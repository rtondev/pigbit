module.exports = {
  apps: [
    {
      name: "pigbit",
      cwd: "/var/www/pigbit",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 10000",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 10000,
      },
    },
  ],
};
