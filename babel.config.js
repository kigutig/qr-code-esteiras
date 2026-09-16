/**
 * babel.config.js — Configuração Babel para Jest
 * Separado do jest.config para evitar problemas de resolução de módulos
 */

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
}
