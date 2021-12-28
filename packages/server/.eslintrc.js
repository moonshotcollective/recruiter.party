module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['standard', 'plugin:node/recommended', 'plugin:import/recommended', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12
  }
}
