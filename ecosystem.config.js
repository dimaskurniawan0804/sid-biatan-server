module.exports = {
  apps: [
    {
      name: 'sid-biatan-nest',
      script: 'dist/src/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
