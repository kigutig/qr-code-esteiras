/**
 * __tests__/unit/lib/types.test.ts
 * Testes unitários para as funções puras de lib/types.ts
 * 
 * Cobertura:
 * - hasPermission()
 * - getStatusColor()
 * - getStatusLabel()
 * - getPartStatusLabel()
 * - getPartStatusColor()
 * - getRoleLabel()
 * - getEquipmentTypeLabel()
 * - getEquipmentTypePluralLabel()
 * - ROLE_PERMISSIONS (estrutura)
 */

import {
  hasPermission,
  getStatusColor,
  getStatusLabel,
  getPartStatusLabel,
  getPartStatusColor,
  getRoleLabel,
  getEquipmentTypeLabel,
  getEquipmentTypePluralLabel,
  ROLE_PERMISSIONS,
  type UserRole,
  type TreadmillStatus,
  type PartStatus,
  type EquipmentType,
} from '@/lib/types'

// ─── hasPermission ───────────────────────────────────────────────────────────

describe('hasPermission()', () => {
  describe('admin', () => {
    it('deve ter todas as permissões administrativas', () => {
      expect(hasPermission('admin', 'create_user')).toBe(true)
      expect(hasPermission('admin', 'edit_user')).toBe(true)
      expect(hasPermission('admin', 'delete_user')).toBe(true)
      expect(hasPermission('admin', 'view_logs')).toBe(true)
      expect(hasPermission('admin', 'manage_settings')).toBe(true)
      expect(hasPermission('admin', 'view_all')).toBe(true)
    })

    it('deve ter permissões de treadmill', () => {
      expect(hasPermission('admin', 'create_treadmill')).toBe(true)
      expect(hasPermission('admin', 'edit_treadmill')).toBe(true)
      expect(hasPermission('admin', 'delete_treadmill')).toBe(true)
    })

    it('deve ter permissões de manutenção', () => {
      expect(hasPermission('admin', 'create_maintenance')).toBe(true)
      expect(hasPermission('admin', 'edit_maintenance')).toBe(true)
      expect(hasPermission('admin', 'delete_maintenance')).toBe(true)
    })
  })

  describe('tecnico', () => {
    it('deve poder criar e editar equipamentos', () => {
      expect(hasPermission('tecnico', 'create_treadmill')).toBe(true)
      expect(hasPermission('tecnico', 'edit_treadmill')).toBe(true)
    })

    it('NÃO deve poder deletar equipamentos', () => {
      expect(hasPermission('tecnico', 'delete_treadmill')).toBe(false)
    })

    it('NÃO deve ter acesso aos logs do sistema', () => {
      expect(hasPermission('tecnico', 'view_logs')).toBe(false)
    })

    it('NÃO deve poder gerenciar usuários', () => {
      expect(hasPermission('tecnico', 'create_user')).toBe(false)
      expect(hasPermission('tecnico', 'delete_user')).toBe(false)
    })

    it('deve poder fazer upload de fotos e atualizar status', () => {
      expect(hasPermission('tecnico', 'upload_photos')).toBe(true)
      expect(hasPermission('tecnico', 'update_status')).toBe(true)
    })
  })

  describe('compras', () => {
    it('deve poder visualizar e atualizar peças', () => {
      expect(hasPermission('compras', 'view_parts')).toBe(true)
      expect(hasPermission('compras', 'mark_purchased')).toBe(true)
      expect(hasPermission('compras', 'set_delivery_date')).toBe(true)
      expect(hasPermission('compras', 'update_part_status')).toBe(true)
      expect(hasPermission('compras', 'view_purchase_history')).toBe(true)
    })

    it('NÃO deve poder criar ou deletar equipamentos', () => {
      expect(hasPermission('compras', 'create_treadmill')).toBe(false)
      expect(hasPermission('compras', 'delete_treadmill')).toBe(false)
    })

    it('NÃO deve ter acesso administrativo', () => {
      expect(hasPermission('compras', 'create_user')).toBe(false)
      expect(hasPermission('compras', 'manage_settings')).toBe(false)
    })
  })

  describe('leitor', () => {
    it('deve poder visualizar e escanear QR codes', () => {
      expect(hasPermission('leitor', 'view_treadmills')).toBe(true)
      expect(hasPermission('leitor', 'search_treadmills')).toBe(true)
      expect(hasPermission('leitor', 'scan_qr')).toBe(true)
      expect(hasPermission('leitor', 'view_status')).toBe(true)
    })

    it('NÃO deve poder criar ou editar nada', () => {
      expect(hasPermission('leitor', 'create_treadmill')).toBe(false)
      expect(hasPermission('leitor', 'edit_treadmill')).toBe(false)
      expect(hasPermission('leitor', 'create_user')).toBe(false)
    })
  })

  describe('permissões inválidas', () => {
    it('deve retornar false para permissão inexistente', () => {
      expect(hasPermission('admin', 'permissao_inexistente')).toBe(false)
      expect(hasPermission('tecnico', 'super_admin_access')).toBe(false)
    })

    it('deve retornar false para role undefined/null via cast', () => {
      // Testa robustez com valores inválidos via cast
      expect(hasPermission(undefined as unknown as UserRole, 'create_user')).toBe(false)
    })
  })
})

// ─── ROLE_PERMISSIONS (estrutura) ────────────────────────────────────────────

describe('ROLE_PERMISSIONS', () => {
  it('deve conter as 4 roles', () => {
    expect(ROLE_PERMISSIONS).toHaveProperty('admin')
    expect(ROLE_PERMISSIONS).toHaveProperty('tecnico')
    expect(ROLE_PERMISSIONS).toHaveProperty('compras')
    expect(ROLE_PERMISSIONS).toHaveProperty('leitor')
  })

  it('admin deve ter mais permissões que qualquer outro papel', () => {
    const adminCount = ROLE_PERMISSIONS.admin.length
    expect(adminCount).toBeGreaterThan(ROLE_PERMISSIONS.tecnico.length)
    expect(adminCount).toBeGreaterThan(ROLE_PERMISSIONS.compras.length)
    expect(adminCount).toBeGreaterThan(ROLE_PERMISSIONS.leitor.length)
  })

  it('não deve ter permissões duplicadas em nenhuma role', () => {
    for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const uniquePerms = new Set(permissions)
      expect(uniquePerms.size).toBe(permissions.length)
    }
  })
})

// ─── getStatusColor ──────────────────────────────────────────────────────────

describe('getStatusColor()', () => {
  const testCases: Array<[TreadmillStatus, string]> = [
    ['pronta', 'bg-status-success text-status-success'],
    ['manutencao', 'bg-status-warning text-status-warning'],
    ['indisponivel', 'bg-status-danger text-status-danger'],
    ['vendido', 'bg-blue-500/15 text-blue-600'],
  ]

  test.each(testCases)(
    'status "%s" deve retornar classe "%s"',
    (status, expectedClass) => {
      expect(getStatusColor(status)).toBe(expectedClass)
    }
  )

  it('deve retornar classe de muted para status desconhecido', () => {
    const result = getStatusColor('desconhecido' as TreadmillStatus)
    expect(result).toContain('bg-muted')
  })

  it('aguardando_pecas deve retornar classe de muted', () => {
    const result = getStatusColor('aguardando_pecas')
    expect(result).toContain('bg-muted')
  })
})

// ─── getStatusLabel ──────────────────────────────────────────────────────────

describe('getStatusLabel()', () => {
  it('deve retornar "Pronta para Venda" para status pronta', () => {
    expect(getStatusLabel('pronta')).toBe('Pronta para Venda')
  })

  it('deve retornar "Em Manutenção" para status manutencao', () => {
    expect(getStatusLabel('manutencao')).toBe('Em Manutenção')
  })

  it('deve retornar "Indisponível" para status indisponivel', () => {
    expect(getStatusLabel('indisponivel')).toBe('Indisponível')
  })

  it('deve retornar "Vendido" para status vendido', () => {
    expect(getStatusLabel('vendido')).toBe('Vendido')
  })

  it('deve retornar "Desconhecido" para status inválido', () => {
    expect(getStatusLabel('invalido' as TreadmillStatus)).toBe('Desconhecido')
  })
})

// ─── getPartStatusLabel ──────────────────────────────────────────────────────

describe('getPartStatusLabel()', () => {
  const testCases: Array<[PartStatus, string]> = [
    ['faltando', 'Faltando'],
    ['comprada', 'Comprada'],
    ['recebida', 'Recebida'],
  ]

  test.each(testCases)(
    'status "%s" deve retornar "%s"',
    (status, expectedLabel) => {
      expect(getPartStatusLabel(status)).toBe(expectedLabel)
    }
  )

  it('deve retornar "Desconhecido" para status inválido', () => {
    expect(getPartStatusLabel('invalido' as PartStatus)).toBe('Desconhecido')
  })
})

// ─── getPartStatusColor ──────────────────────────────────────────────────────

describe('getPartStatusColor()', () => {
  it('"faltando" deve ter classe de danger', () => {
    const cls = getPartStatusColor('faltando')
    expect(cls).toContain('status-danger')
  })

  it('"comprada" deve ter classe de info', () => {
    const cls = getPartStatusColor('comprada')
    expect(cls).toContain('status-info')
  })

  it('"recebida" deve ter classe de success', () => {
    const cls = getPartStatusColor('recebida')
    expect(cls).toContain('status-success')
  })

  it('status inválido deve retornar classe muted', () => {
    const cls = getPartStatusColor('invalido' as PartStatus)
    expect(cls).toContain('bg-muted')
  })

  it('todas as cores devem conter border classes', () => {
    expect(getPartStatusColor('faltando')).toContain('border-')
    expect(getPartStatusColor('comprada')).toContain('border-')
    expect(getPartStatusColor('recebida')).toContain('border-')
  })
})

// ─── getRoleLabel ─────────────────────────────────────────────────────────────

describe('getRoleLabel()', () => {
  const testCases: Array<[UserRole, string]> = [
    ['admin', 'Administrador'],
    ['tecnico', 'Técnico'],
    ['compras', 'Compras'],
    ['leitor', 'Leitor/Vendedor'],
  ]

  test.each(testCases)(
    'role "%s" deve retornar "%s"',
    (role, expectedLabel) => {
      expect(getRoleLabel(role)).toBe(expectedLabel)
    }
  )

  it('deve retornar "Desconhecido" para role inválida', () => {
    expect(getRoleLabel('invalido' as UserRole)).toBe('Desconhecido')
  })
})

// ─── getEquipmentTypeLabel ────────────────────────────────────────────────────

describe('getEquipmentTypeLabel()', () => {
  it('deve retornar "Bike" para type bike', () => {
    expect(getEquipmentTypeLabel('bike')).toBe('Bike')
  })

  it('deve retornar "Elíptico" para type eliptico', () => {
    expect(getEquipmentTypeLabel('eliptico')).toBe('Elíptico')
  })

  it('deve retornar "Esteira" para type esteira', () => {
    expect(getEquipmentTypeLabel('esteira')).toBe('Esteira')
  })

  it('deve retornar "Esteira" quando type é undefined', () => {
    expect(getEquipmentTypeLabel(undefined)).toBe('Esteira')
  })

  it('deve retornar "Esteira" para tipo desconhecido (fallback)', () => {
    expect(getEquipmentTypeLabel('desconhecido' as EquipmentType)).toBe('Esteira')
  })
})

// ─── getEquipmentTypePluralLabel ──────────────────────────────────────────────

describe('getEquipmentTypePluralLabel()', () => {
  it('deve retornar "Bikes" para type bike', () => {
    expect(getEquipmentTypePluralLabel('bike')).toBe('Bikes')
  })

  it('deve retornar "Elípticos" para type eliptico', () => {
    expect(getEquipmentTypePluralLabel('eliptico')).toBe('Elípticos')
  })

  it('deve retornar "Esteiras" para type esteira', () => {
    expect(getEquipmentTypePluralLabel('esteira')).toBe('Esteiras')
  })

  it('deve retornar "Esteiras" quando type é undefined', () => {
    expect(getEquipmentTypePluralLabel(undefined)).toBe('Esteiras')
  })
})
