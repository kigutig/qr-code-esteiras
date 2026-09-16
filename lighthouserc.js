/**
 * lighthouserc.js — Configuração do Lighthouse CI
 * Thresholds mínimos de qualidade para o Esteira Management System
 */

module.exports = {
  ci: {
    collect: {
      url: [process.env.LHCI_URL || 'http://localhost:3001'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        // Performance — mínimo 80 (staging), 90 (prod)
        'categories:performance': ['warn', { minScore: 0.8 }],
        // Acessibilidade — mínimo 90
        'categories:accessibility': ['error', { minScore: 0.9 }],
        // Boas práticas — mínimo 90
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        // SEO — mínimo 90
        'categories:seo': ['warn', { minScore: 0.9 }],

        // Métricas específicas
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],

        // Segurança
        'is-on-https': 'error',
        'uses-http2': 'warn',

        // Boas práticas extras
        'no-vulnerable-libraries': 'error',
        'csp-xss': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
