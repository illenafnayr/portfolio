import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      env: {
        node: true,      // <-- add this
        browser: true,
        es2021: true
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]
