module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['apps/frontend/**/*.ts', 'apps/frontend/**/*.tsx'],
      plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
};
