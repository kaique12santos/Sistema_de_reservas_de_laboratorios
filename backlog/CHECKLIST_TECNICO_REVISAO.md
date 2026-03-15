# ✅ CHECKLIST TÉCNICO DE REVISÃO - Sistema de Reserva de Laboratórios

**Objetivo:** Garantir que nenhum detalhe arquitetural ou requisito seja esquecido antes de avançar de fase.  
**Uso:** Revisar este documento ANTES de marcar qualquer fase como concluída.

---

## 📐 PADRÕES ARQUITETURAIS OBRIGATÓRIOS

### 🔹 Backend - Padrão MVC + Service Layer

**Estrutura de Arquivos Obrigatória:**
```
src/
├── app.js                      ✓ Configuração do Express
├── server.js                   ✓ Inicialização do servidor
├── config/
│   └── database.js             ✓ Singleton de conexão MySQL (pool)
├── routes/                     ✓ Definição de endpoints
├── controllers/                ✓ Recebe req, chama service, retorna res
├── services/                   ✓ TODA lógica de negócio AQUI
├── repositories/               ✓ Queries SQL isoladas
├── models/                     ✓ Representação de entidades
├── middlewares/                ✓ Auth, autorização, validação
├── utils/                      ✓ Funções puras auxiliares
├── dtos/                       ✓ Objetos de entrada
└── events/                     ✓ EventBus e listeners
```

### 🔹 Frontend - React + MUI

**Estrutura de Arquivos Obrigatória:**
```
src/
├── app/
│   ├── App.jsx                 ✓ Componente raiz
│   ├── routes.jsx              ✓ Definição de rotas
│   └── theme.js                ✓ Tema MUI institucional (CPS)
├── components/
│   ├── common/                 ✓ Componentes reutilizáveis genéricos
│   ├── layout/                 ✓ MainLayout, Sidebar, Topbar
│   └── [domain]/               ✓ Componentes de domínio (reservation, laboratory)
├── pages/                      ✓ Páginas por rota
├── services/                   ✓ Axios + chamadas API
├── hooks/                      ✓ Custom hooks (useReservation, etc)
├── context/                    ✓ Estado global (AuthContext, NotificationContext)
├── utils/                      ✓ Funções auxiliares
└── constants/                  ✓ Enums (roles.js, status.js)
```

---

## ✅ FASE 1 - INFRAESTRUTURA E AUTENTICAÇÃO

### 🔹 Backend - Checklist Técnico

#### ✓ Estrutura Base
- [x] **app.js** existe e configura Express corretamente
  - [x] `express.json()` configurado
  - [x] CORS configurado (permitir frontend)
  - [x] Rotas importadas e registradas
  - [x] Middleware de erro global no final
  
- [x] **server.js** inicializa servidor
  - [x] Porta definida via `process.env.PORT` ou fallback
  - [x] Mensagem de log ao iniciar
  - [x] Testa conexão com banco antes de subir

- [x] **config/database.js** - Singleton de Conexão
  - [x] Usa `mysql2/promise`
  - [x] Pool de conexões configurado (min: 5, max: 20)
  - [x] Credenciais via `.env` (host, user, password, database)
  - [x] Método `getConnection()` funciona
  - [x] Tratamento de erro de conexão

#### ✓ Autenticação (AuthController, AuthService, UserRepository)

**UserRepository.js:**
- [x] Método `create(userData)` insere usuário
  - [x] INSERT em `users` com campos: name, email, password_hash, department_id, role, status
  - [x] Status inicial: `PENDING`
  - [x] Role padrão: `PROFESSOR`
  - [x] Retorna ID do usuário criado
  
- [x] Método `findByEmail(email)` busca usuário
  - [x] SELECT com WHERE email = ?
  - [x] Retorna null se não encontrar
  
- [x] Método `findById(id)` busca por ID
  - [x] SELECT com WHERE id = ?
  - [x] JOIN com `departments` para trazer nome do departamento

**AuthService.js:**
- [x] Método `register(dto)` valida e cria usuário
  - [x] Valida se email já existe (UserRepository.findByEmail)
  - [x] Se existir: lançar erro "Email já cadastrado"
  - [x] Criptografa senha com `bcrypt.hash(password, 10)`
  - [x] Chama UserRepository.create()
  - [x] Retorna dados do usuário (sem password_hash)
  
- [x] Método `login(email, password)` autentica
  - [x] Busca usuário por email
  - [x] Se não encontrar: lançar erro "Credenciais inválidas"
  - [x] Verifica status: se `PENDING`, lançar erro "Conta aguardando aprovação"
  - [x] Verifica status: se `REJECTED`, lançar erro "Conta rejeitada"
  - [x] Compara senha com `bcrypt.compare(password, user.password_hash)`
  - [x] Se senha errada: lançar erro "Credenciais inválidas"
  - [x] Gera token JWT com `jwt.sign({ id, email, role }, SECRET, { expiresIn: '24h' })`
  - [x] Retorna `{ token, user: { id, name, email, role } }`

**AuthService.js (novos métodos):**

* [x] `forgotPassword(email)`
* [x] Busca usuário. Se não achar, não retorna erro (segurança), apenas finge que enviou.
* [x] Gera token aleatório: `crypto.randomBytes(20).toString('hex')`
* [x] Define expiração: `Date.now() + 3600000` (1 hora)
* [x] Salva no banco (`UPDATE users SET password_reset_token = ?, password_reset_expires = ?`)
* [x] Chama `EmailService.sendPasswordReset(email, token)`


* [x] `resetPassword(token, newPassword)`
* [x] Busca usuário por token e verifica se `password_reset_expires > now`
* [x] Se inválido: lança erro "Token inválido ou expirado"
* [x] Hash da nova senha (`bcrypt`)
* [x] Atualiza banco e limpa campos de token (`token = null, expires = null`)

**EmailService.js (Básico F1):**

* [x] Configuração do `nodemailer` (ou log no console para dev)
* [x] Template simples de texto: "Para redefinir sua senha, clique em: http://localhost:5173/reset-password?token=..."


**AuthController.js:**
- [x] Método `register(req, res)` recebe POST
  - [x] Valida DTO (nome, email, senha obrigatórios)
  - [x] Chama AuthService.register()
  - [x] Retorna 201 com mensagem "Cadastro realizado. Aguarde aprovação."
  - [x] Catch: retorna 400 ou 500 com mensagem de erro
  
- [x] Método `login(req, res)` recebe POST
  - [x] Valida DTO (email, senha obrigatórios)
  - [x] Chama AuthService.login()
  - [x] Retorna 200 com `{ token, user }`
  - [x] Catch: retorna 401 ou 500

**routes/auth.routes.js:**
- [x] POST `/register` → AuthController.register
- [x] POST `/login` → AuthController.login
- [x] Rotas registradas em `app.js` como `/auth`

#### ✓ Middleware de Autenticação

**middlewares/auth.middleware.js:**
- [x] Função `verifyToken(req, res, next)`
  - [x] Extrai token do header `Authorization: Bearer {token}`
  - [x] Se não houver token: retorna 401 "Token não fornecido"
  - [x] Verifica token com `jwt.verify(token, SECRET)`
  - [x] Se inválido/expirado: retorna 403 "Token inválido"
  - [x] Se válido: injeta `req.user = { id, email, role }`
  - [x] Chama `next()`

#### ✓ Middleware de Autorização (RBAC)

**middlewares/authorize.middleware.js:**
- [x] Função `authorize(allowedRoles)` retorna middleware
  - [x] Verifica se `req.user.role` está em `allowedRoles`
  - [x] Se não: retorna 403 "Acesso negado"
  - [x] Se sim: chama `next()`
  
**Exemplo de uso:**
```javascript
router.post('/laboratories', verifyToken, authorize(['ADMIN']), LaboratoryController.create);
```

#### ✓ Variáveis de Ambiente

**.env:**
```env
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha123
DB_NAME=fatecZL_lab_reservations

# JWT
JWT_SECRET=chave_secreta_super_segura_mudar_em_producao
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development
```

**Validação:**
- [ ] `.env.example` criado com campos vazios
- [x] `.env` no `.gitignore`
- [x] dotenv carregado em `app.js`: `require('dotenv').config()`

---

### 🔹 Frontend - Checklist Técnico

#### ✓ Configuração Inicial

**package.json (dependências essenciais):**
- [x] `react`, `react-dom`
- [x] `react-router-dom` (v6+)
- [x] `@mui/material`, `@emotion/react`, `@emotion/styled`
- [x] `axios`
- [ ] `date-fns` ou `dayjs` (manipulação de datas)

**src/app/theme.js:**
- [x] Tema MUI customizado
- [x] Paleta de cores institucional CPS:
  - [x] `primary.main`: Vermelho CPS (#C8102E ou similar)
  - [x] `secondary.main`: Cinza escuro ou azul
- [x] Tipografia padrão (Roboto ou institucional)
- [x] Exporta `createTheme()`

**src/app/App.jsx:**
- [x] Envolto em `<ThemeProvider theme={theme}>`
- [x] Envolto em `<BrowserRouter>`
- [x] Envolto em `<AuthProvider>` (context)
- [x] Renderiza `<Routes>` com rotas definidas

#### ✓ Sistema de Rotas

**src/app/routes.jsx:**
- [x] Rotas públicas:
  - [x] `/login` → LoginPage
  - [x] `/register` → RegisterPage
  
- [x] Rotas protegidas (dentro de `<ProtectedRoute>`):
  - [x] `/` ou `/dashboard` → DashboardPage
  - [x] `/reservations` → MyReservationsPage (ou AdminReservationsPage)
  - [x] `/laboratories` → LaboratoriesPage (ADMIN only)
  - [x] Adicionar conforme fases avançam

**components/layout/ProtectedRoute.jsx:**
- [ ] Verifica se `user` está no AuthContext
- [ ] Se não: redireciona para `/login`
- [ ] Se sim: renderiza `<Outlet />` ou children

#### ✓ Context de Autenticação

**src/context/AuthContext.jsx:**
- [x] Estado: `user` (null ou objeto), `loading`
- [x] Métodos:
  - [x] `login(email, password)` → chama API, armazena token e user
  - [x] `register(userData)` → chama API
  - [x] `logout()` → limpa token e user, redireciona para login
  
- [x] Persistência:
  - [x] Token salvo no `localStorage.setItem('token', token)`
  - [x] User salvo no `localStorage.setItem('user', JSON.stringify(user))`
  - [x] No `useEffect` inicial: restaura token e user do localStorage
  
- [x] Axios interceptor:
  - [x] Inclui `Authorization: Bearer {token}` em toda requisição
  - [x] Se 401: chama `logout()` automaticamente

**src/services/api.js:**
- [x] Instância Axios configurada:
  - [x] `baseURL: process.env.REACT_APP_API_URL` (ex: http://localhost:3000)
  - [x] Interceptor de request: adiciona `Authorization`
  - [x] Interceptor de response: trata 401 globalmente

**src/services/auth.service.js:**
- [x] `async login(email, password)` → POST `/auth/login`
- [x] `async register(userData)` → POST `/auth/register`
- [x] Exporta funções

#### ✓ Telas de Autenticação

**src/pages/LoginPage.jsx:**
- [x] Formulário MUI com:
  - [x] `<TextField>` para email
  - [x] `<TextField type="password">` para senha
  - [x] `<Button>` para submeter
  - [x] Link para `/register`
  
- [x] Estado: `email`, `password`, `loading`, `error`
- [x] Submit:
  - [x] Chama `AuthContext.login()`
  - [x] Se sucesso: redireciona para `/dashboard`
  - [x] Se erro: exibe mensagem de erro
  
- [x] Validação:
  - [x] Email obrigatório e formato válido
  - [x] Senha obrigatória

**src/pages/RegisterPage.jsx:**
- [x] Formulário MUI com:
  - [x] `<TextField>` para nome
  - [x] `<TextField>` para email
  - [x] `<Select>` para departamento (buscar de API ou hardcoded)
  - [x] `<TextField type="password">` para senha
  - [x] `<TextField type="password">` para confirmar senha
  - [x] `<Button>` para submeter
  
- [x] Validação:
  - [x] Todos campos obrigatórios
  - [x] Senhas coincidem
  - [x] Email formato válido
  
- [x] Submit:
  - [x] Chama `AuthContext.register()`
  - [x] Se sucesso: exibe mensagem "Aguarde aprovação" e redireciona para login
  - [x] Se erro: exibe mensagem

**src/app/routes.jsx:**

* [x] Rota pública: `/forgot-password` → ForgotPasswordPage
* [x] Rota pública: `/reset-password` → ResetPasswordPage (ler query param `?token=`)

**src/pages/ForgotPasswordPage.jsx:**

* [x] Input email
* [x] Botão "Enviar Link"
* [x] Feedback: "Se o email existir, você receberá um link."

**src/pages/ResetPasswordPage.jsx:**

* [x] `const [searchParams] = useSearchParams(); const token = searchParams.get('token');`
* [x] Inputs: Senha e Confirmação
* [x] Validação: Senhas iguais
* [x] Submit envia `{ token, password }`
* [x] Sucesso: Redireciona para `/login`



## ✅ FASE 2 - APROVAÇÃO DE CADASTROS E CONFIGURAÇÕES BÁSICAS

### 🔹 Backend - Checklist Técnico

#### ✓ CRUD de Laboratórios

**LaboratoryRepository.js:**
- [ ] `findAll()` → SELECT * FROM laboratories WHERE is_active = true ORDER BY name
- [ ] `findById(id)` → SELECT * WHERE id = ? AND is_active = true
- [ ] `create(data)` → INSERT (name, location, capacity, description_lab, type)
- [ ] `update(id, data)` → UPDATE SET ... WHERE id = ?
- [ ] `softDelete(id)` → UPDATE is_active = false WHERE id = ?

**LaboratoryService.js:**
- [ ] `listLaboratories()` → chama repo.findAll()
- [ ] `getLaboratoryById(id)` → valida se existe, retorna
- [ ] `createLaboratory(dto)` → valida dados, chama repo.create()
  - [ ] Validações:
    - [ ] name obrigatório
    - [ ] capacity > 0
    - [ ] type em ['LABORATORIO', 'SALA DE AULA', 'AUDITORIO']
    
- [ ] `updateLaboratory(id, dto)` → valida, atualiza
- [ ] `deleteLaboratory(id)` → soft-delete

**LaboratoryController.js:**
- [ ] `index(req, res)` → GET → lista labs
- [ ] `show(req, res)` → GET /:id → detalhe
- [ ] `create(req, res)` → POST → cria (ADMIN only)
- [ ] `update(req, res)` → PUT /:id → atualiza (ADMIN only)
- [ ] `destroy(req, res)` → DELETE /:id → soft-delete (ADMIN only)

**routes/laboratory.routes.js:**
- [ ] GET `/` → index (público ou autenticado)
- [ ] GET `/:id` → show
- [ ] POST `/` → create + `verifyToken` + `authorize(['ADMIN'])`
- [ ] PUT `/:id` → update + middlewares
- [ ] DELETE `/:id` → destroy + middlewares

#### ✓ CRUD de Time Slots (Horários)

**TimeSlotRepository.js:**
- [ ] `findAll()` → SELECT * WHERE is_active = true ORDER BY start_time
- [ ] `create(data)` → INSERT (name, start_time, end_time)
- [ ] `update(id, data)` → UPDATE ...
- [ ] `softDelete(id)` → UPDATE is_active = false

**TimeSlotService.js:**
- [ ] `listTimeSlots()` → repo.findAll()
- [ ] `createTimeSlot(dto)` → valida, cria
  - [ ] Validações:
    - [ ] name obrigatório (ex: "M1")
    - [ ] start_time < end_time
    - [ ] Formato TIME válido (HH:MM:SS)

**TimeSlotController.js + routes:**
- [ ] Mesmo padrão de laboratories
- [ ] CRUD completo
- [ ] Apenas ADMIN pode criar/editar/deletar

#### ✓ Aprovação de Cadastros de Usuários (RF02, RF03)

**UserRepository.js (adicionar métodos):**
- [ ] `findPending()` → SELECT * FROM users WHERE status = 'PENDING' ORDER BY created_at
- [ ] `updateStatus(id, status)` → UPDATE status = ? WHERE id = ?
- [ ] `countByStatus(status)` → SELECT COUNT(*) WHERE status = ?

**UserService.js:**
- [ ] `listPendingUsers()` → repo.findPending()
- [ ] `approveUser(userId, adminId)` → valida e aprova
  - [ ] Busca usuário
  - [ ] Se status != PENDING: erro "Usuário já processado"
  - [ ] Atualiza status para 'APPROVED'
  - [ ] (Opcional) Emite evento `user:approved` para email
  - [ ] Registra em audit_logs (se já implementado)
  
- [ ] `rejectUser(userId, adminId, reason)` → valida e rejeita
  - [ ] Atualiza status para 'REJECTED'
  - [ ] Salva motivo (adicionar campo `rejection_reason` se necessário)

**UserController.js:**
- [ ] `getPending(req, res)` → GET /pending → lista pendentes
- [ ] `approve(req, res)` → PUT /:id/approve → aprova
- [ ] `reject(req, res)` → PUT /:id/reject → rejeita (body: { reason })

**routes/user.routes.js:**
- [ ] GET `/pending` → getPending + `verifyToken` + `authorize(['ADMIN'])`
- [ ] PUT `/:id/approve` → approve + middlewares
- [ ] PUT `/:id/reject` → reject + middlewares

**Validação de Transição de Status (utils/statusValidator.js):**
- [ ] Função `isValidUserStatusTransition(from, to)`
  - [ ] PENDING → APPROVED ✓
  - [ ] PENDING → REJECTED ✓
  - [ ] APPROVED → REJECTED ✗ (não permitido)
  - [ ] REJECTED → APPROVED ✗ (não permitido)

---

### 🔹 Frontend - Checklist Técnico

#### ✓ Layout Base

**src/components/layout/MainLayout.jsx:**
- [ ] `<Box sx={{ display: 'flex' }}>`
  - [ ] `<Sidebar />` (menu lateral fixo)
  - [ ] `<Box component="main">` (conteúdo principal)
    - [ ] `<Topbar />` (barra superior)
    - [ ] `<Outlet />` (renderiza páginas)

**src/components/layout/Sidebar.jsx:**
- [ ] `<Drawer variant="permanent">`
- [ ] Logo da Fatec no topo
- [ ] Menu dinâmico baseado em role:
  - [ ] Se ADMIN:
    - [ ] Dashboard
    - [ ] Laboratórios
    - [ ] Ciclos Acadêmicos
    - [ ] Horários
    - [ ] Feriados
    - [ ] Aprovações (cadastros e reservas)
    - [ ] Minhas Reservas
  - [ ] Se PROFESSOR:
    - [ ] Dashboard
    - [ ] Minhas Reservas
    - [ ] Nova Reserva
    - [ ] Perfil
    
- [ ] Usa `<ListItem>` e `<ListItemButton>` do MUI
- [ ] Ícones do `@mui/icons-material`

**src/components/layout/Topbar.jsx:**
- [ ] `<AppBar position="sticky">`
- [ ] Mostra nome do usuário logado
- [ ] Avatar ou ícone do usuário
- [ ] Botão de logout (chama `AuthContext.logout()`)
- [ ] (Opcional) Sino de notificações

---
#### ✓ Tela de Gestão de Laboratórios (ADMIN)

**src/pages/LaboratoriesPage.jsx:**
- [ ] DataGrid do MUI (`<DataGrid>`) com colunas:
  - [ ] Nome
  - [ ] Localização
  - [ ] Capacidade
  - [ ] Tipo
  - [ ] Ações (Editar, Deletar)
  
- [ ] Botão "Novo Laboratório" → abre modal
- [ ] Modal de criação/edição:
  - [ ] Campos: name, location, capacity, description, type (select)
  - [ ] Validação: todos obrigatórios
  - [ ] Submit: POST ou PUT `/laboratories`
  
- [ ] Botão deletar: confirmação antes de executar DELETE

**src/services/laboratory.service.js:**
- [ ] `async getAll()` → GET `/laboratories`
- [ ] `async create(data)` → POST `/laboratories`
- [ ] `async update(id, data)` → PUT `/laboratories/:id`
- [ ] `async delete(id)` → DELETE `/laboratories/:id`

**src/hooks/useLaboratory.js (opcional mas recomendado):**
- [ ] Estado: `laboratories`, `loading`, `error`
- [ ] Funções: `fetchLaboratories()`, `createLab()`, `updateLab()`, `deleteLab()`
- [ ] Recarrega lista após criar/editar/deletar

#### ✓ Tela de Configuração de Horários (ADMIN)

**src/pages/TimeSlotsPage.jsx:**
- [ ] Similar a LaboratoriesPage
- [ ] DataGrid com: nome, horário início, horário fim
- [ ] Modal para criar/editar
- [ ] Validação: start_time < end_time

#### ✓ Tela de Aprovação de Cadastros (ADMIN)

**src/pages/PendingUsersPage.jsx:**
- [ ] DataGrid com usuários status PENDING:
  - [ ] Nome
  - [ ] Email
  - [ ] Departamento
  - [ ] Data de cadastro
  - [ ] Ações (Aprovar, Rejeitar)
  
- [ ] Botão "Aprovar":
  - [ ] Confirmação: "Aprovar cadastro de [nome]?"
  - [ ] PUT `/users/:id/approve`
  - [ ] Remove da lista após aprovação
  
- [ ] Botão "Rejeitar":
  - [ ] Modal para digitar motivo
  - [ ] PUT `/users/:id/reject` com { reason }
  - [ ] Remove da lista após rejeição

**src/services/user.service.js:**
- [ ] `async getPending()` → GET `/users/pending`
- [ ] `async approve(id)` → PUT `/users/:id/approve`
- [ ] `async reject(id, reason)` → PUT `/users/:id/reject`

---

## ✅ FASE 3 - CICLOS ACADÊMICOS E FERIADOS

### 🔹 Backend - Checklist Técnico

#### ✓ CRUD de Ciclos Acadêmicos (RF05, RF06, RF19)

**AcademicCycleRepository.js:**
- [ ] `findAll()` → SELECT * ORDER BY start_date DESC
- [ ] `findById(id)` → SELECT * WHERE id = ?
- [ ] `findActive()` → SELECT * WHERE is_active = true LIMIT 1
- [ ] `create(data)` → INSERT (name, start_date, end_date, admin_exclusive_end_date)
- [ ] `update(id, data)` → UPDATE ...
- [ ] `setActive(id)` → transaction:
  - [ ] UPDATE is_active = false (todos)
  - [ ] UPDATE is_active = true WHERE id = ?

**AcademicCycleService.js:**
- [ ] `listCycles()` → repo.findAll()
- [ ] `getActiveCycle()` → repo.findActive()
- [ ] `createCycle(dto)` → valida, cria
  - [ ] Validações (RF05):
    - [ ] name obrigatório
    - [ ] start_date < end_date
    - [ ] Se admin_exclusive_end_date fornecido: deve estar entre start_date e end_date
    
- [ ] `activateCycle(id)` → marca como ativo (apenas 1 por vez)
  - [ ] Validação: ciclo existe
  - [ ] Desativa todos, ativa o escolhido

**AcademicCycleController.js + routes:**
- [ ] GET `/` → index (listar)
- [ ] GET `/active` → getActive (ciclo corrente)
- [ ] POST `/` → create (ADMIN only)
- [ ] PUT `/:id/activate` → activate (ADMIN only)

**Validação de Período Exclusivo ADMIN (RF19, RN04):**
- [ ] Em `utils/dateUtils.js`:
  - [ ] `isInAdminExclusivePeriod(date, cycle)` → bool
    - [ ] Se `admin_exclusive_end_date` for null: retorna false
    - [ ] Se date <= admin_exclusive_end_date: retorna true
    - [ ] Caso contrário: false

#### ✓ CRUD de Feriados (RF07)

**HolidayRepository.js:**
- [ ] `findByCycle(cycleId)` → SELECT * WHERE cycle_id = ? ORDER BY date
- [ ] `create(data)` → INSERT (cycle_id, date, description)
- [ ] `delete(id)` → DELETE WHERE id = ?
- [ ] `isHoliday(date, cycleId)` → SELECT COUNT(*) WHERE date = ? AND cycle_id = ?

**HolidayService.js:**
- [ ] `listHolidaysByCycle(cycleId)` → repo.findByCycle()
- [ ] `createHoliday(dto)` → valida, cria
  - [ ] Validações:
    - [ ] date obrigatória
    - [ ] description obrigatória
    - [ ] cycle_id existe (buscar em AcademicCycleRepo)
    - [ ] data dentro do ciclo (start_date <= date <= end_date)
    
- [ ] `deleteHoliday(id)` → remove
- [ ] `checkIfHoliday(date, cycleId)` → retorna bool (usado em reservas)

**HolidayController.js + routes:**
- [ ] GET `/` com query `?cycle_id=X` → lista feriados do ciclo
- [ ] POST `/` → create (ADMIN only)
- [ ] DELETE `/:id` → delete (ADMIN only)

**Validação de Feriados em Reservas (RN03):**
- [ ] Em `ReservationService` (FASE 4):
  - [ ] Antes de criar reserva, chamar `HolidayService.checkIfHoliday(date, cycleId)`
  - [ ] Se true: lançar erro "Não é possível reservar em feriados"

---

### 🔹 Frontend - Checklist Técnico

#### ✓ Tela de Gestão de Ciclos Acadêmicos

**src/pages/AcademicCyclesPage.jsx:**
- [ ] DataGrid com ciclos:
  - [ ] Nome
  - [ ] Data início
  - [ ] Data fim
  - [ ] Período exclusivo admin (opcional)
  - [ ] Status (Ativo/Inativo)
  - [ ] Ações (Ativar, Editar)
  
- [ ] Botão "Novo Ciclo" → modal com formulário:
  - [ ] Campo: nome (ex: "2026-1")
  - [ ] DatePicker: data início
  - [ ] DatePicker: data fim
  - [ ] DatePicker (opcional): fim do período exclusivo admin
  - [ ] Validação: start < end, exclusive <= end
  
- [ ] Botão "Ativar" → confirmação → PUT `/academic-cycles/:id/activate`
  - [ ] Apenas 1 ciclo ativo por vez (backend garante)

**src/services/academicCycle.service.js:**
- [ ] `async getAll()`
- [ ] `async getActive()`
- [ ] `async create(data)`
- [ ] `async activate(id)`

#### ✓ Tela de Cadastro de Feriados

**src/pages/HolidaysPage.jsx:**
- [ ] Dropdown: selecionar ciclo acadêmico
- [ ] Após selecionar: carregar feriados do ciclo
- [ ] DataGrid com feriados:
  - [ ] Data
  - [ ] Descrição
  - [ ] Ações (Deletar)
  
- [ ] Botão "Adicionar Feriado" → modal:
  - [ ] DatePicker: data
  - [ ] TextField: descrição (ex: "Carnaval")
  - [ ] Validação: data dentro do ciclo selecionado
  
- [ ] Botão deletar: confirmação → DELETE `/holidays/:id`

**src/services/holiday.service.js:**
- [ ] `async getByCycle(cycleId)`
- [ ] `async create(data)`
- [ ] `async delete(id)`

---

## ✅ FASE 4 - RESERVAS SIMPLES (CORE BÁSICO)

### 🔹 Backend - Checklist Técnico

#### ✓ Lógica de Detecção de Conflitos (RF14, RNF05)

**ReservationRepository.js:**
- [ ] `findConflicting(labId, date, startTime, endTime)` → query crítica:
  ```sql
  SELECT r.*, u.name as user_name 
  FROM reservation_items ri
  JOIN reservations r ON ri.reservation_id = r.id
  JOIN users u ON r.user_id = u.id
  WHERE ri.lab_id = ?
    AND ri.date = ?
    AND ri.status = 'ACTIVE'
    AND (
      (ri.start_time < ? AND ri.end_time > ?) OR  -- Cobre horário solicitado
      (ri.start_time >= ? AND ri.start_time < ?)   -- Começa durante
    )
  LIMIT 1
  ```
  - [ ] Retorna objeto com dados da reserva conflitante ou null
  
- [ ] **Otimização (BD):**
  - [ ] Índice composto: `CREATE INDEX idx_conflict ON reservation_items(lab_id, date, start_time, status)`

**ReservationService.js (método auxiliar):**
- [ ] `async checkConflict(labId, date, startTime, endTime)` → retorna objeto ou null
  - [ ] Chama repo.findConflicting()
  - [ ] Se encontrar: retorna { hasConflict: true, reservation: {...} }
  - [ ] Se não: retorna { hasConflict: false }

#### ✓ Criação de Reserva Simples (RF10)

**Estrutura de Tabelas (lembrete):**
- `reservations` (cabeçalho):
  - id, user_id, lab_id, cycle_id, type ('SINGLE' ou 'RECURRING'), status, reason, approved_by, approval_date
  
- `reservation_items` (dias ocupados):
  - id, reservation_id, lab_id, date, time_slot_id, start_time, end_time, note, status ('ACTIVE', 'CANCELED')

**ReservationRepository.js:**
- [ ] `create(reservationData)` → INSERT em `reservations`, retorna ID
- [ ] `createItem(itemData)` → INSERT em `reservation_items`
- [ ] `findById(id)` → SELECT com JOIN users, laboratories, academic_cycles
- [ ] `findByUser(userId)` → SELECT reservas de um usuário específico
- [ ] `findAll(filters)` → SELECT com filtros (status, lab_id, etc)
- [ ] `updateStatus(id, status, reason)` → UPDATE reservations SET status = ?, reason = ?

**ReservationService.js:**
- [ ] `createSimpleReservation(dto, userId, userRole)` → lógica completa
  - **DTO esperado:**
    ```javascript
    {
      lab_id: number,
      date: 'YYYY-MM-DD',
      time_slot_id: number (ou start_time/end_time direto),
      note: string (opcional)
    }
    ```
  
  - **Validações (em ordem):**
    1. [ ] Ciclo ativo existe (buscar em AcademicCycleRepo.findActive())
       - Se não: erro "Nenhum ciclo acadêmico ativo"
    
    2. [ ] Data dentro do ciclo (start_date <= date <= end_date)
       - Se não: erro "Data fora do ciclo acadêmico"
    
    3. [ ] Não é feriado (HolidayService.checkIfHoliday)
       - Se sim: erro "Não é possível reservar em feriados" (RN03)
    
    4. [ ] Respeitar período exclusivo ADMIN (RF19, RN04)
       - Se userRole == 'PROFESSOR' && isInAdminExclusivePeriod(date, cycle):
         - Erro "Apenas administradores podem reservar neste período"
    
    5. [ ] Laboratório existe e está ativo (LaboratoryRepo.findById)
       - Se não: erro "Laboratório não encontrado"
    
    6. [ ] Time slot existe (TimeSlotRepo.findById)
       - Obter start_time e end_time do slot
    
    7. [ ] Detectar conflito (checkConflict)
       - Se conflito encontrado:
         - Se userRole == 'PROFESSOR': erro "Horário já reservado por [nome]" (RF14)
         - Se userRole == 'ADMIN': permitir (será tratado na sobrescrita - RF15)
  
  - **Criação (transação):**
    - [ ] BEGIN TRANSACTION
    - [ ] INSERT em `reservations`:
      ```javascript
      {
        user_id: userId,
        lab_id: dto.lab_id,
        cycle_id: cycle.id,
        type: 'SINGLE',
        status: 'APPROVED', // Direto para professor (reserva simples sem conflito)
        approved_by: userRole === 'ADMIN' ? userId : null,
        approval_date: userRole === 'ADMIN' ? NOW() : null
      }
      ```
    - [ ] INSERT em `reservation_items`:
      ```javascript
      {
        reservation_id: insertedId,
        lab_id: dto.lab_id,
        date: dto.date,
        time_slot_id: dto.time_slot_id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        note: dto.note,
        status: 'ACTIVE'
      }
      ```
    - [ ] COMMIT
    - [ ] Retornar reserva criada com JOIN completo
    
  - **Eventos:**
    - [ ] Emitir `EventBus.emit('reservation:created', { reservation, user })`
      - Se ADMIN: não notificar (ele mesmo criou)
      - Se PROFESSOR: notificar admins (RF16)

**ReservationController.js:**
- [ ] `create(req, res)` → POST
  - [ ] Valida DTO (lab_id, date, time_slot_id obrigatórios)
  - [ ] Extrai userId e userRole de `req.user` (vem do verifyToken)
  - [ ] Chama ReservationService.createSimpleReservation()
  - [ ] Retorna 201 com reserva criada
  - [ ] Catch: retorna 400 ou 500
  
- [ ] `index(req, res)` → GET com filtros
  - [ ] Se PROFESSOR: filtrar apenas suas reservas (user_id = req.user.id)
  - [ ] Se ADMIN: pode ver todas
  - [ ] Query params opcionais: status, lab_id, date_from, date_to
  
- [ ] `show(req, res)` → GET /:id
  - [ ] Busca reserva
  - [ ] Se PROFESSOR: verifica se é dono (user_id = req.user.id)
  - [ ] Se ADMIN: pode ver qualquer uma

**routes/reservation.routes.js:**
- [ ] POST `/` → create + `verifyToken`
- [ ] GET `/` → index + `verifyToken`
- [ ] GET `/:id` → show + `verifyToken`

#### ✓ Validação de Integridade (RNF04)

- [ ] Usar transações MySQL em todas operações críticas:
  ```javascript
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    // operações...
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  ```

---

### 🔹 Frontend - Checklist Técnico

#### ✓ Formulário de Criação de Reserva Simples

**src/pages/CreateReservationPage.jsx:**
- [ ] Formulário com:
  - [ ] Select: Laboratório (carregar de API)
  - [ ] DatePicker: Data (bloquear datas passadas, feriados se possível)
  - [ ] Select: Horário (carregar time slots de API)
  - [ ] TextField: Observação (opcional)
  - [ ] Botão "Verificar Disponibilidade" (opcional)
  - [ ] Botão "Solicitar Reserva"
  
- [ ] Estado: `labId`, `date`, `timeSlotId`, `note`, `loading`, `error`, `conflict`
- [ ] Validação:
  - [ ] Todos campos obrigatórios
  - [ ] Data não pode ser no passado
  
- [ ] Ao clicar "Verificar Disponibilidade":
  - [ ] POST `/reservations/check-conflict` (criar endpoint novo)
  - [ ] Se conflito: exibir alerta "Reservado por [nome]"
  - [ ] Se ADMIN: exibir opção "Sobrescrever" (FASE 6)
  
- [ ] Ao clicar "Solicitar Reserva":
  - [ ] POST `/reservations`
  - [ ] Se sucesso: mensagem "Reserva criada com sucesso" e redireciona para "/reservations"
  - [ ] Se erro 400 (conflito): exibir mensagem clara

**src/services/reservation.service.js:**
- [ ] `async checkConflict(data)` → POST `/reservations/check-conflict`
- [ ] `async create(data)` → POST `/reservations`
- [ ] `async getMyReservations()` → GET `/reservations` (filtra por user automaticamente)
- [ ] `async getAll(filters)` → GET `/reservations` com query params (ADMIN)

#### ✓ Visualização de Minhas Reservas (RF20)

**src/pages/MyReservationsPage.jsx:**
- [ ] DataGrid com reservas do usuário:
  - [ ] Laboratório
  - [ ] Data
  - [ ] Horário (start_time - end_time)
  - [ ] Status (chip colorido: APPROVED = verde, PENDING = amarelo, CANCELED = vermelho)
  - [ ] Observação
  - [ ] Ações (Cancelar se status = APPROVED)
  
- [ ] Filtros (opcionais):
  - [ ] Por status
  - [ ] Por data (range)
  
- [ ] Botão "Cancelar":
  - [ ] Confirmação: "Tem certeza que deseja cancelar?"
  - [ ] PUT `/reservations/:id/cancel`
  - [ ] Remove da lista ou atualiza status

**src/components/common/StatusChip.jsx (componente reutilizável):**
- [ ] Recebe `status` como prop
- [ ] Retorna `<Chip>` do MUI com cor baseada em status:
  - [ ] PENDING → amarelo (#FFC107)
  - [ ] APPROVED → verde (#4CAF50)
  - [ ] REJECTED → vermelho (#F44336)
  - [ ] CANCELED → cinza (#9E9E9E)

---

## ✅ FASE 5 - RESERVAS RECORRENTES

### 🔹 Backend - Checklist Técnico

#### ✓ Criação de Reserva Recorrente (RF11, RF12, RN05)

**ReservationService.js:**
- [ ] `createRecurringReservation(dto, userId, userRole)` → lógica complexa
  - **DTO esperado:**
    ```javascript
    {
      lab_id: number,
      start_date: 'YYYY-MM-DD',
      end_date: 'YYYY-MM-DD',
      weekdays: [1, 3, 5], // 0=Dom, 1=Seg, ..., 6=Sáb (ou todos os dias)
      time_slot_id: number,
      note: string (opcional)
    }
    ```
  
  - **Validações iniciais:**
    1. [ ] Ciclo ativo existe
    2. [ ] start_date < end_date
    3. [ ] Ambas datas dentro do ciclo
    4. [ ] Laboratório e time slot existem
    5. [ ] Se PROFESSOR: verificar período exclusivo admin na start_date
  
  - **Geração de datas (utils/dateUtils.js):**
    - [ ] Função `generateRecurringDates(startDate, endDate, weekdays)` → array de datas
      - [ ] Loop de startDate até endDate
      - [ ] Para cada data: se dia da semana está em `weekdays`, adiciona ao array
      - [ ] Exemplo: de 10/03 a 10/05, weekdays=[1,3,5] → [11/03, 13/03, 15/03, ...]
  
  - **Filtrar feriados:**
    - [ ] Para cada data gerada: verificar se é feriado
    - [ ] Remover feriados do array (RN03)
  
  - **Validação de conflitos em TODAS as datas (RN05):**
    - [ ] Para cada data no array:
      - [ ] Chamar `checkConflict(labId, date, startTime, endTime)`
      - [ ] Se qualquer data tiver conflito:
        - Se PROFESSOR: erro "Conflito encontrado em [data X]" + ROLLBACK
        - Se ADMIN: permitir (reserva recorrente aprovada direto)
  
  - **Criação (transação grande):**
    - [ ] BEGIN TRANSACTION
    - [ ] INSERT em `reservations`:
      ```javascript
      {
        user_id: userId,
        lab_id: dto.lab_id,
        cycle_id: cycle.id,
        type: 'RECURRING',
        status: userRole === 'ADMIN' ? 'APPROVED' : 'PENDING', // RF12: PROFESSOR fica PENDING
        approved_by: userRole === 'ADMIN' ? userId : null
      }
      ```
    - [ ] Para cada data válida:
      - [ ] INSERT em `reservation_items`:
        ```javascript
        {
          reservation_id: insertedId,
          lab_id: dto.lab_id,
          date: currentDate,
          time_slot_id: dto.time_slot_id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          note: dto.note,
          status: 'ACTIVE'
        }
        ```
    - [ ] COMMIT
    - [ ] Retornar reserva com contagem de datas criadas
  
  - **Eventos:**
    - [ ] Se PROFESSOR: emitir `reservation:created` para notificar ADMIN (RF16)
    - [ ] Se ADMIN: não notificar

**ReservationController.js:**
- [ ] Mesmo método `create()` mas detecta `type: 'RECURRING'` no body
- [ ] Valida campos adicionais: start_date, end_date, weekdays
- [ ] Chama `createRecurringReservation()` ao invés de `createSimpleReservation()`

#### ✓ Aprovação/Rejeição de Reservas (RF13)

**ReservationService.js:**
- [ ] `approveReservation(reservationId, adminId, redirectLabId = null)` → aprova
  - **Validações:**
    - [ ] Reserva existe
    - [ ] Status atual = PENDING
    - [ ] Admin tem role ADMIN (garantido por middleware)
  
  - **Redirecionamento (opcional - RF13):**
    - Se `redirectLabId` fornecido:
      - [ ] Validar que lab existe
      - [ ] UPDATE `reservations` SET `lab_id = redirectLabId`
      - [ ] UPDATE todos `reservation_items` SET `lab_id = redirectLabId`
      - [ ] Adicionar no campo `reason`: "Redirecionado para [nome do lab]"
  
  - **Aprovação:**
    - [ ] UPDATE `reservations` SET:
      ```javascript
      status = 'APPROVED',
      approved_by = adminId,
      approval_date = NOW()
      ```
    - [ ] Emitir evento `reservation:approved`
    - [ ] Registrar em audit_logs (FASE 6)
  
- [ ] `rejectReservation(reservationId, adminId, reason)` → rejeita
  - **Validações:**
    - [ ] Reserva existe
    - [ ] Status atual = PENDING
    - [ ] Reason obrigatório
  
  - **Rejeição:**
    - [ ] UPDATE `reservations` SET:
      ```javascript
      status = 'REJECTED',
      reason = reason,
      approved_by = adminId
      ```
    - [ ] Emitir evento `reservation:rejected`
    - [ ] Registrar em audit_logs

**ReservationController.js:**
- [ ] `approve(req, res)` → PUT /:id/approve
  - [ ] Body (opcional): { redirect_lab_id }
  - [ ] Extrai adminId de req.user.id
  - [ ] Chama service.approveReservation()
  - [ ] Retorna 200
  
- [ ] `reject(req, res)` → PUT /:id/reject
  - [ ] Body: { reason }
  - [ ] Valida reason obrigatório
  - [ ] Chama service.rejectReservation()
  - [ ] Retorna 200

**routes/reservation.routes.js:**
- [ ] PUT `/:id/approve` → approve + `verifyToken` + `authorize(['ADMIN'])`
- [ ] PUT `/:id/reject` → reject + middlewares

---

### 🔹 Frontend - Checklist Técnico

#### ✓ Formulário de Reserva Recorrente

**src/pages/CreateReservationPage.jsx (modificar):**
- [ ] Toggle: "Reserva Simples" vs "Reserva Recorrente"
- [ ] Se recorrente:
  - [ ] DatePicker: data início
  - [ ] DatePicker: data fim
  - [ ] Checkboxes: dias da semana (Seg, Ter, Qua, Qui, Sex, Sáb, Dom)
  - [ ] Alerta visual: "Como PROFESSOR, esta reserva ficará PENDENTE até aprovação"
  
- [ ] Validação:
  - [ ] start_date < end_date
  - [ ] Pelo menos 1 dia da semana selecionado
  
- [ ] Submit:
  - [ ] POST `/reservations` com type: 'RECURRING' e campos adicionais
  - [ ] Se sucesso e PROFESSOR: "Solicitação enviada para aprovação"
  - [ ] Se sucesso e ADMIN: "Reserva recorrente criada com sucesso"

#### ✓ Painel de Aprovação de Reservas (ADMIN)

**src/pages/PendingReservationsPage.jsx:**
- [ ] DataGrid com reservas status PENDING:
  - [ ] Nome do professor
  - [ ] Laboratório
  - [ ] Tipo (SINGLE ou RECURRING)
  - [ ] Datas (se recorrente: "10/03 a 10/05 - 15 datas")
  - [ ] Horário
  - [ ] Data da solicitação
  - [ ] Ações (Aprovar, Rejeitar, Redirecionar)
  
- [ ] Botão "Aprovar":
  - [ ] Confirmação: "Aprovar reserva de [nome]?"
  - [ ] PUT `/reservations/:id/approve`
  
- [ ] Botão "Rejeitar":
  - [ ] Modal: campo de texto para motivo
  - [ ] Validação: motivo obrigatório
  - [ ] PUT `/reservations/:id/reject` com { reason }
  
- [ ] Botão "Redirecionar":
  - [ ] Modal: select de laboratório
  - [ ] Campo: motivo do redirecionamento
  - [ ] PUT `/reservations/:id/approve` com { redirect_lab_id, reason }

**src/services/reservation.service.js:**
- [ ] `async getPending()` → GET `/reservations?status=PENDING`
- [ ] `async approve(id, redirectLabId = null)` → PUT `/reservations/:id/approve`
- [ ] `async reject(id, reason)` → PUT `/reservations/:id/reject`

---

## ✅ FASE 6 - SOBRESCRITA E CONTROLE AVANÇADO (ADMIN)

### 🔹 Backend - Checklist Técnico

#### ✓ Sobrescrita de Reserva (RF15, RF21, RNF04)

**ReservationService.js:**
- [ ] `overwriteReservation(dto, adminId)` → força reserva em horário ocupado
  - **Validações iniciais:**
    - [ ] Admin tem role ADMIN (garantido por middleware)
    - [ ] Mesmas validações de `createSimpleReservation()` (ciclo, feriado, lab existe)
  
  - **Detectar conflito:**
    - [ ] Chamar `checkConflict()`
    - [ ] Se NÃO houver conflito: erro "Use o método create normal, não há conflito"
    - [ ] Se houver conflito: continuar
  
  - **Processo (transação):**
    - [ ] BEGIN TRANSACTION
    - [ ] Buscar reserva conflitante (com dados do usuário)
    - [ ] UPDATE `reservation_items` da reserva conflitante:
      ```javascript
      SET status = 'OVERWRITTEN'
      WHERE reservation_id = conflictReservation.id
        AND date = dto.date
        AND lab_id = dto.lab_id
      ```
    - [ ] (Opcional) UPDATE `reservations` SET status = 'CANCELED' se TODOS os items foram sobrescritos
    - [ ] Criar nova reserva (INSERT em reservations + reservation_items) com status APPROVED
    - [ ] Registrar em `audit_logs`:
      ```javascript
      {
        action: 'OVERWRITE',
        table_name: 'reservations',
        record_id: newReservation.id,
        changed_by: adminId,
        old_values: JSON.stringify(conflictReservation),
        new_values: JSON.stringify(newReservation)
      }
      ```
    - [ ] COMMIT
  
  - **Eventos:**
    - [ ] Emitir `reservation:overwritten` com dados:
      ```javascript
      {
        oldReservation: conflictReservation,
        newReservation: newReservation,
        affectedUser: conflictReservation.user
      }
      ```
      - Listener enviará email para professor afetado (RF17)

**ReservationController.js:**
- [ ] `overwrite(req, res)` → POST /overwrite
  - [ ] Valida DTO (mesmos campos de create)
  - [ ] Extrai adminId de req.user.id
  - [ ] Chama service.overwriteReservation()
  - [ ] Retorna 201

**routes/reservation.routes.js:**
- [ ] POST `/overwrite` → overwrite + `verifyToken` + `authorize(['ADMIN'])`

#### ✓ Exclusão Múltipla (RF18)

**ReservationService.js:**
- [ ] `bulkDelete(ids, userId, userRole)` → deleta múltiplas reservas
  - **Validações:**
    - [ ] Array de IDs não vazio
    - [ ] Para cada ID:
      - [ ] Reserva existe
      - [ ] Se PROFESSOR: apenas próprias reservas (user_id = userId)
      - [ ] Se ADMIN: pode deletar qualquer uma
  
  - **Exclusão (transação):**
    - [ ] BEGIN TRANSACTION
    - [ ] Para cada ID válido:
      - [ ] UPDATE `reservation_items` SET status = 'CANCELED'
      - [ ] UPDATE `reservations` SET status = 'CANCELED'
    - [ ] COMMIT
  
  - **Retorno:**
    - [ ] Retornar contagem de reservas deletadas

**ReservationController.js:**
- [ ] `bulkDelete(req, res)` → DELETE /bulk
  - [ ] Body: { ids: [1, 2, 3] }
  - [ ] Valida array não vazio
  - [ ] Chama service.bulkDelete()
  - [ ] Retorna 200 com contagem

**routes/reservation.routes.js:**
- [ ] DELETE `/bulk` → bulkDelete + `verifyToken`

#### ✓ Sistema de Auditoria (RF21)

**AuditRepository.js:**
- [ ] `create(logData)` → INSERT em audit_logs
  ```javascript
  {
    action: 'OVERWRITE',
    table_name: 'reservations',
    record_id: 123,
    changed_by: adminId,
    old_values: JSON.stringify({...}),
    new_values: JSON.stringify({...})
  }
  ```
- [ ] `findByRecord(tableName, recordId)` → SELECT WHERE table_name AND record_id ORDER BY timestamp DESC
- [ ] `findByUser(userId)` → SELECT WHERE changed_by = userId

**AuditService.js:**
- [ ] `log(action, tableName, recordId, changedBy, oldValues, newValues)` → wrapper
  - [ ] Chama repo.create()
  - [ ] Não lança erro se falhar (log não deve quebrar fluxo principal)
  
- [ ] `getRecordHistory(tableName, recordId)` → histórico de mudanças

**Integração:**
- [ ] Chamar `AuditService.log()` em:
  - [ ] `overwriteReservation()` → action: 'OVERWRITE'
  - [ ] `approveReservation()` → action: 'APPROVE'
  - [ ] `rejectReservation()` → action: 'REJECT'
  - [ ] `bulkDelete()` → action: 'DELETE'

---

### 🔹 Frontend - Checklist Técnico

#### ✓ Interface de Sobrescrita

**src/pages/CreateReservationPage.jsx (modificar):**
- [ ] Ao detectar conflito (após `checkConflict()`):
  - Se ADMIN:
    - [ ] Exibir alerta: "⚠️ Horário já reservado por [nome do professor]"
    - [ ] Botão "Sobrescrever Reserva"
    - [ ] Modal de confirmação:
      - [ ] Texto: "Tem certeza? O professor [nome] será notificado e perderá esta reserva."
      - [ ] Botão "Confirmar Sobrescrita"
    - [ ] Ao confirmar: POST `/reservations/overwrite`
  
  - Se PROFESSOR:
    - [ ] Apenas exibir erro: "Horário indisponível"
    - [ ] Bloquear submit

#### ✓ Exclusão Múltipla

**src/pages/MyReservationsPage.jsx (modificar):**
- [ ] Adicionar checkboxes na primeira coluna do DataGrid
- [ ] Estado: `selectedIds` (array)
- [ ] Botão "Deletar Selecionadas" (só aparece se selectedIds.length > 0)
- [ ] Ao clicar:
  - [ ] Confirmação: "Deletar [X] reservas selecionadas?"
  - [ ] DELETE `/reservations/bulk` com { ids: selectedIds }
  - [ ] Recarregar lista

---

## ✅ FASE 7 - NOTIFICAÇÕES E COMUNICAÇÃO

### 🔹 Backend - Checklist Técnico

#### ✓ Sistema de Eventos (Observer Pattern)

**events/EventBus.js:**
- [ ] Exporta instância do EventEmitter do Node.js:
  ```javascript
  const EventEmitter = require('events');
  const eventBus = new EventEmitter();
  module.exports = eventBus;
  ```

**events/reservation.events.js:**
- [ ] Importa EventBus e serviços
- [ ] Registra listeners:
  - [ ] `EventBus.on('reservation:created', async (data) => { ... })`
    - Se criador for PROFESSOR: notificar ADMIN (RF16)
    - Chama NotificationService.notifyAdminNewReservation()
  
  - [ ] `EventBus.on('reservation:overwritten', async (data) => { ... })`
    - Notificar professor afetado (RF17)
    - Chama NotificationService.notifyOverwrite()
  
  - [ ] `EventBus.on('reservation:approved', async (data) => { ... })`
    - Notificar professor solicitante
    - Chama NotificationService.notifyApproval()
  
  - [ ] `EventBus.on('reservation:rejected', async (data) => { ... })`
    - Notificar professor solicitante
    - Chama NotificationService.notifyRejection()

**Ativação:**
- [ ] Em `app.js` ou `server.js`: importar `./events/reservation.events.js`
  - Apenas importar já registra os listeners

#### ✓ Serviço de Email (RF16, RF17)

**services/EmailService.js:**
- [ ] Configurar Nodemailer:
  ```javascript
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransporter({
    service: 'gmail', // ou SMTP institucional
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  ```

- [ ] Método `sendEmail(to, subject, html)` → envia email
  - [ ] Usa `transporter.sendMail()`
  - [ ] Trata erros (log mas não quebra)

- [ ] Templates de email (criar arquivos HTML ou usar template strings):
  - [ ] `templates/newReservationRequest.html`:
    - "Nova solicitação de reserva de [Professor X] para [Lab Y] em [Data Z]"
    
  - [ ] `templates/reservationOverwritten.html`:
    - "Sua reserva no [Lab] em [Data] foi sobrescrita pelo coordenador [Nome]. Motivo: [Motivo]"
    
  - [ ] `templates/reservationApproved.html`:
    - "Sua reserva foi aprovada!"
    
  - [ ] `templates/reservationRejected.html`:
    - "Sua reserva foi rejeitada. Motivo: [Motivo]"

**services/NotificationService.js:**
- [ ] `notifyAdminNewReservation(reservation, user)` → envia email para admins
  - [ ] Buscar todos admins (UserRepo.findByRole('ADMIN'))
  - [ ] Para cada admin: enviar email com template
  
- [ ] `notifyOverwrite(oldReservation, newReservation, affectedUser)` → email para professor
  - [ ] Montar mensagem com dados das duas reservas
  - [ ] Enviar para email do professor afetado
  
- [ ] `notifyApproval(reservation, user)` → email de aprovação
  
- [ ] `notifyRejection(reservation, user, reason)` → email de rejeição com motivo

**Variáveis de Ambiente (.env):**
```env
EMAIL_USER=sistema@fatec.sp.gov.br
EMAIL_PASS=senha_app_gmail
```

---

### 🔹 Frontend - Checklist Técnico

#### ✓ Sistema de Notificações Toast

**src/context/NotificationContext.jsx:**
- [ ] Estado: `notifications` (array de objetos { id, message, type, duration })
- [ ] Métodos:
  - [ ] `showSuccess(message)` → adiciona notificação verde
  - [ ] `showError(message)` → adiciona notificação vermelha
  - [ ] `showWarning(message)` → adiciona notificação amarela
  - [ ] `showInfo(message)` → adiciona notificação azul
  - [ ] `dismiss(id)` → remove notificação

**src/components/common/NotificationToast.jsx:**
- [ ] Componente que renderiza `<Snackbar>` do MUI para cada notificação
- [ ] Auto-dismiss após N segundos (configurável)
- [ ] Posição: top-right

**Uso em páginas:**
```javascript
const { showSuccess, showError } = useNotification();

try {
  await reservationService.create(data);
  showSuccess('Reserva criada com sucesso!');
} catch (error) {
  showError(error.message);
}
```

---

## ✅ FASE 8 - VISUALIZAÇÃO E CALENDÁRIO

### 🔹 Frontend - Checklist Técnico

#### ✓ Calendário Visual (RF20)

**src/pages/CalendarPage.jsx:**
- [ ] Biblioteca: `react-big-calendar` ou `@fullcalendar/react`
- [ ] Configuração:
  - [ ] View: mensal (padrão)
  - [ ] Eventos: reservas do lab selecionado
  
- [ ] Filtros:
  - [ ] Select: laboratório (carregar da API)
  - [ ] Date range: mês/ano (navegação)
  
- [ ] Buscar reservas:
  - [ ] GET `/reservations?lab_id=X&month=Y`
  - [ ] Mapear para formato do calendário:
    ```javascript
    {
      id: reservation.id,
      title: `${reservation.user.name} - ${reservation.time_slot.name}`,
      start: new Date(reservation.date + ' ' + reservation.start_time),
      end: new Date(reservation.date + ' ' + reservation.end_time),
      color: reservation.status === 'APPROVED' ? 'green' : 'yellow'
    }
    ```
  
- [ ] Código de cores:
  - [ ] Verde: APPROVED
  - [ ] Amarelo: PENDING
  - [ ] Cinza: CANCELED
  
- [ ] Click em evento:
  - [ ] Modal com detalhes da reserva
  - [ ] Se ADMIN e é dele: opção de cancelar
  - [ ] Se ADMIN e é de outro: opção de sobrescrever (link para CreateReservationPage com data pré-preenchida)
  
- [ ] Click em dia vazio:
  - [ ] Redirecionar para CreateReservationPage com data pré-preenchida

**Dependências:**
```bash
npm install react-big-calendar date-fns
```

#### ✓ Dashboard com Métricas

**src/pages/DashboardPage.jsx:**
- [ ] Cards MUI com estatísticas:
  - [ ] Se ADMIN:
    - [ ] Total de reservas ativas (GET `/reservations/stats`)
    - [ ] Reservas pendentes (GET `/reservations?status=PENDING&count=true`)
    - [ ] Cadastros pendentes (GET `/users/pending?count=true`)
    - [ ] Laboratórios cadastrados (GET `/laboratories?count=true`)
  
  - [ ] Se PROFESSOR:
    - [ ] Minhas reservas ativas
    - [ ] Próximas reservas (próximos 7 dias)
    - [ ] Total de reservas no semestre
  
- [ ] Gráfico (opcional):
  - [ ] Biblioteca: `recharts` ou `chart.js`
  - [ ] Gráfico de barras: reservas por mês/semana

**Backend (adicionar endpoints):**
- [ ] GET `/reservations/stats` → retorna contagens gerais
- [ ] GET `/reservations?count=true` → retorna apenas COUNT(*)

---

## ✅ FASE 9 - REFINAMENTOS E EXTRAS

### 🔹 Frontend - Checklist Técnico

#### ✓ Responsividade Mobile

**Checklist de Responsividade:**
- [ ] Todas páginas testadas em resoluções:
  - [ ] Desktop: 1920x1080
  - [ ] Tablet: 768x1024
  - [ ] Mobile: 375x667

**Ajustes no Layout:**
- [ ] `MainLayout.jsx`:
  - [ ] Em mobile: Sidebar vira Drawer temporário (abre/fecha)
  - [ ] Botão hambúrguer na Topbar
  
- [ ] DataGrids:
  - [ ] Em mobile: usar `<List>` do MUI ao invés de DataGrid
  - [ ] Cards ao invés de tabelas

- [ ] Formulários:
  - [ ] Campos em 100% width em mobile
  - [ ] Botões empilhados verticalmente

**MUI Breakpoints:**
```javascript
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// Uso:
<Box sx={{ 
  display: { xs: 'block', md: 'flex' } // block em mobile, flex em desktop
}}>
```

#### ✓ Tela de Perfil do Usuário

**src/pages/ProfilePage.jsx:**
- [ ] Formulário com dados do usuário:
  - [ ] Nome (editável)
  - [ ] Email (read-only ou editável com validação)
  - [ ] Departamento (read-only)
  - [ ] Seção "Alterar Senha":
    - [ ] Senha atual (obrigatória)
    - [ ] Nova senha
    - [ ] Confirmar nova senha
  
- [ ] Botão "Salvar Alterações":
  - [ ] PUT `/users/me` com dados atualizados
  - [ ] Se senha fornecida: validar senha atual no backend
  
- [ ] Feedback: toast de sucesso ou erro

**Backend (adicionar endpoint):**
- [ ] PUT `/users/me` → UserController.updateProfile
  - [ ] Valida que senha atual está correta (se fornecida)
  - [ ] Atualiza nome, email
  - [ ] Se nova senha: criptografa e atualiza password_hash

---

## ✅ FASE 10 - TESTES E DEPLOY

### 🔹 Backend - Checklist de Testes

#### ✓ Configuração de Testes

**Jest:**
```bash
npm install --save-dev jest supertest
```

**jest.config.js:**
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  }
};
```

**Banco de dados de teste (.env.test):**
```env
DB_NAME=fatecZL_lab_reservations_test
```

#### ✓ Testes Unitários (Services)

**tests/unit/ReservationService.test.js:**
- [ ] Testar `createSimpleReservation()`:
  - [ ] Sucesso: reserva criada
  - [ ] Erro: data fora do ciclo
  - [ ] Erro: feriado
  - [ ] Erro: conflito (professor)
  - [ ] Sucesso: conflito (admin permite)
  
- [ ] Testar `createRecurringReservation()`:
  - [ ] Sucesso: múltiplas datas criadas
  - [ ] Erro: conflito em qualquer data
  - [ ] Filtrar feriados corretamente

**Mock de Repositories:**
```javascript
jest.mock('../repositories/ReservationRepository');
const ReservationRepository = require('../repositories/ReservationRepository');

ReservationRepository.findConflicting.mockResolvedValue(null);
```

#### ✓ Testes de Integração (API)

**tests/integration/reservation.test.js:**
- [ ] Setup: criar usuário de teste, ciclo, lab, time slot
- [ ] Teardown: limpar banco de teste
- [ ] Testes:
  - [ ] POST /reservations (sucesso)
  - [ ] POST /reservations (conflito)
  - [ ] PUT /reservations/:id/approve (ADMIN)
  - [ ] PUT /reservations/:id/approve (PROFESSOR - deve falhar)
  
**Supertest:**
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('POST /reservations', () => {
  it('deve criar reserva com sucesso', async () => {
    const response = await request(app)
      .post('/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ lab_id: 1, date: '2026-05-10', time_slot_id: 1 })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
  });
});
```

---

### 🔹 Frontend - Checklist de Testes

**React Testing Library:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

**tests/LoginPage.test.jsx:**
- [ ] Renderiza formulário
- [ ] Valida campos obrigatórios
- [ ] Submit chama API corretamente
- [ ] Exibe erro se credenciais inválidas

**Mock de API:**
```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fake_token', user: {...} }));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
```

---

### 🔹 Deploy - Checklist

#### ✓ Backend (Heroku/Railway)

**Preparação:**
- [ ] `package.json` com script:
  ```json
  {
    "scripts": {
      "start": "node src/server.js",
      "dev": "nodemon src/server.js"
    }
  }
  ```

- [ ] Criar `Procfile`:
  ```
  web: node src/server.js
  ```

- [ ] Variáveis de ambiente no servidor:
  - [ ] DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
  - [ ] JWT_SECRET
  - [ ] EMAIL_USER, EMAIL_PASS

- [ ] Banco de dados em produção:
  - [ ] ClearDB (Heroku) ou Railway MySQL
  - [ ] Executar `reserva_lab.sql` no banco de produção

#### ✓ Frontend (Vercel/Netlify)

**Preparação:**
- [ ] Build otimizado:
  ```bash
  npm run build
  ```

- [ ] Variável de ambiente:
  ```env
  REACT_APP_API_URL=https://api-reservas.herokuapp.com
  ```

- [ ] Arquivo `vercel.json` ou `netlify.toml`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

#### ✓ Documentação Final

**README.md:**
- [ ] Nome do projeto
- [ ] Descrição
- [ ] Stack tecnológica
- [ ] Pré-requisitos (Node, MySQL)
- [ ] Instalação:
  ```bash
  npm install
  cp .env.example .env
  # configurar .env
  npm run dev
  ```
- [ ] Rodar banco:
  ```bash
  mysql -u root -p < reserva_lab.sql
  ```
- [ ] Rodar testes:
  ```bash
  npm test
  ```
- [ ] URLs de produção
- [ ] Credenciais de teste (ADMIN e PROFESSOR)
- [ ] Autores

**Swagger/Postman Collection:**
- [ ] Documentar todas rotas da API
- [ ] Exemplos de requests/responses
- [ ] Exportar collection e adicionar ao repo

---

## 🎯 CHECKLIST FINAL ANTES DA APRESENTAÇÃO

### 1 Semana Antes
- [ ] Deploy em produção funcionando 100%
- [ ] Todos fluxos principais testados end-to-end
- [ ] Dados de demonstração populados (seed de apresentação):
  - [ ] 1 ADMIN (usuario: admin@fatec.sp.gov.br, senha: admin123)
  - [ ] 3 PROFESSORs
  - [ ] 5 Laboratórios
  - [ ] 1 Ciclo acadêmico ativo
  - [ ] 10 Feriados cadastrados
  - [ ] 20 Reservas de exemplo (variadas: APPROVED, PENDING, CANCELED)
- [ ] Bugs críticos corrigidos

### 3 Dias Antes
- [ ] Slides de apresentação prontos (15 minutos)
- [ ] Script de demo escrito (quem fala o quê)
- [ ] Vídeo backup gravado (caso servidor caia)
- [ ] URLs públicas confirmadas:
  - [ ] Frontend: https://fatec-reservas.vercel.app
  - [ ] Backend: https://api-reservas.herokuapp.com
- [ ] Testar em rede da faculdade (firewall pode bloquear)

### 1 Dia Antes
- [ ] Teste completo end-to-end em produção
- [ ] Verificar SSL ativo (https://)
- [ ] Verificar CORS configurado
- [ ] Backup local pronto (pen drive com código e apresentação)
- [ ] Ensaio da apresentação com cronômetro

### No Dia
- [ ] Chegar 30min antes
- [ ] Testar projetor e conexões
- [ ] Abrir URLs de produção em abas
- [ ] Logar com usuários de demo
- [ ] Ter código fonte no pen drive (backup do backup)
- [ ] Respirar fundo e mandar bem! 🚀

---

## 📊 MATRIZ DE RASTREABILIDADE - REQUISITOS x TASKS

| Requisito | Fase | Backend Tasks | Frontend Tasks | Status |
|-----------|------|---------------|----------------|--------|
| RF01 | 1 | F1-BE-02, F1-BE-03 | F1-FE-02, F1-FE-03 | ✅ |
| RF02 | 2 | F2-BE-01 | F2-FE-01 | 🔴 |
| RF03 | 2 | F2-BE-01 | F2-FE-01 | 🔴 |
| RF04 | 2 | F2-BE-03 | F2-FE-03 | 🔴 |
| RF05 | 3 | F3-BE-01 | F3-FE-01 | 🔴 |
| RF06 | 3 | F3-BE-01 | F3-FE-01 | 🔴 |
| RF07 | 3 | F3-BE-02 | F3-FE-02 | 🔴 |
| RF08 | 2 | F2-BE-02 | F2-FE-02 | 🔴 |
| RF09 | 1 | F1-BE-04 | - | 🔴 |
| RF10 | 4 | F4-BE-02 | F4-FE-01 | 🔴 |
| RF11 | 5 | F5-BE-01 | F5-FE-01 | 🔴 |
| RF12 | 5 | F5-BE-01 | F5-FE-01 | 🔴 |
| RF13 | 5 | F5-BE-02 | F5-FE-02 | 🔴 |
| RF14 | 4 | F4-BE-01 | F4-FE-01 | 🔴 |
| RF15 | 6 | F6-BE-01 | F6-FE-01 | 🔴 |
| RF16 | 7 | F7-BE-01, F7-BE-02 | - | 🔴 |
| RF17 | 7 | F7-BE-01, F7-BE-02 | - | 🔴 |
| RF18 | 6 | F6-BE-02 | F6-FE-02 | 🔴 |
| RF19 | 3 | F3-BE-01 | F3-FE-01 | 🔴 |
| RF20 | 1,4,8 | - | F1-FE-04, F4-FE-02, F8-FE-01 | 🔴 |
| RF21 | 6 | F6-BE-03 | - | 🔴 |

---

## 🔍 COMO USAR ESTE DOCUMENTO

### Para o Líder:
1. **Antes de iniciar cada fase**: Leia o checklist técnico completo da fase
2. **Durante o desenvolvimento**: Acompanhe se cada item está sendo implementado
3. **Ao revisar PRs**: Use o checklist para validar se nada foi esquecido
4. **Antes de avançar de fase**: Marque TODOS os checkboxes da fase atual

### Para Desenvolvedores:
1. **Ao pegar uma task**: Leia os itens relacionados à sua task neste documento
2. **Durante o desenvolvimento**: Use como guia técnico (não precisa decorar)
3. **Ao abrir PR**: Mencione no PR quais itens do checklist foram implementados

### Para Code Review:
- Use este documento como "lista de verificação" ao revisar código
- Se algo do checklist não foi implementado, comentar no PR antes de aprovar

---

**Versão:** 1.0  
**Última Atualização:** 02/03/2026  
**Autor:** Kaique Caitano (Líder de Projeto)

> 💡 **Importante:** Este documento é vivo! Atualize conforme surgem novos aprendizados ou decisões técnicas.
