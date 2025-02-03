import { FlatCompat } from '@eslint/eslintrc';
import perfectionist from 'eslint-plugin-perfectionist';
import tailwind from 'eslint-plugin-tailwindcss';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const nextConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

const config = [
  ...nextConfig,
  ...tailwind.configs['flat/recommended'],
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': 'error',
      'tailwindcss/no-custom-classname': 'off',
    },
  },
];

export default config;
