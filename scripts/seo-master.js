/**
 * 🚀 ASPPIBRA-DAO: ULTIMATE SEO BUILDER
 * * Este script gera todos os ativos estáticos de SEO, injeta metadados 
 * no index.html e cria dados estruturados (JSON-LD) para Rich Snippets.
 */

const fs = require("fs");
const path = require("path");

// =========================================================
// 1. MASTER CONFIGURATION (Central de Comando)
// =========================================================
const CONFIG = {
  // Dados do Site
  domain: "https://www.asppibra-dao.com.br", // URL final de produção
  title: "ASPPIBRA-DAO | Governança Web3 e IA",
  shortName: "ASPPIBRA",
  description: "Redefinindo ativos reais no mundo digital através de Web3 e Inteligência Artificial. Participe da nossa governança descentralizada.",
  keywords: "DAO, Governança, Blockchain, RWA, Web3, Investimentos, Agroecologia, Brasil",
  themeColor: "#1A73E8",
  backgroundColor: "#f4f6f8",
  author: "ASPPIBRA-DAO",
  twitterHandle: "@asppibra", // Se tiver

  // Caminhos (Ajustados para seu Monorepo)
  publicDir: path.join(__dirname, "../apps/frontend/public"),
  htmlPath: path.join(__dirname, "../apps/frontend/index.html"),
  
  // Imagens (Devem estar em apps/frontend/public/)
  images: {
    logo192: "/android-chrome-192x192.png",
    logo512: "/android-chrome-512x512.png",
    socialBanner: "/social-preview.png", // 1200x630
    favicon: "/favicon.ico"
  }
};

// Rotas Importantes para o Sitemap
const SITEMAP_ROUTES = [
  { url: "/", priority: "1.0", freq: "daily" },
  { url: "/login", priority: "0.8", freq: "monthly" },
  { url: "/register", priority: "0.8", freq: "monthly" },
  { url: "/ecosystem", priority: "0.7", freq: "weekly" },
  { url: "/roadmap", priority: "0.6", freq: "monthly" },
  { url: "/faq", priority: "0.5", freq: "yearly" }
];

// =========================================================
// 2. GERADORES DE CONTEÚDO
// =========================================================

// A. JSON-LD (O Segredo dos Rich Snippets)
const generateJSONLD = () => {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization", // ou "WebSite" ou "DAO"
    "name": CONFIG.title,
    "url": CONFIG.domain,
    "logo": `${CONFIG.domain}${CONFIG.images.logo512}`,
    "description": CONFIG.description,
    "sameAs": [
      "https://twitter.com/asppibra",
      "https://github.com/asppibra",
      // Adicione outras redes sociais aqui
    ]
  }, null, 2);
};

// B. Robots.txt
const generateRobots = () => {
  return `# Gerasdo automaticamente pelo SEO-Master
User-agent: *
Allow: /

# Segurança e Admin
Disallow: /dashboard
Disallow: /admin
Disallow: /account
Disallow: /api/

# Arquivos Técnicos
Disallow: /.env
Disallow: /wrangler.toml
Disallow: /package.json

Sitemap: ${CONFIG.domain}/sitemap.xml
`;
};

// C. Sitemap.xml
const generateSitemap = () => {
  const today = new Date().toISOString().split("T")[0];
  const urls = SITEMAP_ROUTES.map(route => `
  <url>
    <loc>${CONFIG.domain}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.freq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

// D. Web Manifest
const generateManifest = () => {
  return JSON.stringify({
    name: CONFIG.title,
    short_name: CONFIG.shortName,
    description: CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: CONFIG.backgroundColor,
    theme_color: CONFIG.themeColor,
    icons: [
      { src: CONFIG.images.logo192, sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: CONFIG.images.logo512, sizes: "512x512", type: "image/png", purpose: "any maskable" }
    ]
  }, null, 2);
};

// =========================================================
// 3. O INJETOR DE HTML (Cirurgia no Código)
// =========================================================

function injectSEOintoHTML() {
  console.log("💉 Injetando Metadados e JSON-LD no index.html...");
  
  let html = fs.readFileSync(CONFIG.htmlPath, "utf-8");
  const jsonLD = generateJSONLD();

  // 1. Substituições via Regex (Atualiza tags existentes)
  const replacements = [
    { regex: /<title>.*<\/title>/, val: `<title>${CONFIG.title}</title>` },
    { regex: /name="description" content=".*?"/, val: `name="description" content="${CONFIG.description}"` },
    { regex: /name="keywords" content=".*?"/, val: `name="keywords" content="${CONFIG.keywords}"` },
    { regex: /name="theme-color" content=".*?"/, val: `name="theme-color" content="${CONFIG.themeColor}"` },
    
    // Open Graph
    { regex: /property="og:title" content=".*?"/, val: `property="og:title" content="${CONFIG.title}"` },
    { regex: /property="og:description" content=".*?"/, val: `property="og:description" content="${CONFIG.description}"` },
    { regex: /property="og:url" content=".*?"/, val: `property="og:url" content="${CONFIG.domain}/"` },
    { regex: /property="og:image" content=".*?"/, val: `property="og:image" content="${CONFIG.domain}${CONFIG.images.socialBanner}"` },
  ];

  replacements.forEach(item => {
    if (html.match(item.regex)) {
      html = html.replace(item.regex, item.val);
    } else {
      console.warn(`⚠️ Tag não encontrada para substituição automática: ${item.regex}`);
    }
  });

  // 2. Injeção de JSON-LD (Adiciona se não existir, atualiza se existir)
  const scriptTag = `<script type="application/ld+json">\\n${jsonLD}\\n    </script>`;
  
  if (html.includes('<script type="application/ld+json">')) {
    // Substitui o bloco existente
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, scriptTag);
  } else {
    // Insere antes do fechamento do head
    html = html.replace("</head>", `    ${scriptTag}\\n  </head>`);
  }

  fs.writeFileSync(CONFIG.htmlPath, html);
  console.log("✅ index.html atualizado com sucesso.");
}

// =========================================================
// 4. AUDITORIA DE ARQUIVOS (File Size Check)
// =========================================================

function auditFiles() {
  console.log("⚖️  Auditando peso dos arquivos de imagem...");
  const imagesToCheck = Object.values(CONFIG.images);
  let hasError = false;

  imagesToCheck.forEach(imgUrl => {
    const filePath = path.join(CONFIG.publicDir, imgUrl); // Ajuste: imgUrl já tem / no inicio
    // Remover a barra inicial para o path join funcionar corretamente se necessário, 
    // mas path.join geralmente lida bem. Vamos garantir:
    const cleanPath = path.join(CONFIG.publicDir, imgUrl.replace(/^\//, ''));

    if (!fs.existsSync(cleanPath)) {
      console.error(`❌ ARQUIVO FALTANDO: ${cleanPath}`);
      hasError = true;
    } else {
      const stats = fs.statSync(cleanPath);
      const sizeKB = stats.size / 1024;
      
      if (sizeKB > 500) {
        console.warn(`⚠️  PESADO: ${imgUrl} tem ${sizeKB.toFixed(0)}KB. Tente manter abaixo de 200KB.`);
      } else {
        console.log(`ok: ${imgUrl} (${sizeKB.toFixed(0)}KB)`);
      }
    }
  });

  if (hasError) process.exit(1);
}

// =========================================================
// 5. EXECUÇÃO PRINCIPAL
// =========================================================

console.log(`\\n🤖 ASPPIBRA-DAO SEO BUILDER \\n--------------------------------`);

try {
  // 1. Gerar Arquivos Estáticos
  fs.writeFileSync(path.join(CONFIG.publicDir, "robots.txt"), generateRobots());
  console.log("📄 robots.txt gerado.");

  fs.writeFileSync(path.join(CONFIG.publicDir, "sitemap.xml"), generateSitemap());
  console.log("🗺️  sitemap.xml gerado.");

  fs.writeFileSync(path.join(CONFIG.publicDir, "site.webmanifest"), generateManifest());
  console.log("📱 site.webmanifest gerado.");

  // 2. Injetar no HTML
  injectSEOintoHTML();

  // 3. Auditar
  auditFiles();

  console.log("\\n✨ TUDO PRONTO! Seu SEO está tecnicamente perfeito.");

} catch (error) {
  console.error("\\n❌ ERRO FATAL:", error);
  process.exit(1);
}