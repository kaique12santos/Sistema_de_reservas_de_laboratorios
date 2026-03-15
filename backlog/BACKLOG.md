# 📋 Backlog Geral - Sistema de Reservas Fatec ZL

---

# 🟢 FASE 1 – Infraestrutura e Autenticação (MVP)
**Requisitos:** RF01, RF02, RF03, RNF03

**Status Geral:** 🟡 EM ANDAMENTO (Ajustes Finais)

### 🔹 Banco de Dados

#### [F1-BD-01] Criar estrutura completa do banco e seed para popular

* **Descrição:** 
  * 1- Executar script no arquivo da pasta do banco de dados do repositorio `estrutura.txt` no seu banco MySQL.
  * 2- preenchimento do arquivo `seed.txt`
  **Seed Mínimo Obrigatório:**
    - [x] 3 Departamentos (DSM, GPI, GE)
    - [x] 5 Time Slots (M1 a M4, N1)
    - [x] 3 Laboratórios (Lab 01, Lab 02, Auditório)
    - [x] 1 ADMIN (email: admin@fatec.sp.gov.br, senha: admin123)
    - [x] 2 PROFESSORES de teste
    - [x] 1 Ciclo Acadêmico ativo (2026-1)
    - [x] 5 Feriados (Carnaval, Páscoa, etc)
  * 3- desenvolver index e views conforme achar necessario para otimizar os acessos ao BD (procedures podem ser desenvolvidas pórem essa otimização deve ser feita com aval do backend conforme os comandos sql necessarios em alguns processos ao longo do desenvolvimento entao nessa fase apenas o necessario para otimizar)
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Vinicius / Kaique

---

### 🔹 Backend

#### [F1-BE-01] Configuração inicial do servidor

* **Descrição:** Setup Express + estrutura MVC + conexão MySQL.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Kaique

#### [F1-BE-02] Sistema de cadastro de usuário

* **Descrição:** Rota POST `api/auth/register`. Apenas cria o registro no banco com senha hashada.
* **Obs:** Apenas a criação esta implementada, falta validações, e verificação de email via token JWT
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Kaique

#### [F1-BE-03] Sistema de login e JWT

* **Descrição:** Rota POST `api/auth/login` gerando token.
* **Obs:** Código base existe, mas falta validar e integrar.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Nicole

#### [F1-BE-04] Middleware de autorização

* **Descrição:** Implementar um middleware Express que proteja rotas usando o token JWT já gerado pela estrutura base. O middleware deve validar a expiração do token, extrair os dados úteis (ex.: id, role) e anexá‑los à requisição para uso posterior. Deve também suportar verificação opcional de permissões/roles e retornar respostas HTTP apropriadas quando o token estiver ausente, inválido ou sem permissão.
  * **Critérios de Aceite:**
    - [x] Rejeita requisições sem token (401)
    - [x] Rejeita tokens expirados (403)
    - [x] Injeta req.user com { id, email, role }
    - [x] Permite filtrar por role: authorize(['ADMIN']) 
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Kaique

#### [F1-BE-05] Serviço de Email (SMTP)
* **Descrição:** Configurar Nodemailer para envio de emails transacionais.
* **Entregáveis:** `services/EmailService.js` com método `sendPasswordReset(email, token)`.
* **Obs:** pedir arquivo do lider de projeto para tentar reaproveitar codigo do SGPI de serviço de email ou de projeto pessoal dele.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** kaique

#### [F1-BE-06] Solicitação de Recuperação (Forgot Password)
* **Descrição:** Endpoint que gera token e envia por email.
* **Entregáveis:** POST `api/auth/forgot-password`
  - Gerar token (crypto.randomBytes ou JWT curto)
  - Salvar hash do token e expiração (1h) no banco
  - Enviar link: `front/reset-password?token=XYZ`
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Nicole

#### [F1-BE-07] Redefinição de Senha (Reset Password)
* **Descrição:** Endpoint que valida o token e atualiza a senha.
* **Entregáveis:**  POST `api/auth/reset-password`
  - Validar se token existe e não expirou
  - Criptografar nova senha
  - Limpar token do banco
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Nicole

#### [F1-BE-08] Verificação de Email (Opcional se sobrar tempo)
* **Descrição:** Endpoint que confirma o email do usuário via token.
* **Entregáveis:**
  - GET `api/auth/verify-email?token=XYZ`
  - Atualiza campo `email_verified` no banco
  - Só permite login se email verificado
* **Status:** ✅ CONCLUÍDO
* **Responsavel:** Kaique

---

### 🔹 Frontend

#### [F1-FE-01] Configuração inicial React

* **Descrição:** Setup Vite + Axios + Rotas.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Kaique

#### [F1-FE-02] Tela de Login (Estrutura)

* **Descrição:** Inputs e lógica de envio.
* **Obs:** Funcional, mas **sem identidade visual final**.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Luiz / Kaique

#### [F1-FE-03] Tela de Cadastro (Estrutura)

* **Descrição:** Inputs e lógica de envio.
* **Obs:** Funcional, mas **sem identidade visual final**.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Luiz / Kaique 

#### [F1-FE-04] Tela "Esqueci minha senha"
* **Descrição:** Formulário simples pedindo o e-mail.
* **Entregáveis:** `ForgotPasswordPage.jsx`
* **Ação:** Chama POST `api/auth/forgot-password` e exibe feedback de sucesso.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** - Luiz

#### [F1-FE-05] Tela de Nova Senha
* **Descrição:** Acessada via link do email (lê token da URL).
* **Entregáveis:** `ResetPasswordPage.jsx`
* **Campos:** Nova Senha, Confirmar Senha.
* **Ação:** Chama POST `api/auth/reset-password` e redireciona para Login.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** - Luiz

#### [F1-FE-06] Tela de Verificação de Email
* **Descrição:** Acessa via link do email
* **Entregáveis:** `VerifyEmailPage.jsx`
* **Ação:** Valida Email pela rota `api/auth/verify-email` e apresenta mensagem de sucesso com botao de redirecionamento para o login ou msg de erro.
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Luiz / Kaique
---

### 🔹 Teste final de fase

#### [F1-INT-01] Teste End-to-End da Autenticação
* **Descrição:** Testar fluxo completo: Cadastro → Login → Acesso protegido
* **Checklist:**
  - [x] Cadastrar usuário via frontend
  - [x] Verificar no banco que status = PENDING
  - [x] Tentar fazer login (deve falhar - aguardando aprovação)
  - [x] Admin aprova usuário manualmente no banco
  - [x] Login funciona e redireciona para dashboard
  - [x] Acessar rota protegida com token válido (sucesso)
  - [x] Acessar rota protegida sem token (401)
* **Status:** ✅ CONCLUÍDO
* **Responsável:** Kaique
---


# 🟡 FASE 2 – Aprovação de Cadastros e Configurações Básicas

**Requisitos:** RF02, RF03, RF04, RF08, RF09  
**Status Geral:** 🔴 PENDENTE  
**Meta:** Admins podem gerenciar usuários, laboratórios e horários

---

## 🔹 Backend

### [F2-BE-01] Aprovação de Cadastro de Usuários

**Descrição:**  
ADMIN lista usuários pendentes e pode aprovar ou rejeitar cadastros.

**Entregáveis:**

**1. UserRepository.js (adicionar métodos):**
- [ ] `findPending()` → SELECT * FROM users WHERE status = 'PENDING' ORDER BY created_at
- [ ] `updateStatus(id, status, rejectionReason = null)` → UPDATE users SET status = ?, rejection_reason = ? WHERE id = ?
- [ ] `countByStatus(status)` → SELECT COUNT(*) FROM users WHERE status = ?

**2. UserService.js:**
- [ ] `listPendingUsers()` → retorna array de usuários pendentes
  ```javascript
  async listPendingUsers() {
    return await UserRepository.findPending();
  }
  ```

- [ ] `approveUser(userId, adminId)` → aprova usuário
  **Lógica de Negócio:**
  1. [ ] Buscar usuário por ID
     - Se não existir: erro "Usuário não encontrado"
  2. [ ] Validar status atual:
     - Se != PENDING: erro "Usuário já foi processado"
  3. [ ] Atualizar status para 'APPROVED'
  4. [ ] (Opcional) Enviar email: "Sua conta foi aprovada! Você já pode fazer login."
  5. [ ] Registrar em audit_logs:
     ```javascript
     AuditService.log(
       'APPROVE',
       'users',
       userId,
       adminId,
       { status: 'PENDING' },
       { status: 'APPROVED' }
     );
     ```
  6. [ ] Retornar usuário atualizado

- [ ] `rejectUser(userId, adminId, reason)` → rejeita usuário
  **Lógica de Negócio:**
  1. [ ] Validar que reason não é vazio
     - Se vazio: erro "Motivo da rejeição é obrigatório"
  2. [ ] Buscar usuário e validar status = PENDING
  3. [ ] Atualizar:
     ```javascript
     status = 'REJECTED',
     rejection_reason = reason
     ```
  4. [ ] (Opcional) Enviar email: "Sua conta foi rejeitada. Motivo: [reason]"
  5. [ ] Registrar em audit_logs
  6. [ ] Retornar usuário atualizado

**3. UserController.js:**
- [ ] `getPending(req, res)` → GET /api/users/pending
  ```javascript
  async getPending(req, res) {
    try {
      const users = await UserService.listPendingUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ```

- [ ] `approve(req, res)` → PUT /api/users/:id/approve
  ```javascript
  async approve(req, res) {
    try {
      const { id } = req.params;
      const adminId = req.user.id; // do middleware verifyToken
      
      const user = await UserService.approveUser(id, adminId);
      res.json({ message: 'Usuário aprovado com sucesso', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  ```

- [ ] `reject(req, res)` → PUT /api/users/:id/reject
  ```javascript
  async reject(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user.id;
      
      const user = await UserService.rejectUser(id, adminId, reason);
      res.json({ message: 'Usuário rejeitado', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  ```

**4. routes/user.routes.js:**
```javascript
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

router.get('/pending', verifyToken, authorize(['ADMIN']), UserController.getPending);
router.put('/:id/approve', verifyToken, authorize(['ADMIN']), UserController.approve);
router.put('/:id/reject', verifyToken, authorize(['ADMIN']), UserController.reject);
```

**Validação de Transição de Status (utils/statusValidator.js):**
```javascript
const validUserTransitions = {
  'PENDING': ['APPROVED', 'REJECTED'],
  'APPROVED': [], // Não pode mudar depois de aprovado
  'REJECTED': []  // Não pode mudar depois de rejeitado
};

function isValidUserStatusTransition(from, to) {
  return validUserTransitions[from]?.includes(to) || false;
}
```

**Critérios de Aceite:**
- [ ] GET /api/users/pending retorna lista de usuários PENDING
- [ ] PUT /api/users/:id/approve muda status para APPROVED
- [ ] PUT /api/users/:id/reject requer reason obrigatório
- [ ] Não pode aprovar usuário já aprovado (erro)
- [ ] Não pode reverter aprovação/rejeição (erro)
- [ ] Apenas ADMIN pode acessar estas rotas (403 se PROFESSOR)
- [ ] Testado no Postman:
  - [ ] Listar pendentes
  - [ ] Aprovar usuário
  - [ ] Tentar aprovar novamente (deve falhar)
  - [ ] Rejeitar outro usuário com motivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F1-BE-04, F1-BE-05

---

### [F2-BE-02] CRUD de Laboratórios

**Descrição:**  
Gerenciamento completo de laboratórios (criar, listar, editar, inativar).

**Entregáveis:**

**1. LaboratoryRepository.js:**
- [ ] `findAll(includeInactive = false)` → SELECT * FROM laboratories WHERE is_active = true (ou todos se includeInactive) ORDER BY name
- [ ] `findById(id)` → SELECT * WHERE id = ? AND is_active = true
- [ ] `findByName(name)` → SELECT * WHERE name = ?
- [ ] `create(data)` → INSERT (name, location, capacity, description_lab, type)
- [ ] `update(id, data)` → UPDATE SET ... WHERE id = ?
- [ ] `softDelete(id)` → UPDATE is_active = false WHERE id = ?
- [ ] `hasActiveReservations(labId)` → verifica se há reservation_items com date >= HOJE e status = ACTIVE

**2. LaboratoryService.js:**
- [ ] `listLaboratories(includeInactive = false)` → lista labs
  ```javascript
  async listLaboratories(includeInactive = false) {
    return await LaboratoryRepository.findAll(includeInactive);
  }
  ```

- [ ] `getLaboratoryById(id)` → busca lab por ID
  **Validação:**
  - Se não encontrado: erro "Laboratório não encontrado"

- [ ] `createLaboratory(dto)` → cria lab
  **Validações:**
  1. [ ] name obrigatório
  2. [ ] name único (verificar com findByName)
     - Se existir: erro "Já existe laboratório com este nome"
  3. [ ] capacity obrigatório e > 0
     - Se <= 0: erro "Capacidade deve ser maior que zero"
  4. [ ] type obrigatório e válido
     - Valores: 'LABORATORIO', 'SALA DE AULA', 'AUDITORIO'
     - Se inválido: erro "Tipo inválido"
  5. [ ] location opcional mas recomendado
  6. [ ] Criar no banco com is_active = true
  7. [ ] Retornar laboratório criado

- [ ] `updateLaboratory(id, dto)` → atualiza lab
  **Validações:**
  1. [ ] Lab existe
  2. [ ] Se mudar name: verificar se novo nome já existe (exceto próprio ID)
  3. [ ] capacity > 0 se fornecido
  4. [ ] type válido se fornecido
  5. [ ] Atualizar campos fornecidos
  6. [ ] Retornar lab atualizado

- [ ] `deleteLaboratory(id)` → inativa lab (soft-delete)
  **Regra de Negócio Crítica:**
  1. [ ] Lab existe
  2. [ ] Verificar se possui reservas futuras ativas:
     ```sql
     SELECT COUNT(*) FROM reservation_items
     WHERE lab_id = ?
       AND date >= CURDATE()
       AND status = 'ACTIVE'
     ```
     - Se COUNT > 0: erro "Laboratório possui reservas futuras. Cancele-as primeiro."
  3. [ ] Se sem reservas: UPDATE is_active = false
  4. [ ] Retornar sucesso

**3. LaboratoryController.js:**
- [ ] `index(req, res)` → GET /api/laboratories
  - Query param: `?include_inactive=true` (opcional, só ADMIN)
  - Se PROFESSOR: sempre includeInactive = false

- [ ] `show(req, res)` → GET /api/laboratories/:id

- [ ] `create(req, res)` → POST /api/laboratories
  **Body esperado:**
  ```json
  {
    "name": "Lab 03",
    "location": "Bloco A, 2º Andar",
    "capacity": 40,
    "description_lab": "Computadores Intel i5, Projetor, Ar-condicionado",
    "type": "LABORATORIO"
  }
  ```

- [ ] `update(req, res)` → PUT /api/laboratories/:id

- [ ] `destroy(req, res)` → DELETE /api/laboratories/:id

**4. routes/laboratory.routes.js:**
```javascript
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

// Rotas públicas (autenticadas)
router.get('/', verifyToken, LaboratoryController.index);
router.get('/:id', verifyToken, LaboratoryController.show);

// Rotas de ADMIN
router.post('/', verifyToken, authorize(['ADMIN']), LaboratoryController.create);
router.put('/:id', verifyToken, authorize(['ADMIN']), LaboratoryController.update);
router.delete('/:id', verifyToken, authorize(['ADMIN']), LaboratoryController.destroy);
```

**Matriz de Permissões:**

| Endpoint | ADMIN | PROFESSOR | Sem Auth |
|----------|-------|-----------|----------|
| GET /laboratories | ✓ (todos) | ✓ (só ativos) | ✗ (401) |
| GET /laboratories/:id | ✓ | ✓ | ✗ |
| POST /laboratories | ✓ | ✗ (403) | ✗ |
| PUT /laboratories/:id | ✓ | ✗ (403) | ✗ |
| DELETE /laboratories/:id | ✓ | ✗ (403) | ✗ |

**Critérios de Aceite:**
- [ ] GET /api/laboratories retorna lista de labs ativos
- [ ] POST cria lab com validações corretas
- [ ] Não pode criar lab com nome duplicado
- [ ] Não pode criar lab com capacity = 0
- [ ] PUT atualiza campos permitidos
- [ ] DELETE inativa lab (soft-delete)
- [ ] Não pode inativar lab com reservas futuras (erro claro)
- [ ] PROFESSOR não consegue criar/editar/deletar (403)
- [ ] Testado no Postman todos os endpoints

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F1-BE-04, F1-BE-05

---

### [F2-BE-03] CRUD de Horários (Time Slots)

**Descrição:**  
Configurar períodos de aula padrão (M1, M2, N1, etc).

**Entregáveis:**

**1. TimeSlotRepository.js:**
- [ ] `findAll(includeInactive = false)` → SELECT * WHERE is_active = true (ou todos) ORDER BY start_time
- [ ] `findById(id)` → SELECT * WHERE id = ?
- [ ] `create(data)` → INSERT (name, start_time, end_time)
- [ ] `update(id, data)` → UPDATE SET ... WHERE id = ?
- [ ] `softDelete(id)` → UPDATE is_active = false WHERE id = ?

**2. TimeSlotService.js:**
- [ ] `listTimeSlots()` → lista horários ativos
- [ ] `createTimeSlot(dto)` → cria horário
  **Validações:**
  1. [ ] name obrigatório (ex: "M1", "Vespertino 1")
  2. [ ] start_time obrigatório, formato TIME válido (HH:MM:SS)
  3. [ ] end_time obrigatório, formato TIME válido
  4. [ ] start_time < end_time
     - Se start >= end: erro "Horário inicial deve ser anterior ao final"
  5. [ ] Criar com is_active = true
  6. [ ] Retornar time slot criado

- [ ] `updateTimeSlot(id, dto)` → atualiza horário
  **Validações:**
  1. [ ] Time slot existe
  2. [ ] Se atualizar horários: validar start < end
  3. [ ] Atualizar campos fornecidos

- [ ] `deleteTimeSlot(id)` → inativa horário
  **Regra de Negócio:**
  - Verificar se há reservation_items com este time_slot_id e date >= HOJE
  - Se houver: erro "Horário possui reservas futuras. Não pode ser inativado."

**3. TimeSlotController.js:**
- [ ] `index(req, res)` → GET /api/time-slots
- [ ] `create(req, res)` → POST /api/time-slots
  **Body esperado:**
  ```json
  {
    "name": "M5",
    "start_time": "11:00:00",
    "end_time": "11:50:00"
  }
  ```
- [ ] `update(req, res)` → PUT /api/time-slots/:id
- [ ] `destroy(req, res)` → DELETE /api/time-slots/:id

**4. routes/timeSlot.routes.js:**
```javascript
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

// Público (autenticado)
router.get('/', verifyToken, TimeSlotController.index);

// ADMIN only
router.post('/', verifyToken, authorize(['ADMIN']), TimeSlotController.create);
router.put('/:id', verifyToken, authorize(['ADMIN']), TimeSlotController.update);
router.delete('/:id', verifyToken, authorize(['ADMIN']), TimeSlotController.destroy);
```

**Critérios de Aceite:**
- [ ] GET /api/time-slots retorna lista ordenada por start_time
- [ ] POST cria horário com validações
- [ ] Não pode criar horário com start >= end (erro)
- [ ] PUT atualiza campos
- [ ] DELETE inativa se sem reservas futuras
- [ ] PROFESSOR só pode listar (403 em create/update/delete)
- [ ] Testado no Postman

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F1-BE-04, F1-BE-05

---

## 🔹 Frontend

### [F2-FE-01] Tela de Aprovação de Cadastros

**Descrição:**  
Interface para ADMIN visualizar e gerenciar usuários pendentes.

**Entregáveis:**
- [ ] `src/pages/admin/PendingUsersPage.jsx`
- [ ] `src/services/user.service.js` (métodos de API)

**Componentes:**

**1. Lista de Usuários Pendentes:**
- [ ] DataGrid do MUI com colunas:
  - Nome
  - Email
  - Departamento
  - Data de cadastro (formatada)
  - Ações (Aprovar, Rejeitar)

**2. Estado do Componente:**
```javascript
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedUser, setSelectedUser] = useState(null);
const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectionReason, setRejectionReason] = useState('');
```

**3. Buscar Usuários Pendentes:**
```javascript
useEffect(() => {
  async function loadPendingUsers() {
    try {
      const data = await userService.getPending();
      setUsers(data);
    } catch (error) {
      showError('Erro ao carregar usuários pendentes');
    } finally {
      setLoading(false);
    }
  }
  loadPendingUsers();
}, []);
```

**4. Ação: Aprovar**
- [ ] Botão "Aprovar" (ícone check verde)
- [ ] Ao clicar: Modal de confirmação
  ```
  "Aprovar cadastro de [Nome]?"
  [Cancelar] [Confirmar]
  ```
- [ ] Ao confirmar:
  ```javascript
  async function handleApprove(userId) {
    try {
      await userService.approve(userId);
      showSuccess('Usuário aprovado com sucesso!');
      // Remover da lista
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      showError(error.message);
    }
  }
  ```

**5. Ação: Rejeitar**
- [ ] Botão "Rejeitar" (ícone X vermelho)
- [ ] Ao clicar: Modal com formulário
  ```
  "Rejeitar cadastro de [Nome]"
  
  Motivo da rejeição: (obrigatório)
  [Textarea com 3 linhas]
  
  [Cancelar] [Rejeitar]
  ```
- [ ] Validação: motivo não pode ser vazio
- [ ] Ao confirmar:
  ```javascript
  async function handleReject(userId, reason) {
    try {
      await userService.reject(userId, reason);
      showSuccess('Usuário rejeitado');
      setUsers(users.filter(u => u.id !== userId));
      setShowRejectModal(false);
    } catch (error) {
      showError(error.message);
    }
  }
  ```

**6. Filtros (opcional mas recomendado):**
- [ ] Select: Filtrar por departamento
- [ ] DatePicker: Filtrar por data de cadastro
- [ ] TextField: Busca por nome ou email

**7. Estado Vazio:**
- [ ] Se `users.length === 0`: exibir mensagem
  ```
  "Nenhum usuário aguardando aprovação 🎉"
  ```

**src/services/user.service.js:**
```javascript
import api from './api';

export const userService = {
  async getPending() {
    const response = await api.get('/users/pending');
    return response.data;
  },
  
  async approve(userId) {
    const response = await api.put(`/users/${userId}/approve`);
    return response.data;
  },
  
  async reject(userId, reason) {
    const response = await api.put(`/users/${userId}/reject`, { reason });
    return response.data;
  }
};
```

**Critérios de Aceite:**
- [ ] DataGrid carrega usuários pendentes ao montar
- [ ] Loading visual durante carregamento
- [ ] Aprovar usuário → remove da lista + toast de sucesso
- [ ] Rejeitar sem motivo → erro de validação
- [ ] Rejeitar com motivo → remove da lista + toast
- [ ] Se lista vazia → mensagem apropriada
- [ ] Apenas ADMIN acessa (verificar no router)
- [ ] Responsivo (mobile e desktop)

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F2-BE-01, F1-FE-01

---

### [F2-FE-02] Tela de Gestão de Laboratórios

**Descrição:**  
CRUD completo de laboratórios com DataGrid e modal.

**Entregáveis:**
- [ ] `src/pages/admin/LaboratoriesPage.jsx`
- [ ] `src/components/admin/LaboratoryFormModal.jsx`
- [ ] `src/services/laboratory.service.js`

**Componentes:**

**1. Lista de Laboratórios:**
- [ ] DataGrid com colunas:
  - Nome
  - Localização
  - Capacidade
  - Tipo
  - Status (Ativo/Inativo - chip colorido)
  - Ações (Editar, Deletar)

**2. Botão "Novo Laboratório":**
- [ ] Botão no topo da página (ícone +)
- [ ] Ao clicar: abre modal de criação

**3. Modal de Criação/Edição:**
- [ ] Título dinâmico: "Novo Laboratório" ou "Editar [Nome]"
- [ ] Formulário MUI com campos:
  - [ ] TextField: Nome (obrigatório)
  - [ ] TextField: Localização (opcional)
  - [ ] TextField: Capacidade (number, obrigatório, min=1)
  - [ ] TextField: Descrição (multiline, opcional)
  - [ ] Select: Tipo
    - Opções: Laboratório, Sala de Aula, Auditório
- [ ] Botões: [Cancelar] [Salvar]

**4. Validações do Formulário:**
```javascript
const validateForm = () => {
  const errors = {};
  
  if (!formData.name) {
    errors.name = 'Nome é obrigatório';
  }
  
  if (!formData.capacity || formData.capacity <= 0) {
    errors.capacity = 'Capacidade deve ser maior que zero';
  }
  
  if (!formData.type) {
    errors.type = 'Tipo é obrigatório';
  }
  
  return errors;
};
```

**5. Ação: Criar**
```javascript
async function handleCreate(data) {
  try {
    const newLab = await laboratoryService.create(data);
    showSuccess('Laboratório criado com sucesso!');
    setLabs([...labs, newLab]);
    closeModal();
  } catch (error) {
    if (error.response?.status === 400) {
      showError(error.response.data.error); // ex: "Nome já existe"
    } else {
      showError('Erro ao criar laboratório');
    }
  }
}
```

**6. Ação: Editar**
- [ ] Botão "Editar" (ícone lápis)
- [ ] Abre modal preenchido com dados atuais
- [ ] Submit atualiza no backend e na lista

**7. Ação: Deletar (Inativar)**
- [ ] Botão "Deletar" (ícone lixeira)
- [ ] Modal de confirmação:
  ```
  "Tem certeza que deseja inativar o laboratório [Nome]?"
  "Laboratórios inativos não aparecem nas opções de reserva."
  
  [Cancelar] [Inativar]
  ```
- [ ] Se sucesso: atualizar lista (marcar como inativo ou remover)
- [ ] Se erro (reservas futuras):
  ```javascript
  catch (error) {
    if (error.response?.data?.error.includes('reservas futuras')) {
      showError('Laboratório possui reservas futuras. Cancele-as primeiro.');
    }
  }
  ```

**8. Filtros (opcional):**
- [ ] Checkbox: "Mostrar inativos" (só ADMIN)
- [ ] Select: Filtrar por tipo

**src/services/laboratory.service.js:**
```javascript
export const laboratoryService = {
  async getAll(includeInactive = false) {
    const params = includeInactive ? '?include_inactive=true' : '';
    const response = await api.get(`/laboratories${params}`);
    return response.data;
  },
  
  async create(data) {
    const response = await api.post('/laboratories', data);
    return response.data;
  },
  
  async update(id, data) {
    const response = await api.put(`/laboratories/${id}`, data);
    return response.data;
  },
  
  async delete(id) {
    const response = await api.delete(`/laboratories/${id}`);
    return response.data;
  }
};
```

**Critérios de Aceite:**
- [ ] Lista carrega todos laboratórios ativos
- [ ] Criar novo lab → aparece na lista
- [ ] Não pode criar com nome duplicado (erro)
- [ ] Não pode criar com capacity 0 (validação frontend + backend)
- [ ] Editar lab → atualiza na lista
- [ ] Deletar lab sem reservas → inativa com sucesso
- [ ] Deletar lab com reservas → erro claro
- [ ] Modal fecha após ação bem-sucedida
- [ ] Apenas ADMIN acessa (router protect)
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F2-BE-02, F1-FE-01

---

### [F2-FE-03] Tela de Configuração de Horários

**Descrição:**  
Gerenciar períodos de aula (M1, M2, N1, etc).

**Entregáveis:**
- [ ] `src/pages/admin/TimeSlotsPage.jsx`
- [ ] `src/components/admin/TimeSlotFormModal.jsx`
- [ ] `src/services/timeSlot.service.js`

**Componentes:**

**1. Lista de Horários:**
- [ ] DataGrid com colunas:
  - Nome (ex: M1)
  - Horário Início
  - Horário Fim
  - Status (Ativo/Inativo)
  - Ações (Editar, Deletar)
- [ ] Ordenado por horário de início

**2. Modal de Criação/Edição:**
- [ ] TextField: Nome (ex: "M5")
- [ ] TimePicker: Horário Início (formato HH:MM)
- [ ] TimePicker: Horário Fim (formato HH:MM)
- [ ] Validação: início < fim

**3. Validações:**
```javascript
const validateTimeSlot = () => {
  if (!name) return 'Nome é obrigatório';
  if (!startTime || !endTime) return 'Horários são obrigatórios';
  
  // Converter para minutos para comparar
  const start = timeToMinutes(startTime); // ex: "08:20" → 500
  const end = timeToMinutes(endTime);
  
  if (start >= end) {
    return 'Horário inicial deve ser anterior ao final';
  }
  
  return null;
};
```

**4. Ação: Deletar**
- [ ] Confirmação: "Inativar horário [Nome]?"
- [ ] Se erro (reservas futuras): exibir mensagem clara

**src/services/timeSlot.service.js:**
```javascript
export const timeSlotService = {
  async getAll() {
    const response = await api.get('/time-slots');
    return response.data;
  },
  
  async create(data) {
    const response = await api.post('/time-slots', data);
    return response.data;
  },
  
  async update(id, data) {
    const response = await api.put(`/time-slots/${id}`, data);
    return response.data;
  },
  
  async delete(id) {
    const response = await api.delete(`/time-slots/${id}`);
    return response.data;
  }
};
```

**Critérios de Aceite:**
- [ ] Lista ordenada por horário
- [ ] Criar novo horário → aparece na lista
- [ ] Não pode criar com início >= fim (erro)
- [ ] Editar horário → atualiza na lista
- [ ] Deletar sem reservas → inativa
- [ ] Deletar com reservas → erro
- [ ] Apenas ADMIN acessa
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F2-BE-03, F1-FE-01

---

## 🔹 Teste final de fase

### [F2-INT-01] Teste de Integração da FASE 2

**Descrição:**  
Validar que todos os CRUDs funcionam end-to-end.

**Checklist de Testes:**

**Cenário 1: Aprovação de Cadastro**
- [ ] 1. Cadastrar novo usuário via /register
- [ ] 2. Verificar que aparece em /admin/pending-users
- [ ] 3. ADMIN aprova usuário
- [ ] 4. Usuário some da lista de pendentes
- [ ] 5. Professor consegue fazer login com sucesso
- [ ] 6. Cadastrar outro usuário
- [ ] 7. ADMIN rejeita sem motivo → erro
- [ ] 8. ADMIN rejeita com motivo → sucesso
- [ ] 9. Professor rejeitado tenta login → mensagem "Conta rejeitada"

**Cenário 2: Gestão de Laboratórios**
- [ ] 1. ADMIN cria "Lab 10" com capacidade 30
- [ ] 2. Lab aparece na lista
- [ ] 3. Tentar criar outro "Lab 10" → erro "Nome já existe"
- [ ] 4. Editar Lab 10 para capacidade 40 → atualiza
- [ ] 5. Tentar editar capacidade para 0 → erro
- [ ] 6. Deletar Lab 10 (sem reservas) → inativa
- [ ] 7. Lab 10 não aparece mais na lista ativa
- [ ] 8. PROFESSOR tenta criar lab → 403 bloqueado

**Cenário 3: Gestão de Horários**
- [ ] 1. ADMIN cria horário "M5" (11:00-11:50)
- [ ] 2. Horário aparece na lista
- [ ] 3. Tentar criar horário com início 12:00 e fim 11:00 → erro
- [ ] 4. Editar M5 para 11:10-12:00 → atualiza
- [ ] 5. Deletar M5 (sem reservas) → inativa
- [ ] 6. PROFESSOR tenta criar horário → 403

**Cenário 4: Proteção de Rotas**
- [ ] 1. Tentar acessar /admin/pending-users sem login → 401
- [ ] 2. Login como PROFESSOR e acessar /admin/laboratories → 403
- [ ] 3. Login como ADMIN → todas rotas permitidas

**Critérios de Aceite:**
- [ ] Todos os 4 cenários passam sem bugs
- [ ] Nenhum console.error no frontend
- [ ] Nenhum erro 500 no backend
- [ ] Pronto para avançar para FASE 3

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F2-* concluídas

---


## 🟠 FASE 3 – Ciclos Acadêmicos e Feriados
**Requisitos:** RF05, RF06, RF07, RF19  
**Status Geral:** 🔴 PENDENTE

### 🔹 Backend

#### [F3-BE-01] CRUD de Ciclos Acadêmicos
- **Descrição:** Criar e gerenciar semestres letivos
- **Entregáveis:**
  - GET `/academic-cycles` (listar)
  - POST `/academic-cycles` (criar - ADMIN only)
  - PUT `/academic-cycles/:id` (editar - ADMIN only)
  - PUT `/academic-cycles/:id/activate` (marcar como ativo)
- **Requisitos:** 
  - **RF05** - Criação de ciclo acadêmico
  - **RF06** - Unificação de ciclo (não precisa criar sessões semanais)
  - **RF19** - Período exclusivo de administrador
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F1-BE-04

#### [F3-BE-02] CRUD de Feriados
- **Descrição:** Cadastrar feriados vinculados ao ciclo
- **Entregáveis:**
  - GET `/holidays` (listar por ciclo)
  - POST `/holidays` (criar - ADMIN only)
  - DELETE `/holidays/:id` (remover - ADMIN only)
- **Requisitos:** **RF07** - Cadastro de feriados
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F3-BE-01

---

### 🔹 Frontend

#### [F3-FE-01] Tela de gestão de ciclos
- **Descrição:** Criar ciclo com nome, datas, período exclusivo admin
- **Entregáveis:** `AcademicCyclesPage.jsx`, formulário com:
  - Nome do ciclo (ex: 2026-1)
  - Data início/fim
  - Data fim do período exclusivo ADMIN
  - Botão "Ativar ciclo"
- **Requisitos:** **RF05, RF06, RF19**
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F3-BE-01

#### [F3-FE-02] Tela de cadastro de feriados
- **Descrição:** Lista de feriados com adição/remoção
- **Entregáveis:** `HolidaysPage.jsx` (vinculado ao ciclo ativo)
- **Requisitos:** **RF07** - Cadastro de feriados
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F3-BE-02

---

## 🔵 FASE 4 – Reservas Simples (Core Básico)
**Requisitos:** RF10, RF14, RNF04, RNF05  
**Status Geral:** 🔴 PENDENTE

### 🔹 Backend

#### [F4-BE-01] Lógica de detecção de conflitos
- **Descrição:** Validar se lab está ocupado no horário solicitado
- **Entregáveis:** 
  - `ReservationRepository.findConflicting(labId, date, startTime, endTime)`
  - Query na tabela `reservation_items` com status ACTIVE
- **Requisitos:** **RF14** - Conflito de reserva, **RNF05** - Detecção em tempo real
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F2-BE-02, F3-BE-01

#### [F4-BE-02] Criação de reserva simples
- **Descrição:** Permitir reserva para 1 dia específico
- **Entregáveis:**
  - POST `/reservations` (criar reserva)
  - Validações:
    - Data dentro do ciclo ativo
    - Não é feriado (RN03)
    - Respeitar período exclusivo ADMIN (RF19)
    - Detectar conflito (RF14)
  - Status:
    - PROFESSOR: APPROVED se sem conflito (reserva simples)
    - ADMIN: APPROVED sempre
- **Requisitos:** **RF10** - Reserva simples
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F4-BE-01

---

### 🔹 Frontend

#### [F4-FE-01] Formulário de criação de reserva simples
- **Descrição:** Interface para solicitar reserva de 1 dia
- **Entregáveis:** `CreateReservationPage.jsx` com:
  - Seleção de laboratório
  - Seleção de data (date picker)
  - Seleção de horários (checkboxes: M1, M2, N1, etc)
  - Validação: alerta se conflito detectado
- **Requisitos:** **RF10** - Reserva simples, **RF14** - Alerta de conflito
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F4-BE-02

#### [F4-FE-02] Visualização de minhas reservas
- **Descrição:** Professor vê lista de suas próprias reservas
- **Entregáveis:** `MyReservationsPage.jsx` com DataGrid
- **Requisitos:** **RF20** - Interface do professor (visualizar reservas)
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F4-BE-02

---

## 🟣 FASE 5 – Reservas Recorrentes
**Requisitos:** RF11, RF12, RF13  
**Status Geral:** 🔴 PENDENTE

### 🔹 Backend

#### [F5-BE-01] Criação de reserva recorrente
- **Descrição:** Reservar múltiplas datas de uma vez
- **Entregáveis:**
  - POST `/reservations` com `type: RECURRING`
  - Gerar N `reservation_items` (1 por dia)
  - Validar conflito em TODAS as datas (RN05)
  - Status:
    - PROFESSOR: PENDING (RF12 - aguarda aprovação)
    - ADMIN: APPROVED direto (RF11)
  - Rollback se qualquer data tiver conflito
- **Requisitos:** 
  - **RF11** - Reserva recorrente (ADMIN)
  - **RF12** - Solicitação de reserva recorrente (PROFESSOR)
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F4-BE-02

#### [F5-BE-02] Aprovação/Rejeição de reservas
- **Descrição:** ADMIN aprova ou rejeita reservas PENDING
- **Entregáveis:**
  - PUT `/reservations/:id/approve` (aprovar - ADMIN only)
  - PUT `/reservations/:id/reject` (rejeitar com motivo - ADMIN only)
  - PUT `/reservations/:id/redirect` (redirecionar para outro lab - ADMIN only)
  - Gravar `approved_by`, `approval_date`, `reason`
- **Requisitos:** **RF13** - Aprovação de reserva (incluindo redirecionamento)
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F5-BE-01

---

### 🔹 Frontend

#### [F5-FE-01] Formulário de reserva recorrente
- **Descrição:** Criar reserva para múltiplas datas
- **Entregáveis:** Adicionar em `CreateReservationPage.jsx`:
  - Toggle: "Reserva simples" vs "Reserva recorrente"
  - Se recorrente: date range picker (início/fim)
  - Seleção de dias da semana (seg, ter, qua, etc)
  - Alerta: "Como PROFESSOR, esta reserva ficará PENDENTE até aprovação"
- **Requisitos:** **RF11, RF12** - Reserva recorrente
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F5-BE-01

#### [F5-FE-02] Painel de aprovação de reservas
- **Descrição:** ADMIN vê e gerencia reservas pendentes
- **Entregáveis:** `PendingReservationsPage.jsx` com:
  - DataGrid de reservas PENDING
  - Botões: Aprovar, Rejeitar, Redirecionar
  - Modal para informar motivo (rejeição/redirecionamento)
- **Requisitos:** **RF13** - Aprovação de reserva
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F5-BE-02

---

## 🟢 FASE 6 – Sobrescrita e Controle Avançado (ADMIN)
**Requisitos:** RF15, RF18, RF21, RNF04  
**Status Geral:** 🔴 PENDENTE

### 🔹 Backend

#### [F6-BE-01] Sobrescrita de reserva
- **Descrição:** ADMIN pode forçar reserva em horário ocupado
- **Entregáveis:**
  - POST `/reservations/overwrite` (ADMIN only)
  - Marcar reserva antiga: `status = CANCELED` ou `OVERWRITTEN`
  - Criar nova reserva: `status = APPROVED`
  - Registrar em `audit_logs` (RF21)
  - Emitir evento para notificação (RF17)
- **Requisitos:** 
  - **RF15** - Sobrescrita de reserva
  - **RF21** - Log de reservas
  - **RNF04** - Integridade transacional
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F5-BE-01

#### [F6-BE-02] Exclusão múltipla de reservas
- **Descrição:** Deletar várias reservas de uma vez
- **Entregáveis:**
  - DELETE `/reservations/bulk` (array de IDs)
  - Validar permissões para cada ID
  - Transação: ou deleta todas ou nenhuma
- **Requisitos:** **RF18** - Exclusão múltipla
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F4-BE-02

#### [F6-BE-03] Sistema de auditoria
- **Descrição:** Registrar ações críticas em audit_logs
- **Entregáveis:**
  - `AuditService.log(action, table, recordId, changedBy, oldValues, newValues)`
  - Registrar: CREATE, UPDATE, DELETE, OVERWRITE, APPROVE, REJECT
- **Requisitos:** **RF21** - Log de reservas e sobrescrita
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F6-BE-01

---

### 🔹 Frontend

#### [F6-FE-01] Interface de sobrescrita
- **Descrição:** ADMIN pode sobrescrever reserva existente
- **Entregáveis:** Modal de confirmação em `CreateReservationPage.jsx`:
  - Se ADMIN detectar conflito: exibir alerta
  - Botão: "Sobrescrever reserva de [Nome do Professor]"
  - Confirmação: "Tem certeza? O professor será notificado"
- **Requisitos:** **RF15** - Sobrescrita de reserva
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F6-BE-01

#### [F6-FE-02] Exclusão múltipla
- **Descrição:** Selecionar e deletar múltiplas reservas
- **Entregáveis:** Adicionar em `MyReservationsPage.jsx`:
  - Checkboxes para seleção múltipla
  - Botão: "Deletar selecionadas"
- **Requisitos:** **RF18** - Exclusão múltipla
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F6-BE-02

---

## 🔴 FASE 7 – Notificações e Comunicação
**Requisitos:** RF16, RF17  
**Status Geral:** 🔴 PENDENTE

### 🔹 Backend

#### [F7-BE-01] Sistema de eventos (EventBus)
- **Descrição:** Implementar padrão Observer para desacoplamento
- **Entregáveis:**
  - `events/EventBus.js` (EventEmitter)
  - `events/reservation.events.js` (listeners)
  - Eventos:
    - `reservation:created` → notificar ADMIN (RF16)
    - `reservation:overwritten` → notificar professor (RF17)
    - `reservation:approved` → notificar professor
    - `reservation:rejected` → notificar professor
- **Requisitos:** **RF16, RF17** - Notificações
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F5-BE-01, F6-BE-01

#### [F7-BE-02] Serviço de email (Nodemailer)
- **Descrição:** Enviar emails assíncronos
- **Entregáveis:**
  - `services/EmailService.js`
  - Templates:
    - Nova solicitação (para ADMIN)
    - Reserva sobrescrita (para professor)
    - Reserva aprovada (para professor)
    - Reserva rejeitada (para professor)
  - Configuração SMTP (Gmail ou institucional)
- **Requisitos:** **RF16, RF17** - Notificações
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F7-BE-01

---

### 🔹 Frontend

#### [F7-FE-01] Sistema de notificações toast
- **Descrição:** Feedback visual para usuário
- **Entregáveis:**
  - `NotificationContext.jsx`
  - Toast/Snackbar para:
    - Sucesso: "Reserva criada com sucesso"
    - Alerta: "Reserva pendente de aprovação"
    - Erro: "Conflito detectado"
- **Requisitos:** Feedback de ações (complementar RF16/RF17)
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F4-FE-01

---

## 🟡 FASE 8 – Visualização e Calendário
**Requisitos:** RF20 (complemento visual)  
**Status Geral:** 🔴 PENDENTE

### 🔹 Frontend

#### [F8-FE-01] Calendário visual de reservas
- **Descrição:** Visualizar ocupação dos labs em calendário
- **Entregáveis:** `CalendarPage.jsx` com:
  - FullCalendar ou biblioteca similar
  - Filtro por laboratório
  - Código de cores:
    - Verde: disponível
    - Vermelho: ocupado
    - Amarelo: pendente
  - Click no dia: abrir modal de criação
- **Requisitos:** **RF20** - Interface do professor (visualização clara)
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F4-BE-02

#### [F8-FE-02] Dashboard com métricas
- **Descrição:** Visão geral do sistema
- **Entregáveis:** `DashboardPage.jsx` com cards:
  - Total de reservas ativas
  - Reservas pendentes (se ADMIN)
  - Laboratórios cadastrados
  - Próximas reservas do usuário
- **Requisitos:** **RF20** - Interface organizada
- **Status:** 🔴 PENDENTE
- **Responsável:** -
- **Depende de:** F4-BE-02

---

## 🎯 FASE 9 – Refinamentos e Extras
**Status Geral:** 🔴 PENDENTE

### 🔹 Backend

#### [F9-BE-01] Relatórios e exportação
- **Descrição:** (Opcional) Exportar lista de reservas em CSV/PDF
- **Entregáveis:** GET `/reservations/export` com query params
- **Requisitos:** Extra (não obrigatório)
- **Status:** 🔴 PENDENTE
- **Responsável:** -

---

### 🔹 Frontend

#### [F9-FE-01] Responsividade mobile
- **Descrição:** Adaptar interfaces para celular/tablet
- **Entregáveis:** Breakpoints MUI configurados, menu hambúrguer
- **Requisitos:** **RNF02** - Usabilidade
- **Status:** 🔴 PENDENTE
- **Responsável:** -

#### [F9-FE-02] Tela de perfil do usuário
- **Descrição:** Editar dados pessoais e trocar senha
- **Entregáveis:** `ProfilePage.jsx`
- **Requisitos:** **RF20** - Configuração de conta
- **Status:** 🔴 PENDENTE
- **Responsável:** -

---

## 🚀 FASE 10 – Testes e Deploy
**Status Geral:** 🔴 PENDENTE

### 🔹 Backend

#### [F10-BE-01] Testes unitários
- **Descrição:** Testar Services e Repositories
- **Entregáveis:** Jest configurado, cobertura mínima 70%
- **Requisitos:** Qualidade de código
- **Status:** 🔴 PENDENTE
- **Responsável:** -

#### [F10-BE-02] Testes de integração
- **Descrição:** Testar rotas da API
- **Entregáveis:** Supertest configurado, testes de fluxos principais
- **Requisitos:** **RNF04, RNF05** - Integridade e performance
- **Status:** 🔴 PENDENTE
- **Responsável:** -

---

### 🔹 Frontend

#### [F10-FE-01] Testes de componentes
- **Descrição:** Testar componentes React
- **Entregáveis:** React Testing Library configurado
- **Requisitos:** Qualidade de código
- **Status:** 🔴 PENDENTE
- **Responsável:** -

---

### 🔹 Geral

#### [F10-GE-01] Deploy backend
- **Descrição:** Subir API em servidor (Heroku/Railway/AWS)
- **Entregáveis:** URL pública da API, SSL configurado
- **Requisitos:** Apresentação final
- **Status:** 🔴 PENDENTE
- **Responsável:** -

#### [F10-GE-02] Deploy frontend
- **Descrição:** Subir aplicação React (Vercel/Netlify)
- **Entregáveis:** URL pública da aplicação
- **Requisitos:** Apresentação final
- **Status:** 🔴 PENDENTE
- **Responsável:** -

#### [F10-GE-03] Documentação final
- **Descrição:** README completo, guia de instalação, API docs
- **Entregáveis:** README.md, Swagger/Postman collection
- **Requisitos:** Apresentação final
- **Status:** 🔴 PENDENTE
- **Responsável:** -

---

## 📊 RESUMO DE REQUISITOS FUNCIONAIS

| RF | Descrição | Tasks Relacionadas |
|----|-----------|-------------------|
| RF01 | Cadastro de usuário | F1-BE-02, F1-FE-02, F1-FE-03 |
| RF02 | Validação de cadastro | F2-BE-01, F2-FE-01 |
| RF03 | Status de usuário | F2-BE-01 |
| RF04 | Configuração de períodos | F2-BE-03, F2-FE-03 |
| RF05 | Criação de ciclo acadêmico | F3-BE-01, F3-FE-01 |
| RF06 | Unificação de ciclo | F3-BE-01 |
| RF07 | Cadastro de feriados | F3-BE-02, F3-FE-02 |
| RF08 | Cadastro de salas/laboratórios | F2-BE-02, F2-FE-02 |
| RF09 | Controle hierárquico | F1-BE-04 |
| RF10 | Reserva simples | F4-BE-02, F4-FE-01 |
| RF11 | Reserva recorrente (ADMIN) | F5-BE-01, F5-FE-01 |
| RF12 | Solicitação de reserva recorrente (PROFESSOR) | F5-BE-01, F5-FE-01 |
| RF13 | Aprovação de reserva | F5-BE-02, F5-FE-02 |
| RF14 | Conflito de reserva | F4-BE-01, F4-FE-01 |
| RF15 | Sobrescrita de reserva | F6-BE-01, F6-FE-01 |
| RF16 | Notificação de solicitação | F7-BE-01, F7-BE-02 |
| RF17 | Notificação de sobrescrita | F7-BE-01, F7-BE-02 |
| RF18 | Exclusão múltipla | F6-BE-02, F6-FE-02 |
| RF19 | Período exclusivo de administrador | F3-BE-01, F3-FE-01 |
| RF20 | Interface do professor | F1-FE-04, F4-FE-02, F8-FE-01, F9-FE-02 |
| RF21 | Log de reservas | F6-BE-03 |

---

## 🎯 TOTAL DE TASKS

- **Banco de Dados:** 1 task
- **Backend:** 25 tasks
- **Frontend:** 21 tasks
- **Geral:** 3 tasks
- **TOTAL:** **50 tasks**

---

## ✅ PROGRESSO GERAL

- **Concluídas:** 9 tasks (18%)
- **Em Andamento:** 0 tasks
- **Pendentes:** 41 tasks (82%)
