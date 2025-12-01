# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [ pkgs.nodejs_20 pkgs.pnpm ];

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [ # "vscodevim.vim"
    ];

    # Enable previews and customize settings
    previews = {
      enable = true;
      previews = {
        # KEY CHANGE: Converted from list [ ] to set { key = {}; }
        frontend = {
          command = ["pnpm" "-F" "frontend" "dev"];
          manager = "web";
          env = {
            # Ideally, pass the port via environment variable if your app supports it
            PORT = "3000";
          };
        };
        api = {
          command = ["pnpm" "-F" "api" "dev"];
          manager = "web";
          env = {
            PORT = "8787";
          };
        };
      };
    };

    # The following attributes are used to configure things in your workspace.
    # For more details, see: https://firebase.google.com/docs/studio/reference/dev-json
    workspace = {
      # Runs when the workspace is first created
      onCreate = { "install-dependencies" = "pnpm install"; };
      # Runs when you start a new session
      onStart = { # Example:
        # "start-server" = "npm run dev";
      };
    };
  };
}