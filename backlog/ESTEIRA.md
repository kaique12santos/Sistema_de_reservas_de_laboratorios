# 🚀 Esteira de Desenvolvimento – Sistema de Reserva de Laboratórios

---

## 👥 Estrutura da Equipe

| Área         | Responsável Principal | Papel Sugerido |
|--------------|-----------------------|----------------|
| **Backend**  | Nicole Lisboa         | Dev            |
| **Frontend** | Luiz Carlos           | Dev / Designer |
| **Banco**    | Vinicius Crepaldi     | DBA / QA       |
| **Suporte**  | Diego Marques         | Apoio / Doc    |
| **Liderança**| Kaique Caitano        | Full Stack / Arquiteto |

---

## 📜 Regras da Esteira

### 1️⃣ Assunção de Tarefas
- **Ninguém inicia uma task sem ciência do responsável da área ou do Líder**
- Trabalho na própria área tem prioridade
- Para ajudar outra área:
  1. Consultar o backlog e identificar task disponível
  2. Pedir permissão no grupo: "@responsável-area posso pegar a task F3-BE-01?"
  3. Aguardar resposta (aprovação ou negativa)
  4. Se aprovado, colocar seu nome no campo "Responsável" do BACKLOG.md

### 2️⃣ Responsabilidade
- Quem assume uma task DEVE:
  - Atualizar status no BACKLOG.md (commit)
  - Colocar seu nome no "Responsável"
  - Informar no grupo quando iniciar
  - Informar no grupo quando concluir

### 3️⃣ Fluxo de Entrega
```
1. Criar branch específica:
   git checkout -b feat/F3-BE-01-crud-ciclos
   
2. Desenvolver e commitar (Conventional Commits):
   git commit -m "feat(F3-BE-01): adiciona CRUD de ciclos acadêmicos"
   
3. Atualizar status para "EM REVIEW" no BACKLOG.md
   
4. Abrir Pull Request:
   - Título: [F3-BE-01] CRUD de Ciclos Acadêmicos
   - Descrição: O que foi feito, como testar
   - Reviewers: @lider + @responsavel-area
   
5. Após aprovação e merge na develop:
   - Atualizar status para "CONCLUÍDO" no BACKLOG.md
   - Informar no grupo: "✅ F3-BE-01 concluída e mergeada"
   
6. Deletar branch local:
   git branch -d feat/F3-BE-01-crud-ciclos
```

### 4️⃣ Dependências
- **Nunca iniciar uma task se suas dependências não estão concluídas**
- Exemplo: Não pode fazer F4-BE-02 (Reserva simples) se F4-BE-01 (Detecção de conflitos) não estiver pronta
- Se estiver bloqueado, avisar imediatamente no grupo

---

## 🔄 Status Possíveis

| Status | Significado | Ação |
|--------|-------------|------|
| 🔴 **PENDENTE** | Tarefa mapeada, ninguém pegou ainda | Livre para assumir (com permissão) |
| 🟡 **EM ANDAMENTO** | Alguém está codando neste momento | Não assumir (já tem responsável) |
| 🟠 **EM REVIEW** | Código pronto, aguardando code review | Revisar PR se for da sua área |
| ✅ **CONCLUÍDO** | Código mergeado na `develop` e testado | Task finalizada |

---

## 📋 Padrão de Commit (Conventional Commits)

```bash
# Feature nova
git commit -m "feat(F3-BE-01): adiciona endpoint de criação de ciclos"

# Correção de bug
git commit -m "fix(F4-BE-02): corrige validação de conflitos"

# Refatoração
git commit -m "refactor(F1-BE-03): melhora estrutura do AuthService"

# Documentação
git commit -m "docs(F10-GE-03): atualiza README com instruções de deploy"

# Testes
git commit -m "test(F10-BE-01): adiciona testes unitários de ReservationService"
```

---

## 🎯 Cronograma Sugerido (12 Semanas)

### 📅 Semana 1 - FASE 1 (🟡 pendente)
- [x] Infraestrutura base
- [] Autenticação JWT
- [] Telas de login/cadastro

### 📅 Semana 2-3 - FASE 2
**Meta:** Aprovação de cadastros + CRUD básico  
**Tasks:**
- [ ] F1-BE-04: Middleware de autorização
- [ ] F2-BE-01: Aprovação de cadastros (Backend)
- [ ] F2-BE-02: CRUD de Laboratórios (Backend)
- [ ] F2-BE-03: CRUD de Horários (Backend)
- [ ] F2-FE-01: Tela de aprovação de cadastros
- [ ] F2-FE-02: Tela de gestão de laboratórios

**Responsáveis:**
- Backend → F1-BE-04, F2-BE-01, F2-BE-02, F2-BE-03
- Frontend → F2-FE-01, F2-FE-02
- Suporte → F2-FE-03 (tela de horários)

---

### 📅 Semana 4 - FASE 3
**Meta:** Ciclos acadêmicos e feriados  
**Tasks:**
- [ ] F3-BE-01: CRUD de Ciclos Acadêmicos
- [ ] F3-BE-02: CRUD de Feriados
- [ ] F3-FE-01: Tela de gestão de ciclos
- [ ] F3-FE-02: Tela de cadastro de feriados

**Responsáveis:**
- Backend → F3-BE-01, F3-BE-02
- Frontend → F3-FE-01, F3-FE-02

---

### 📅 Semana 5-6 - FASE 4
**Meta:** Reservas simples funcionando  
**Tasks:**
- [ ] F4-BE-01: Lógica de detecção de conflitos ⚡ CRÍTICO
- [ ] F4-BE-02: Criação de reserva simples ⚡ CRÍTICO
- [ ] F4-FE-01: Formulário de criação de reserva
- [ ] F4-FE-02: Visualização de minhas reservas

**Responsáveis:**
- Backend → F4-BE-01, F4-BE-02 (par programming recomendado)
- Frontend → F4-FE-01, F4-FE-02
- Banco → Apoiar otimização de queries (F4-BE-01)

---

### 📅 Semana 7-8 - FASE 5
**Meta:** Reservas recorrentes + Aprovação  
**Tasks:**
- [ ] F5-BE-01: Criação de reserva recorrente ⚡ CRÍTICO
- [ ] F5-BE-02: Aprovação/Rejeição de reservas
- [ ] F5-FE-01: Formulário de reserva recorrente
- [ ] F5-FE-02: Painel de aprovação de reservas

**Responsáveis:**
- Backend → F5-BE-01, F5-BE-02
- Frontend → F5-FE-01, F5-FE-02

---

### 📅 Semana 9-10 - FASE 6 + FASE 7
**Meta:** Sobrescrita + Notificações  
**Tasks:**
- [ ] F6-BE-01: Sobrescrita de reserva
- [ ] F6-BE-02: Exclusão múltipla
- [ ] F6-BE-03: Sistema de auditoria
- [ ] F7-BE-01: Sistema de eventos (EventBus)
- [ ] F7-BE-02: Serviço de email
- [ ] F6-FE-01: Interface de sobrescrita
- [ ] F6-FE-02: Exclusão múltipla (UI)
- [ ] F7-FE-01: Sistema de notificações toast

**Responsáveis:**
- Backend → F6-BE-01, F6-BE-02, F6-BE-03, F7-BE-01, F7-BE-02
- Frontend → F6-FE-01, F6-FE-02, F7-FE-01
- Suporte → Configurar SMTP para emails

---

### 📅 Semana 11 - FASE 8 + FASE 9
**Meta:** Visualização + Refinamentos  
**Tasks:**
- [ ] F8-FE-01: Calendário visual de reservas
- [ ] F8-FE-02: Dashboard com métricas
- [ ] F9-FE-01: Responsividade mobile
- [ ] F9-FE-02: Tela de perfil do usuário
- [ ] F9-BE-01: Relatórios (opcional)

**Responsáveis:**
- Frontend → F8-FE-01, F8-FE-02, F9-FE-01, F9-FE-02
- Backend → F9-BE-01 (se houver tempo)
- Todos → Correção de bugs encontrados

---

### 📅 Semana 12 - FASE 10 (Deploy e Apresentação)
**Meta:** Sistema em produção + Apresentação  
**Tasks:**
- [ ] F10-BE-01: Testes unitários
- [ ] F10-BE-02: Testes de integração
- [ ] F10-FE-01: Testes de componentes
- [ ] F10-GE-01: Deploy backend
- [ ] F10-GE-02: Deploy frontend
- [ ] F10-GE-03: Documentação final
- [ ] Preparar slides de apresentação
- [ ] Ensaiar demonstração

**Responsáveis:**
- Backend → F10-BE-01, F10-BE-02, F10-GE-01
- Frontend → F10-FE-01, F10-GE-02
- Líder → F10-GE-03, coordenar apresentação
- Todos → Ensaio da apresentação

---


### Prioridades de Resolução
1. **P0 - Crítico:** Bloqueia múltiplas pessoas/tasks → resolver em 2h
2. **P1 - Alto:** Bloqueia 1 task crítica → resolver em 1 dia
3. **P2 - Médio:** Bloqueia task não-crítica → resolver em 2 dias
4. **P3 - Baixo:** Não bloqueia nada → resolver quando possível


## 🏆 Definition of Done (DoD)

Uma task só está **CONCLUÍDA** quando:

### Backend ✅
- [ ] Código implementado e funcional
- [ ] Testes básicos escritos
- [ ] ESLint sem erros
- [ ] Code review aprovado
- [ ] PR mergeado na `develop`
- [ ] BACKLOG.md atualizado com status ✅

### Frontend ✅
- [ ] Componente renderiza corretamente
- [ ] Responsivo (testado em 2 resoluções mínimo)
- [ ] Sem erros no console
- [ ] Code review aprovado
- [ ] PR mergeado na `develop`
- [ ] BACKLOG.md atualizado com status ✅

---

## 🎯 Priorização de Tasks

### Ordem de Prioridade
1. **MUST HAVE** ⚡ (Crítico para MVP)
   - F4-BE-01, F4-BE-02: Reservas simples
   - F5-BE-01, F5-BE-02: Reservas recorrentes + Aprovação
   - F6-BE-01: Sobrescrita
   
2. **SHOULD HAVE** 🟡 (Importante)
   - F7-BE-01, F7-BE-02: Notificações
   - F8-FE-01: Calendário visual
   
3. **COULD HAVE** 🔵 (Desejável)
   - F9-BE-01: Relatórios
   - F9-FE-02: Tela de perfil

4. **WON'T HAVE** ⚪ (Fora do escopo)
   - Integração com Google Calendar
   - App Mobile nativo
   - Chat interno

---

**Última Atualização:** 02/03/2026  
**Versão da Esteira:** 1.0

