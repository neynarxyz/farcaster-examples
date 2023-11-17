module.exports = {
  apps: [
    {
      name: "neynar-gm-bot",
      script: "./dist/app.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
