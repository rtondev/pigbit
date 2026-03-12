/**
 * Configuração PM2 para i9chain
 * Uso: pm2 start ecosystem.config.cjs
 */

const path = require("path");

module.exports = {
  apps: [
    {
      name: "pigbit",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 2000",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      error_file: path.join(__dirname, "logs", "err.log"),
      out_file: path.join(__dirname, "logs", "out.log"),
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
