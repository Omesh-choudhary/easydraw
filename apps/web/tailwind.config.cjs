// apps/web/tailwind.config.cjs
const sharedConfig = require("@acme/tailwind-config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  // optionally extend/override per-app:
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme?.extend,
      // app-specific tokens here
    }
  }
};
