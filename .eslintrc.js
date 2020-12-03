module.exports = {
  rules: {
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-function": "off",

    "vue/no-side-effects-in-computed-properties": "off",
    "vue/no-unused-vars": "off",

    "prefer-const": "off",
    "no-undef": "off",
    "no-prototype-builtins": "off",
    "prefer-spread": "off",
    "no-useless-escape": "off",
    "no-var": "off",
    "prefer-rest-params": "off",
    "no-debugger": "off",
  },
  root: true,
  // env: {
  //   node: true
  // },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    parser: "babel-eslint",
  },
  // rules: {
  //   'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  // }
};
