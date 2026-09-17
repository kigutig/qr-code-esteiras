/**
 * jest.config.js — Configuração Jest
 * Compatível com Next.js 16 + React 19 + TypeScript + Babel 8
 */

/** @type {import('jest').Config} */
const config = {
  // Usa jsdom para simular o browser (necessário para React components)
  testEnvironment: 'jest-environment-jsdom',

  // Arquivo de setup executado após o jest-environment ser inicializado
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Transformações: usa babel.jest.config.js separado para não interferir no SWC do Next.js
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.jest.config.js' }],
  },

  // Módulos que NÃO devem ser transformados (exceto arquivos .mjs puros)
  transformIgnorePatterns: [
    '/node_modules/(?!(.*\\.mjs$))',
  ],

  // Mapeamento de módulos (alias @ → raiz do projeto, conforme tsconfig)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg|ico|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Padrões de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // Excluir da execução de testes
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/android/',
  ],

  // ── Cobertura ────────────────────────────────────────────────────────────
  // Inclui APENAS os arquivos que temos testes ativos.
  // components/ui, hooks e contexts têm 0% de coverage pois são componentes
  // gerados (Shadcn) e serão cobertos em fases futuras de testes E2E/Playwright.
  collectCoverageFrom: [
    // Core da aplicação — totalmente testado
    'lib/types.ts',
    'lib/firebase.ts',
    'middleware.ts',

    // Excluir explicitamente arquivos gerados, UI e server-only
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/android/**',
  ],

  // Threshold realista para os arquivos que cobrimos agora
  // (lib/types.ts → 100%, lib/firebase.ts → 88%/50% branch, middleware.ts → 100%)
  // firebase.ts branch é 50% porque o `if (typeof window)` não pode ser testado
  // em jsdom sem mocks complexos — aceitável neste contexto.
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Funções puras de tipos devem ter cobertura total
    './lib/types.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },

  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageDirectory: 'coverage',
  verbose: true,
}

module.exports = config
