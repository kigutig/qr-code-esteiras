# Política de Segurança

## Versões Suportadas

| Versão | Suporte de Segurança |
|--------|---------------------|
| Latest (`main`) | ✅ Suportada |
| Staging (`develop`) | ⚠️ Apenas crítico |
| Versões anteriores | ❌ Não suportada |

## Reportando Vulnerabilidades

**NÃO abra issues públicas para vulnerabilidades de segurança.**

### Como reportar

1. **GitHub Private Security Advisory**: Use a aba **Security → Advisories → "Report a vulnerability"** neste repositório.

2. **Email**: Se preferir, envie um email para o maintainer com o assunto `[SECURITY] Vulnerabilidade — Esteira Management System`.

### O que incluir no relatório

- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial (CVSS se possível)
- Versão/commit afetado
- Possível solução (opcional)

### Processo de resposta

| Etapa | Prazo |
|-------|-------|
| Confirmação de recebimento | 48 horas |
| Avaliação inicial | 5 dias úteis |
| Patch/mitigação | 30 dias (crítico: 7 dias) |
| Divulgação pública | Após o patch |

## Práticas de Segurança Implementadas

- **DevSecOps**: Trivy, Semgrep SAST e npm audit em cada PR
- **Dependabot**: Atualizações automáticas semanais de dependências
- **Headers HTTP**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Variáveis de ambiente**: Segredos em GitHub Secrets, nunca no código
- **Firebase Rules**: Regras de segurança para Realtime Database e Storage
- **CODEOWNERS**: Revisão obrigatória para arquivos críticos

## Escopo

| Área | Incluída no escopo |
|------|--------------------|
| Autenticação Firebase | ✅ Sim |
| Regras do Firebase Database | ✅ Sim |
| API Routes Next.js | ✅ Sim |
| Middleware de segurança | ✅ Sim |
| Exposição de dados sensíveis | ✅ Sim |
| Vulnerabilidades de dependências | ✅ Sim |
| Problemas de UI/UX | ❌ Não |

---

*Última atualização: Setembro 2026*
