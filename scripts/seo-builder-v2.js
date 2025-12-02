#!/usr/bin/env node
/**
 * seo-builder-v2.js — Professional (updated)
 * Additions: multiple JSON-LD (Organization + WebSite), canonical check/fix,
 * and HTML audit report generation.
 *
 * Usage:
 *  node seo-builder-v2.js --html ../apps/frontend/index.html --public ../apps/frontend/public --domain https://asppibra.com --dry
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { program } = require('commander');
const cheerio = require('cheerio');

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const PKG = { name: "asppibra-seo-builder-v2", version: "2.1.0" };

// -------------------- CLI --------------------
program
  .name(PKG.name)
  .version(PKG.version)
  .option('--html <path>', 'caminho para index.html', path.join(__dirname, '../apps/frontend/index.html'))
  .option('--public <path>', 'pasta public', path.join(__dirname, '../apps/frontend/public'))
  .option('--domain <url>', 'domínio do site', 'https://asppibra.com')
  .option('--title <string>', 'title do site', 'ASPPIBRA-DAO | Web3 Governance & RWA Solutions')
  .option('--description <string>', 'meta description', 'Redefining Real World Assets (RWA) in the digital economy through Web3 and Artificial Intelligence. Join our decentralized governance ecosystem.')
  .option('--keywords <string>', 'meta keywords', 'DAO, Governance, Blockchain, RWA, Web3, Investments, Agroecology')
  .option('--author <string>', 'author meta', 'ASPPIBRA-DAO')
  .option('--threshold <kb>', 'limite de tamanho de imagem em KB', parseInt, 500)
  .option('--dry', 'dry-run (não escreve arquivos)', false)
  .option('--silent', 'modo silencioso (ideal para CI)', false)
  .option('--backupDir <path>', 'diretório para backups/reports', path.join(process.cwd(), 'seo-backups'))
  .parse(process.argv);

const opts = program.opts();

// -------------------- Logging --------------------
const log = {
  info: (...args) => { if (!opts.silent) console.log('ℹ️', ...args); },
  warn: (...args) => { if (!opts.silent) console.warn('⚠️', ...args); },
  error: (...args) => { console.error('❌', ...args); },
  dbg: (...args) => { if (!opts.silent) console.debug('[debug]', ...args); }
};

// -------------------- CONFIG --------------------
const CONFIG = {
  domain: opts.domain.replace(/\/$/, ''), // no trailing slash
  title: opts.title,
  description: opts.description,
  keywords: opts.keywords,
  author: opts.author,
  publicDir: path.resolve(opts.public),
  htmlPath: path.resolve(opts.html),
  images: {
    // Ajustado ao seu index.html atual
    logo512: "/android-chrome-512x512.png",
    socialBannerEn: "/social-preview.png",
    favicon: "/favicon.ico"
  },
  thresholdKB: opts.threshold,
  dryRun: opts.dry,
  backupDir: path.resolve(opts.backupDir)
};

// -------------------- Helpers --------------------
function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : url + '/';
}
function escapeAttr(s) {
  return (s || '').replace(/"/g, '&quot;');
}
async function safeMkdir(dir) {
  try { await fsp.mkdir(dir, { recursive: true }); } catch (e) { /* ignore */ }
}
function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

// -------------------- JSON-LD: multiple schemas --------------------
function generateJSONLDMultiple() {
  // Organization (from your index.html)
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": CONFIG.title.includes('|') ? CONFIG.title.split('|')[0].trim() : CONFIG.title,
    "url": CONFIG.domain,
    "logo": `${CONFIG.domain}${CONFIG.images.logo512}`,
    "description": CONFIG.description,
    "sameAs": [
      "https://twitter.com/asppibra",
      "https://github.com/asppibra"
    ]
  };

  // WebSite (useful for sitelinks/search)
  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": CONFIG.domain,
    "name": CONFIG.title,
    "description": CONFIG.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${CONFIG.domain}search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // Return an array to support multiple JSON-LD blocks in a single script tag
  return JSON.stringify([org, site], null, 2);
}

// -------------------- Robots, Sitemap, Manifest --------------------
function generateRobots() {
  return `# Gerado automaticamente pelo ASPPIBRA-DAO SEO Builder (v2)
User-agent: *
Allow: /

Disallow: /dashboard
Disallow: /admin
Disallow: /account
Disallow: /api/

# Técnicos
Disallow: /.env
Disallow: /wrangler.toml
Disallow: /package.json

Sitemap: ${CONFIG.domain}/sitemap.xml
`;
}

function generateSitemap(routes = [
  { url: "/", priority: "1.0", freq: "daily" },
  { url: "/login", priority: "0.8", freq: "monthly" },
  { url: "/register", priority: "0.8", freq: "monthly" },
]) {
  const today = new Date().toISOString().split('T')[0];
  const urls = routes.map(r => `
  <url>
    <loc>${CONFIG.domain}${r.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.freq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function generateManifest() {
  return JSON.stringify({
    name: CONFIG.title,
    short_name: CONFIG.title.split(' ')[0],
    description: CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1A73E8",
    icons: [
      { src: CONFIG.images.logo512, sizes: "512x512", type: "image/png", purpose: "any maskable" }
    ]
  }, null, 2);
}

// -------------------- HTML Injection (cheerio) + canonical fix --------------------
async function injectSEOIntoHTML() {
  log.info('🔧 Injetando metadados em', CONFIG.htmlPath);
  if (!fs.existsSync(CONFIG.htmlPath)) {
    throw new Error(`index.html não encontrado em ${CONFIG.htmlPath}`);
  }

  const raw = await fsp.readFile(CONFIG.htmlPath, 'utf8');
  const $ = cheerio.load(raw);

  // Backup original
  await createBackup(raw);

  // Title
  if ($('title').length) {
    $('title').text(CONFIG.title);
  } else {
    $('head').prepend(`<title>${escapeAttr(CONFIG.title)}</title>`);
  }

  // Meta tags essenciais (cria se não existirem)
  setOrCreateMeta('description', CONFIG.description);
  setOrCreateMeta('keywords', CONFIG.keywords);
  setOrCreateMeta('author', CONFIG.author);
  setOrCreateMeta('theme-color', '#1A73E8');

  // OG
  setOrCreateMetaProperty('og:type', 'website');
  setOrCreateMetaProperty('og:url', ensureTrailingSlash(CONFIG.domain));
  setOrCreateMetaProperty('og:title', CONFIG.title);
  setOrCreateMetaProperty('og:description', CONFIG.description);
  setOrCreateMetaProperty('og:image', `${CONFIG.domain}${CONFIG.images.socialBannerEn || CONFIG.images.socialBanner || '/social-preview.png'}`);

  // Twitter
  setOrCreateMetaName('twitter:card', 'summary_large_image');
  setOrCreateMetaName('twitter:url', ensureTrailingSlash(CONFIG.domain));
  setOrCreateMetaName('twitter:domain', new URL(CONFIG.domain).hostname);
  setOrCreateMetaName('twitter:title', CONFIG.title);
  setOrCreateMetaName('twitter:description', CONFIG.description);
  setOrCreateMetaName('twitter:image', `${CONFIG.domain}${CONFIG.images.socialBannerEn || '/social-preview.png'}`);

  // Canonical — check and fix
  const expectedCanonical = ensureTrailingSlash(CONFIG.domain);
  const canonicalLink = $('link[rel="canonical"]').first();
  if (canonicalLink.length) {
    const href = canonicalLink.attr('href');
    if (!href || href.replace(/\/$/, '') !== CONFIG.domain.replace(/\/$/, '')) {
      log.warn('Canonical diferente do esperado. Atualizando para', expectedCanonical);
      canonicalLink.attr('href', expectedCanonical);
    } else {
      log.info('Canonical ok:', href);
    }
  } else {
    log.info('Canonical ausente. Inserindo:', expectedCanonical);
    $('head').append(`<link rel="canonical" href="${expectedCanonical}" />`);
  }

  // JSON-LD multiple
  const multiJsonLd = generateJSONLDMultiple();
  let replaced = false;
  $('script[type="application/ld+json"]').each((i, el) => {
    // If existing JSON-LD contains Organization, replace it with our combined payload.
    const text = $(el).html() || '';
    if (text.includes('"@type": "Organization"') || text.includes('"@type": "WebSite"')) {
      $(el).replaceWith(`<script type="application/ld+json">\n${multiJsonLd}\n</script>`);
      replaced = true;
    }
  });
  if (!replaced) {
    $('head').append(`\n<script type="application/ld+json">\n${multiJsonLd}\n</script>\n`);
    log.info('JSON-LD (Organization + WebSite) inserido.');
  } else {
    log.info('JSON-LD atualizado.');
  }

  const finalHtml = $.html();

  if (CONFIG.dryRun) {
    log.info('--- dry-run: não serão feitas escritas em disco. ---');
    log.dbg('HTML preview snippet:', finalHtml.slice(0, 600));
    return;
  }

  await fsp.writeFile(CONFIG.htmlPath, finalHtml, 'utf8');
  log.info('✅ index.html atualizado com sucesso.');
  // helper functions
  function setOrCreateMeta(name, content) {
    const sel = `meta[name="${name}"]`;
    if ($(sel).length) $(sel).attr('content', content);
    else $('head').append(`<meta name="${name}" content="${escapeAttr(content)}">`);
  }
  function setOrCreateMetaProperty(property, content) {
    const sel = `meta[property="${property}"]`;
    if ($(sel).length) $(sel).attr('content', content);
    else $('head').append(`<meta property="${property}" content="${escapeAttr(content)}">`);
  }
  function setOrCreateMetaName(name, content) {
    const sel = `meta[name="${name}"]`;
    if ($(sel).length) $(sel).attr('content', content);
    else $('head').append(`<meta name="${name}" content="${escapeAttr(content)}">`);
  }
}

// -------------------- Backup --------------------
async function createBackup(originalString) {
  try {
    await safeMkdir(CONFIG.backupDir);
    const ts = timestamp();
    const baseName = path.basename(CONFIG.htmlPath);
    const bakPath = path.join(CONFIG.backupDir, `${baseName}.${ts}.bak.html`);
    if (!CONFIG.dryRun) {
      await fsp.writeFile(bakPath, originalString, 'utf8');
      log.info('Backup criado em', bakPath);
    } else {
      log.info('dry-run: backup não gravado (simulado).');
    }
  } catch (err) {
    log.warn('Falha ao criar backup:', err.message);
  }
}

// -------------------- Audit images + report --------------------
async function auditImagesAndReport() {
  log.info(`🔍 Auditando imagens em ${CONFIG.publicDir} (threshold ${CONFIG.thresholdKB}KB)`);
  const imagesToCheck = [
    CONFIG.images.logo512,
    CONFIG.images.socialBannerEn || '/social-preview.png',
    CONFIG.images.favicon
  ].map(p => path.join(CONFIG.publicDir, p.replace(/^\//, '')));

  // Ensure publicDir exists (if not, try create)
  if (!fs.existsSync(CONFIG.publicDir)) {
    log.warn('Pasta public não existe:', CONFIG.publicDir);
    if (!CONFIG.dryRun) {
      await safeMkdir(CONFIG.publicDir);
      log.info('Pasta public criada (vazia).');
    }
  }

  const results = [];
  for (const p of imagesToCheck) {
    try {
      if (!fs.existsSync(p)) {
        log.warn('Arquivo faltando:', p);
        results.push({ path: p, status: 'missing' });
        continue;
      }
      const stats = await fsp.stat(p);
      const kb = Math.round(stats.size / 1024);
      const ok = kb <= CONFIG.thresholdKB;
      if (!ok) log.warn(`PESADO: ${p} = ${kb}KB`);
      else log.info(`ok: ${path.basename(p)} (${kb}KB)`);
      results.push({ path: p, status: ok ? 'ok' : 'heavy', sizeKB: kb });
    } catch (err) {
      log.error('Erro checando imagem', p, err.message);
      results.push({ path: p, status: 'error', error: err.message });
    }
  }

  // If dry-run, just return results
  if (CONFIG.dryRun) {
    return results;
  }

  // Generate HTML report
  const reportHtml = buildReportHtml(results);
  await safeMkdir(CONFIG.backupDir);
  const reportPath = path.join(CONFIG.backupDir, `report-${timestamp()}.html`);
  await fsp.writeFile(reportPath, reportHtml, 'utf8');
  log.info('📊 Relatório de auditoria gerado em', reportPath);

  // If there are missing files, throw to stop process (dangerous to deploy)
  const missing = results.filter(r => r.status === 'missing');
  if (missing.length) {
    throw new Error('Algumas imagens estão faltando. Veja o relatório e corrija antes do deploy.');
  }

  return results;

  function buildReportHtml(items) {
    const rows = items.map(it => {
      const name = path.basename(it.path);
      const status = it.status;
      const size = it.sizeKB ? `${it.sizeKB} KB` : '-';
      const color = status === 'ok' ? '#1a7f37' : (status === 'heavy' ? '#e69500' : '#c62828');
      return `<tr>
        <td>${escapeHtml(name)}</td>
        <td>${escapeHtml(it.path)}</td>
        <td style="color:${color};font-weight:700">${escapeHtml(status)}</td>
        <td>${escapeHtml(size)}</td>
        <td>${it.error ? escapeHtml(it.error) : ''}</td>
      </tr>`;
    }).join('\n');

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>SEO Audit Report - ${escapeHtml(new Date().toISOString())}</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111}
    table{border-collapse:collapse;width:100%}
    th,td{border:1px solid #ddd;padding:8px}
    th{background:#f4f4f4;text-align:left}
  </style>
</head>
<body>
  <h1>SEO Audit Report</h1>
  <p>Domain: ${escapeHtml(CONFIG.domain)}</p>
  <p>Threshold: ${escapeHtml(String(CONFIG.thresholdKB))} KB</p>
  <table>
    <thead><tr><th>File</th><th>Path</th><th>Status</th><th>Size</th><th>Error</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
  }
}

// -------------------- Write static assets --------------------
async function writeStaticAssets() {
  const robotsPath = path.join(CONFIG.publicDir, 'robots.txt');
  const sitemapPath = path.join(CONFIG.publicDir, 'sitemap.xml');
  const manifestPath = path.join(CONFIG.publicDir, 'site.webmanifest');

  if (CONFIG.dryRun) {
    log.info('dry-run: arquivos estáticos serão simulados (robots, sitemap, manifest).');
    return;
  }

  await fsp.writeFile(robotsPath, generateRobots(), 'utf8');
  log.info('📄 robots.txt gerado em', robotsPath);

  await fsp.writeFile(sitemapPath, generateSitemap(), 'utf8');
  log.info('🗺 sitemap.xml gerado em', sitemapPath);

  await fsp.writeFile(manifestPath, generateManifest(), 'utf8');
  log.info('📱 site.webmanifest gerado em', manifestPath);
}

// -------------------- MAIN --------------------
(async function main() {
  try {
    log.info(`\n🚀 ASPPIBRA-DAO SEO Builder v2.1 — Domain: ${CONFIG.domain}\n--------------------------------`);

    // inject and canonical fix
    await injectSEOIntoHTML();

    // write static files
    await writeStaticAssets();

    // audit + report; may throw on missing files
    await auditImagesAndReport();

    log.info('\n✨ Tudo pronto. Exiting 0.');
    process.exit(0);
  } catch (err) {
    log.error('\n❌ ERRO FATAL:', err.message || err);
    if (!opts.silent) console.error(err);
    process.exit(1);
  }
})();
