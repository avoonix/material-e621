module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/base",
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    // "@vue/prettier",
    // "@typescript-eslint",
    "plugin:vuetify/base",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-function": "off",

    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off",

    "vue/no-side-effects-in-computed-properties": "off",
    "vue/no-unused-vars": "off",
    "vue/no-mutating-props": "off",

    "prefer-const": "off",
    "no-undef": "off",
    "no-prototype-builtins": "off",
    "prefer-spread": "off",
    "no-useless-escape": "off",
    "no-var": "off",
    "prefer-rest-params": "off",
    "no-debugger": "off",
    "no-constant-condition": "off",
    "vue/multi-word-component-names": "off",
    // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
    "vue/v-slot-style": [
      "error",
      {
        atComponent: "shorthand",
        default: "shorthand",
        named: "shorthand",
      },
    ],
    "vue/attribute-hyphenation": [
      "error",
      "always",
      {
        ignore: [],
      },
    ],
  },
};
