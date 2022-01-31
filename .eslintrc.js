module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    worker: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    // ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    // sourceType: "module",
    extraFileExtensions: ["vue"],
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    // "@typescript-eslint/no-var-requires": false,
    "vue/no-multiple-template-root": false,
  },
};
