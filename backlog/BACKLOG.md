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
* **Obs:** Funcional
* **Status:** ✅ CONCLUÍDO (Aguardando Design)
* **Responsável:** Luiz / Kaique

#### [F1-FE-03] Tela de Cadastro (Estrutura)

* **Descrição:** Inputs e lógica de envio.
* **Obs:** Funcional, mas **sem identidade visual final**.
* **Status:** ✅ CONCLUÍDO
* **Obs:** Funcional
* **Status:** ✅ CONCLUÍDO (Aguardando Design)
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
- [x] GET /api/laboratories retorna lista de labs ativos
- [x] POST cria lab com validações corretas
- [x] Não pode criar lab com nome duplicado
- [x] Não pode criar lab com capacity = 0
- [x] PUT atualiza campos permitidos
- [x] DELETE inativa lab (soft-delete)
- [x] Não pode inativar lab com reservas futuras (erro claro)
- [x] PROFESSOR não consegue criar/editar/deletar (403)
- [x] Testado no Postman todos os endpoints

**Status:** ✅ Concluído  
**Responsável:** Kaique
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
- [x] DataGrid carrega usuários pendentes ao montar
- [x] Loading visual durante carregamento
- [x] Aprovar usuário → remove da lista + toast de sucesso
- [x] Rejeitar sem motivo → erro de validação
- [x] Rejeitar com motivo → remove da lista + toast
- [x] Se lista vazia → mensagem apropriada
- [x] Apenas ADMIN acessa (verificar no router)
- [x] Responsivo (mobile e desktop)

**Status:** ✅ CONCLUÍDO 
**Responsável:** Kaique  
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
- [x] Lista carrega todos laboratórios ativos
- [x] Criar novo lab → aparece na lista
- [x] Não pode criar com nome duplicado (erro)
- [x] Não pode criar com capacity 0 (validação frontend + backend)
- [x] Editar lab → atualiza na lista
- [x] Deletar lab sem reservas → inativa com sucesso
- [x] Deletar lab com reservas → erro claro
- [x] Modal fecha após ação bem-sucedida
- [x] Apenas ADMIN acessa (router protect)
- [x] Responsivo

**Status:** ✅ CONCLUÍDO
**Responsável:** kaique  
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


# 🟠 FASE 3 – Ciclos Acadêmicos e Feriados

**Requisitos:** RF05, RF06, RF07, RF19  
**Status Geral:** 🔴 PENDENTE  
**Meta:** Admins podem criar ciclos letivos, ativá-los e cadastrar feriados vinculados

---

## 🔹 Backend

### [F3-BE-01] CRUD de Ciclos Acadêmicos

**Descrição:**  
Criar e gerenciar semestres letivos. Um ciclo deve ser ativado para que reservas possam ser feitas. Apenas um ciclo pode estar ativo por vez.

**Entregáveis:**

**1. AcademicCycleRepository.js:**
- [ ] `findAll()` → SELECT * FROM academic_cycles ORDER BY start_date DESC
- [ ] `findById(id)` → SELECT * FROM academic_cycles WHERE id = ?
- [ ] `findActive()` → SELECT * FROM academic_cycles WHERE is_active = true LIMIT 1
- [ ] `findByName(name)` → SELECT * FROM academic_cycles WHERE name = ?
- [ ] `create(data)` → INSERT (name, start_date, end_date, exclusive_admin_end_date)
- [ ] `update(id, data)` → UPDATE SET ... WHERE id = ?
- [ ] `deactivateAll()` → UPDATE academic_cycles SET is_active = false
- [ ] `activate(id)` → UPDATE academic_cycles SET is_active = true WHERE id = ?

**2. AcademicCycleService.js:**
- [ ] `listCycles()` → lista todos os ciclos
  ```javascript
  async listCycles() {
    return await AcademicCycleRepository.findAll();
  }
  ```

- [ ] `getActiveCycle()` → retorna ciclo ativo
  ```javascript
  async getActiveCycle() {
    const cycle = await AcademicCycleRepository.findActive();
    if (!cycle) throw new Error('Nenhum ciclo acadêmico ativo encontrado');
    return cycle;
  }
  ```

- [ ] `createCycle(dto)` → cria ciclo
  **Lógica de Negócio:**
  1. [ ] Validar `name` obrigatório (ex: "2026-1")
  2. [ ] Verificar nome único:
     - Se existir: erro "Já existe um ciclo com este nome"
  3. [ ] Validar `start_date` obrigatório
  4. [ ] Validar `end_date` obrigatório
  5. [ ] Validar start_date < end_date:
     - Se inválido: erro "Data de início deve ser anterior à data de fim"
  6. [ ] Validar `exclusive_admin_end_date` obrigatório
  7. [ ] Validar exclusive_admin_end_date <= start_date:
     - Se inválido: erro "Período exclusivo admin deve terminar antes ou na data de início do ciclo"
  8. [ ] Criar no banco com is_active = false
  9. [ ] Retornar ciclo criado

- [ ] `updateCycle(id, dto)` → atualiza ciclo
  **Lógica de Negócio:**
  1. [ ] Ciclo existe
  2. [ ] Se alterar `name`: verificar unicidade (exceto próprio ID)
  3. [ ] Se alterar datas: revalidar start_date < end_date
  4. [ ] Se alterar exclusive_admin_end_date: revalidar <= start_date
  5. [ ] Não pode editar ciclo ativo (is_active = true):
     - Se ativo: erro "Não é possível editar um ciclo ativo. Desative-o primeiro."
  6. [ ] Retornar ciclo atualizado

- [ ] `activateCycle(id, adminId)` → ativa ciclo
  **Lógica de Negócio:**
  1. [ ] Ciclo existe
  2. [ ] Se já ativo: erro "Este ciclo já está ativo"
  3. [ ] Desativar todos os outros ciclos (deactivateAll)
  4. [ ] Ativar o ciclo solicitado
  5. [ ] Registrar em audit_logs:
     ```javascript
     AuditService.log(
       'ACTIVATE',
       'academic_cycles',
       id,
       adminId,
       { is_active: false },
       { is_active: true }
     );
     ```
  6. [ ] Retornar ciclo ativo

**3. AcademicCycleController.js:**
- [ ] `index(req, res)` → GET /api/academic-cycles
  ```javascript
  async index(req, res) {
    try {
      const cycles = await AcademicCycleService.listCycles();
      res.json(cycles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ```

- [ ] `active(req, res)` → GET /api/academic-cycles/active
  ```javascript
  async active(req, res) {
    try {
      const cycle = await AcademicCycleService.getActiveCycle();
      res.json(cycle);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  ```

- [ ] `create(req, res)` → POST /api/academic-cycles
  **Body esperado:**
  ```json
  {
    "name": "2026-1",
    "start_date": "2026-02-01",
    "end_date": "2026-06-30",
    "exclusive_admin_end_date": "2026-01-25"
  }
  ```

- [ ] `update(req, res)` → PUT /api/academic-cycles/:id

- [ ] `activate(req, res)` → PUT /api/academic-cycles/:id/activate
  ```javascript
  async activate(req, res) {
    try {
      const { id } = req.params;
      const adminId = req.user.id;
      const cycle = await AcademicCycleService.activateCycle(id, adminId);
      res.json({ message: 'Ciclo ativado com sucesso', cycle });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  ```

**4. routes/academicCycle.routes.js:**
```javascript
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

// Público (autenticado) — qualquer role precisa saber o ciclo ativo
router.get('/', verifyToken, AcademicCycleController.index);
router.get('/active', verifyToken, AcademicCycleController.active);

// ADMIN only
router.post('/', verifyToken, authorize(['ADMIN']), AcademicCycleController.create);
router.put('/:id', verifyToken, authorize(['ADMIN']), AcademicCycleController.update);
router.put('/:id/activate', verifyToken, authorize(['ADMIN']), AcademicCycleController.activate);
```

**Matriz de Permissões:**

| Endpoint | ADMIN | PROFESSOR | Sem Auth |
|----------|-------|-----------|----------|
| GET /academic-cycles | ✓ | ✓ | ✗ (401) |
| GET /academic-cycles/active | ✓ | ✓ | ✗ (401) |
| POST /academic-cycles | ✓ | ✗ (403) | ✗ |
| PUT /academic-cycles/:id | ✓ | ✗ (403) | ✗ |
| PUT /academic-cycles/:id/activate | ✓ | ✗ (403) | ✗ |

**Critérios de Aceite:**
- [ ] GET /api/academic-cycles retorna lista ordenada por data
- [ ] GET /api/academic-cycles/active retorna o ciclo ativo (404 se nenhum)
- [ ] POST cria ciclo com is_active = false por padrão
- [ ] Não pode criar ciclo com nome duplicado (erro)
- [ ] Não pode criar com start_date >= end_date (erro)
- [ ] Não pode criar com exclusive_admin_end_date > start_date (erro)
- [ ] PUT /activate desativa todos os outros e ativa o solicitado
- [ ] Não pode ativar ciclo já ativo (erro claro)
- [ ] PROFESSOR não consegue criar/editar/ativar (403)
- [ ] Testado no Postman:
  - [ ] Criar ciclo
  - [ ] Ativar ciclo
  - [ ] Tentar criar com datas inválidas (deve falhar)
  - [ ] Tentar ativar ciclo já ativo (deve falhar)

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F1-BE-04

---

### [F3-BE-02] CRUD de Feriados

**Descrição:**  
Cadastrar feriados vinculados a um ciclo acadêmico. Dias marcados como feriado não podem receber reservas.

**Entregáveis:**

**1. HolidayRepository.js:**
- [ ] `findByCycle(cycleId)` → SELECT * FROM holidays WHERE academic_cycle_id = ? ORDER BY date ASC
- [ ] `findById(id)` → SELECT * FROM holidays WHERE id = ?
- [ ] `findByDateAndCycle(date, cycleId)` → SELECT * FROM holidays WHERE date = ? AND academic_cycle_id = ?
- [ ] `create(data)` → INSERT (academic_cycle_id, date, description)
- [ ] `delete(id)` → DELETE FROM holidays WHERE id = ?

**2. HolidayService.js:**
- [ ] `listHolidays(cycleId)` → lista feriados de um ciclo
  ```javascript
  async listHolidays(cycleId) {
    // Se cycleId não informado, usa o ciclo ativo
    const resolvedId = cycleId || (await AcademicCycleRepository.findActive())?.id;
    if (!resolvedId) throw new Error('Nenhum ciclo encontrado');
    return await HolidayRepository.findByCycle(resolvedId);
  }
  ```

- [ ] `createHoliday(dto)` → cria feriado
  **Lógica de Negócio:**
  1. [ ] Validar `date` obrigatório (formato YYYY-MM-DD)
  2. [ ] Validar `academic_cycle_id` obrigatório
  3. [ ] Verificar que o ciclo existe:
     - Se não existir: erro "Ciclo acadêmico não encontrado"
  4. [ ] Validar que date está dentro do range do ciclo:
     - Se fora: erro "A data não pertence ao período do ciclo acadêmico"
  5. [ ] Verificar duplicidade de feriado na mesma data/ciclo:
     - Se existir: erro "Já existe um feriado cadastrado nesta data para este ciclo"
  6. [ ] `description` opcional (ex: "Carnaval", "Feriado Municipal")
  7. [ ] Inserir e retornar feriado criado

- [ ] `deleteHoliday(id)` → remove feriado
  **Lógica de Negócio:**
  1. [ ] Feriado existe
  2. [ ] Verificar que a data do feriado é >= HOJE:
     - Se já passou: erro "Não é possível remover um feriado de data passada"
  3. [ ] Deletar e retornar sucesso

- [ ] `isHoliday(date, cycleId)` → utility para verificar se uma data é feriado
  ```javascript
  async isHoliday(date, cycleId) {
    const holiday = await HolidayRepository.findByDateAndCycle(date, cycleId);
    return !!holiday;
  }
  ```

**3. HolidayController.js:**
- [ ] `index(req, res)` → GET /api/holidays
  - Query param: `?cycle_id=123` (opcional, usa ativo se omitido)
  ```javascript
  async index(req, res) {
    try {
      const { cycle_id } = req.query;
      const holidays = await HolidayService.listHolidays(cycle_id);
      res.json(holidays);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ```

- [ ] `create(req, res)` → POST /api/holidays
  **Body esperado:**
  ```json
  {
    "academic_cycle_id": 1,
    "date": "2026-03-03",
    "description": "Carnaval"
  }
  ```

- [ ] `destroy(req, res)` → DELETE /api/holidays/:id
  ```javascript
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await HolidayService.deleteHoliday(id);
      res.json({ message: 'Feriado removido com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  ```

**4. routes/holiday.routes.js:**
```javascript
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

// Público (autenticado) — professor precisa saber os feriados ao criar reserva
router.get('/', verifyToken, HolidayController.index);

// ADMIN only
router.post('/', verifyToken, authorize(['ADMIN']), HolidayController.create);
router.delete('/:id', verifyToken, authorize(['ADMIN']), HolidayController.destroy);
```

**Matriz de Permissões:**

| Endpoint | ADMIN | PROFESSOR | Sem Auth |
|----------|-------|-----------|----------|
| GET /holidays | ✓ | ✓ | ✗ (401) |
| POST /holidays | ✓ | ✗ (403) | ✗ |
| DELETE /holidays/:id | ✓ | ✗ (403) | ✗ |

**Critérios de Aceite:**
- [ ] GET /api/holidays retorna feriados do ciclo ativo (sem query param)
- [ ] GET /api/holidays?cycle_id=1 retorna feriados de ciclo específico
- [ ] POST cria feriado vinculado ao ciclo
- [ ] Não pode criar feriado em data fora do range do ciclo (erro)
- [ ] Não pode duplicar feriado na mesma data+ciclo (erro)
- [ ] DELETE remove feriado de data futura
- [ ] DELETE em feriado de data passada retorna erro
- [ ] PROFESSOR não consegue criar/deletar (403)
- [ ] Testado no Postman:
  - [ ] Listar feriados do ciclo ativo
  - [ ] Criar feriado com data válida
  - [ ] Criar feriado em data fora do ciclo (deve falhar)
  - [ ] Deletar feriado futuro
  - [ ] Tentar deletar feriado passado (deve falhar)

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F3-BE-01

---

## 🔹 Frontend

### [F3-FE-01] Tela de Gestão de Ciclos Acadêmicos

**Descrição:**  
Interface para ADMIN criar, visualizar e ativar ciclos letivos.

**Entregáveis:**
- [ ] `src/pages/admin/AcademicCyclesPage.jsx`
- [ ] `src/components/admin/AcademicCycleFormModal.jsx`
- [ ] `src/services/academicCycle.service.js`

**Componentes:**

**1. Lista de Ciclos:**
- [ ] DataGrid com colunas:
  - Nome (ex: 2026-1)
  - Data Início
  - Data Fim
  - Fim Período Exclusivo Admin
  - Status (chip: **Ativo** verde / **Inativo** cinza)
  - Ações (Editar, Ativar)

**2. Estado do Componente:**
```javascript
const [cycles, setCycles] = useState([]);
const [loading, setLoading] = useState(true);
const [openModal, setOpenModal] = useState(false);
const [editingCycle, setEditingCycle] = useState(null); // null = criação
```

**3. Botão "Novo Ciclo":**
- [ ] Botão no topo da página (ícone +)
- [ ] Ao clicar: abre modal de criação

**4. Modal de Criação/Edição:**
- [ ] Título dinâmico: "Novo Ciclo Acadêmico" ou "Editar [Nome]"
- [ ] Formulário MUI com campos:
  - [ ] TextField: Nome do ciclo (ex: "2026-1") — obrigatório
  - [ ] DatePicker: Data de Início — obrigatório
  - [ ] DatePicker: Data de Fim — obrigatório
  - [ ] DatePicker: Fim do período exclusivo ADMIN — obrigatório
  - [ ] Tooltip de ajuda no campo exclusivo admin: "Após esta data, professores também podem fazer reservas"
- [ ] Botões: [Cancelar] [Salvar]

**5. Validações do Formulário:**
```javascript
const validateForm = () => {
  const errors = {};
  if (!formData.name) errors.name = 'Nome é obrigatório';
  if (!formData.start_date) errors.start_date = 'Data de início é obrigatória';
  if (!formData.end_date) errors.end_date = 'Data de fim é obrigatória';
  if (!formData.exclusive_admin_end_date)
    errors.exclusive_admin_end_date = 'Período exclusivo é obrigatório';

  if (formData.start_date && formData.end_date) {
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      errors.end_date = 'Data de fim deve ser posterior ao início';
    }
  }
  if (formData.exclusive_admin_end_date && formData.start_date) {
    if (new Date(formData.exclusive_admin_end_date) > new Date(formData.start_date)) {
      errors.exclusive_admin_end_date =
        'Período exclusivo deve terminar antes ou na data de início';
    }
  }
  return errors;
};
```

**6. Ação: Ativar Ciclo**
- [ ] Botão "Ativar" (ícone play) — visível apenas em ciclos inativos
- [ ] Modal de confirmação:
  ```
  "Ativar ciclo [Nome]?"
  "O ciclo ativo atual será desativado automaticamente."
  [Cancelar] [Confirmar]
  ```
- [ ] Ao confirmar:
  ```javascript
  async function handleActivate(cycleId) {
    try {
      await academicCycleService.activate(cycleId);
      showSuccess('Ciclo ativado com sucesso!');
      // Atualizar lista: desativar todos e ativar o selecionado
      setCycles(cycles.map(c => ({
        ...c,
        is_active: c.id === cycleId
      })));
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao ativar ciclo');
    }
  }
  ```

**7. Estado Vazio:**
- [ ] Se `cycles.length === 0`: exibir mensagem:
  ```
  "Nenhum ciclo acadêmico cadastrado. Crie o primeiro!"
  ```

**src/services/academicCycle.service.js:**
```javascript
import api from './api';

export const academicCycleService = {
  async getAll() {
    const response = await api.get('/academic-cycles');
    return response.data;
  },

  async getActive() {
    const response = await api.get('/academic-cycles/active');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/academic-cycles', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/academic-cycles/${id}`, data);
    return response.data;
  },

  async activate(id) {
    const response = await api.put(`/academic-cycles/${id}/activate`);
    return response.data;
  }
};
```

**Critérios de Aceite:**
- [ ] DataGrid carrega ciclos ao montar
- [ ] Chip colorido diferencia ciclo ativo dos demais
- [ ] Criar novo ciclo → aparece na lista como inativo
- [ ] Não pode criar com nome duplicado (erro via toast)
- [ ] Não pode criar com datas inválidas (validação frontend + backend)
- [ ] Ativar ciclo → chip do antigo vira cinza, novo vira verde
- [ ] Confirmação antes de ativar
- [ ] Apenas ADMIN acessa (router protect)
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F3-BE-01

---

### [F3-FE-02] Tela de Cadastro de Feriados

**Descrição:**  
Interface para ADMIN adicionar e remover feriados vinculados ao ciclo ativo.

**Entregáveis:**
- [ ] `src/pages/admin/HolidaysPage.jsx`
- [ ] `src/services/holiday.service.js`

**Componentes:**

**1. Header da Página:**
- [ ] Exibir nome do ciclo ativo no topo: "Feriados — Ciclo 2026-1"
- [ ] Se nenhum ciclo ativo: banner de alerta
  ```
  "⚠️ Nenhum ciclo acadêmico ativo. Ative um ciclo antes de cadastrar feriados."
  ```

**2. Lista de Feriados:**
- [ ] DataGrid com colunas:
  - Data (formatada: ex. "03/03/2026")
  - Dia da Semana (ex. "Terça-feira") — calculado no frontend
  - Descrição (ex. "Carnaval")
  - Ações (Deletar)
- [ ] Ordenado por data

**3. Estado do Componente:**
```javascript
const [holidays, setHolidays] = useState([]);
const [activeCycle, setActiveCycle] = useState(null);
const [loading, setLoading] = useState(true);
const [newDate, setNewDate] = useState(null);
const [newDescription, setNewDescription] = useState('');
```

**4. Formulário Inline de Adição:**
- [ ] DatePicker: Selecionar data
- [ ] TextField: Descrição (opcional, ex: "Tiradentes")
- [ ] Botão "+ Adicionar Feriado"
- [ ] Ao adicionar:
  ```javascript
  async function handleAdd() {
    if (!newDate) return showError('Selecione uma data');
    try {
      const holiday = await holidayService.create({
        academic_cycle_id: activeCycle.id,
        date: newDate,
        description: newDescription
      });
      setHolidays([...holidays, holiday].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
      ));
      setNewDate(null);
      setNewDescription('');
      showSuccess('Feriado adicionado!');
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao adicionar feriado');
    }
  }
  ```

**5. Ação: Deletar Feriado**
- [ ] Botão "Deletar" (ícone lixeira)
- [ ] Sem modal de confirmação (ação rápida)
- [ ] Ao deletar:
  ```javascript
  async function handleDelete(id) {
    try {
      await holidayService.delete(id);
      setHolidays(holidays.filter(h => h.id !== id));
      showSuccess('Feriado removido');
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao remover feriado');
    }
  }
  ```

**6. Estado Vazio:**
- [ ] Se `holidays.length === 0`: "Nenhum feriado cadastrado para este ciclo."

**src/services/holiday.service.js:**
```javascript
import api from './api';

export const holidayService = {
  async getByCycle(cycleId) {
    const params = cycleId ? `?cycle_id=${cycleId}` : '';
    const response = await api.get(`/holidays${params}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/holidays', data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/holidays/${id}`);
    return response.data;
  }
};
```

**Critérios de Aceite:**
- [ ] Página exibe o nome do ciclo ativo no header
- [ ] Banner de alerta se nenhum ciclo ativo
- [ ] Lista carrega feriados do ciclo ativo ao montar
- [ ] Adicionar feriado com data e descrição → aparece na lista ordenada
- [ ] Não pode adicionar feriado em data fora do ciclo (erro backend → toast)
- [ ] Não pode adicionar feriado duplicado (erro backend → toast)
- [ ] Deletar feriado → some da lista
- [ ] Apenas ADMIN acessa
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F3-BE-02, F3-FE-01

---

## 🔹 Teste Final de Fase

### [F3-INT-01] Teste de Integração da FASE 3

**Descrição:**  
Validar que ciclos e feriados funcionam end-to-end e estão prontos para suportar a lógica de reservas da Fase 4.

**Checklist de Testes:**

**Cenário 1: Criação e Ativação de Ciclo**
- [ ] 1. ADMIN cria ciclo "2026-1" com datas válidas
- [ ] 2. Ciclo aparece na lista com status Inativo
- [ ] 3. ADMIN ativa o ciclo "2026-1"
- [ ] 4. Ciclo exibe chip "Ativo"
- [ ] 5. GET /api/academic-cycles/active retorna "2026-1"
- [ ] 6. ADMIN cria segundo ciclo "2026-2"
- [ ] 7. ADMIN ativa "2026-2"
- [ ] 8. "2026-1" passa a ficar Inativo, "2026-2" fica Ativo
- [ ] 9. Tentar ativar "2026-2" novamente → erro claro
- [ ] 10. PROFESSOR tenta criar ciclo → 403

**Cenário 2: Validações de Ciclo**
- [ ] 1. Criar ciclo com nome duplicado → erro "Já existe um ciclo com este nome"
- [ ] 2. Criar ciclo com start_date >= end_date → erro
- [ ] 3. Criar ciclo com exclusive_admin_end_date > start_date → erro
- [ ] 4. Tentar editar ciclo ativo → erro "Não é possível editar um ciclo ativo"

**Cenário 3: Gestão de Feriados**
- [ ] 1. Com ciclo "2026-1" ativo, ADMIN acessa tela de feriados
- [ ] 2. Header exibe "Feriados — Ciclo 2026-1"
- [ ] 3. ADMIN adiciona feriado "03/03/2026 - Carnaval"
- [ ] 4. Feriado aparece na lista
- [ ] 5. Tentar adicionar outro feriado em "03/03/2026" → erro "Já existe um feriado nesta data"
- [ ] 6. Tentar adicionar feriado em data fora do range do ciclo → erro
- [ ] 7. ADMIN remove o feriado de Carnaval → some da lista
- [ ] 8. PROFESSOR tenta POST /holidays → 403

**Cenário 4: Proteção de Rotas**
- [ ] 1. GET /api/academic-cycles sem token → 401
- [ ] 2. GET /api/academic-cycles/active com token PROFESSOR → 200
- [ ] 3. POST /api/academic-cycles com token PROFESSOR → 403
- [ ] 4. POST /api/holidays com token PROFESSOR → 403
- [ ] 5. GET /api/holidays com token PROFESSOR → 200

**Critérios de Aceite:**
- [ ] Todos os 4 cenários passam sem bugs
- [ ] Nenhum console.error no frontend
- [ ] Nenhum erro 500 no backend
- [ ] GET /api/academic-cycles/active retorna dados corretos
- [ ] Pronto para avançar para FASE 4

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F3-* concluídas

---


# 🔵 FASE 4 – Reservas Simples (Core Básico)

**Requisitos:** RF10, RF14, RNF04, RNF05  
**Status Geral:** 🔴 PENDENTE  
**Meta:** Professores podem reservar um laboratório para um dia e horário específico

---

## 🔹 Backend

### [F4-BE-01] Lógica de Detecção de Conflitos

**Descrição:**  
Verificar se um laboratório já está ocupado no horário solicitado antes de criar a reserva. É o coração do sistema — deve ser preciso e eficiente.

**Entregáveis:**

**1. ReservationRepository.js (métodos de conflito):**
- [ ] `findConflicting(labId, date, timeSlotIds)` → detecta conflito
  ```javascript
  async findConflicting(labId, date, timeSlotIds) {
    // Busca reservation_items onde:
    // - lab_id = labId
    // - date = date
    // - time_slot_id IN (timeSlotIds)
    // - status = 'ACTIVE'
    // JOIN reservations para garantir que a reserva pai também está ACTIVE
    const query = `
      SELECT ri.*, r.id as reservation_id, r.professor_id
      FROM reservation_items ri
      INNER JOIN reservations r ON r.id = ri.reservation_id
      WHERE ri.lab_id = ?
        AND ri.date = ?
        AND ri.time_slot_id IN (?)
        AND ri.status = 'ACTIVE'
        AND r.status IN ('APPROVED', 'PENDING')
    `;
    return await db.query(query, [labId, date, timeSlotIds]);
  }
  ```

- [ ] `findByProfessorAndDateRange(professorId, startDate, endDate)` → reservas do professor
  ```javascript
  async findByProfessorAndDateRange(professorId, startDate, endDate) {
    const query = `
      SELECT r.*, ri.date, ri.time_slot_id, ri.lab_id, ri.status as item_status
      FROM reservations r
      INNER JOIN reservation_items ri ON ri.reservation_id = r.id
      WHERE r.professor_id = ?
        AND ri.date BETWEEN ? AND ?
      ORDER BY ri.date ASC, ri.time_slot_id ASC
    `;
    return await db.query(query, [professorId, startDate, endDate]);
  }
  ```

**2. ConflictService.js (novo arquivo):**
- [ ] `checkConflict(labId, date, timeSlotIds)` → retorna detalhes do conflito
  ```javascript
  async checkConflict(labId, date, timeSlotIds) {
    const conflicts = await ReservationRepository.findConflicting(
      labId, date, timeSlotIds
    );
    
    if (conflicts.length === 0) {
      return { hasConflict: false, conflicts: [] };
    }
    
    // Retorna quais time_slots têm conflito (para exibir no frontend)
    const conflictingSlots = conflicts.map(c => c.time_slot_id);
    return {
      hasConflict: true,
      conflicts: conflicts,
      conflictingSlots,
      message: `Conflito detectado para ${conflicts.length} horário(s) solicitado(s)`
    };
  }
  ```

**3. Endpoint de verificação prévia (opcional mas recomendado):**
- [ ] GET `/api/reservations/check-conflict?lab_id=1&date=2026-03-10&time_slots=1,2,3`
  - Permite o frontend verificar disponibilidade antes de submeter o formulário
  - Retorna `{ hasConflict: boolean, conflictingSlots: number[] }`

**Critérios de Aceite:**
- [ ] `findConflicting` retorna apenas reservas ACTIVE na data+lab+timeslots solicitados
- [ ] Não retorna reservas CANCELLED ou REJECTED como conflito
- [ ] GET /check-conflict responde em tempo real (< 200ms) (RNF05)
- [ ] Testado no Postman:
  - [ ] Verificar lab livre → `{ hasConflict: false }`
  - [ ] Verificar lab ocupado → `{ hasConflict: true, conflictingSlots: [...] }`

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F2-BE-02, F3-BE-01

---

### [F4-BE-02] Criação de Reserva Simples

**Descrição:**  
Endpoint para criar uma reserva de 1 dia com todos os validadores de negócio encadeados.

**Entregáveis:**

**1. ReservationRepository.js (adicionar métodos):**
- [ ] `create(data)` → INSERT na tabela `reservations`
  ```javascript
  // data = { professor_id, academic_cycle_id, type: 'SIMPLE', status, notes }
  async create(data) {
    const result = await db.query(
      'INSERT INTO reservations SET ?', [data]
    );
    return { id: result.insertId, ...data };
  }
  ```

- [ ] `createItem(data)` → INSERT na tabela `reservation_items`
  ```javascript
  // data = { reservation_id, lab_id, date, time_slot_id, status: 'ACTIVE' }
  async createItem(data) {
    const result = await db.query(
      'INSERT INTO reservation_items SET ?', [data]
    );
    return { id: result.insertId, ...data };
  }
  ```

- [ ] `findById(id)` → SELECT reserva com seus items
  ```javascript
  async findById(id) {
    const [reservation] = await db.query(
      'SELECT * FROM reservations WHERE id = ?', [id]
    );
    if (!reservation) return null;
    reservation.items = await db.query(
      'SELECT * FROM reservation_items WHERE reservation_id = ?', [id]
    );
    return reservation;
  }
  ```

- [ ] `findByProfessor(professorId)` → SELECT todas as reservas de um professor com items

**2. ReservationService.js:**
- [ ] `createSimpleReservation(dto, requestingUser)` → cria reserva simples
  **Lógica de Negócio (em ordem):**
  1. [ ] Validar campos obrigatórios:
     - `lab_id`, `date`, `time_slot_ids` (array, mínimo 1)
  2. [ ] Buscar ciclo ativo:
     - Se nenhum ativo: erro "Nenhum ciclo acadêmico ativo. Não é possível criar reservas."
  3. [ ] Validar que `date` está dentro do ciclo ativo (RF05):
     - Se fora: erro "A data não pertence ao ciclo acadêmico ativo"
  4. [ ] Verificar se `date` é feriado (RF07 / RN03):
     - Se feriado: erro "Não é possível reservar em feriados"
  5. [ ] Verificar período exclusivo ADMIN (RF19):
     ```javascript
     const today = new Date();
     const exclusiveEnd = new Date(activeCycle.exclusive_admin_end_date);
     if (today <= exclusiveEnd && requestingUser.role !== 'ADMIN') {
       throw new Error(
         `Reservas abertas para professores apenas após ${
           exclusiveEnd.toLocaleDateString('pt-BR')
         }`
       );
     }
     ```
  6. [ ] Validar que o laboratório existe e está ativo:
     - Se não: erro "Laboratório não encontrado ou inativo"
  7. [ ] Validar que todos os time_slots existem e estão ativos:
     - Se algum não: erro "Horário inválido: [id]"
  8. [ ] Detectar conflito de horário (RF14):
     ```javascript
     const { hasConflict, conflictingSlots } =
       await ConflictService.checkConflict(lab_id, date, time_slot_ids);
     ```
     - Se PROFESSOR e hasConflict: erro "Conflito de horário detectado nos seguintes períodos: [slots]"
     - Se ADMIN e hasConflict: log de aviso mas **não bloqueia**
  9. [ ] Definir status da reserva:
     ```javascript
     const status = requestingUser.role === 'ADMIN'
       ? 'APPROVED'
       : 'APPROVED'; // Reserva simples PROFESSOR = aprovação automática se sem conflito
     ```
  10. [ ] Criar reserva (tabela `reservations`):
      ```javascript
      const reservation = await ReservationRepository.create({
        professor_id: requestingUser.id,
        academic_cycle_id: activeCycle.id,
        type: 'SIMPLE',
        status,
        notes: dto.notes || null
      });
      ```
  11. [ ] Criar os items da reserva (tabela `reservation_items`) — 1 item por time_slot:
      ```javascript
      const items = await Promise.all(
        dto.time_slot_ids.map(tsId =>
          ReservationRepository.createItem({
            reservation_id: reservation.id,
            lab_id: dto.lab_id,
            date: dto.date,
            time_slot_id: tsId,
            status: 'ACTIVE'
          })
        )
      );
      ```
  12. [ ] Registrar em audit_logs
  13. [ ] Retornar reserva completa com items

- [ ] `getMyReservations(professorId)` → lista reservas do professor
  ```javascript
  async getMyReservations(professorId) {
    return await ReservationRepository.findByProfessor(professorId);
  }
  ```

**3. ReservationController.js:**
- [ ] `create(req, res)` → POST /api/reservations
  **Body esperado:**
  ```json
  {
    "lab_id": 2,
    "date": "2026-03-10",
    "time_slot_ids": [1, 2],
    "notes": "Aula de Banco de Dados — opcional"
  }
  ```

- [ ] `myReservations(req, res)` → GET /api/reservations/my
  ```javascript
  async myReservations(req, res) {
    try {
      const professorId = req.user.id;
      const reservations = await ReservationService.getMyReservations(professorId);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ```

**4. routes/reservation.routes.js:**
```javascript
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

// Verificação prévia (sem autenticação especial)
router.get('/check-conflict', verifyToken, ReservationController.checkConflict);

// Reservas próprias (qualquer role autenticado)
router.get('/my', verifyToken, ReservationController.myReservations);

// Criar reserva (qualquer role autenticado)
router.post('/', verifyToken, ReservationController.create);
```

**Regras de Negócio Resumidas:**

| Situação | PROFESSOR | ADMIN |
|----------|-----------|-------|
| Sem conflito | APPROVED ✅ | APPROVED ✅ |
| Com conflito | ✗ ERRO | APPROVED ✅ (com log) |
| Período exclusivo admin | ✗ ERRO | APPROVED ✅ |
| Feriado | ✗ ERRO | ✗ ERRO |
| Data fora do ciclo | ✗ ERRO | ✗ ERRO |

**Critérios de Aceite:**
- [ ] POST /api/reservations cria reserva + items na transação
- [ ] Professor não pode reservar em feriado (erro claro)
- [ ] Professor não pode reservar fora do ciclo ativo (erro claro)
- [ ] Professor não pode reservar no período exclusivo ADMIN (erro com data)
- [ ] Professor não pode reservar lab com conflito (erro com slots conflitantes)
- [ ] ADMIN pode criar reserva com conflito (aprovação forçada)
- [ ] Reserva criada com sucesso retorna objeto completo com items
- [ ] Testado no Postman:
  - [ ] Criar reserva em lab/data/horário livre → 201
  - [ ] Criar reserva em mesmo lab/data/horário → conflito → erro
  - [ ] Criar reserva em feriado → erro
  - [ ] Criar reserva fora do ciclo → erro
  - [ ] ADMIN cria reserva sobre conflito existente → 201

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F4-BE-01

---

## 🔹 Frontend

### [F4-FE-01] Formulário de Criação de Reserva Simples

**Descrição:**  
Interface para professores solicitarem reserva de laboratório para um dia específico, com detecção visual de conflitos em tempo real.

**Entregáveis:**
- [ ] `src/pages/professor/CreateReservationPage.jsx`
- [ ] `src/services/reservation.service.js`

**Componentes:**

**1. Estado do Componente:**
```javascript
const [labs, setLabs] = useState([]);
const [timeSlots, setTimeSlots] = useState([]);
const [activeCycle, setActiveCycle] = useState(null);
const [holidays, setHolidays] = useState([]);

const [formData, setFormData] = useState({
  lab_id: '',
  date: null,
  time_slot_ids: [],
  notes: ''
});

const [conflictInfo, setConflictInfo] = useState(null); // { hasConflict, conflictingSlots }
const [checkingConflict, setCheckingConflict] = useState(false);
const [submitting, setSubmitting] = useState(false);
```

**2. Carregar Dados Iniciais:**
```javascript
useEffect(() => {
  async function loadInitialData() {
    const [labsData, slotsData, cycleData, holidaysData] = await Promise.all([
      laboratoryService.getAll(),
      timeSlotService.getAll(),
      academicCycleService.getActive(),
      holidayService.getByCycle() // ciclo ativo
    ]);
    setLabs(labsData);
    setTimeSlots(slotsData);
    setActiveCycle(cycleData);
    setHolidays(holidaysData.map(h => h.date)); // array de datas string
  }
  loadInitialData();
}, []);
```

**3. Campos do Formulário:**
- [ ] **Select: Laboratório**
  - Opções: todos os labs ativos
  - Obrigatório

- [ ] **DatePicker: Data**
  - Obrigatório
  - `minDate` = activeCycle.start_date
  - `maxDate` = activeCycle.end_date
  - Datas feriados desabilitadas no picker:
    ```javascript
    shouldDisableDate={(date) =>
      holidays.includes(dayjs(date).format('YYYY-MM-DD')) ||
      dayjs(date).day() === 0 // Opcional: desabilitar domingos
    }
    ```

- [ ] **Checkboxes: Horários (Time Slots)**
  - Grid de checkboxes (2 colunas): M1, M2, M3... N1, N2...
  - Cada checkbox mostra: nome + horário (ex: "M1 — 07:30 às 08:20")
  - Checkbox com conflito exibe ícone de alerta ⚠️ e cor laranja

- [ ] **TextField: Observações** (multiline, opcional)

**4. Verificação de Conflito em Tempo Real (RNF05):**
```javascript
// Dispara toda vez que lab, data ou time_slots mudam
useEffect(() => {
  async function verifyConflict() {
    if (!formData.lab_id || !formData.date || formData.time_slot_ids.length === 0) {
      setConflictInfo(null);
      return;
    }
    
    setCheckingConflict(true);
    try {
      const result = await reservationService.checkConflict({
        lab_id: formData.lab_id,
        date: dayjs(formData.date).format('YYYY-MM-DD'),
        time_slot_ids: formData.time_slot_ids
      });
      setConflictInfo(result);
    } catch (error) {
      // silencioso — não bloquear o formulário por erro no check
    } finally {
      setCheckingConflict(false);
    }
  }
  
  const debounce = setTimeout(verifyConflict, 500);
  return () => clearTimeout(debounce);
}, [formData.lab_id, formData.date, formData.time_slot_ids]);
```

**5. Banner de Alerta de Conflito:**
```javascript
{conflictInfo?.hasConflict && (
  <Alert severity="warning" sx={{ my: 2 }}>
    ⚠️ Conflito detectado nos horários:{' '}
    {conflictInfo.conflictingSlots
      .map(id => timeSlots.find(ts => ts.id === id)?.name)
      .join(', ')}
    . Esses horários já estão reservados.
  </Alert>
)}

{checkingConflict && (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <CircularProgress size={16} />
    <Typography variant="caption">Verificando disponibilidade...</Typography>
  </Box>
)}
```

**6. Submit do Formulário:**
```javascript
async function handleSubmit() {
  // Validação frontend
  if (!formData.lab_id) return showError('Selecione um laboratório');
  if (!formData.date) return showError('Selecione uma data');
  if (formData.time_slot_ids.length === 0)
    return showError('Selecione ao menos um horário');
  if (conflictInfo?.hasConflict)
    return showError('Não é possível reservar horários com conflito');
  
  setSubmitting(true);
  try {
    const reservation = await reservationService.create({
      ...formData,
      date: dayjs(formData.date).format('YYYY-MM-DD')
    });
    showSuccess('Reserva criada com sucesso!');
    navigate('/my-reservations');
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao criar reserva');
  } finally {
    setSubmitting(false);
  }
}
```

**src/services/reservation.service.js:**
```javascript
import api from './api';

export const reservationService = {
  async create(data) {
    const response = await api.post('/reservations', data);
    return response.data;
  },

  async getMyReservations() {
    const response = await api.get('/reservations/my');
    return response.data;
  },

  async checkConflict({ lab_id, date, time_slot_ids }) {
    const params = new URLSearchParams({
      lab_id,
      date,
      time_slots: time_slot_ids.join(',')
    });
    const response = await api.get(`/reservations/check-conflict?${params}`);
    return response.data;
  }
};
```

**Critérios de Aceite:**
- [ ] DatePicker bloqueia datas fora do ciclo ativo
- [ ] DatePicker mostra feriados desabilitados
- [ ] Ao selecionar lab + data + horários, verificação de conflito é disparada
- [ ] Banner de conflito aparece em < 1s após seleção (RNF05)
- [ ] Checkboxes com conflito ficam visuais em laranja/alerta
- [ ] Botão "Criar Reserva" fica desabilitado se conflito detectado
- [ ] Submit com dados válidos → redireciona para "Minhas Reservas"
- [ ] Erros do backend exibidos em toast
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F4-BE-02, F3-FE-01

---

### [F4-FE-02] Visualização de Minhas Reservas

**Descrição:**  
Professor vê lista de todas as suas reservas com status e detalhes do laboratório.

**Entregáveis:**
- [ ] `src/pages/professor/MyReservationsPage.jsx`

**Componentes:**

**1. Estado do Componente:**
```javascript
const [reservations, setReservations] = useState([]);
const [loading, setLoading] = useState(true);
const [filterStatus, setFilterStatus] = useState('ALL');
```

**2. Carregar Reservas:**
```javascript
useEffect(() => {
  async function loadReservations() {
    try {
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      showError('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  }
  loadReservations();
}, []);
```

**3. DataGrid de Reservas:**
- [ ] Colunas:
  - Laboratório
  - Data (formatada: DD/MM/YYYY)
  - Horários (ex: "M1, M2")
  - Status (chip colorido)
    - APPROVED → verde
    - PENDING → amarelo
    - CANCELLED → vermelho
    - REJECTED → cinza
  - Data da Solicitação
  - Observações

**4. Filtro por Status:**
```javascript
const filteredReservations = filterStatus === 'ALL'
  ? reservations
  : reservations.filter(r => r.status === filterStatus);
```
- [ ] Select no topo: Todos | Aprovadas | Pendentes | Canceladas | Rejeitadas

**5. Botão "Nova Reserva":**
- [ ] Botão no topo: navega para `/create-reservation`

**6. Estado Vazio:**
- [ ] Se `reservations.length === 0`:
  ```
  "Você ainda não tem reservas."
  [+ Criar primeira reserva]
  ```

**Critérios de Aceite:**
- [ ] DataGrid carrega reservas do professor logado
- [ ] Status com chip colorido correto
- [ ] Filtro por status funciona
- [ ] Botão "Nova Reserva" navega corretamente
- [ ] Estado vazio com call-to-action
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F4-BE-02, F4-FE-01

---

## 🔹 Teste Final de Fase

### [F4-INT-01] Teste de Integração da FASE 4

**Descrição:**  
Validar o fluxo completo de criação de reservas com todos os validadores de negócio ativos e a lógica de conflito funcionando end-to-end.

**Checklist de Testes:**

**Cenário 1: Reserva Bem-Sucedida (Professor)**
- [ ] 1. Garantir ciclo ativo com start_date no passado e exclusive_admin_end_date também no passado
- [ ] 2. Professor faz login
- [ ] 3. Acessa "Criar Reserva"
- [ ] 4. Seleciona Lab 01, data válida dentro do ciclo, horários M1 e M2
- [ ] 5. Banner de disponível aparece (sem conflito)
- [ ] 6. Clica em "Criar Reserva"
- [ ] 7. Redirecionado para "Minhas Reservas"
- [ ] 8. Reserva aparece com status "APROVADA"

**Cenário 2: Detecção de Conflito**
- [ ] 1. Com a reserva do Cenário 1 existente (Lab 01, mesma data, M1 e M2)
- [ ] 2. Outro professor tenta reservar Lab 01, mesma data, M1
- [ ] 3. Banner de conflito aparece imediatamente ao selecionar M1
- [ ] 4. Checkbox M1 exibe ícone de alerta visual
- [ ] 5. Botão "Criar Reserva" fica desabilitado
- [ ] 6. Tentativa via API direta (Postman) também retorna erro 400 com mensagem

**Cenário 3: Validações de Negócio**
- [ ] 1. Professor tenta reservar em feriado cadastrado → erro "Não é possível reservar em feriados"
- [ ] 2. Professor tenta reservar em data fora do ciclo ativo → erro
- [ ] 3. DatePicker bloqueia visualmente as datas fora do ciclo e feriados
- [ ] 4. Professor tenta reservar durante período exclusivo ADMIN → erro com data de abertura
- [ ] 5. Professor submete sem selecionar horário → validação frontend bloqueia

**Cenário 4: Reserva de ADMIN (com conflito)**
- [ ] 1. Lab 01 já tem reserva em M1 no dia X (do Cenário 1)
- [ ] 2. ADMIN loga e cria reserva no mesmo Lab 01, dia X, horário M1
- [ ] 3. Reserva é criada com status APPROVED (sem bloquear por conflito)
- [ ] 4. Ambas as reservas existem na base (log de conflito registrado)

**Cenário 5: Visualização de Minhas Reservas**
- [ ] 1. Professor loga e acessa "Minhas Reservas"
- [ ] 2. Todas as reservas do professor aparecem listadas
- [ ] 3. Filtro "Aprovadas" exibe apenas reservas APPROVED
- [ ] 4. Filtro "Pendentes" não retorna nada (reservas simples aprovam direto)
- [ ] 5. Botão "Nova Reserva" redireciona para o formulário

**Cenário 6: Proteção de Rotas e Dados**
- [ ] 1. GET /api/reservations/my sem token → 401
- [ ] 2. Professor A não consegue ver reservas do Professor B
- [ ] 3. POST /api/reservations com token inválido → 401
- [ ] 4. GET /api/reservations/check-conflict sem token → 401

**Critérios de Aceite:**
- [ ] Todos os 6 cenários passam sem bugs
- [ ] Verificação de conflito responde em < 1s (RNF05)
- [ ] Nenhum console.error no frontend
- [ ] Nenhum erro 500 no backend
- [ ] Base de dados consistente: toda reserva tem ao menos 1 reservation_item
- [ ] Pronto para avançar para FASE 5

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F4-* concluídas

---

# 🟣 FASE 5 – Reservas Recorrentes

**Requisitos:** RF11, RF12, RF13  
**Status Geral:** 🔴 PENDENTE  
**Meta:** Professores solicitam reservas recorrentes (semanas) e ADMINs aprovam, rejeitam ou redirecionam

---

## 🔹 Backend

### [F5-BE-01] Criação de Reserva Recorrente

**Descrição:**  
Permitir reservas em múltiplas datas de uma vez, com dias da semana selecionados dentro de um intervalo. Professor entra com status PENDING; ADMIN entra direto como APPROVED. Se qualquer data tiver conflito, toda a operação é revertida (rollback).

**Entregáveis:**

**1. RecurrenceHelper.js (utilitário novo):**
- [ ] `generateDates(startDate, endDate, weekdays, holidays, cycleStart, cycleEnd)` → gera array de datas válidas
  ```javascript
  /**
   * weekdays: array de números 0-6 (0=domingo, 1=segunda... 6=sábado)
   * Retorna apenas datas que:
   *   - estão dentro do range startDate..endDate
   *   - estão dentro do ciclo ativo
   *   - não são feriados
   *   - correspondem aos dias da semana selecionados
   */
  function generateDates(startDate, endDate, weekdays, holidays, cycleStart, cycleEnd) {
    const dates = [];
    const holidaySet = new Set(holidays); // set para O(1) lookup
    
    let current = new Date(startDate);
    const end = new Date(endDate);
    const cycleS = new Date(cycleStart);
    const cycleE = new Date(cycleEnd);
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const dayOfWeek = current.getDay();
      
      if (
        current >= cycleS &&
        current <= cycleE &&
        weekdays.includes(dayOfWeek) &&
        !holidaySet.has(dateStr)
      ) {
        dates.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }
    return dates; // ex: ['2026-03-02', '2026-03-09', '2026-03-16', ...]
  }
  ```

**2. ReservationRepository.js (adicionar métodos):**
- [ ] `findConflictingBulk(labId, dates, timeSlotIds)` → detecta conflitos em múltiplas datas
  ```javascript
  async findConflictingBulk(labId, dates, timeSlotIds) {
    // Retorna todos os reservation_items que conflitam
    // em qualquer combinação de (date, time_slot_id) do array
    const query = `
      SELECT ri.date, ri.time_slot_id, r.professor_id
      FROM reservation_items ri
      INNER JOIN reservations r ON r.id = ri.reservation_id
      WHERE ri.lab_id = ?
        AND ri.date IN (?)
        AND ri.time_slot_id IN (?)
        AND ri.status = 'ACTIVE'
        AND r.status IN ('APPROVED', 'PENDING')
    `;
    return await db.query(query, [labId, dates, timeSlotIds]);
  }
  ```

- [ ] `createMany(reservationId, items)` → INSERT em lote de reservation_items
  ```javascript
  async createMany(reservationId, items) {
    // items = [{ lab_id, date, time_slot_id, status }]
    const rows = items.map(i => [reservationId, i.lab_id, i.date, i.time_slot_id, i.status]);
    await db.query(
      'INSERT INTO reservation_items (reservation_id, lab_id, date, time_slot_id, status) VALUES ?',
      [rows]
    );
  }
  ```

**3. ReservationService.js (adicionar método):**
- [ ] `createRecurringReservation(dto, requestingUser)` → cria reserva recorrente
  **Lógica de Negócio (em ordem):**
  1. [ ] Validar campos obrigatórios:
     - `lab_id`, `start_date`, `end_date`, `weekdays` (array, mínimo 1), `time_slot_ids` (array, mínimo 1)
  2. [ ] Validar `start_date < end_date`:
     - Se inválido: erro "Data de início deve ser anterior à data de fim"
  3. [ ] Buscar ciclo ativo:
     - Se nenhum: erro "Nenhum ciclo acadêmico ativo"
  4. [ ] Verificar período exclusivo ADMIN (RF19):
     - Se hoje <= exclusive_admin_end_date e role != ADMIN: erro com data de abertura
  5. [ ] Buscar feriados do ciclo ativo
  6. [ ] Gerar array de datas com `RecurrenceHelper.generateDates`:
     - Se array vazio: erro "Nenhuma data válida encontrada no período selecionado para os dias da semana escolhidos"
  7. [ ] Validar que todas as datas estão dentro do ciclo:
     - (já garantido pelo generateDates, mas logar se alguma for descartada)
  8. [ ] Detectar conflitos em lote (RN05):
     ```javascript
     const conflicts = await ReservationRepository.findConflictingBulk(
       dto.lab_id, generatedDates, dto.time_slot_ids
     );
     if (conflicts.length > 0) {
       // ROLLBACK — não cria nada
       throw new Error(
         `Conflito detectado em ${conflicts.length} ocorrência(s). ` +
         `Primeiras datas conflitantes: ${[...new Set(conflicts.map(c => c.date))].slice(0, 3).join(', ')}`
       );
     }
     ```
  9. [ ] Definir status:
     ```javascript
     const status = requestingUser.role === 'ADMIN' ? 'APPROVED' : 'PENDING';
     ```
  10. [ ] **Iniciar transação** no banco
  11. [ ] Criar reserva pai (tabela `reservations`):
      ```javascript
      const reservation = await ReservationRepository.create({
        professor_id: requestingUser.id,
        academic_cycle_id: activeCycle.id,
        type: 'RECURRING',
        status,
        recurrence_start: dto.start_date,
        recurrence_end: dto.end_date,
        weekdays: JSON.stringify(dto.weekdays),
        notes: dto.notes || null
      });
      ```
  12. [ ] Criar todos os items em lote:
      ```javascript
      const allItems = generatedDates.flatMap(date =>
        dto.time_slot_ids.map(tsId => ({
          lab_id: dto.lab_id,
          date,
          time_slot_id: tsId,
          status: 'ACTIVE'
        }))
      );
      await ReservationRepository.createMany(reservation.id, allItems);
      ```
  13. [ ] **Commit da transação**
  14. [ ] Registrar em audit_logs
  15. [ ] Retornar reserva com total de ocorrências geradas:
      ```javascript
      return {
        ...reservation,
        total_occurrences: generatedDates.length,
        total_items: allItems.length
      };
      ```

**4. ReservationController.js (adaptar):**
- [ ] `create(req, res)` → já existente — adicionar branch para `type`:
  ```javascript
  async create(req, res) {
    try {
      const { type = 'SIMPLE' } = req.body;
      const user = req.user;
      
      let reservation;
      if (type === 'RECURRING') {
        reservation = await ReservationService.createRecurringReservation(req.body, user);
      } else {
        reservation = await ReservationService.createSimpleReservation(req.body, user);
      }
      
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  ```

**Body esperado (recorrente):**
```json
{
  "type": "RECURRING",
  "lab_id": 2,
  "start_date": "2026-03-01",
  "end_date": "2026-06-30",
  "weekdays": [1, 3],
  "time_slot_ids": [1, 2],
  "notes": "Aula de Redes — toda segunda e quarta"
}
```

**Critérios de Aceite:**
- [ ] POST com `type: RECURRING` gera N reservation_items (1 por data×timeslot)
- [ ] Feriados e datas fora do ciclo são ignorados silenciosamente
- [ ] Se QUALQUER data tiver conflito → rollback, nenhum item criado
- [ ] PROFESSOR cria com status PENDING
- [ ] ADMIN cria com status APPROVED
- [ ] Retorno inclui `total_occurrences` geradas
- [ ] Testado no Postman:
  - [ ] Criar recorrente sem conflito → 201 com `total_occurrences`
  - [ ] Criar recorrente com conflito em 1 data → rollback, erro com datas
  - [ ] Verificar que nenhum item foi criado após rollback

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F4-BE-02

---

### [F5-BE-02] Aprovação / Rejeição / Redirecionamento de Reservas

**Descrição:**  
ADMIN gerencia reservas com status PENDING. Pode aprovar, rejeitar com motivo, ou redirecionar para outro laboratório.

**Entregáveis:**

**1. ReservationRepository.js (adicionar métodos):**
- [ ] `updateStatus(id, status, extra = {})` → atualiza status + campos extras
  ```javascript
  async updateStatus(id, status, extra = {}) {
    const fields = { status, ...extra };
    await db.query('UPDATE reservations SET ? WHERE id = ?', [fields, id]);
    return await this.findById(id);
  }
  ```

- [ ] `findPending(filters = {})` → lista reservas PENDING
  ```javascript
  async findPending(filters = {}) {
    let query = `
      SELECT r.*, u.name as professor_name, u.email as professor_email,
             l.name as lab_name
      FROM reservations r
      INNER JOIN users u ON u.id = r.professor_id
      INNER JOIN reservation_items ri ON ri.reservation_id = r.id
      INNER JOIN laboratories l ON l.id = ri.lab_id
      WHERE r.status = 'PENDING'
      GROUP BY r.id
      ORDER BY r.created_at ASC
    `;
    return await db.query(query);
  }
  ```

- [ ] `redirectItems(reservationId, newLabId)` → atualiza lab de todos os items
  ```javascript
  async redirectItems(reservationId, newLabId) {
    await db.query(
      'UPDATE reservation_items SET lab_id = ? WHERE reservation_id = ?',
      [newLabId, reservationId]
    );
  }
  ```

**2. ReservationService.js (adicionar métodos):**
- [ ] `approveReservation(reservationId, adminId)` → aprova reserva
  **Lógica de Negócio:**
  1. [ ] Reserva existe
  2. [ ] Validar status = PENDING:
     - Se != PENDING: erro "Apenas reservas pendentes podem ser aprovadas"
  3. [ ] Verificar novamente se não há conflitos nas datas (re-check no momento da aprovação):
     - Se conflito surgiu desde a criação: erro "Conflito de horário identificado. Rejeite ou redirecione."
  4. [ ] Atualizar:
     ```javascript
     await ReservationRepository.updateStatus(reservationId, 'APPROVED', {
       approved_by: adminId,
       approval_date: new Date()
     });
     ```
  5. [ ] Registrar em audit_logs
  6. [ ] Retornar reserva atualizada

- [ ] `rejectReservation(reservationId, adminId, reason)` → rejeita reserva
  **Lógica de Negócio:**
  1. [ ] Validar `reason` não vazio:
     - Se vazio: erro "Motivo da rejeição é obrigatório"
  2. [ ] Reserva existe e status = PENDING
  3. [ ] Atualizar:
     ```javascript
     await ReservationRepository.updateStatus(reservationId, 'REJECTED', {
       approved_by: adminId,
       approval_date: new Date(),
       rejection_reason: reason
     });
     ```
     - Atualizar também todos os `reservation_items` para status = 'CANCELLED'
  4. [ ] Registrar em audit_logs
  5. [ ] Retornar reserva atualizada

- [ ] `redirectReservation(reservationId, adminId, newLabId, reason)` → redireciona para outro lab
  **Lógica de Negócio:**
  1. [ ] Reserva existe e status = PENDING
  2. [ ] `newLabId` existe e está ativo
  3. [ ] `reason` obrigatório (ex: "Lab original em manutenção")
  4. [ ] Verificar conflito no novo lab para todas as datas da reserva:
     - Se conflito: erro "Novo laboratório também possui conflito nas datas da reserva"
  5. [ ] Atualizar items para o novo lab:
     ```javascript
     await ReservationRepository.redirectItems(reservationId, newLabId);
     ```
  6. [ ] Aprovar a reserva:
     ```javascript
     await ReservationRepository.updateStatus(reservationId, 'APPROVED', {
       approved_by: adminId,
       approval_date: new Date(),
       redirect_reason: reason,
       redirected_lab_id: newLabId
     });
     ```
  7. [ ] Registrar em audit_logs com `oldValues = { lab_id: originalLabId }`
  8. [ ] Retornar reserva atualizada

- [ ] `listPendingReservations()` → lista reservas pendentes com dados relacionados

**3. ReservationController.js (adicionar):**
- [ ] `approve(req, res)` → PUT /api/reservations/:id/approve
- [ ] `reject(req, res)` → PUT /api/reservations/:id/reject
  **Body:** `{ "reason": "Motivo" }`
- [ ] `redirect(req, res)` → PUT /api/reservations/:id/redirect
  **Body:** `{ "new_lab_id": 3, "reason": "Lab original em manutenção" }`
- [ ] `pending(req, res)` → GET /api/reservations/pending (ADMIN only)

**4. routes/reservation.routes.js (adicionar):**
```javascript
// ADMIN only
router.get('/pending', verifyToken, authorize(['ADMIN']), ReservationController.pending);
router.put('/:id/approve', verifyToken, authorize(['ADMIN']), ReservationController.approve);
router.put('/:id/reject', verifyToken, authorize(['ADMIN']), ReservationController.reject);
router.put('/:id/redirect', verifyToken, authorize(['ADMIN']), ReservationController.redirect);
```

**Matriz de Permissões:**

| Endpoint | ADMIN | PROFESSOR | Sem Auth |
|----------|-------|-----------|----------|
| GET /reservations/pending | ✓ | ✗ (403) | ✗ |
| PUT /reservations/:id/approve | ✓ | ✗ (403) | ✗ |
| PUT /reservations/:id/reject | ✓ | ✗ (403) | ✗ |
| PUT /reservations/:id/redirect | ✓ | ✗ (403) | ✗ |

**Critérios de Aceite:**
- [ ] GET /pending retorna apenas reservas com status PENDING
- [ ] Aprovar reserva → status muda para APPROVED, `approved_by` preenchido
- [ ] Não pode aprovar reserva que não é PENDING (erro claro)
- [ ] Rejeitar sem motivo → erro "Motivo obrigatório"
- [ ] Rejeitar com motivo → status REJECTED + items CANCELLED
- [ ] Redirecionar → verifica conflito no novo lab antes de aprovar
- [ ] PROFESSOR não consegue acessar nenhuma rota de aprovação (403)
- [ ] Testado no Postman:
  - [ ] Criar reserva recorrente como professor → PENDING
  - [ ] ADMIN lista pendentes → aparece na lista
  - [ ] ADMIN aprova → status APPROVED
  - [ ] Criar outra reserva recorrente → PENDING
  - [ ] ADMIN rejeita sem motivo → erro
  - [ ] ADMIN rejeita com motivo → REJECTED
  - [ ] Criar terceira recorrente → ADMIN redireciona para outro lab → APPROVED

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F5-BE-01

---

## 🔹 Frontend

### [F5-FE-01] Formulário de Reserva Recorrente

**Descrição:**  
Expandir `CreateReservationPage.jsx` com toggle entre reserva simples e recorrente. Alerta informativo para professores sobre status PENDING.

**Entregáveis:**
- [ ] Atualizar `src/pages/professor/CreateReservationPage.jsx`

**Componentes:**

**1. Toggle Tipo de Reserva:**
```javascript
const [reservationType, setReservationType] = useState('SIMPLE'); // 'SIMPLE' | 'RECURRING'

// Renderizar como ToggleButtonGroup do MUI:
<ToggleButtonGroup
  value={reservationType}
  exclusive
  onChange={(e, val) => val && setReservationType(val)}
>
  <ToggleButton value="SIMPLE">Reserva Simples</ToggleButton>
  <ToggleButton value="RECURRING">Reserva Recorrente</ToggleButton>
</ToggleButtonGroup>
```

**2. Estado Adicional para Recorrência:**
```javascript
const [recurrenceData, setRecurrenceData] = useState({
  start_date: null,
  end_date: null,
  weekdays: []  // [1, 3] = segunda e quarta
});
const [previewDates, setPreviewDates] = useState([]); // datas geradas para preview
```

**3. Campos Exclusivos do Modo Recorrente:**
- [ ] **DateRangePicker (ou dois DatePickers): Início e Fim**
  - `minDate` = activeCycle.start_date
  - `maxDate` = activeCycle.end_date

- [ ] **Checkboxes: Dias da Semana**
  ```javascript
  const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  // Renderizar linha de checkboxes compacta
  ```
  - Sábado e Domingo desabilitados por padrão (institucional)
  - Ao menos 1 dia obrigatório

- [ ] **Preview de Datas Geradas:**
  - Ao preencher range + dias da semana: calcular preview no frontend
  - Exibir: "Serão geradas **12 ocorrências** (ex: 02/03, 09/03, 16/03...)"
  - Chips clicáveis com as primeiras 5 datas + "e mais N..."
  ```javascript
  useEffect(() => {
    if (recurrenceData.start_date && recurrenceData.end_date && recurrenceData.weekdays.length > 0) {
      const dates = generateDatesPreview(
        recurrenceData.start_date,
        recurrenceData.end_date,
        recurrenceData.weekdays,
        holidays
      );
      setPreviewDates(dates);
    }
  }, [recurrenceData.start_date, recurrenceData.end_date, recurrenceData.weekdays]);
  ```

**4. Banner Informativo para Professor:**
```javascript
{reservationType === 'RECURRING' && user.role === 'PROFESSOR' && (
  <Alert severity="info" sx={{ my: 2 }}>
    ℹ️ Reservas recorrentes ficam com status <strong>PENDENTE</strong> até
    aprovação de um administrador.
  </Alert>
)}
```

**5. Verificação de Conflito para Recorrente:**
- [ ] Adaptar o `useEffect` de conflito para aceitar o payload recorrente
- [ ] Banner de conflito agora exibe: "Conflito detectado em X ocorrência(s): 02/03 (M1), 09/03 (M1)..."

**6. Submit Adaptado:**
```javascript
async function handleSubmit() {
  if (reservationType === 'RECURRING') {
    if (!recurrenceData.start_date || !recurrenceData.end_date)
      return showError('Selecione o período da recorrência');
    if (recurrenceData.weekdays.length === 0)
      return showError('Selecione ao menos um dia da semana');
    if (previewDates.length === 0)
      return showError('Nenhuma data válida no período selecionado');
  }
  
  const payload = {
    type: reservationType,
    lab_id: formData.lab_id,
    time_slot_ids: formData.time_slot_ids,
    notes: formData.notes,
    ...(reservationType === 'SIMPLE'
      ? { date: dayjs(formData.date).format('YYYY-MM-DD') }
      : {
          start_date: dayjs(recurrenceData.start_date).format('YYYY-MM-DD'),
          end_date: dayjs(recurrenceData.end_date).format('YYYY-MM-DD'),
          weekdays: recurrenceData.weekdays
        }
    )
  };
  
  setSubmitting(true);
  try {
    const reservation = await reservationService.create(payload);
    const msg = reservationType === 'RECURRING'
      ? `Solicitação criada com ${reservation.total_occurrences} ocorrências. Aguardando aprovação.`
      : 'Reserva criada com sucesso!';
    showSuccess(msg);
    navigate('/my-reservations');
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao criar reserva');
  } finally {
    setSubmitting(false);
  }
}
```

**Critérios de Aceite:**
- [ ] Toggle troca entre modos SIMPLE e RECURRING sem perder dados dos campos comuns
- [ ] Preview de datas atualiza em tempo real ao mudar range ou dias da semana
- [ ] Banner informativo aparece para PROFESSOR no modo recorrente
- [ ] Verificação de conflito funciona no modo recorrente
- [ ] Submit envia payload correto para cada tipo
- [ ] Após criar recorrente: toast com `total_occurrences`
- [ ] Professor redirecionado para "Minhas Reservas" com status PENDING visível
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F5-BE-01, F4-FE-01

---

### [F5-FE-02] Painel de Aprovação de Reservas

**Descrição:**  
Tela exclusiva do ADMIN para gerenciar reservas pendentes com ações de aprovar, rejeitar e redirecionar.

**Entregáveis:**
- [ ] `src/pages/admin/PendingReservationsPage.jsx`
- [ ] `src/components/admin/RejectReservationModal.jsx`
- [ ] `src/components/admin/RedirectReservationModal.jsx`
- [ ] Atualizar `src/services/reservation.service.js`

**Componentes:**

**1. Estado do Componente:**
```javascript
const [reservations, setReservations] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedReservation, setSelectedReservation] = useState(null);
const [showRejectModal, setShowRejectModal] = useState(false);
const [showRedirectModal, setShowRedirectModal] = useState(false);
```

**2. DataGrid de Reservas Pendentes:**
- [ ] Colunas:
  - Professor (nome + email)
  - Laboratório solicitado
  - Tipo (chip: SIMPLES | RECORRENTE)
  - Total de Ocorrências
  - Período (ex: "02/03 a 30/06")
  - Dias da Semana (ex: "Seg, Qua")
  - Horários (ex: "M1, M2")
  - Data da Solicitação
  - Ações (Aprovar ✓, Rejeitar ✗, Redirecionar ↔)

**3. Linha Expansível (opcional mas recomendado):**
- [ ] Ao clicar na linha: expandir e mostrar todas as datas geradas em chips

**4. Ação: Aprovar**
```javascript
async function handleApprove(reservationId) {
  try {
    await reservationService.approve(reservationId);
    showSuccess('Reserva aprovada!');
    setReservations(reservations.filter(r => r.id !== reservationId));
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao aprovar');
  }
}
```
- [ ] Confirmação simples: "Aprovar esta reserva?"

**5. Modal: Rejeitar**
- [ ] `RejectReservationModal.jsx`
  ```
  "Rejeitar reserva de [Professor]"
  
  Motivo da rejeição: (obrigatório)
  [Textarea 3 linhas]
  
  [Cancelar] [Rejeitar]
  ```
- [ ] Ao confirmar:
  ```javascript
  async function handleReject(reservationId, reason) {
    try {
      await reservationService.reject(reservationId, reason);
      showSuccess('Reserva rejeitada');
      setReservations(reservations.filter(r => r.id !== reservationId));
      setShowRejectModal(false);
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao rejeitar');
    }
  }
  ```

**6. Modal: Redirecionar**
- [ ] `RedirectReservationModal.jsx`
  ```
  "Redirecionar reserva de [Professor]"
  
  Laboratório Original: Lab 01 (desabilitado)
  
  Novo Laboratório: [Select — lista labs ativos]
  
  Motivo do redirecionamento: (obrigatório)
  [TextField]
  
  [Cancelar] [Redirecionar e Aprovar]
  ```
- [ ] Ao confirmar:
  ```javascript
  async function handleRedirect(reservationId, newLabId, reason) {
    try {
      await reservationService.redirect(reservationId, newLabId, reason);
      showSuccess('Reserva redirecionada e aprovada!');
      setReservations(reservations.filter(r => r.id !== reservationId));
      setShowRedirectModal(false);
    } catch (error) {
      showError(error.response?.data?.error || 'Erro ao redirecionar');
    }
  }
  ```

**7. Estado Vazio:**
- [ ] Se `reservations.length === 0`:
  ```
  "Nenhuma reserva aguardando aprovação 🎉"
  ```

**Atualizar src/services/reservation.service.js:**
```javascript
async getPending() {
  const response = await api.get('/reservations/pending');
  return response.data;
},

async approve(id) {
  const response = await api.put(`/reservations/${id}/approve`);
  return response.data;
},

async reject(id, reason) {
  const response = await api.put(`/reservations/${id}/reject`, { reason });
  return response.data;
},

async redirect(id, newLabId, reason) {
  const response = await api.put(`/reservations/${id}/redirect`, {
    new_lab_id: newLabId,
    reason
  });
  return response.data;
}
```

**Critérios de Aceite:**
- [ ] DataGrid carrega reservas PENDING ao montar
- [ ] Aprovar → remove da lista + toast
- [ ] Rejeitar sem motivo → erro de validação no modal
- [ ] Rejeitar com motivo → remove da lista + toast
- [ ] Redirecionar com novo lab e motivo → remove da lista + toast
- [ ] Redirecionar para lab com conflito → erro claro no modal
- [ ] Estado vazio com mensagem de sucesso
- [ ] Apenas ADMIN acessa (router protect)
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F5-BE-02, F3-FE-01

---

## 🔹 Teste Final de Fase

### [F5-INT-01] Teste de Integração da FASE 5

**Descrição:**  
Validar o fluxo completo de reservas recorrentes, desde a solicitação até aprovação/rejeição/redirecionamento.

**Checklist de Testes:**

**Cenário 1: Criação de Reserva Recorrente (Professor)**
- [ ] 1. Professor loga e acessa "Criar Reserva"
- [ ] 2. Seleciona modo "Reserva Recorrente"
- [ ] 3. Banner informativo sobre status PENDING aparece
- [ ] 4. Seleciona Lab 01, período 01/03 a 30/06, dias: Seg e Qua, horários M1 e M2
- [ ] 5. Preview exibe "Serão geradas X ocorrências"
- [ ] 6. Submete — toast com "X ocorrências criadas. Aguardando aprovação."
- [ ] 7. Em "Minhas Reservas": reserva aparece com status PENDING
- [ ] 8. POST direto no Postman → retorno inclui `total_occurrences`

**Cenário 2: Rollback por Conflito**
- [ ] 1. Com reserva do Cenário 1 existente (Lab 01, Seg M1)
- [ ] 2. Outro professor tenta criar recorrente: Lab 01, Seg, M1, mesmo período
- [ ] 3. Erro retornado com datas conflitantes
- [ ] 4. Verificar no banco: nenhum `reservation_item` novo criado

**Cenário 3: Aprovação pelo ADMIN**
- [ ] 1. ADMIN loga e acessa painel de aprovações
- [ ] 2. Reserva do Professor (Cenário 1) aparece na lista com tipo "RECORRENTE"
- [ ] 3. ADMIN clica em "Aprovar"
- [ ] 4. Confirmação → ADMIN confirma
- [ ] 5. Reserva some da lista de pendentes
- [ ] 6. Professor acessa "Minhas Reservas" → status agora APPROVED

**Cenário 4: Rejeição pelo ADMIN**
- [ ] 1. Professor cria nova reserva recorrente → PENDING
- [ ] 2. ADMIN abre modal de rejeição
- [ ] 3. Tenta rejeitar sem motivo → erro "Motivo obrigatório"
- [ ] 4. Preenche motivo "Lab em reforma" → confirma
- [ ] 5. Reserva some do painel de pendentes
- [ ] 6. Professor acessa "Minhas Reservas" → status REJECTED com motivo visível

**Cenário 5: Redirecionamento pelo ADMIN**
- [ ] 1. Professor cria reserva recorrente para Lab 01 → PENDING
- [ ] 2. ADMIN abre modal de redirecionamento
- [ ] 3. Seleciona Lab 02, motivo "Lab 01 em manutenção"
- [ ] 4. Confirma → reserva some do painel de pendentes
- [ ] 5. Professor acessa "Minhas Reservas" → status APPROVED, lab exibe "Lab 02"
- [ ] 6. Tentar redirecionar para lab com conflito → erro claro no modal

**Cenário 6: Proteção de Rotas**
- [ ] 1. PROFESSOR tenta GET /api/reservations/pending → 403
- [ ] 2. PROFESSOR tenta PUT /api/reservations/1/approve → 403
- [ ] 3. PROFESSOR tenta PUT /api/reservations/1/reject → 403
- [ ] 4. Sem token: todas as rotas → 401

**Critérios de Aceite:**
- [ ] Todos os 6 cenários passam sem bugs
- [ ] Rollback de conflito é atômico — banco limpo após erro
- [ ] `total_occurrences` bate com a quantidade de datas geradas
- [ ] Nenhum console.error no frontend
- [ ] Nenhum erro 500 no backend
- [ ] Pronto para avançar para FASE 6

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F5-* concluídas

---

---

# 🟢 FASE 6 – Sobrescrita e Controle Avançado (ADMIN)

**Requisitos:** RF15, RF18, RF21, RNF04  
**Status Geral:** 🔴 PENDENTE  
**Meta:** ADMIN tem controle total — pode forçar reservas, deletar em lote e auditoria garante rastreabilidade

---

## 🔹 Backend

### [F6-BE-01] Sobrescrita de Reserva

**Descrição:**  
ADMIN pode forçar uma reserva em horário já ocupado, cancelando a reserva existente. Toda a operação deve ser transacional (RNF04) e registrada em audit_logs (RF21).

**Entregáveis:**

**1. ReservationRepository.js (adicionar métodos):**
- [ ] `cancelItem(itemId, reason = 'OVERWRITTEN')` → cancela item específico
  ```javascript
  async cancelItem(itemId, reason = 'OVERWRITTEN') {
    await db.query(
      'UPDATE reservation_items SET status = ?, cancel_reason = ? WHERE id = ?',
      ['CANCELLED', reason, itemId]
    );
  }
  ```

- [ ] `cancelReservationIfAllItemsCancelled(reservationId)` → verifica se todos os items foram cancelados e atualiza o status da reserva pai
  ```javascript
  async cancelReservationIfAllItemsCancelled(reservationId) {
    const [{ count }] = await db.query(
      'SELECT COUNT(*) as count FROM reservation_items WHERE reservation_id = ? AND status = ?',
      [reservationId, 'ACTIVE']
    );
    if (count === 0) {
      await db.query(
        'UPDATE reservations SET status = ? WHERE id = ?',
        ['CANCELLED', reservationId]
      );
    }
  }
  ```

**2. OverwriteService.js (novo arquivo):**
- [ ] `overwriteReservation(dto, adminId)` → sobrescreve reserva existente
  **Lógica de Negócio:**
  1. [ ] Validar campos: `lab_id`, `date`, `time_slot_ids`, `notes` (opcional)
  2. [ ] Validar que o ciclo está ativo
  3. [ ] Verificar que NÃO é feriado
  4. [ ] Detectar conflitos existentes:
     ```javascript
     const conflicts = await ReservationRepository.findConflicting(
       dto.lab_id, dto.date, dto.time_slot_ids
     );
     if (conflicts.length === 0) {
       throw new Error('Não há conflito a sobrescrever. Use a criação normal de reserva.');
     }
     ```
  5. [ ] **Iniciar transação**
  6. [ ] Para cada item em conflito: cancelar o item e verificar a reserva pai:
     ```javascript
     for (const conflictItem of conflicts) {
       await ReservationRepository.cancelItem(conflictItem.id, 'OVERWRITTEN');
       await ReservationRepository.cancelReservationIfAllItemsCancelled(
         conflictItem.reservation_id
       );
     }
     ```
  7. [ ] Criar nova reserva para o ADMIN:
     ```javascript
     const reservation = await ReservationRepository.create({
       professor_id: adminId,
       academic_cycle_id: activeCycle.id,
       type: dto.type || 'SIMPLE',
       status: 'APPROVED',
       notes: dto.notes || null
     });
     await ReservationRepository.createMany(reservation.id, [/* items */]);
     ```
  8. [ ] **Commit da transação**
  9. [ ] Registrar em audit_logs com todos os IDs sobrescritos:
     ```javascript
     AuditService.log(
       'OVERWRITE',
       'reservation_items',
       reservation.id,
       adminId,
       { overwritten_item_ids: conflicts.map(c => c.id) },
       { new_reservation_id: reservation.id }
     );
     ```
  10. [ ] Retornar:
      ```javascript
      return {
        new_reservation: reservation,
        overwritten_count: conflicts.length,
        overwritten_reservation_ids: [...new Set(conflicts.map(c => c.reservation_id))]
      };
      ```

**3. ReservationController.js (adicionar):**
- [ ] `overwrite(req, res)` → POST /api/reservations/overwrite
  **Body esperado:**
  ```json
  {
    "lab_id": 1,
    "date": "2026-03-10",
    "time_slot_ids": [1, 2],
    "notes": "Evento institucional urgente"
  }
  ```

**4. routes/reservation.routes.js (adicionar):**
```javascript
// ADMIN only — colocar ANTES da rota POST '/'
router.post('/overwrite', verifyToken, authorize(['ADMIN']), ReservationController.overwrite);
```

**Critérios de Aceite:**
- [ ] POST /overwrite cancela items conflitantes e cria nova reserva na mesma transação
- [ ] Se todos os items de uma reserva forem cancelados, a reserva pai também é CANCELLED
- [ ] Se não houver conflito, retorna erro (use rota normal)
- [ ] Retorno inclui `overwritten_count` e IDs das reservas afetadas
- [ ] audit_logs registra a sobrescrita com IDs antigos e novo
- [ ] PROFESSOR não consegue acessar (403)
- [ ] Testado no Postman:
  - [ ] Criar reserva normal → reservar mesmo horário via overwrite → verificar cancelamento
  - [ ] Tentar overwrite sem conflito → erro
  - [ ] Verificar audit_logs após overwrite

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F5-BE-01

---

### [F6-BE-02] Exclusão Múltipla de Reservas

**Descrição:**  
Deletar várias reservas de uma vez. Cada ID é validado individualmente e a operação é transacional — ou cancela todas ou nenhuma (RNF04).

**Entregáveis:**

**1. ReservationRepository.js (adicionar métodos):**
- [ ] `findManyByIds(ids)` → SELECT * FROM reservations WHERE id IN (?)
- [ ] `cancelManyWithItems(ids)` → cancela reservas e seus items em lote
  ```javascript
  async cancelManyWithItems(ids) {
    await db.query(
      'UPDATE reservation_items SET status = ? WHERE reservation_id IN (?)',
      ['CANCELLED', ids]
    );
    await db.query(
      'UPDATE reservations SET status = ? WHERE id IN (?)',
      ['CANCELLED', ids]
    );
  }
  ```

**2. ReservationService.js (adicionar método):**
- [ ] `bulkDeleteReservations(ids, requestingUser)` → cancela múltiplas reservas
  **Lógica de Negócio:**
  1. [ ] Validar `ids` é array não vazio:
     - Se vazio: erro "Selecione ao menos uma reserva para cancelar"
  2. [ ] Buscar todas as reservas pelos IDs
  3. [ ] Validar que todas existem:
     - Se algum ID não encontrado: erro "Reservas não encontradas: [ids]"
  4. [ ] Validar permissões por role:
     - ADMIN: pode cancelar qualquer reserva
     - PROFESSOR: pode cancelar apenas suas próprias:
       ```javascript
       const unauthorized = reservations.filter(
         r => r.professor_id !== requestingUser.id
       );
       if (unauthorized.length > 0) {
         throw new Error('Você não tem permissão para cancelar reservas de outros professores');
       }
       ```
  5. [ ] Validar que nenhuma já está CANCELLED:
     - Se alguma: erro "Reservas já canceladas: [ids]. Remova-as da seleção."
  6. [ ] Validar que professor não cancela reservas com data passada:
     - ADMIN: pode cancelar qualquer data
     - PROFESSOR: apenas reservas com itens de data >= hoje
  7. [ ] **Iniciar transação**
  8. [ ] `cancelManyWithItems(ids)`
  9. [ ] **Commit**
  10. [ ] Registrar em audit_logs para cada ID
  11. [ ] Retornar `{ cancelled_count: ids.length, ids }`

**3. ReservationController.js (adicionar):**
- [ ] `bulkDelete(req, res)` → DELETE /api/reservations/bulk
  **Body esperado:**
  ```json
  {
    "ids": [5, 6, 7]
  }
  ```
  ```javascript
  async bulkDelete(req, res) {
    try {
      const { ids } = req.body;
      const result = await ReservationService.bulkDeleteReservations(ids, req.user);
      res.json({ message: `${result.cancelled_count} reserva(s) cancelada(s)`, ...result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  ```

**4. routes/reservation.routes.js (adicionar):**
```javascript
// Autenticado — permissões controladas no service
router.delete('/bulk', verifyToken, ReservationController.bulkDelete);
```

**Critérios de Aceite:**
- [ ] DELETE /bulk cancela todas as reservas do array em uma transação
- [ ] PROFESSOR só pode cancelar suas próprias reservas (403 semântico para as alheias)
- [ ] ADMIN pode cancelar qualquer reserva
- [ ] Não pode cancelar reservas já CANCELLED (erro claro)
- [ ] Rollback se qualquer validação falhar — nenhuma cancelada parcialmente
- [ ] Testado no Postman:
  - [ ] Cancelar 3 reservas próprias (professor) → sucesso
  - [ ] Tentar cancelar reserva de outro professor → erro
  - [ ] ADMIN cancela qualquer reserva → sucesso
  - [ ] Tentar cancelar IDs inexistentes → erro

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F4-BE-02

---

### [F6-BE-03] Sistema de Auditoria

**Descrição:**  
Centralizar e padronizar o registro de ações críticas na tabela `audit_logs`. Garante rastreabilidade completa (RF21).

**Entregáveis:**

**1. AuditRepository.js:**
- [ ] `create(data)` → INSERT em audit_logs
  ```javascript
  async create(data) {
    // data = { action, table_name, record_id, changed_by, old_values, new_values }
    await db.query('INSERT INTO audit_logs SET ?', [{
      ...data,
      old_values: JSON.stringify(data.old_values || {}),
      new_values: JSON.stringify(data.new_values || {}),
      created_at: new Date()
    }]);
  }
  ```

- [ ] `findByRecord(tableName, recordId)` → histórico de um registro
- [ ] `findByUser(userId, limit = 50)` → histórico de ações de um usuário

**2. AuditService.js (criar ou formalizar):**
- [ ] `log(action, tableName, recordId, changedBy, oldValues, newValues)` → registra ação
  ```javascript
  /**
   * Actions padronizadas:
   * 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT'
   * 'ACTIVATE' | 'OVERWRITE' | 'REDIRECT' | 'BULK_CANCEL'
   */
  static async log(action, tableName, recordId, changedBy, oldValues = {}, newValues = {}) {
    try {
      await AuditRepository.create({
        action,
        table_name: tableName,
        record_id: recordId,
        changed_by: changedBy,
        old_values: oldValues,
        new_values: newValues
      });
    } catch (err) {
      // Nunca deixar falha de auditoria derrubar a operação principal
      console.error('[AuditService] Falha ao registrar log:', err.message);
    }
  }
  ```
  > **Regra crítica:** Audit sempre em try-catch isolado. Falha de log nunca propaga erro para a operação principal.

**3. Retroativamente aplicar AuditService.log() em:**
- [ ] F2-BE-01: approveUser, rejectUser
- [ ] F3-BE-01: activateCycle
- [ ] F4-BE-02: createSimpleReservation
- [ ] F5-BE-01: createRecurringReservation
- [ ] F5-BE-02: approveReservation, rejectReservation, redirectReservation
- [ ] F6-BE-01: overwriteReservation
- [ ] F6-BE-02: bulkDeleteReservations

**4. AuditController.js (ADMIN only):**
- [ ] `getByRecord(req, res)` → GET /api/audit/:table/:id
- [ ] `getByUser(req, res)` → GET /api/audit/user/:userId

**5. routes/audit.routes.js:**
```javascript
// ADMIN only
router.get('/user/:userId', verifyToken, authorize(['ADMIN']), AuditController.getByUser);
router.get('/:table/:id', verifyToken, authorize(['ADMIN']), AuditController.getByRecord);
```

**Critérios de Aceite:**
- [ ] AuditService.log() nunca lança exceção para cima (erro isolado no catch)
- [ ] Todas as operações críticas registram em audit_logs após a implementação retroativa
- [ ] GET /api/audit/:table/:id retorna histórico ordenado por created_at DESC
- [ ] old_values e new_values gravados como JSON válido
- [ ] PROFESSOR não consegue acessar rotas de audit (403)
- [ ] Testado no Postman:
  - [ ] Após ativar ciclo: GET /audit/academic_cycles/:id → exibe log ACTIVATE
  - [ ] Após aprovar reserva: GET /audit/reservations/:id → exibe log APPROVE
  - [ ] Após overwrite: log OVERWRITE com IDs sobrescritos

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F6-BE-01, F6-BE-02

---

## 🔹 Frontend

### [F6-FE-01] Interface de Sobrescrita

**Descrição:**  
ADMIN pode sobrescrever uma reserva existente diretamente do formulário de criação, com confirmação explícita e aviso de impacto.

**Entregáveis:**
- [ ] Atualizar `src/pages/professor/CreateReservationPage.jsx` (usado pelo ADMIN também)
- [ ] `src/components/admin/OverwriteConfirmModal.jsx`

**Componentes:**

**1. Detectar que o usuário é ADMIN com conflito:**
```javascript
// No banner de conflito existente, adicionar branch para ADMIN:
{conflictInfo?.hasConflict && user.role === 'ADMIN' && (
  <Alert severity="warning" sx={{ my: 2 }}>
    ⚠️ Conflito detectado. Como ADMIN, você pode <strong>sobrescrever</strong> a(s)
    reserva(s) existente(s).{' '}
    <Button
      size="small"
      color="warning"
      onClick={() => setShowOverwriteModal(true)}
    >
      Sobrescrever
    </Button>
  </Alert>
)}
```

**2. Modal de Confirmação de Sobrescrita:**
- [ ] `OverwriteConfirmModal.jsx`
  ```
  "⚠️ Confirmar Sobrescrita"
  
  "Você está prestes a sobrescrever as seguintes reservas:"
  - [Professor A] — M1, M2 em 10/03/2026
  - [Professor B] — M1 em 10/03/2026
  
  "As reservas acima serão CANCELADAS. Os professores afetados não
  serão notificados automaticamente nesta versão."
  
  [Cancelar] [Confirmar Sobrescrita]
  ```

**3. Ação de Sobrescrita:**
```javascript
async function handleOverwrite() {
  setSubmitting(true);
  try {
    const result = await reservationService.overwrite({
      lab_id: formData.lab_id,
      date: dayjs(formData.date).format('YYYY-MM-DD'),
      time_slot_ids: formData.time_slot_ids,
      notes: formData.notes
    });
    showSuccess(
      `Sobrescrita realizada! ${result.overwritten_count} reserva(s) anterior(es) cancelada(s).`
    );
    setShowOverwriteModal(false);
    navigate('/admin/pending-reservations');
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao sobrescrever');
  } finally {
    setSubmitting(false);
  }
}
```

**Atualizar src/services/reservation.service.js:**
```javascript
async overwrite(data) {
  const response = await api.post('/reservations/overwrite', data);
  return response.data;
}
```

**Critérios de Aceite:**
- [ ] Botão "Sobrescrever" aparece APENAS para ADMIN quando há conflito
- [ ] Professor com conflito continua bloqueado (sem botão de sobrescrita)
- [ ] Modal exibe lista de reservas que serão canceladas
- [ ] Após confirmação: toast com count de reservas sobrescritas
- [ ] Apenas ADMIN acessa a funcionalidade

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F6-BE-01, F4-FE-01

---

### [F6-FE-02] Exclusão Múltipla

**Descrição:**  
Adicionar seleção múltipla e cancelamento em lote em `MyReservationsPage.jsx` (professor) e no painel do ADMIN.

**Entregáveis:**
- [ ] Atualizar `src/pages/professor/MyReservationsPage.jsx`

**Componentes:**

**1. Habilitar Seleção Múltipla no DataGrid:**
```javascript
// Adicionar ao DataGrid:
checkboxSelection
disableRowSelectionOnClick
onRowSelectionModelChange={(ids) => setSelectedIds(ids)}

// Estado:
const [selectedIds, setSelectedIds] = useState([]);
```

**2. Barra de Ações em Lote:**
```javascript
{selectedIds.length > 0 && (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 1,
             bgcolor: 'warning.light', borderRadius: 1 }}>
    <Typography variant="body2">
      {selectedIds.length} reserva(s) selecionada(s)
    </Typography>
    <Button
      variant="contained"
      color="error"
      size="small"
      startIcon={<DeleteIcon />}
      onClick={() => setShowBulkDeleteConfirm(true)}
    >
      Cancelar Selecionadas
    </Button>
    <Button size="small" onClick={() => setSelectedIds([])}>
      Limpar seleção
    </Button>
  </Box>
)}
```

**3. Modal de Confirmação:**
```
"Cancelar {N} reserva(s)?"
"Esta ação não pode ser desfeita."
[Cancelar] [Confirmar]
```

**4. Ação de Exclusão em Lote:**
```javascript
async function handleBulkDelete() {
  try {
    const result = await reservationService.bulkDelete(selectedIds);
    showSuccess(`${result.cancelled_count} reserva(s) cancelada(s)`);
    // Remover da lista local
    setReservations(reservations.filter(r => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    setShowBulkDeleteConfirm(false);
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao cancelar reservas');
  }
}
```

**Atualizar src/services/reservation.service.js:**
```javascript
async bulkDelete(ids) {
  const response = await api.delete('/reservations/bulk', { data: { ids } });
  return response.data;
}
```

**Critérios de Aceite:**
- [ ] Checkboxes aparecem no DataGrid de "Minhas Reservas"
- [ ] Barra de ações aparece ao selecionar ao menos 1 reserva
- [ ] Confirmação antes de cancelar
- [ ] Após cancelamento: reservas somem da lista
- [ ] Tentar cancelar reserva de outro professor → erro claro
- [ ] ADMIN no painel de reservas também usa a seleção múltipla
- [ ] Responsivo

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F6-BE-02, F4-FE-02

---

## 🔹 Teste Final de Fase

### [F6-INT-01] Teste de Integração da FASE 6

**Descrição:**  
Validar sobrescrita transacional, exclusão múltipla e rastreabilidade completa via audit_logs.

**Checklist de Testes:**

**Cenário 1: Sobrescrita de Reserva (ADMIN)**
- [ ] 1. Professor cria reserva: Lab 01, 10/03, M1 → APPROVED
- [ ] 2. ADMIN acessa formulário de criação
- [ ] 3. Seleciona Lab 01, 10/03, M1 → banner de conflito com botão "Sobrescrever"
- [ ] 4. ADMIN abre modal — lista a reserva do Professor
- [ ] 5. ADMIN confirma sobrescrita
- [ ] 6. Toast: "1 reserva anterior cancelada"
- [ ] 7. Professor acessa "Minhas Reservas" → sua reserva agora está CANCELLED
- [ ] 8. GET /audit/reservations/:newId → log OVERWRITE com ID da reserva antiga
- [ ] 9. Tentar overwrite sem conflito → erro "Não há conflito a sobrescrever"

**Cenário 2: Transação de Sobrescrita (Atomicidade)**
- [ ] 1. Simular falha no meio da transação (mock ou força erro)
- [ ] 2. Verificar que a reserva antiga NÃO foi cancelada
- [ ] 3. Verificar que a nova reserva NÃO foi criada
- [ ] 4. Banco de dados limpo (nenhuma reserva parcial)

**Cenário 3: Exclusão Múltipla**
- [ ] 1. Professor cria 3 reservas simples
- [ ] 2. Seleciona todas no DataGrid
- [ ] 3. Barra de ações aparece com contador "3 reserva(s) selecionada(s)"
- [ ] 4. Confirma cancelamento → toast "3 reserva(s) cancelada(s)"
- [ ] 5. Reservas somem da lista
- [ ] 6. Tentar cancelar reserva de outro professor via API direta → erro de permissão

**Cenário 4: Auditoria Completa**
- [ ] 1. Após ativar ciclo: GET /api/audit/academic_cycles/:id → log ACTIVATE
- [ ] 2. Após aprovar reserva: GET /api/audit/reservations/:id → log APPROVE com `approved_by`
- [ ] 3. Após sobrescrita: log OVERWRITE com `overwritten_item_ids`
- [ ] 4. Após bulk cancel: log BULK_CANCEL com array de IDs
- [ ] 5. PROFESSOR tenta GET /api/audit/... → 403
- [ ] 6. Simular falha no AuditService → operação principal continua funcionando normalmente

**Cenário 5: Proteção de Rotas e Integridade**
- [ ] 1. PROFESSOR tenta POST /api/reservations/overwrite → 403
- [ ] 2. DELETE /api/reservations/bulk com IDs mistos (próprios + alheios) → erro parcial claro
- [ ] 3. Tentar bulk delete de IDs já CANCELLED → erro claro
- [ ] 4. Transação com IDs inválidos → rollback, nenhum ID cancelado

**Critérios de Aceite:**
- [ ] Todos os 5 cenários passam sem bugs
- [ ] Atomicidade comprovada: nunca há estado parcial no banco
- [ ] audit_logs preenchido para todas as ações críticas
- [ ] AuditService nunca derruba operação principal
- [ ] Nenhum console.error no frontend
- [ ] Nenhum erro 500 no backend
- [ ] Pronto para avançar para FASE 7

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F6-* concluídas

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
