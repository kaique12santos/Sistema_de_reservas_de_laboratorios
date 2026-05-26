# Documentação da API - Sistema de Reservas de Laboratórios

Este documento descreve todos os endpoints disponíveis na API do backend, organizados por domínio.

## Health Check

### `GET /`
- **Descrição:** Verifica o status do servidor.
- **Acesso:** Público
- **Retorno:** `200 OK` - `{ status: 'online', message: '...', version: '...' }`

---

## Autenticação (`/api/auth`)

### `POST /api/auth/register`
- **Descrição:** Realiza o cadastro inicial de um novo usuário com status `PENDING`. Dispara e-mail de verificação.
- **Acesso:** Público
- **Corpo:** `{ "name": "...", "email": "...", "password": "...", "department_id": 1 }`
- **Retorno:** `201 Created`

### `POST /api/auth/login`
- **Descrição:** Autentica o usuário e retorna o Token JWT e os dados da sessão.
- **Acesso:** Público
- **Corpo:** `{ "email": "...", "password": "..." }`
- **Retorno:** `200 OK` - `{ "user": { ... }, "token": "..." }`

### `POST /api/auth/verify-email`
- **Descrição:** Valida o token de verificação enviado por e-mail.
- **Acesso:** Público
- **Corpo:** `{ "token": "..." }`
- **Retorno:** `200 OK`

### `POST /api/auth/forgot-password`
- **Descrição:** Inicia o fluxo de recuperação de senha e envia o link por e-mail.
- **Acesso:** Público
- **Corpo:** `{ "email": "..." }`
- **Retorno:** `200 OK`

### `POST /api/auth/reset-password`
- **Descrição:** Finaliza a recuperação de senha com o token do e-mail.
- **Acesso:** Público
- **Corpo:** `{ "token": "...", "newPassword": "..." }`
- **Retorno:** `200 OK`

---

## Departamentos (`/api/departments`)

### `GET /api/departments`
- **Descrição:** Lista todos os departamentos/cursos cadastrados no sistema.
- **Acesso:** Público
- **Retorno:** `200 OK` - Lista de departamentos.

---

## Usuários (`/api/users`)

### `GET /api/users/pending`
- **Descrição:** Lista todos os usuários aguardando aprovação de cadastro.
- **Acesso:** ADMIN

### `PATCH /api/users/:id/approve`
- **Descrição:** Aprova o cadastro de um usuário pendente.
- **Acesso:** ADMIN

### `PATCH /api/users/:id/reject`
- **Descrição:** Rejeita o cadastro de um usuário.
- **Acesso:** ADMIN
- **Corpo:** `{ "reason": "Motivo da rejeição" }`

### `GET /api/users`
- **Descrição:** Lista todos os usuários do sistema.
- **Acesso:** SUPPORT

### `PATCH /api/users/:id/role`
- **Descrição:** Altera a permissão (role) de um usuário.
- **Acesso:** SUPPORT
- **Corpo:** `{ "role": "ADMIN" }`

### `PATCH /api/users/:id/toggle-status`
- **Descrição:** Ativa ou desativa um usuário no sistema.
- **Acesso:** SUPPORT

---

## Laboratórios (`/api/laboratories`)

### `GET /api/laboratories`
- **Descrição:** Retorna a lista de laboratórios. Professores veem apenas os ativos, Admins podem incluir inativos.
- **Acesso:** Autenticado
- **Query Params:** `?includeInactive=true` (Apenas ADMIN)

### `GET /api/laboratories/:id`
- **Descrição:** Retorna os dados de um laboratório específico.
- **Acesso:** Autenticado

### `POST /api/laboratories`
- **Descrição:** Cria um novo laboratório.
- **Acesso:** ADMIN
- **Corpo:** `{ "name": "...", "location": "...", "capacity": 30, "description_lab": "...", "type": "LABORATORIO" }`

### `PUT /api/laboratories/:id`
- **Descrição:** Atualiza os dados de um laboratório existente.
- **Acesso:** ADMIN

### `PATCH /api/laboratories/:id/toggle-status`
- **Descrição:** Alterna o status (ativo/inativo) de um laboratório.
- **Acesso:** ADMIN

---

## Horários / Time Slots (`/api/time-slots`)

### `GET /api/time-slots`
- **Descrição:** Lista todos os horários cadastrados.
- **Acesso:** Autenticado

### `POST /api/time-slots`
- **Descrição:** Cria um novo horário.
- **Acesso:** ADMIN
- **Corpo:** `{ "name": "1º Horário", "start_time": "19:00", "end_time": "19:50" }`

### `PUT /api/time-slots/:id`
- **Descrição:** Atualiza um horário específico.
- **Acesso:** ADMIN

### `DELETE /api/time-slots/:id`
- **Descrição:** Remove (soft-delete) um horário.
- **Acesso:** ADMIN

---

## Ciclos Acadêmicos (`/api/academic-cycles`)

### `GET /api/academic-cycles`
- **Descrição:** Lista todos os ciclos acadêmicos.
- **Acesso:** Autenticado

### `GET /api/academic-cycles/active`
- **Descrição:** Retorna o ciclo acadêmico ativo no momento.
- **Acesso:** Autenticado

### `POST /api/academic-cycles/generate`
- **Descrição:** Gera e configura o próximo ciclo acadêmico e sincroniza feriados.
- **Acesso:** ADMIN

### `PUT /api/academic-cycles/:id/activate`
- **Descrição:** Ativa um ciclo específico, desativando o ciclo anterior.
- **Acesso:** ADMIN

---

## Feriados (`/api/holidays`)

### `GET /api/holidays`
- **Descrição:** Lista os feriados bloqueados.
- **Acesso:** Autenticado
- **Query Params:** `?cycle_id=1` (Opcional, filtra por ciclo)

### `POST /api/holidays/sync`
- **Descrição:** Força a sincronização de feriados via BrasilAPI para um ciclo específico.
- **Acesso:** ADMIN
- **Corpo:** `{ "cycle_id": 1 }`

---

## Reservas (`/api/reservations`)

### `GET /api/reservations/check-conflict`
- **Descrição:** Verifica se há conflito de horários antes da criação da reserva.
- **Acesso:** Autenticado
- **Query Params:** `?lab_id=...&date=...&start_time=...&end_time=...`

### `POST /api/reservations`
- **Descrição:** Cria uma nova reserva (simples ou recorrente).
- **Acesso:** Autenticado

### `GET /api/reservations/my`
- **Descrição:** Lista as reservas do usuário autenticado.
- **Acesso:** Autenticado

### `GET /api/reservations/calendar`
- **Descrição:** Retorna dados das reservas formatados para o frontend (FullCalendar).
- **Acesso:** Autenticado
- **Query Params:** `?lab_id=...&year=...&month=...`

### `GET /api/reservations/stats`
- **Descrição:** Retorna as métricas e totais para o dashboard.
- **Acesso:** Autenticado

### `PATCH /api/reservations/:id/cancel`
- **Descrição:** Cancela uma reserva existente (pelo proprietário ou ADMIN).
- **Acesso:** Autenticado

### `GET /api/reservations/pending`
- **Descrição:** Lista todas as reservas aguardando aprovação.
- **Acesso:** ADMIN

### `PATCH /api/reservations/:id/approve`
- **Descrição:** Aprova uma reserva pendente.
- **Acesso:** ADMIN

### `PATCH /api/reservations/:id/reject`
- **Descrição:** Rejeita uma reserva pendente.
- **Acesso:** ADMIN
- **Corpo:** `{ "reason": "Motivo..." }`

### `PATCH /api/reservations/:id/redirect`
- **Descrição:** Redireciona (muda de laboratório/horário) uma reserva pendente.
- **Acesso:** ADMIN

### `POST /api/reservations/overwrite`
- **Descrição:** Sobrescreve (cancela forçadamente) uma reserva existente em favor de outra prioritária.
- **Acesso:** ADMIN

### `DELETE /api/reservations/bulk`
- **Descrição:** Cancela reservas em lote (baseado nas permissões do service).
- **Acesso:** Autenticado

---

## Auditoria (`/api/audit`)

### `GET /api/audit/user/:userId`
- **Descrição:** Retorna o log de ações/auditoria atreladas a um usuário.
- **Acesso:** ADMIN

### `GET /api/audit/:table/:id`
- **Descrição:** Retorna a trilha de auditoria para um registro específico de uma tabela.
- **Acesso:** ADMIN

---

## Feedback (`/api/feedback`)

### `POST /api/feedback`
- **Descrição:** Recebe as mensagens do widget de feedback / suporte enviado pelo usuário.
- **Acesso:** Autenticado
- **Corpo:** `{ "type": "BUG", "message": "..." }`