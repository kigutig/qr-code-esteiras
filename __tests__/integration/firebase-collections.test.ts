/**
 * __tests__/integration/api/firebase-collections.test.ts
 * Testes de integração para as constantes e configuração do Firebase
 */

import { COLLECTIONS } from '@/lib/firebase'

describe('Firebase COLLECTIONS', () => {
  it('deve exportar todos os nomes de coleções necessários', () => {
    expect(COLLECTIONS.USERS).toBeDefined()
    expect(COLLECTIONS.TREADMILLS).toBeDefined()
    expect(COLLECTIONS.MAINTENANCE).toBeDefined()
    expect(COLLECTIONS.PARTS).toBeDefined()
    expect(COLLECTIONS.LOGS).toBeDefined()
    expect(COLLECTIONS.NOTIFICATIONS).toBeDefined()
  })

  it('deve ter as coleções de arquivo', () => {
    expect(COLLECTIONS.ARCHIVE_TREADMILLS).toBeDefined()
    expect(COLLECTIONS.ARCHIVE_MAINTENANCE).toBeDefined()
    expect(COLLECTIONS.ARCHIVE_PARTS).toBeDefined()
  })

  it('deve ter 9 coleções no total', () => {
    expect(Object.keys(COLLECTIONS)).toHaveLength(9)
  })

  it('nenhum nome de coleção deve estar vazio', () => {
    for (const [key, value] of Object.entries(COLLECTIONS)) {
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    }
  })

  it('coleções de arquivo devem conter "archive" no nome', () => {
    expect(COLLECTIONS.ARCHIVE_TREADMILLS).toContain('archive')
    expect(COLLECTIONS.ARCHIVE_MAINTENANCE).toContain('archive')
    expect(COLLECTIONS.ARCHIVE_PARTS).toContain('archive')
  })

  it('nomes de coleções não devem ter espaços', () => {
    for (const [, value] of Object.entries(COLLECTIONS)) {
      expect(value).not.toContain(' ')
    }
  })

  it('nomes de coleções devem ser strings únicas (sem duplicatas)', () => {
    const values = Object.values(COLLECTIONS)
    const uniqueValues = new Set(values)
    expect(uniqueValues.size).toBe(values.length)
  })
})
