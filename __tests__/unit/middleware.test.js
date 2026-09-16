/**
 * __tests__/unit/middleware.test.js
 * Testes para os security headers e cache headers do middleware Next.js
 * Usa JS puro (sem generics TypeScript) para compatibilidade com babel-jest
 */

// Mock do NextResponse antes de importar o middleware
const mockSet = jest.fn()
const mockGet = jest.fn()
const mockResponse = {
  headers: {
    set: mockSet,
    get: mockGet,
  },
}

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => mockResponse),
  },
}))

// Import após o mock estar configurado
const { middleware } = require('../../middleware')
const { NextResponse } = require('next/server')

/**
 * Cria um mock de NextRequest com o pathname fornecido
 */
function createMockRequest(pathname) {
  return {
    nextUrl: { pathname },
  }
}

describe('middleware()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ── Security Headers ───────────────────────────────────────────────────────

  describe('Security Headers', () => {
    it('deve definir X-Frame-Options como DENY', () => {
      const req = createMockRequest('/dashboard')
      middleware(req)
      expect(mockSet).toHaveBeenCalledWith('X-Frame-Options', 'DENY')
    })

    it('deve definir X-Content-Type-Options como nosniff', () => {
      const req = createMockRequest('/dashboard')
      middleware(req)
      expect(mockSet).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff')
    })

    it('deve definir Referrer-Policy corretamente', () => {
      const req = createMockRequest('/dashboard')
      middleware(req)
      expect(mockSet).toHaveBeenCalledWith(
        'Referrer-Policy',
        'strict-origin-when-cross-origin'
      )
    })

    it('deve adicionar os 3 headers de segurança em rotas de dashboard', () => {
      const req = createMockRequest('/dashboard/esteiras')
      middleware(req)
      const setCalls = mockSet.mock.calls.map(([key]) => key)
      expect(setCalls).toContain('X-Frame-Options')
      expect(setCalls).toContain('X-Content-Type-Options')
      expect(setCalls).toContain('Referrer-Policy')
    })

    it('deve adicionar headers de segurança na rota raiz', () => {
      const req = createMockRequest('/')
      middleware(req)
      expect(mockSet).toHaveBeenCalledWith('X-Frame-Options', 'DENY')
    })

    it('deve adicionar headers de segurança na rota de login', () => {
      const req = createMockRequest('/login')
      middleware(req)
      expect(mockSet).toHaveBeenCalledWith('X-Frame-Options', 'DENY')
    })
  })

  // ── Cache Headers ──────────────────────────────────────────────────────────

  describe('Cache Headers — Assets Estáticos', () => {
    it('deve definir Cache-Control imutável para assets /_next/static/', () => {
      const req = createMockRequest('/_next/static/chunks/main.js')
      middleware(req)
      expect(mockSet).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=31536000, immutable'
      )
    })

    it('deve definir Cache-Control de 1 dia para imagens otimizadas', () => {
      const req = createMockRequest('/_next/image?url=test')
      middleware(req)
      expect(mockSet).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=86400'
      )
    })

    it('NÃO deve definir cache imutável para rotas de página', () => {
      const req = createMockRequest('/dashboard')
      middleware(req)
      const setCalls = mockSet.mock.calls
      const cacheImmutableCall = setCalls.find(
        ([key, value]) => key === 'Cache-Control' && value.includes('immutable')
      )
      expect(cacheImmutableCall).toBeUndefined()
    })

    it('NÃO deve definir cache de imagem para rotas de dashboard', () => {
      const req = createMockRequest('/dashboard/bikes')
      middleware(req)
      const setCalls = mockSet.mock.calls
      const imageCacheCall = setCalls.find(
        ([key, value]) => key === 'Cache-Control' && value === 'public, max-age=86400'
      )
      expect(imageCacheCall).toBeUndefined()
    })
  })

  // ── NextResponse ───────────────────────────────────────────────────────────

  describe('NextResponse.next()', () => {
    it('deve sempre chamar NextResponse.next()', () => {
      const req = createMockRequest('/')
      middleware(req)
      expect(NextResponse.next).toHaveBeenCalled()
    })

    it('deve retornar a resposta modificada com headers', () => {
      const req = createMockRequest('/test')
      const result = middleware(req)
      expect(result).toBeDefined()
      expect(result.headers).toBeDefined()
    })
  })
})
