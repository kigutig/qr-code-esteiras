/**
 * jest.config.js — Configuração Jest
 * Compatível com Next.js 16 + React 19 + TypeScript + Babel 8
 */

/** @type {import('jest').Config} */
const config = {
  // Usa jsdom para simular o browser (necessário para React components)
  testEnvironment: 'jest-environment-jsdom',

  // Arquivo de setup executado após o jest-environment ser inicializado
  // Aqui importamos @testing-library/jest-dom e configuramos mocks globais
  // https://jestjs.io/docs/configuration#setupfilesafterenv-array
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Transformações: usa babel-jest com babel.config.js separado
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
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

  // Arquivos incluídos no relatório de cobertura
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'contexts/**/*.{ts,tsx}',
    'middleware.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],

  // Thresholds mínimos de cobertura (bloqueiam o CI se não atingidos)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageDirectory: 'coverage',
  verbose: true,
}

module.exports = config
