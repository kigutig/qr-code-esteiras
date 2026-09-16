/**
 * jest.setup.js — Setup global para todos os testes
 * Importa matchers do @testing-library/jest-dom e configura mocks globais
 */

// Adiciona matchers customizados: toBeInTheDocument(), toHaveClass(), etc.
require('@testing-library/jest-dom')

// ── Mock do Firebase ──────────────────────────────────────────────────────────
// Impede chamadas reais ao Firebase durante os testes
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({})),
}))

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}))

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  push: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  onValue: jest.fn(),
  off: jest.fn(),
  query: jest.fn(),
  orderByChild: jest.fn(),
  equalTo: jest.fn(),
}))

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}))

// ── Mock Next.js router ───────────────────────────────────────────────────────
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// ── Suprimir console.error em testes (opcional — remova para debugging) ───────
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('act('))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// ── Limpar mocks após cada teste ──────────────────────────────────────────────
afterEach(() => {
  jest.clearAllMocks()
})
