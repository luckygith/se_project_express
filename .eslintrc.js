console.error("HELLO THERE");
// console.log("hi there"); // this is warning

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": ["warn", { allow: ["error"] }],
    camelcase: [
      "error",
      {
        allow: ["_id"], // Allow underscores for `_id`
        properties: "never", // Disable enforcing camelCase for object properties
      },
    ],
  },
};
