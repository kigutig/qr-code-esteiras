/**
 * babel.jest.config.js — Configuração Babel exclusiva para Jest
 * Nomeado separadamente para não desativar o SWC no Next.js build
 */

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
}
