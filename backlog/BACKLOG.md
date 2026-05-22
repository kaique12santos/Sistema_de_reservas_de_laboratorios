# 📋 Backlog Geral - Sistema de Reservas Fatec ZL

---

# 🟢 FASE 1 – Infraestrutura e Autenticação (MVP)
**Requisitos:** RF01, RF02, RF03, RNF03

**Status Geral:** 🟢 Concluído

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
**Status Geral:** ✅ CONCLUÍDO 
**Meta:** Admins podem gerenciar usuários, laboratórios e horários

---

## 🔹 Backend

### [F2-BE-01] Aprovação de Cadastro de Usuários

**Descrição:**  
ADMIN lista usuários pendentes e pode aprovar ou rejeitar cadastros.

**Entregáveis:**

**1. UserRepository.js (adicionar métodos):**
- [x] `findPending()` → SELECT * FROM users WHERE status = 'PENDING' ORDER BY created_at
- [x] `updateStatus(id, status, rejectionReason = null)` → UPDATE users SET status = ?, rejection_reason = ? WHERE id = ?
- [x] `countByStatus(status)` → SELECT COUNT(*) FROM users WHERE status = ?

**2. UserService.js:**
- [x] `listPendingUsers()` → retorna array de usuários pendentes
  ```javascript
  async listPendingUsers() {
    return await UserRepository.findPending();
  }
  ```

- [x] `approveUser(userId, adminId)` → aprova usuário
  **Lógica de Negócio:**
  1. [x] Buscar usuário por ID
     - Se não existir: erro "Usuário não encontrado"
  2. [x] Validar status atual:
     - Se != PENDING: erro "Usuário já foi processado"
  3. [x] Atualizar status para 'APPROVED'
  4. [x] (Opcional) Enviar email: "Sua conta foi aprovada! Você já pode fazer login."
  5. [x] Registrar em audit_logs:
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
  6. [x] Retornar usuário atualizado

- [x] `rejectUser(userId, adminId, reason)` → rejeita usuário
  **Lógica de Negócio:**
  1. [x] Validar que reason não é vazio
     - Se vazio: erro "Motivo da rejeição é obrigatório"
  2. [x] Buscar usuário e validar status = PENDING
  3. [x] Atualizar:
     ```javascript
     status = 'REJECTED',
     rejection_reason = reason
     ```
  4. [x] (Opcional) Enviar email: "Sua conta foi rejeitada. Motivo: [reason]"
  5. [x] Registrar em audit_logs
  6. [x] Retornar usuário atualizado

**3. UserController.js:**
- [x] `getPending(req, res)` → GET /api/users/pending
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

- [x] `approve(req, res)` → PUT /api/users/:id/approve
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

- [x] `reject(req, res)` → PUT /api/users/:id/reject
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
- [x] GET /api/users/pending retorna lista de usuários PENDING
- [x] PUT /api/users/:id/approve muda status para APPROVED
- [x] PUT /api/users/:id/reject requer reason obrigatório
- [x] Não pode aprovar usuário já aprovado (erro)
- [x] Não pode reverter aprovação/rejeição (erro)
- [x] Apenas ADMIN pode acessar estas rotas (403 se PROFESSOR)
- [x] Testado no Postman:
  - [x] Listar pendentes
  - [x] Aprovar usuário
  - [x] Tentar aprovar novamente (deve falhar)
  - [x] Rejeitar outro usuário com motivo

**Status:** ✅ Concluído  
**Responsável:**  Vinicius
**Depende de:** F1-BE-04, F1-BE-05

---

### [F2-BE-02] CRUD de Laboratórios

**Descrição:**  
Gerenciamento completo de laboratórios (criar, listar, editar, inativar).

**Entregáveis:**

**1. LaboratoryRepository.js:**
- [x] `findAll(includeInactive = false)` → SELECT * FROM laboratories WHERE is_active = true (ou todos se includeInactive) ORDER BY name
- [x] `findById(id)` → SELECT * WHERE id = ? AND is_active = true
- [x] `findByName(name)` → SELECT * WHERE name = ?
- [x] `create(data)` → INSERT (name, location, capacity, description_lab, type)
- [x] `update(id, data)` → UPDATE SET ... WHERE id = ?
- [x] `softDelete(id)` → UPDATE is_active = false WHERE id = ?
- [x] `hasActiveReservations(labId)` → verifica se há reservation_items com date >= HOJE e status = ACTIVE

**2. LaboratoryService.js:**
- [x] `listLaboratories(includeInactive = false)` → lista labs
  ```javascript
  async listLaboratories(includeInactive = false) {
    return await LaboratoryRepository.findAll(includeInactive);
  }
  ```

- [x] `getLaboratoryById(id)` → busca lab por ID
  **Validação:**
  - Se não encontrado: erro "Laboratório não encontrado"

- [x] `createLaboratory(dto)` → cria lab
  **Validações:**
  1. [x] name obrigatório
  2. [x] name único (verificar com findByName)
     - Se existir: erro "Já existe laboratório com este nome"
  3. [x] capacity obrigatório e > 0
     - Se <= 0: erro "Capacidade deve ser maior que zero"
  4. [x] type obrigatório e válido
     - Valores: 'LABORATORIO', 'SALA DE AULA', 'AUDITORIO'
     - Se inválido: erro "Tipo inválido"
  5. [x] location opcional mas recomendado
  6. [x] Criar no banco com is_active = true
  7. [x] Retornar laboratório criado

- [x] `updateLaboratory(id, dto)` → atualiza lab
  **Validações:**
  1. [x] Lab existe
  2. [x] Se mudar name: verificar se novo nome já existe (exceto próprio ID)
  3. [x] capacity > 0 se fornecido
  4. [x] type válido se fornecido
  5. [x] Atualizar campos fornecidos
  6. [x] Retornar lab atualizado

- [x] `deleteLaboratory(id)` → inativa lab (soft-delete)
  **Regra de Negócio Crítica:**
  1. [x] Lab existe
  2. [x] Verificar se possui reservas futuras ativas:
     ```sql
     SELECT COUNT(*) FROM reservation_items
     WHERE lab_id = ?
       AND date >= CURDATE()
       AND status = 'ACTIVE'
     ```
     - Se COUNT > 0: erro "Laboratório possui reservas futuras. Cancele-as primeiro."
  3. [x] Se sem reservas: UPDATE is_active = false
  4. [x] Retornar sucesso

**3. LaboratoryController.js:**
- [x] `index(req, res)` → GET /api/laboratories
  - Query param: `?include_inactive=true` (opcional, só ADMIN)
  - Se PROFESSOR: sempre includeInactive = false

- [x] `show(req, res)` → GET /api/laboratories/:id

- [x] `create(req, res)` → POST /api/laboratories
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

- [x] `update(req, res)` → PUT /api/laboratories/:id

- [x] `destroy(req, res)` → DELETE /api/laboratories/:id

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
- [x] `findAll(includeInactive = false)` → SELECT * WHERE is_active = true (ou todos) ORDER BY start_time
- [x] `findById(id)` → SELECT * WHERE id = ?
- [x] `create(data)` → INSERT (name, start_time, end_time)
- [x] `update(id, data)` → UPDATE SET ... WHERE id = ?
- [x] `softDelete(id)` → UPDATE is_active = false WHERE id = ?

**2. TimeSlotService.js:**
- [x] `listTimeSlots()` → lista horários ativos
- [x] `createTimeSlot(dto)` → cria horário
  **Validações:**
  1. [x] name obrigatório (ex: "M1", "Vespertino 1")
  2. [x] start_time obrigatório, formato TIME válido (HH:MM:SS)
  3. [x] end_time obrigatório, formato TIME válido
  4. [x] start_time < end_time
     - Se start >= end: erro "Horário inicial deve ser anterior ao final"
  5. [x] Criar com is_active = true
  6. [x] Retornar time slot criado

- [x] `updateTimeSlot(id, dto)` → atualiza horário
  **Validações:**
  1. [x] Time slot existe
  2. [x] Se atualizar horários: validar start < end
  3. [x] Atualizar campos fornecidos

- [x] `deleteTimeSlot(id)` → inativa horário
  **Regra de Negócio:**
  - Verificar se há reservation_items com este time_slot_id e date >= HOJE
  - Se houver: erro "Horário possui reservas futuras. Não pode ser inativado."

**3. TimeSlotController.js:**
- [x] `index(req, res)` → GET /api/time-slots
- [x] `create(req, res)` → POST /api/time-slots
  **Body esperado:**
  ```json
  {
    "name": "M5",
    "start_time": "11:00:00",
    "end_time": "11:50:00"
  }
  ```
- [x] `update(req, res)` → PUT /api/time-slots/:id
- [x] `destroy(req, res)` → DELETE /api/time-slots/:id

**4. routes/timeSlot.routes.js:**
```javascript
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

// Público (autenticado)
routes.get('/', verifyToken, TimeSlotController.index);

// ADMIN only
routes.post('/', verifyToken, authorize(['ADMIN']), TimeSlotController.create);
routes.put('/:id', verifyToken, authorize(['ADMIN']), TimeSlotController.update);
routes.delete('/:id', verifyToken, authorize(['ADMIN']), TimeSlotController.destroy);
```

**Critérios de Aceite:**
- [x] GET /api/time-slots retorna lista ordenada por start_time
- [x] POST cria horário com validações
- [x] Não pode criar horário com start >= end (erro)
- [x] PUT atualiza campos
- [x] DELETE inativa se sem reservas futuras
- [x] PROFESSOR só pode listar (403 em create/update/delete)
- [x] Testado no Postman
**Componentes:**

**1. Lista de Usuários Pendentes:**
- [x] DataGrid do MUI com colunas:
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
- [x] Botão "Aprovar" (ícone check verde)
- [x] Ao clicar: Modal de confirmação
  ```
  "Aprovar cadastro de [Nome]?"
  [Cancelar] [Confirmar]
  ```
- [x] Ao confirmar:
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
- [x] Botão "Rejeitar" (ícone X vermelho)
- [x] Ao clicar: Modal com formulário
  ```
  "Rejeitar cadastro de [Nome]"
  
  Motivo da rejeição: (obrigatório)
  [Textarea com 3 linhas]
  
  [Cancelar] [Rejeitar]
  ```
- [x] Validação: motivo não pode ser vazio
- [x] Ao confirmar:
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
- [x] Select: Filtrar por departamento
- [x] DatePicker: Filtrar por data de cadastro
- [x] TextField: Busca por nome ou email

**7. Estado Vazio:**
- [x] Se `users.length === 0`: exibir mensagem
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
- [x] `src/pages/admin/LaboratoriesPage.jsx`
- [x] `src/components/admin/LaboratoryFormModal.jsx`
- [x] `src/services/laboratory.service.js`

**Componentes:**

**1. Lista de Laboratórios:**
- [x] DataGrid com colunas:
  - Nome
  - Localização
  - Capacidade
  - Tipo
  - Status (Ativo/Inativo - chip colorido)
  - Ações (Editar, Deletar)

**2. Botão "Novo Laboratório":**
- [x] Botão no topo da página (ícone +)
- [x] Ao clicar: abre modal de criação

**3. Modal de Criação/Edição:**
- [x] Título dinâmico: "Novo Laboratório" ou "Editar [Nome]"
- [x] Formulário MUI com campos:
  - [x] TextField: Nome (obrigatório)
  - [x] TextField: Localização (opcional)
  - [x] TextField: Capacidade (number, obrigatório, min=1)
  - [x] TextField: Descrição (multiline, opcional)
  - [x] Select: Tipo
    - Opções: Laboratório, Sala de Aula, Auditório
- [x] Botões: [Cancelar] [Salvar]

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
- [x] Botão "Editar" (ícone lápis)
- [x] Abre modal preenchido com dados atuais
- [x] Submit atualiza no backend e na lista

**7. Ação: Deletar (Inativar)**
- [x] Botão "Deletar" (ícone lixeira)
- [x] Modal de confirmação:
  ```
  "Tem certeza que deseja inativar o laboratório [Nome]?"
  "Laboratórios inativos não aparecem nas opções de reserva."
  
  [Cancelar] [Inativar]
  ```
- [x] Se sucesso: atualizar lista (marcar como inativo ou remover)
- [x] Se erro (reservas futuras):
  ```javascript
  catch (error) {
    if (error.response?.data?.error.includes('reservas futuras')) {
      showError('Laboratório possui reservas futuras. Cancele-as primeiro.');
    }
  }
  ```

**8. Filtros (opcional):**
- [x] Checkbox: "Mostrar inativos" (só ADMIN)
- [x] Select: Filtrar por tipo

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
- [x] `src/pages/admin/TimeSlotsPage.jsx`
- [x] `src/components/admin/TimeSlotFormModal.jsx`
- [x] `src/services/timeSlot.service.js`

**Componentes:**

**1. Lista de Horários:**
- [x] DataGrid com colunas:
  - Nome (ex: M1)
  - Horário Início
  - Horário Fim
  - Status (Ativo/Inativo)
  - Ações (Editar, Deletar)
- [x] Ordenado por horário de início

**2. Modal de Criação/Edição:**
- [x] TextField: Nome (ex: "M5")
- [x] TimePicker: Horário Início (formato HH:MM)
- [x] TimePicker: Horário Fim (formato HH:MM)
- [x] Validação: início < fim

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
- [x] Confirmação: "Inativar horário [Nome]?"
- [x] Se erro (reservas futuras): exibir mensagem clara

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
- [x] Lista ordenada por horário
- [x] Criar novo horário → aparece na lista
- [x] Não pode criar com início >= fim (erro)
- [x] Editar horário → atualiza na lista
- [x] Deletar sem reservas → inativa
- [x] Deletar com reservas → erro
- [x] Apenas ADMIN acessa
- [x] Responsivo

**Status:** ✅ Concluído  
**Responsável:** Luiz Carlos
**Depende de:** F2-BE-03, F1-FE-01

---

## 🔹 Teste final de fase

### [F2-INT-01] Teste de Integração da FASE 2

**Descrição:**  
Validar que todos os CRUDs funcionam end-to-end.

**Checklist de Testes:**

**Cenário 1: Aprovação de Cadastro**
- [x] 1. Cadastrar novo usuário via /register
- [x] 2. Verificar que aparece em /admin/pending-users
- [x] 3. ADMIN aprova usuário
- [x] 4. Usuário some da lista de pendentes
- [x] 5. Professor consegue fazer login com sucesso
- [x] 6. Cadastrar outro usuário
- [x] 7. ADMIN rejeita sem motivo → erro
- [x] 8. ADMIN rejeita com motivo → sucesso
- [x] 9. Professor rejeitado tenta login → mensagem "Conta rejeitada"

**Cenário 2: Gestão de Laboratórios**
- [x] 1. ADMIN cria "Lab 10" com capacidade 30
- [x] 2. Lab aparece na lista
- [x] 3. Tentar criar outro "Lab 10" → erro "Nome já existe"
- [x] 4. Editar Lab 10 para capacidade 40 → atualiza
- [x] 5. Tentar editar capacidade para 0 → erro
- [x] 6. Deletar Lab 10 (sem reservas) → inativa
- [x] 7. Lab 10 não aparece mais na lista ativa
- [x] 8. PROFESSOR tenta criar lab → 403 bloqueado

**Cenário 3: Gestão de Horários**
- [x] 1. ADMIN cria horário "M5" (11:00-11:50)
- [x] 2. Horário aparece na lista
- [x] 3. Tentar criar horário com início 12:00 e fim 11:00 → erro
- [x] 4. Editar M5 para 11:10-12:00 → atualiza
- [x] 5. Deletar M5 (sem reservas) → inativa
- [x] 6. PROFESSOR tenta criar horário → 403

**Cenário 4: Proteção de Rotas**
- [x] 1. Tentar acessar /admin/pending-users sem login → 401
- [x] 2. Login como PROFESSOR e acessar /admin/laboratories → 403
- [x] 3. Login como ADMIN → todas rotas permitidas

**Critérios de Aceite:**
- [x] Todos os 4 cenários passam sem bugs
- [x] Nenhum console.error no frontend
- [x] Nenhum erro 500 no backend
- [x] Pronto para avançar para FASE 3

**Status:** ✅ Concluído 
**Responsável:** Kaique  
**Depende de:** Todas as tasks F2-* concluídas

---


# 🟠 FASE 3 – Ciclos Acadêmicos e Feriados

**Requisitos:** RF05, RF06, RF07, RF19  
**Status Geral:** ✅ CONCLUÍDO  
**Meta:** Admins podem criar ciclos letivos, ativá-los e cadastrar feriados vinculados

---

## 🔹 Backend

### [F3-BE-01] CRUD de Ciclos Acadêmicos

**Descrição:**  
Criar e gerenciar semestres letivos. Um ciclo deve ser ativado para que reservas possam ser feitas. Apenas um ciclo pode estar ativo por vez.

**Entregáveis:**

**1. AcademicCycleRepository.js:**
- [x] `findAll()` → SELECT * FROM academic_cycles ORDER BY start_date DESC
- [x] `findById(id)` → SELECT * FROM academic_cycles WHERE id = ?
- [x] `findActive()` → SELECT * FROM academic_cycles WHERE is_active = true LIMIT 1
- [x] `findByName(name)` → SELECT * FROM academic_cycles WHERE name = ?
- [x] `create(data)` → INSERT (name, start_date, end_date, exclusive_admin_end_date)
- [x] `update(id, data)` → UPDATE SET ... WHERE id = ?
- [x] `deactivateAll()` → UPDATE academic_cycles SET is_active = false
- [x] `activate(id)` → UPDATE academic_cycles SET is_active = true WHERE id = ?

**2. AcademicCycleService.js:**
- [x] `listCycles()` → lista todos os ciclos
  ```javascript
  async listCycles() {
    return await AcademicCycleRepository.findAll();
  }
  ```

- [x] `getActiveCycle()` → retorna ciclo ativo
  ```javascript
  async getActiveCycle() {
    const cycle = await AcademicCycleRepository.findActive();
    if (!cycle) throw new Error('Nenhum ciclo acadêmico ativo encontrado');
    return cycle;
  }
  ```

- [x] `createCycle(dto)` → cria ciclo
  **Lógica de Negócio:**
  1. [x] Validar `name` obrigatório (ex: "2026-1")
  2. [x] Verificar nome único:
     - Se existir: erro "Já existe um ciclo com este nome"
  3. [x] Validar `start_date` obrigatório
  4. [x] Validar `end_date` obrigatório
  5. [x] Validar start_date < end_date:
     - Se inválido: erro "Data de início deve ser anterior à data de fim"
  6. [x] Validar `exclusive_admin_end_date` obrigatório
  7. [x] Validar exclusive_admin_end_date <= start_date:
     - Se inválido: erro "Período exclusivo admin deve terminar antes ou na data de início do ciclo"
  8. [x] Criar no banco com is_active = false
  9. [x] Retornar ciclo criado

- [x] `updateCycle(id, dto)` → atualiza ciclo
  **Lógica de Negócio:**
  1. [x] Ciclo existe
  2. [x] Se alterar `name`: verificar unicidade (exceto próprio ID)
  3. [x] Se alterar datas: revalidar start_date < end_date
  4. [x] Se alterar exclusive_admin_end_date: revalidar <= start_date
  5. [x] Não pode editar ciclo ativo (is_active = true):
     - Se ativo: erro "Não é possível editar um ciclo ativo. Desative-o primeiro."
  6. [x] Retornar ciclo atualizado

- [x] `activateCycle(id, adminId)` → ativa ciclo
  **Lógica de Negócio:**
  1. [x] Ciclo existe
  2. [x] Se já ativo: erro "Este ciclo já está ativo"
  3. [x] Desativar todos os outros ciclos (deactivateAll)
  4. [x] Ativar o ciclo solicitado
  5. [x] Registrar em audit_logs:
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
  6. [x] Retornar ciclo ativo

**3. AcademicCycleController.js:**
- [x] `index(req, res)` → GET /api/academic-cycles
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

- [x] `active(req, res)` → GET /api/academic-cycles/active
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

- [x] `create(req, res)` → POST /api/academic-cycles
  **Body esperado:**
  ```json
  {
    "name": "2026-1",
    "start_date": "2026-02-01",
    "end_date": "2026-06-30",
    "exclusive_admin_end_date": "2026-01-25"
  }
  ```

- [x] `update(req, res)` → PUT /api/academic-cycles/:id

- [x] `activate(req, res)` → PUT /api/academic-cycles/:id/activate
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
- [x] GET /api/academic-cycles retorna lista ordenada por data
- [x] GET /api/academic-cycles/active retorna o ciclo ativo (404 se nenhum)
- [x] POST cria ciclo com is_active = false por padrão
- [x] Não pode criar ciclo com nome duplicado (erro)
- [x] Não pode criar com start_date >= end_date (erro)
- [x] Não pode criar com exclusive_admin_end_date > start_date (erro)
- [x] PUT /activate desativa todos os outros e ativa o solicitado
- [x] Não pode ativar ciclo já ativo (erro claro)
- [x] PROFESSOR não consegue criar/editar/ativar (403)
- [x] Testado no Postman:
  - [x] Criar ciclo
  - [x] Ativar ciclo
  - [x] Tentar criar com datas inválidas (deve falhar)
  - [x] Tentar ativar ciclo já ativo (deve falhar)

**Status:** ✅ Concluído  
**Responsável:** Kaique
**Depende de:** F1-BE-04

---

### [F3-BE-02] CRUD de Feriados

**Descrição:**  
Cadastrar feriados vinculados a um ciclo acadêmico. Dias marcados como feriado não podem receber reservas.

**Entregáveis:**

**1. HolidayRepository.js:**
- [x] `findByCycle(cycleId)` → SELECT * FROM holidays WHERE academic_cycle_id = ? ORDER BY date ASC
- [x] `findById(id)` → SELECT * FROM holidays WHERE id = ?
- [x] `findByDateAndCycle(date, cycleId)` → SELECT * FROM holidays WHERE date = ? AND academic_cycle_id = ?
- [x] `create(data)` → INSERT (academic_cycle_id, date, description)
- [x] `delete(id)` → DELETE FROM holidays WHERE id = ?

**2. HolidayService.js:**
- [x] `listHolidays(cycleId)` → lista feriados de um ciclo
  ```javascript
  async listHolidays(cycleId) {
    // Se cycleId não informado, usa o ciclo ativo
    const resolvedId = cycleId || (await AcademicCycleRepository.findActive())?.id;
    if (!resolvedId) throw new Error('Nenhum ciclo encontrado');
    return await HolidayRepository.findByCycle(resolvedId);
  }
  ```

- [x] `createHoliday(dto)` → cria feriado
  **Lógica de Negócio:**
  1. [x] Validar `date` obrigatório (formato YYYY-MM-DD)
  2. [x] Validar `academic_cycle_id` obrigatório
  3. [x] Verificar que o ciclo existe:
     - Se não existir: erro "Ciclo acadêmico não encontrado"
  4. [x] Validar que date está dentro do range do ciclo:
     - Se fora: erro "A data não pertence ao período do ciclo acadêmico"
  5. [x] Verificar duplicidade de feriado na mesma data/ciclo:
     - Se existir: erro "Já existe um feriado cadastrado nesta data para este ciclo"
  6. [x] `description` opcional (ex: "Carnaval", "Feriado Municipal")
  7. [x] Inserir e retornar feriado criado

- [x] `deleteHoliday(id)` → remove feriado
  **Lógica de Negócio:**
  1. [x] Feriado existe
  2. [x] Verificar que a data do feriado é >= HOJE:
     - Se já passou: erro "Não é possível remover um feriado de data passada"
  3. [x] Deletar e retornar sucesso

- [x] `isHoliday(date, cycleId)` → utility para verificar se uma data é feriado
  ```javascript
  async isHoliday(date, cycleId) {
    const holiday = await HolidayRepository.findByDateAndCycle(date, cycleId);
    return !!holiday;
  }
  ```

**3. HolidayController.js:**
- [x] `index(req, res)` → GET /api/holidays
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

- [x] `create(req, res)` → POST /api/holidays
  **Body esperado:**
  ```json
  {
    "academic_cycle_id": 1,
    "date": "2026-03-03",
    "description": "Carnaval"
  }
  ```

- [x] `destroy(req, res)` → DELETE /api/holidays/:id
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
- [x] GET /api/holidays retorna feriados do ciclo ativo (sem query param)
- [x] GET /api/holidays?cycle_id=1 retorna feriados de ciclo específico
- [x] POST cria feriado vinculado ao ciclo
- [x] Não pode criar feriado em data fora do range do ciclo (erro)
- [x] Não pode duplicar feriado na mesma data+ciclo (erro)
- [x] DELETE remove feriado de data futura
- [x] DELETE em feriado de data passada retorna erro
- [x] PROFESSOR não consegue criar/deletar (403)
- [x] Testado no Postman:
  - [x] Listar feriados do ciclo ativo
  - [x] Criar feriado com data válida
  - [x] Criar feriado em data fora do ciclo (deve falhar)
  - [x] Deletar feriado futuro
  - [x] Tentar deletar feriado passado (deve falhar)

**Status:** ✅ Concluído  
**Responsável:** Kaique
**Depende de:** F3-BE-01

---

## 🔹 Frontend

### [F3-FE-01] Tela de Gestão de Ciclos Acadêmicos

**Descrição:**  
Interface para ADMIN criar, visualizar e ativar ciclos letivos.

**Entregáveis:**
- [x] `src/pages/admin/AcademicCyclesPage.jsx`
- [x] `src/components/admin/AcademicCycleFormModal.jsx`
- [x] `src/services/academicCycle.service.js`

**Componentes:**

**1. Lista de Ciclos:**
- [x] DataGrid com colunas:
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
- [x] Botão no topo da página (ícone +)
- [x] Ao clicar: abre modal de criação

**4. Modal de Criação/Edição:**
- [x] Título dinâmico: "Novo Ciclo Acadêmico" ou "Editar [Nome]"
- [x] Formulário MUI com campos:
  - [x] TextField: Nome do ciclo (ex: "2026-1") — obrigatório
  - [x] DatePicker: Data de Início — obrigatório
  - [x] DatePicker: Data de Fim — obrigatório
  - [x] DatePicker: Fim do período exclusivo ADMIN — obrigatório
  - [x] Tooltip de ajuda no campo exclusivo admin: "Após esta data, professores também podem fazer reservas"
- [x] Botões: [Cancelar] [Salvar]

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
- [x] Botão "Ativar" (ícone play) — visível apenas em ciclos inativos
- [x] Modal de confirmação:
  ```
  "Ativar ciclo [Nome]?"
  "O ciclo ativo atual será desativado automaticamente."
  [Cancelar] [Confirmar]
  ```
- [x] Ao confirmar:
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
- [x] Se `cycles.length === 0`: exibir mensagem:
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
- [x] DataGrid carrega ciclos ao montar
- [x] Chip colorido diferencia ciclo ativo dos demais
- [x] Criar novo ciclo → aparece na lista como inativo
- [x] Não pode criar com nome duplicado (erro via toast)
- [x] Não pode criar com datas inválidas (validação frontend + backend)
- [x] Ativar ciclo → chip do antigo vira cinza, novo vira verde
- [x] Confirmação antes de ativar
- [x] Apenas ADMIN acessa (router protect)
- [x] Responsivo

**Status:** ✅ Concluído  
**Responsável:** Luiz
**Depende de:** F3-BE-01

---

### [F3-FE-02] Tela de Cadastro de Feriados

**Descrição:**  
Interface para ADMIN adicionar e remover feriados vinculados ao ciclo ativo.

**Entregáveis:**
- [x] `src/pages/admin/HolidaysPage.jsx`
- [x] `src/services/holiday.service.js`

**Componentes:**

**1. Header da Página:**
- [x] Exibir nome do ciclo ativo no topo: "Feriados — Ciclo 2026-1"
- [x] Se nenhum ciclo ativo: banner de alerta
  ```
  "⚠️ Nenhum ciclo acadêmico ativo. Ative um ciclo antes de cadastrar feriados."
  ```

**2. Lista de Feriados:**
- [x] DataGrid com colunas:
  - Data (formatada: ex. "03/03/2026")
  - Dia da Semana (ex. "Terça-feira") — calculado no frontend
  - Descrição (ex. "Carnaval")
  - Ações (Deletar)
- [x] Ordenado por data

**3. Estado do Componente:**
```javascript
const [holidays, setHolidays] = useState([]);
const [activeCycle, setActiveCycle] = useState(null);
const [loading, setLoading] = useState(true);
const [newDate, setNewDate] = useState(null);
const [newDescription, setNewDescription] = useState('');
```

**4. Formulário Inline de Adição:**
- [x] DatePicker: Selecionar data
- [x] TextField: Descrição (opcional, ex: "Tiradentes")
- [x] Botão "+ Adicionar Feriado"
- [x] Ao adicionar:
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
- [x] Botão "Deletar" (ícone lixeira)
- [x] Sem modal de confirmação (ação rápida)
- [x] Ao deletar:
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
- [x] Se `holidays.length === 0`: "Nenhum feriado cadastrado para este ciclo."

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
- [x] Página exibe o nome do ciclo ativo no header
- [x] Banner de alerta se nenhum ciclo ativo
- [x] Lista carrega feriados do ciclo ativo ao montar
- [x] Adicionar feriado com data e descrição → aparece na lista ordenada
- [X] Não pode adicionar feriado em data fora do ciclo (erro backend → toast)
- [x] Não pode adicionar feriado duplicado (erro backend → toast)
- [X] Deletar feriado → some da lista
- [x] Apenas ADMIN acessa
- [x] Responsivo

**Status:** 🟢 Concluido
**Responsável:** Luiz
**Depende de:** F3-BE-02, F3-FE-01

---

## 🔹 Teste Final de Fase

### [F3-INT-01] Teste de Integração da FASE 3

**Descrição:**  
Validar que ciclos e feriados funcionam end-to-end e estão prontos para suportar a lógica de reservas da Fase 4.

**Checklist de Testes:**

**Cenário 1: Criação e Ativação de Ciclo**
- [X] 1. ADMIN cria ciclo "2026-1" com datas válidas
- [X] 2. Ciclo aparece na lista com status Inativo
- [X] 3. ADMIN ativa o ciclo "2026-1"
- [X] 4. Ciclo exibe chip "Ativo"
- [X] 5. GET /api/academic-cycles/active retorna "2026-1"
- [X] 6. ADMIN cria segundo ciclo "2026-2"
- [X] 7. ADMIN ativa "2026-2"
- [X] 8. "2026-1" passa a ficar Inativo, "2026-2" fica Ativo
- [X] 9. Tentar ativar "2026-2" novamente → erro claro
- [x] 10. PROFESSOR tenta criar ciclo → 403

**Cenário 2: Validações de Ciclo**
- [X] 1. Criar ciclo com nome duplicado → erro "Já existe um ciclo com este nome"
- [x] 2. Criar ciclo com start_date >= end_date → erro
- [x] 3. Criar ciclo com exclusive_admin_end_date > start_date → erro
- [x] 4. Tentar editar ciclo ativo → erro "Não é possível editar um ciclo ativo"

**Cenário 3: Gestão de Feriados**
- [x] 1. Com ciclo "2026-1" ativo, ADMIN acessa tela de feriados
- [x] 2. Header exibe "Feriados — Ciclo 2026-1"
- [x] 3. ADMIN adiciona feriado "03/03/2026 - Carnaval"
- [x] 4. Feriado aparece na lista
- [x] 5. Tentar adicionar outro feriado em "03/03/2026" → erro "Já existe um feriado nesta data"
- [x] 6. Tentar adicionar feriado em data fora do range do ciclo → erro
- [x] 7. ADMIN remove o feriado de Carnaval → some da lista
- [x] 8. PROFESSOR tenta POST /holidays → 403

**Cenário 4: Proteção de Rotas**
- [x] 1. GET /api/academic-cycles sem token → 401
- [x] 2. GET /api/academic-cycles/active com token PROFESSOR → 200
- [x] 3. POST /api/academic-cycles com token PROFESSOR → 403
- [x] 4. POST /api/holidays com token PROFESSOR → 403
- [x] 5. GET /api/holidays com token PROFESSOR → 200

**Critérios de Aceite:**
- [x] Todos os 4 cenários passam sem bugs
- [x] Nenhum console.error no frontend
- [x] Nenhum erro 500 no backend
- [x] GET /api/academic-cycles/active retorna dados corretos
- [x] Pronto para avançar para FASE 4

**Status:** 🟢 Concluído  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F3-* concluídas

---


# 🔵 FASE 4 – Reservas Simples (Core Básico)

**Requisitos:** RF10, RF14, RNF04, RNF05  
**Status Geral:** 🟢 Concluído  
**Meta:** Professores podem reservar um laboratório para um dia e horário específico

---

## 🔹 Backend

### [F4-BE-01] Lógica de Detecção de Conflitos

**Descrição:**  
Verificar se um laboratório já está ocupado no horário solicitado antes de criar a reserva. É o coração do sistema — deve ser preciso e eficiente.

**Entregáveis:**

**1. ReservationRepository.js (métodos de conflito):**
- [x] `findConflicting(labId, date, timeSlotIds)` → detecta conflito
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

- [x] `findByProfessorAndDateRange(professorId, startDate, endDate)` → reservas do professor
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
- [x] `checkConflict(labId, date, timeSlotIds)` → retorna detalhes do conflito
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
- [x] GET `/api/reservations/check-conflict?lab_id=1&date=2026-03-10&time_slots=1,2,3`
- [x] GET `/api/reservations/check-conflict?lab_id=1&date=2026-03-10&time_slots=1,2,3`
  - Permite o frontend verificar disponibilidade antes de submeter o formulário
  - Retorna `{ hasConflict: boolean, conflictingSlots: number[] }`

**Critérios de Aceite:**
- [x] `findConflicting` retorna apenas reservas ACTIVE na data+lab+timeslots solicitados
- [x] Não retorna reservas CANCELLED ou REJECTED como conflito
- [x] GET /check-conflict responde em tempo real (< 200ms) (RNF05)
- [x] Testado no Postman:
  - [x] Verificar lab livre → `{ hasConflict: false }`
  - [x] Verificar lab ocupado → `{ hasConflict: true, conflictingSlots: [...] }`

**Status:** 🟢 concluído  
**Responsável:** Nicole  
**Depende de:** F2-BE-02, F3-BE-01

---

### [F4-BE-02] Criação de Reserva Simples

**Descrição:**  
Endpoint para criar uma reserva de 1 dia com todos os validadores de negócio encadeados.

**Entregáveis:**

**1. ReservationRepository.js (adicionar métodos):**
- [x] `create(data)` → INSERT na tabela `reservations`
  ```javascript
  // data = { professor_id, academic_cycle_id, type: 'SIMPLE', status, notes }
  async create(data) {
    const result = await db.query(
      'INSERT INTO reservations SET ?', [data]
    );
    return { id: result.insertId, ...data };
  }
  ```

- [x] `createItem(data)` → INSERT na tabela `reservation_items`
  ```javascript
  // data = { reservation_id, lab_id, date, time_slot_id, status: 'ACTIVE' }
  async createItem(data) {
    const result = await db.query(
      'INSERT INTO reservation_items SET ?', [data]
    );
    return { id: result.insertId, ...data };
  }
  ```

- [x] `findById(id)` → SELECT reserva com seus items
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

- [x] `findByProfessor(professorId)` → SELECT todas as reservas de um professor com items

**2. ReservationService.js:**
- [x] `createSimpleReservation(dto, requestingUser)` → cria reserva simples
  **Lógica de Negócio (em ordem):**
  1. [x] Validar campos obrigatórios:
     - `lab_id`, `date`, `time_slot_ids` (array, mínimo 1)
  2. [x] Buscar ciclo ativo:
     - Se nenhum ativo: erro "Nenhum ciclo acadêmico ativo. Não é possível criar reservas."
  3. [x] Validar que `date` está dentro do ciclo ativo (RF05):
     - Se fora: erro "A data não pertence ao ciclo acadêmico ativo"
  4. [x] Verificar se `date` é feriado (RF07 / RN03):
     - Se feriado: erro "Não é possível reservar em feriados"
  5. [x] Verificar período exclusivo ADMIN (RF19):
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
  6. [x] Validar que o laboratório existe e está ativo:
     - Se não: erro "Laboratório não encontrado ou inativo"
  7. [x] Validar que todos os time_slots existem e estão ativos:
     - Se algum não: erro "Horário inválido: [id]"
  8. [x] Detectar conflito de horário (RF14):
     ```javascript
     const { hasConflict, conflictingSlots } =
       await ConflictService.checkConflict(lab_id, date, time_slot_ids);
     ```
     - Se PROFESSOR e hasConflict: erro "Conflito de horário detectado nos seguintes períodos: [slots]"
     - Se ADMIN e hasConflict: log de aviso mas **não bloqueia**
  9. [x] Definir status da reserva:
     ```javascript
     const status = requestingUser.role === 'ADMIN'
       ? 'APPROVED'
       : 'APPROVED'; // Reserva simples PROFESSOR = aprovação automática se sem conflito
     ```
  10. [x] Criar reserva (tabela `reservations`):
      ```javascript
      const reservation = await ReservationRepository.create({
        professor_id: requestingUser.id,
        academic_cycle_id: activeCycle.id,
        type: 'SIMPLE',
        status,
        notes: dto.notes || null
      });
      ```
  11. [x] Criar os items da reserva (tabela `reservation_items`) — 1 item por time_slot:
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
  12. [x] Registrar em audit_logs
  13. [x] Retornar reserva completa com items

- [x] `getMyReservations(professorId)` → lista reservas do professor
  ```javascript
  async getMyReservations(professorId) {
    return await ReservationRepository.findByProfessor(professorId);
  }
  ```

**3. ReservationController.js:**
- [x] `create(req, res)` → POST /api/reservations
  **Body esperado:**
  ```json
  {
    "lab_id": 2,
    "date": "2026-03-10",
    "time_slot_ids": [1, 2],
    "notes": "Aula de Banco de Dados — opcional"
  }
  ```

- [x] `myReservations(req, res)` → GET /api/reservations/my
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
- [x] POST /api/reservations cria reserva + items na transação
- [x] Professor não pode reservar em feriado (erro claro)
- [x] Professor não pode reservar fora do ciclo ativo (erro claro)
- [x] Professor não pode reservar no período exclusivo ADMIN (erro com data)
- [x] Professor não pode reservar lab com conflito (erro com slots conflitantes)
- [x] ADMIN pode criar reserva com conflito (aprovação forçada)
- [x] Reserva criada com sucesso retorna objeto completo com items
- [x] Testado no Postman:
  - [x] Criar reserva em lab/data/horário livre → 201
  - [x] Criar reserva em mesmo lab/data/horário → conflito → erro
  - [x] Criar reserva em feriado → erro
  - [x] Criar reserva fora do ciclo → erro
  - [x] ADMIN cria reserva sobre conflito existente → 201

**Status:** 🟢 Concluído
**Responsável:** Vinicius
**Depende de:** F4-BE-01

---

## 🔹 Frontend

### [F4-FE-01] Formulário de Criação de Reserva Simples

**Descrição:**  
Interface para professores solicitarem reserva de laboratório para um dia específico, com detecção visual de conflitos em tempo real.

**Entregáveis:**
- [x] `src/pages/professor/CreateReservationPage.jsx`
- [x] `src/services/reservation.service.js`

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
- [x] **Select: Laboratório**
  - Opções: todos os labs ativos
  - Obrigatório

- [x] **DatePicker: Data**
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

- [x] **Checkboxes: Horários (Time Slots)**
  - Grid de checkboxes (2 colunas): M1, M2, M3... N1, N2...
  - Cada checkbox mostra: nome + horário (ex: "M1 — 07:30 às 08:20")
  - Checkbox com conflito exibe ícone de alerta ⚠️ e cor laranja

- [x] **TextField: Observações** (multiline, opcional)

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
- [x] DatePicker bloqueia datas fora do ciclo ativo
- [x] DatePicker mostra feriados desabilitados
- [x] Ao selecionar lab + data + horários, verificação de conflito é disparada
- [x] Banner de conflito aparece em < 1s após seleção (RNF05)
- [x] Checkboxes com conflito ficam visuais em laranja/alerta
- [x] Botão "Criar Reserva" fica desabilitado se conflito detectado
- [x] Submit com dados válidos → redireciona para "Minhas Reservas"
- [x] Erros do backend exibidos em toast
- [x] Responsivo

**Status:** 💚 Concluida 
**Responsável:** kaique
**Depende de:** F4-BE-02, F3-FE-01

---

### [F4-FE-02] Visualização de Minhas Reservas

**Descrição:**  
Professor vê lista de todas as suas reservas com status e detalhes do laboratório.

**Entregáveis:**
- [x] `src/pages/professor/MyReservationsPage.jsx`

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
- [x] Colunas:
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
- [x] Select no topo: Todos | Aprovadas | Pendentes | Canceladas | Rejeitadas

**5. Botão "Nova Reserva":**
- [x] Botão no topo: navega para `/create-reservation`

**6. Estado Vazio:**
- [x] Se `reservations.length === 0`:
  ```
  "Você ainda não tem reservas."
  [+ Criar primeira reserva]
  ```

**Critérios de Aceite:**
- [x] DataGrid carrega reservas do professor logado
- [x] Status com chip colorido correto
- [x] Filtro por status funciona
- [x] Botão "Nova Reserva" navega corretamente
- [x] Estado vazio com call-to-action
- [x] Responsivo

**Status:** 🟢 Concluído  
**Responsável:** kaique
**Depende de:** F4-BE-02, F4-FE-01

---

## 🔹 Teste Final de Fase

### [F4-INT-01] Teste de Integração da FASE 4

**Descrição:**
Validar o fluxo completo de criação de reservas com todos os validadores de negócio ativos e a lógica de conflito funcionando end-to-end.

**Checklist de Testes:**

**Cenário 1: Reserva Bem-Sucedida (Professor)**
- [x] 1. Garantir ciclo ativo com start_date no passado e exclusive_admin_end_date também no passado
- [x] 2. Professor faz login
- [x] 3. Acessa "Criar Reserva"
- [x] 4. Seleciona Lab 01, data válida dentro do ciclo, horários M1 e M2
- [x] 5. Banner de disponível aparece (sem conflito)
- [x] 6. Clica em "Criar Reserva"
- [x] 7. Redirecionado para "Minhas Reservas"
- [x] 8. Reserva aparece com status "APROVADA"

**Cenário 2: Detecção de Conflito**
- [x] 1. Com a reserva do Cenário 1 existente (Lab 01, mesma data, M1 e M2)
- [x] 2. Outro professor tenta reservar Lab 01, mesma data, M1
- [x] 3. Banner de conflito aparece imediatamente ao selecionar M1
- [x] 4. Checkbox M1 exibe ícone de alerta visual
- [x] 5. Botão "Criar Reserva" fica desabilitado
- [x] 6. Tentativa via API direta (Postman) também retorna erro 400 com mensagem

**Cenário 3: Validações de Negócio**
- [x] 1. Professor tenta reservar em feriado cadastrado → erro "Não é possível reservar em feriados"
- [x] 2. Professor tenta reservar em data fora do ciclo ativo → erro
- [x] 3. DatePicker bloqueia visualmente as datas fora do ciclo e feriados
- [x] 4. Professor tenta reservar durante período exclusivo ADMIN → erro com data de abertura
- [x] 5. Professor submete sem selecionar horário → validação frontend bloqueia

**Cenário 4: Reserva de ADMIN (com conflito)**
- [x] 1. Lab 01 já tem reserva em M1 no dia X (do Cenário 1)
- [x] 2. ADMIN loga e cria reserva no mesmo Lab 01, dia X, horário M1
- [x] 3. Reserva é criada com status APPROVED (sem bloquear por conflito)
- [x] 4. Ambas as reservas existem na base (log de conflito registrado)

**Cenário 5: Visualização de Minhas Reservas**
- [x] 1. Professor loga e acessa "Minhas Reservas"
- [x] 2. Todas as reservas do professor aparecem listadas
- [x] 3. Filtro "Aprovadas" exibe apenas reservas APPROVED
- [x] 4. Filtro "Pendentes" não retorna nada (reservas simples aprovam direto)
- [x] 5. Botão "Nova Reserva" redireciona para o formulário

**Cenário 6: Proteção de Rotas e Dados**
- [x] 1. GET /api/reservations/my sem token → 401
- [x] 2. Professor A não consegue ver reservas do Professor B
- [x] 3. POST /api/reservations com token inválido → 401
- [x] 4. GET /api/reservations/check-conflict sem token → 401

**Critérios de Aceite:**
- [x] Todos os 6 cenários passam sem bugs
- [x] Verificação de conflito responde em < 1s (RNF05)
- [x] Nenhum console.error no frontend
- [x] Nenhum erro 500 no backend
- [x] Base de dados consistente: toda reserva tem ao menos 1 reservation_item
- [x] Pronto para avançar para FASE 5

**Status:** 🟢 Concluído  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F4-* concluídas

---

# 🟣 FASE 5 – Reservas Recorrentes

**Requisitos:** RF11, RF12, RF13  
**Status Geral:** 🟢 Concluído  
**Meta:** Professores solicitam reservas recorrentes (semanas) e ADMINs aprovam, rejeitam ou redirecionam

---

## 🔹 Backend

### [F5-BE-01] Criação de Reserva Recorrente

**Descrição:**  
Permitir reservas em múltiplas datas de uma vez, com dias da semana selecionados dentro de um intervalo. Professor entra com status PENDING; ADMIN entra direto como APPROVED. Se qualquer data tiver conflito, toda a operação é revertida (rollback).

**Entregáveis:**

**1. RecurrenceHelper.js (utilitário novo):**
- [x] `generateDates(startDate, endDate, weekdays, holidays, cycleStart, cycleEnd)` → gera array de datas válidas
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
- [x] `findConflictingBulk(labId, dates, timeSlotIds)` → detecta conflitos em múltiplas datas
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

- [x] `createMany(reservationId, items)` → INSERT em lote de reservation_items
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
- [x] `createRecurringReservation(dto, requestingUser)` → cria reserva recorrente
  **Lógica de Negócio (em ordem):**
  1. [x] Validar campos obrigatórios:
     - `lab_id`, `start_date`, `end_date`, `weekdays` (array, mínimo 1), `time_slot_ids` (array, mínimo 1)
  2. [x] Validar `start_date < end_date`:
     - Se inválido: erro "Data de início deve ser anterior à data de fim"
  3. [x] Buscar ciclo ativo:
     - Se nenhum: erro "Nenhum ciclo acadêmico ativo"
  4. [x] Verificar período exclusivo ADMIN (RF19):
     - Se hoje <= exclusive_admin_end_date e role != ADMIN: erro com data de abertura
  5. [x] Buscar feriados do ciclo ativo
  6. [x] Gerar array de datas com `RecurrenceHelper.generateDates`:
     - Se array vazio: erro "Nenhuma data válida encontrada no período selecionado para os dias da semana escolhidos"
  7. [x] Validar que todas as datas estão dentro do ciclo:
     - (já garantido pelo generateDates, mas logar se alguma for descartada)
  8. [x] Detectar conflitos em lote (RN05):
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
  9. [x] Definir status:
     ```javascript
     const status = requestingUser.role === 'ADMIN' ? 'APPROVED' : 'PENDING';
     ```
  10. [x] **Iniciar transação** no banco
  11. [x] Criar reserva pai (tabela `reservations`):
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
  12. [x] Criar todos os items em lote:
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
  13. [x] **Commit da transação**
  14. [x] Registrar em audit_logs
  15. [x] Retornar reserva com total de ocorrências geradas:
      ```javascript
      return {
        ...reservation,
        total_occurrences: generatedDates.length,
        total_items: allItems.length
      };
      ```

**4. ReservationController.js (adaptar):**
- [x] `create(req, res)` → já existente — adicionar branch para `type`:
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
- [x] POST com `type: RECURRING` gera N reservation_items (1 por data×timeslot)
- [x] Feriados e datas fora do ciclo são ignorados silenciosamente
- [x] Se QUALQUER data tiver conflito → rollback, nenhum item criado
- [x] PROFESSOR cria com status PENDING
- [x] ADMIN cria com status APPROVED
- [x] Retorno inclui `total_occurrences` geradas
- [x] Testado no Postman:
  - [x] Criar recorrente sem conflito → 201 com `total_occurrences`
  - [x] Criar recorrente com conflito em 1 data → rollback, erro com datas
  - [x] Verificar que nenhum item foi criado após rollback

**Status:** 🟢 Concluído
**Responsável:** Vinicius 
**Depende de:** F4-BE-02

---

### [F5-BE-02] Aprovação / Rejeição / Redirecionamento de Reservas

**Descrição:**  
ADMIN gerencia reservas com status PENDING. Pode aprovar, rejeitar com motivo, ou redirecionar para outro laboratório.

**Entregáveis:**

**1. ReservationRepository.js (adicionar métodos):**
- [x] `updateStatus(id, status, extra = {})` → atualiza status + campos extras
  ```javascript
  async updateStatus(id, status, extra = {}) {
    const fields = { status, ...extra };
    await db.query('UPDATE reservations SET ? WHERE id = ?', [fields, id]);
    return await this.findById(id);
  }
  ```

- [x] `findPending(filters = {})` → lista reservas PENDING
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

- [x] `redirectItems(reservationId, newLabId)` → atualiza lab de todos os items
  ```javascript
  async redirectItems(reservationId, newLabId) {
    await db.query(
      'UPDATE reservation_items SET lab_id = ? WHERE reservation_id = ?',
      [newLabId, reservationId]
    );
  }
  ```

**2. ReservationService.js (adicionar métodos):**
- [x] `approveReservation(reservationId, adminId)` → aprova reserva
  **Lógica de Negócio:**
  1. [x] Reserva existe
  2. [x] Validar status = PENDING:
     - Se != PENDING: erro "Apenas reservas pendentes podem ser aprovadas"
  3. [x] Verificar novamente se não há conflitos nas datas (re-check no momento da aprovação):
     - Se conflito surgiu desde a criação: erro "Conflito de horário identificado. Rejeite ou redirecione."
  4. [x] Atualizar:
     ```javascript
     await ReservationRepository.updateStatus(reservationId, 'APPROVED', {
       approved_by: adminId,
       approval_date: new Date()
     });
     ```
  5. [x] Registrar em audit_logs
  6. [x] Retornar reserva atualizada

- [x] `rejectReservation(reservationId, adminId, reason)` → rejeita reserva
  **Lógica de Negócio:**
  1. [x] Validar `reason` não vazio:
     - Se vazio: erro "Motivo da rejeição é obrigatório"
  2. [x] Reserva existe e status = PENDING
  3. [x] Atualizar:
     ```javascript
     await ReservationRepository.updateStatus(reservationId, 'REJECTED', {
       approved_by: adminId,
       approval_date: new Date(),
       rejection_reason: reason
     });
     ```
     - Atualizar também todos os `reservation_items` para status = 'CANCELLED'
  4. [x] Registrar em audit_logs
  5. [x] Retornar reserva atualizada

- [x] `redirectReservation(reservationId, adminId, newLabId, reason)` → redireciona para outro lab
  **Lógica de Negócio:**
  1. [x] Reserva existe e status = PENDING
  2. [x] `newLabId` existe e está ativo
  3. [x] `reason` obrigatório (ex: "Lab original em manutenção")
  4. [x] Verificar conflito no novo lab para todas as datas da reserva:
     - Se conflito: erro "Novo laboratório também possui conflito nas datas da reserva"
  5. [x] Atualizar items para o novo lab:
     ```javascript
     await ReservationRepository.redirectItems(reservationId, newLabId);
     ```
  6. [x] Aprovar a reserva:
     ```javascript
     await ReservationRepository.updateStatus(reservationId, 'APPROVED', {
       approved_by: adminId,
       approval_date: new Date(),
       redirect_reason: reason,
       redirected_lab_id: newLabId
     });
     ```
  7. [x] Registrar em audit_logs com `oldValues = { lab_id: originalLabId }`
  8. [x] Retornar reserva atualizada

- [x] `listPendingReservations()` → lista reservas pendentes com dados relacionados

**3. ReservationController.js (adicionar):**
- [x] `approve(req, res)` → PUT /api/reservations/:id/approve
- [x] `reject(req, res)` → PUT /api/reservations/:id/reject
  **Body:** `{ "reason": "Motivo" }`
- [x] `redirect(req, res)` → PUT /api/reservations/:id/redirect
  **Body:** `{ "new_lab_id": 3, "reason": "Lab original em manutenção" }`
- [x] `pending(req, res)` → GET /api/reservations/pending (ADMIN only)

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
- [x] GET /pending retorna apenas reservas com status PENDING
- [x] Aprovar reserva → status muda para APPROVED, `approved_by` preenchido
- [x] Não pode aprovar reserva que não é PENDING (erro claro)
- [x] Rejeitar sem motivo → erro "Motivo obrigatório"
- [x] Rejeitar com motivo → status REJECTED + items CANCELLED
- [x] Redirecionar → verifica conflito no novo lab antes de aprovar
- [x] PROFESSOR não consegue acessar nenhuma rota de aprovação (403)
- [x] Testado no Postman:
  - [x] Criar reserva recorrente como professor → PENDING
  - [x] ADMIN lista pendentes → aparece na lista
  - [x] ADMIN aprova → status APPROVED
  - [x] Criar outra reserva recorrente → PENDING
  - [x] ADMIN rejeita sem motivo → erro
  - [x] ADMIN rejeita com motivo → REJECTED
  - [x] Criar terceira recorrente → ADMIN redireciona para outro lab → APPROVED

**Status:** 🟢 Concluído  
**Responsável:** Kaique C.  
**Depende de:** F5-BE-01

---

## 🔹 Frontend

### [F5-FE-01] Formulário de Reserva Recorrente

**Descrição:**  
Expandir `CreateReservationPage.jsx` com toggle entre reserva simples e recorrente. Alerta informativo para professores sobre status PENDING.

**Entregáveis:**
- [x] Atualizar `src/pages/professor/CreateReservationPage.jsx`

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
- [x] **DateRangePicker (ou dois DatePickers): Início e Fim**
  - `minDate` = activeCycle.start_date
  - `maxDate` = activeCycle.end_date

- [x] **Checkboxes: Dias da Semana**
  ```javascript
  const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  // Renderizar linha de checkboxes compacta
  ```
  - Sábado e Domingo desabilitados por padrão (institucional)
  - Ao menos 1 dia obrigatório

- [x] **Preview de Datas Geradas:**
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
- [x] Adaptar o `useEffect` de conflito para aceitar o payload recorrente
- [x] Banner de conflito agora exibe: "Conflito detectado em X ocorrência(s): 02/03 (M1), 09/03 (M1)..."

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
- [x] Toggle troca entre modos SIMPLE e RECURRING sem perder dados dos campos comuns
- [x] Preview de datas atualiza em tempo real ao mudar range ou dias da semana
- [x] Banner informativo aparece para PROFESSOR no modo recorrente
- [x] Verificação de conflito funciona no modo recorrente
- [x] Submit envia payload correto para cada tipo
- [x] Após criar recorrente: toast com `total_occurrences`
- [x] Professor redirecionado para "Minhas Reservas" com status PENDING visível
- [x] Responsivo

**Status:** 🟢 Concluído  
**Responsável:** Vinicius
**Depende de:** F5-BE-01, F4-FE-01

---

### [F5-FE-02] Painel de Aprovação de Reservas

**Descrição:**  
Tela exclusiva do ADMIN para gerenciar reservas pendentes com ações de aprovar, rejeitar e redirecionar.

**Entregáveis:**
- [x] `src/pages/admin/PendingReservationsPage.jsx`
- [x] `src/components/admin/RejectReservationModal.jsx`
- [x] `src/components/admin/RedirectReservationModal.jsx`
- [x] Atualizar `src/services/reservation.service.js`

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
- [x] Colunas:
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
- [x] Ao clicar na linha: expandir e mostrar todas as datas geradas em chips

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
- [x] Confirmação simples: "Aprovar esta reserva?"

**5. Modal: Rejeitar**
- [x] `RejectReservationModal.jsx`
  ```
  "Rejeitar reserva de [Professor]"
  
  Motivo da rejeição: (obrigatório)
  [Textarea 3 linhas]
  
  [Cancelar] [Rejeitar]
  ```
- [x] Ao confirmar:
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
- [x] `RedirectReservationModal.jsx`
  ```
  "Redirecionar reserva de [Professor]"
  
  Laboratório Original: Lab 01 (desabilitado)
  
  Novo Laboratório: [Select — lista labs ativos]
  
  Motivo do redirecionamento: (obrigatório)
  [TextField]
  
  [Cancelar] [Redirecionar e Aprovar]
  ```
- [x] Ao confirmar:
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
- [x] Se `reservations.length === 0`:
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
- [x] DataGrid carrega reservas PENDING ao montar
- [x] Aprovar → remove da lista + toast
- [x] Rejeitar sem motivo → erro de validação no modal
- [x] Rejeitar com motivo → remove da lista + toast
- [x] Redirecionar com novo lab e motivo → remove da lista + toast
- [x] Redirecionar para lab com conflito → erro claro no modal
- [x] Estado vazio com mensagem de sucesso
- [x] Apenas ADMIN acessa (router protect)
- [x] Responsivo

**Status:** 🟢 Concluído
**Responsável:** Vinicius  
**Depende de:** F5-BE-02, F3-FE-01

---

## 🔹 Teste Final de Fase

### [F5-INT-01] Teste de Integração da FASE 5

**Descrição:**  
Validar o fluxo completo de reservas recorrentes, desde a solicitação até aprovação/rejeição/redirecionamento.

**Checklist de Testes:**

**Cenário 1: Criação de Reserva Recorrente (Professor)**
- [x] 1. Professor loga e acessa "Criar Reserva"
- [x] 2. Seleciona modo "Reserva Recorrente"
- [x] 3. Banner informativo sobre status PENDING aparece
- [x] 4. Seleciona Lab 01, período 01/03 a 30/06, dias: Seg e Qua, horários M1 e M2
- [x] 5. Preview exibe "Serão geradas X ocorrências"
- [x] 6. Submete — toast com "X ocorrências criadas. Aguardando aprovação."
- [x] 7. Em "Minhas Reservas": reserva aparece com status PENDING
- [x] 8. POST direto no Postman → retorno inclui `total_occurrences`

**Cenário 2: Rollback por Conflito**
- [x] 1. Com reserva do Cenário 1 existente (Lab 01, Seg M1)
- [x] 2. Outro professor tenta criar recorrente: Lab 01, Seg, M1, mesmo período
- [x] 3. Erro retornado com datas conflitantes
- [x] 4. Verificar no banco: nenhum `reservation_item` novo criado

**Cenário 3: Aprovação pelo ADMIN**
- [x] 1. ADMIN loga e acessa painel de aprovações
- [x] 2. Reserva do Professor (Cenário 1) aparece na lista com tipo "RECORRENTE"
- [x] 3. ADMIN clica em "Aprovar"
- [x] 4. Confirmação → ADMIN confirma
- [x] 5. Reserva some da lista de pendentes
- [x] 6. Professor acessa "Minhas Reservas" → status agora APPROVED

**Cenário 4: Rejeição pelo ADMIN**
- [x] 1. Professor cria nova reserva recorrente → PENDING
- [x] 2. ADMIN abre modal de rejeição
- [x] 3. Tenta rejeitar sem motivo → erro "Motivo obrigatório"
- [x] 4. Preenche motivo "Lab em reforma" → confirma
- [x] 5. Reserva some do painel de pendentes
- [x] 6. Professor acessa "Minhas Reservas" → status REJECTED com motivo visível

**Cenário 5: Redirecionamento pelo ADMIN**
- [x] 1. Professor cria reserva recorrente para Lab 01 → PENDING
- [x] 2. ADMIN abre modal de redirecionamento
- [x] 3. Seleciona Lab 02, motivo "Lab 01 em manutenção"
- [x] 4. Confirma → reserva some do painel de pendentes
- [x] 5. Professor acessa "Minhas Reservas" → status APPROVED, lab exibe "Lab 02"
- [x] 6. Tentar redirecionar para lab com conflito → erro claro no modal

**Cenário 6: Proteção de Rotas**
- [x] 1. PROFESSOR tenta GET /api/reservations/pending → 403
- [x] 2. PROFESSOR tenta PUT /api/reservations/1/approve → 403
- [x] 3. PROFESSOR tenta PUT /api/reservations/1/reject → 403
- [x] 4. Sem token: todas as rotas → 401

**Critérios de Aceite:**
- [x] Todos os 6 cenários passam sem bugs
- [x] Rollback de conflito é atômico — banco limpo após erro
- [x] `total_occurrences` bate com a quantidade de datas geradas
- [x] Nenhum console.error no frontend
- [x] Nenhum erro 500 no backend
- [x] Pronto para avançar para FASE 6

**Status:** 🟢 Concluído  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F5-* concluídas

---

---

# 🟢 FASE 6 – Sobrescrita e Controle Avançado (ADMIN)

**Requisitos:** RF15, RF18, RF21, RNF04  
**Status Geral:** 💚 Concluído  
**Meta:** ADMIN tem controle total — pode forçar reservas, deletar em lote e auditoria garante rastreabilidade

---

## 🔹 Backend

### [F6-BE-01] Sobrescrita de Reserva

**Descrição:**  
ADMIN pode forçar uma reserva em horário já ocupado, cancelando a reserva existente. Toda a operação deve ser transacional (RNF04) e registrada em audit_logs (RF21).

**Entregáveis:**

**1. ReservationRepository.js (adicionar métodos):**
- [x] `cancelItem(itemId, reason = 'OVERWRITTEN')` → cancela item específico
  ```javascript
  async cancelItem(itemId, reason = 'OVERWRITTEN') {
    await db.query(
      'UPDATE reservation_items SET status = ?, cancel_reason = ? WHERE id = ?',
      ['CANCELLED', reason, itemId]
    );
  }
  ```

- [x] `cancelReservationIfAllItemsCancelled(reservationId)` → verifica se todos os items foram cancelados e atualiza o status da reserva pai
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
- [x] `overwriteReservation(dto, adminId)` → sobrescreve reserva existente
  **Lógica de Negócio:**
  1. [x] Validar campos: `lab_id`, `date`, `time_slot_ids`, `notes` (opcional)
  2. [x] Validar que o ciclo está ativo
  3. [x] Verificar que NÃO é feriado
  4. [x] Detectar conflitos existentes:
     ```javascript
     const conflicts = await ReservationRepository.findConflicting(
       dto.lab_id, dto.date, dto.time_slot_ids
     );
     if (conflicts.length === 0) {
       throw new Error('Não há conflito a sobrescrever. Use a criação normal de reserva.');
     }
     ```
  5. [x] **Iniciar transação**
  6. [x] Para cada item em conflito: cancelar o item e verificar a reserva pai:
     ```javascript
     for (const conflictItem of conflicts) {
       await ReservationRepository.cancelItem(conflictItem.id, 'OVERWRITTEN');
       await ReservationRepository.cancelReservationIfAllItemsCancelled(
         conflictItem.reservation_id
       );
     }
     ```
  7. [x] Criar nova reserva para o ADMIN:
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
  8. [x] **Commit da transação**
  9. [x] Registrar em audit_logs com todos os IDs sobrescritos:
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
  10. [x] Retornar:
      ```javascript
      return {
        new_reservation: reservation,
        overwritten_count: conflicts.length,
        overwritten_reservation_ids: [...new Set(conflicts.map(c => c.reservation_id))]
      };
      ```

**3. ReservationController.js (adicionar):**
- [x] `overwrite(req, res)` → POST /api/reservations/overwrite
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
- [x] POST /overwrite cancela items conflitantes e cria nova reserva na mesma transação
- [x] Se todos os items de uma reserva forem cancelados, a reserva pai também é CANCELLED
- [x] Se não houver conflito, retorna erro (use rota normal)
- [x] Retorno inclui `overwritten_count` e IDs das reservas afetadas
- [x] audit_logs registra a sobrescrita com IDs antigos e novo
- [x] PROFESSOR não consegue acessar (403)
- [x] Testado no Postman:
  - [x] Criar reserva normal → reservar mesmo horário via overwrite → verificar cancelamento
  - [x] Tentar overwrite sem conflito → erro
  - [x] Verificar audit_logs após overwrite

**Status:** 💚 Concluído  
**Responsável:** kaique
**Depende de:** F5-BE-01

---

### [F6-BE-02] Exclusão Múltipla de Reservas

**Descrição:**  
Deletar várias reservas de uma vez. Cada ID é validado individualmente e a operação é transacional — ou cancela todas ou nenhuma (RNF04).

**Entregáveis:**

**1. ReservationRepository.js (adicionar métodos):**
- [x] `findManyByIds(ids)` → SELECT * FROM reservations WHERE id IN (?)
- [x] `cancelManyWithItems(ids)` → cancela reservas e seus items em lote
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
- [x] `bulkDeleteReservations(ids, requestingUser)` → cancela múltiplas reservas
  **Lógica de Negócio:**
  1. [x] Validar `ids` é array não vazio:
     - Se vazio: erro "Selecione ao menos uma reserva para cancelar"
  2. [x] Buscar todas as reservas pelos IDs
  3. [x] Validar que todas existem:
     - Se algum ID não encontrado: erro "Reservas não encontradas: [ids]"
  4. [x] Validar permissões por role:
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
  5. [x] Validar que nenhuma já está CANCELLED:
     - Se alguma: erro "Reservas já canceladas: [ids]. Remova-as da seleção."
  6. [x] Validar que professor não cancela reservas com data passada:
     - ADMIN: pode cancelar qualquer data
     - PROFESSOR: apenas reservas com itens de data >= hoje
  7. [x] **Iniciar transação**
  8. [x] `cancelManyWithItems(ids)`
  9. [x] **Commit**
  10. [x] Registrar em audit_logs para cada ID
  11. [x] Retornar `{ cancelled_count: ids.length, ids }`

**3. ReservationController.js (adicionar):**
- [x] `bulkDelete(req, res)` → DELETE /api/reservations/bulk
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
- [x] DELETE /bulk cancela todas as reservas do array em uma transação
- [x] PROFESSOR só pode cancelar suas próprias reservas (403 semântico para as alheias)
- [x] ADMIN pode cancelar qualquer reserva
- [x] Não pode cancelar reservas já CANCELLED (erro claro)
- [x] Rollback se qualquer validação falhar — nenhuma cancelada parcialmente
- [x] Testado no Postman:
  - [x] Cancelar 3 reservas próprias (professor) → sucesso
  - [x] Tentar cancelar reserva de outro professor → erro
  - [x] ADMIN cancela qualquer reserva → sucesso
  - [x] Tentar cancelar IDs inexistentes → erro

**Status:** 💚 Concluído
**Responsável:** Nicole
**Depende de:** F4-BE-02

---

### [F6-BE-03] Sistema de Auditoria

**Descrição:**  
Centralizar e padronizar o registro de ações críticas na tabela `audit_logs`. Garante rastreabilidade completa (RF21).

**Entregáveis:**

**1. AuditRepository.js:**
- [x] `create(data)` → INSERT em audit_logs
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

- [x] `findByRecord(tableName, recordId)` → histórico de um registro
- [x] `findByUser(userId, limit = 50)` → histórico de ações de um usuário

**2. AuditService.js (criar ou formalizar):**
- [x] `log(action, tableName, recordId, changedBy, oldValues, newValues)` → registra ação
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
- [x] F2-BE-01: approveUser, rejectUser
- [x] F3-BE-01: activateCycle
- [x] F4-BE-02: createSimpleReservation
- [x] F5-BE-01: createRecurringReservation
- [x] F5-BE-02: approveReservation, rejectReservation, redirectReservation
- [x] F6-BE-01: overwriteReservation
- [x] F6-BE-02: bulkDeleteReservations

**4. AuditController.js (ADMIN only):**
- [x] `getByRecord(req, res)` → GET /api/audit/:table/:id
- [x] `getByUser(req, res)` → GET /api/audit/user/:userId

**5. routes/audit.routes.js:**
```javascript
// ADMIN only
router.get('/user/:userId', verifyToken, authorize(['ADMIN']), AuditController.getByUser);
router.get('/:table/:id', verifyToken, authorize(['ADMIN']), AuditController.getByRecord);
```

**Critérios de Aceite:**
- [x] AuditService.log() nunca lança exceção para cima (erro isolado no catch)
- [x] Todas as operações críticas registram em audit_logs após a implementação retroativa
- [x] GET /api/audit/:table/:id retorna histórico ordenado por created_at DESC
- [x] old_values e new_values gravados como JSON válido
- [x] PROFESSOR não consegue acessar rotas de audit (403)
- [x] Testado no Postman:
  - [x] Após ativar ciclo: GET /audit/academic_cycles/:id → exibe log ACTIVATE
  - [x] Após aprovar reserva: GET /audit/reservations/:id → exibe log APPROVE
  - [x] Após overwrite: log OVERWRITE com IDs sobrescritos

**Status:** 💚 Concluído  
**Responsável:** -  
**Depende de:** F6-BE-01, F6-BE-02

---

## 🔹 Frontend

### [F6-FE-01] Interface de Sobrescrita

**Descrição:**  
ADMIN pode sobrescrever uma reserva existente diretamente do formulário de criação, com confirmação explícita e aviso de impacto.

**Entregáveis:**
- [x] Atualizar `src/pages/professor/CreateReservationPage.jsx` (usado pelo ADMIN também)
- [x] `src/components/admin/OverwriteConfirmModal.jsx`

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
- [x] `OverwriteConfirmModal.jsx`
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
- [x] Botão "Sobrescrever" aparece APENAS para ADMIN quando há conflito
- [x] Professor com conflito continua bloqueado (sem botão de sobrescrita)
- [x] Modal exibe lista de reservas que serão canceladas
- [x] Após confirmação: toast com count de reservas sobrescritas
- [x] Apenas ADMIN acessa a funcionalidade

**Status:** 🟢 Concluído 
**Responsável:** Kaique 
**Depende de:** F6-BE-01, F4-FE-01

---

### [F6-FE-02] Exclusão Múltipla

**Descrição:**  
Adicionar seleção múltipla e cancelamento em lote em `MyReservationsPage.jsx` (professor) e no painel do ADMIN.

**Entregáveis:**
- [x] Atualizar `src/pages/professor/MyReservationsPage.jsx`

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
- [x] Checkboxes aparecem no DataGrid de "Minhas Reservas"
- [x] Barra de ações aparece ao selecionar ao menos 1 reserva
- [x] Confirmação antes de cancelar
- [x] Após cancelamento: reservas somem da lista
- [x] Tentar cancelar reserva de outro professor → erro claro
- [x] ADMIN no painel de reservas também usa a seleção múltipla
- [x] Responsivo

**Status:** 💚 Concluído  
**Responsável:** Kaique
**Depende de:** F6-BE-02, F4-FE-02

---

## 🔹 Teste Final de Fase

### [F6-INT-01] Teste de Integração da FASE 6

**Descrição:**  
Validar sobrescrita transacional, exclusão múltipla e rastreabilidade completa via audit_logs.

**Checklist de Testes:**

**Cenário 1: Sobrescrita de Reserva (ADMIN)**
- [x] 1. Professor cria reserva: Lab 01, 10/03, M1 → APPROVED
- [x] 2. ADMIN acessa formulário de criação
- [x] 3. Seleciona Lab 01, 10/03, M1 → banner de conflito com botão "Sobrescrever"
- [x] 4. ADMIN abre modal — lista a reserva do Professor
- [x] 5. ADMIN confirma sobrescrita
- [x] 6. Toast: "1 reserva anterior cancelada"
- [x] 7. Professor acessa "Minhas Reservas" → sua reserva agora está CANCELLED
- [x] 8. GET /audit/reservations/:newId → log OVERWRITE com ID da reserva antiga
- [x] 9. Tentar overwrite sem conflito → erro "Não há conflito a sobrescrever"

**Cenário 2: Transação de Sobrescrita (Atomicidade)**
- [x] 1. Simular falha no meio da transação (mock ou força erro)
- [x] 2. Verificar que a reserva antiga NÃO foi cancelada
- [x] 3. Verificar que a nova reserva NÃO foi criada
- [x] 4. Banco de dados limpo (nenhuma reserva parcial)

**Cenário 3: Exclusão Múltipla**
- [x] 1. Professor cria 3 reservas simples
- [x] 2. Seleciona todas no DataGrid
- [x] 3. Barra de ações aparece com contador "3 reserva(s) selecionada(s)"
- [x] 4. Confirma cancelamento → toast "3 reserva(s) cancelada(s)"
- [x] 5. Reservas somem da lista
- [x] 6. Tentar cancelar reserva de outro professor via API direta → erro de permissão

**Cenário 4: Auditoria Completa**
- [x] 1. Após ativar ciclo: GET /api/audit/academic_cycles/:id → log ACTIVATE
- [x] 2. Após aprovar reserva: GET /api/audit/reservations/:id → log APPROVE com `approved_by`
- [x] 3. Após sobrescrita: log OVERWRITE com `overwritten_item_ids`
- [x] 4. Após bulk cancel: log BULK_CANCEL com array de IDs
- [x] 5. PROFESSOR tenta GET /api/audit/... → 403
- [x] 6. Simular falha no AuditService → operação principal continua funcionando normalmente

**Cenário 5: Proteção de Rotas e Integridade**
- [x] 1. PROFESSOR tenta POST /api/reservations/overwrite → 403
- [x] 2. DELETE /api/reservations/bulk com IDs mistos (próprios + alheios) → erro parcial claro
- [x] 3. Tentar bulk delete de IDs já CANCELLED → erro claro
- [x] 4. Transação com IDs inválidos → rollback, nenhum ID cancelado

**Critérios de Aceite:**
- [x] Todos os 5 cenários passam sem bugs
- [x] Atomicidade comprovada: nunca há estado parcial no banco
- [x] audit_logs preenchido para todas as ações críticas
- [x] AuditService nunca derruba operação principal
- [x] Nenhum console.error no frontend
- [x] Nenhum erro 500 no backend
- [x] Pronto para avançar para FASE 7

**Status:** 💚 Concluído  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F6-* concluídas

---

# 🔴 FASE 7 – Notificações e Comunicação

**Requisitos:** RF16, RF17  
**Status Geral:** 💚 Concluído  
**Meta:** Admins recebem alerta de novas solicitações; professores recebem confirmações de aprovação, rejeição e sobrescrita

---

## 🔹 Backend

### [F7-BE-01] Sistema de Eventos (EventBus)

**Descrição:**  
Implementar padrão Observer com Node.js EventEmitter para desacoplar os serviços de negócio das notificações. Nenhum service de reserva deve importar diretamente o EmailService.

**Entregáveis:**

**1. events/EventBus.js:**
```javascript
const { EventEmitter } = require('events');

// Singleton — mesma instância em toda a aplicação
const EventBus = new EventEmitter();

// Aumentar limite para evitar warning em produção
EventBus.setMaxListeners(20);

module.exports = EventBus;
```

**2. events/reservation.events.js (listeners):**
- [x] Definir e registrar todos os listeners de reserva
  ```javascript
  const EventBus = require('./EventBus');
  const EmailService = require('../services/EmailService');
  
  // RF16 — Nova solicitação de reserva recorrente → notificar ADMINs
  EventBus.on('reservation:created:pending', async ({ reservation, professor }) => {
    try {
      await EmailService.notifyAdminsNewRequest({ reservation, professor });
    } catch (err) {
      console.error('[Event reservation:created:pending] Falha no email:', err.message);
    }
  });
  
  // RF17 — Reserva sobrescrita → notificar professor afetado
  EventBus.on('reservation:overwritten', async ({ affectedProfessor, newReservation, cancelledItems }) => {
    try {
      await EmailService.notifyProfessorOverwritten({ affectedProfessor, newReservation, cancelledItems });
    } catch (err) {
      console.error('[Event reservation:overwritten] Falha no email:', err.message);
    }
  });
  
  // Reserva aprovada → notificar professor
  EventBus.on('reservation:approved', async ({ reservation, professor }) => {
    try {
      await EmailService.notifyProfessorApproved({ reservation, professor });
    } catch (err) {
      console.error('[Event reservation:approved] Falha no email:', err.message);
    }
  });
  
  // Reserva rejeitada → notificar professor
  EventBus.on('reservation:rejected', async ({ reservation, professor, reason }) => {
    try {
      await EmailService.notifyProfessorRejected({ reservation, professor, reason });
    } catch (err) {
      console.error('[Event reservation:rejected] Falha no email:', err.message);
    }
  });
  
  console.log('[EventBus] Listeners de reserva registrados');
  ```

**3. Emitir eventos nos Services existentes:**

- [x] **ReservationService.createRecurringReservation** — emitir após criar com status PENDING:
  ```javascript
  // Ao final do método, após commit:
  if (status === 'PENDING') {
    const professor = await UserRepository.findById(requestingUser.id);
    EventBus.emit('reservation:created:pending', { reservation, professor });
  }
  ```

- [x] **ReservationService.approveReservation** — emitir após aprovar:
  ```javascript
  const professor = await UserRepository.findById(reservation.professor_id);
  EventBus.emit('reservation:approved', { reservation, professor });
  ```

- [x] **ReservationService.rejectReservation** — emitir após rejeitar:
  ```javascript
  const professor = await UserRepository.findById(reservation.professor_id);
  EventBus.emit('reservation:rejected', { reservation, professor, reason });
  ```

- [x] **OverwriteService.overwriteReservation** — emitir para cada professor afetado:
  ```javascript
  // Para cada reserva única afetada pela sobrescrita:
  for (const affectedId of overwritten_reservation_ids) {
    const affectedReservation = await ReservationRepository.findById(affectedId);
    const affectedProfessor = await UserRepository.findById(affectedReservation.professor_id);
    EventBus.emit('reservation:overwritten', {
      affectedProfessor,
      newReservation: reservation,
      cancelledItems: conflicts.filter(c => c.reservation_id === affectedId)
    });
  }
  ```

**4. Registrar listeners na inicialização do servidor (app.js ou server.js):**
```javascript
// Importar uma vez para registrar todos os listeners
require('./events/reservation.events');
```

**Critérios de Aceite:**
- [x] EventBus é singleton (mesmo require retorna mesma instância)
- [x] Falha em listener nunca propaga erro para o service emissor
- [x] `reservation:created:pending` dispara apenas quando status = PENDING (recorrente de professor)
- [x] `reservation:overwritten` dispara para cada professor com reserva cancelada
- [x] `reservation:approved` e `reservation:rejected` disparam após ações do ADMIN
- [x] Listeners registrados ao iniciar o servidor (log de confirmação no console)
- [x] Testado localmente (pode ser com `console.log` temporário nos listeners antes de integrar email)

**Status:** 💚 Concluído  
**Responsável:** kaique
**Depende de:** F5-BE-01, F6-BE-01

---

### [F7-BE-02] Serviço de Email (Nodemailer)

**Descrição:**  
Enviar emails assíncronos via SMTP com templates HTML para cada tipo de notificação.

**Entregáveis:**

**Instalação:**
```bash
npm install nodemailer
```

**1. Variáveis de ambiente (.env):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sislab.fatec@gmail.com
SMTP_PASS=sua_app_password_aqui
EMAIL_FROM="SisLab Fatec ZL <sislab.fatec@gmail.com>"
```
> Para Gmail: usar App Password (não a senha da conta). Ativar autenticação de 2 fatores → Configurações → Senhas de app.

**2. services/EmailService.js:**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verificar conexão ao iniciar (não bloqueia startup)
transporter.verify().then(() => {
  console.log('[EmailService] SMTP conectado e pronto');
}).catch(err => {
  console.error('[EmailService] Falha na conexão SMTP:', err.message);
});

const EmailService = {

  async send({ to, subject, html }) {
    return await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
  },

  // RF16 — Nova solicitação pendente: notificar todos os ADMINs
  async notifyAdminsNewRequest({ reservation, professor }) {
    const admins = await UserRepository.findByRole('ADMIN');
    const adminEmails = admins.map(a => a.email).join(',');
    
    const html = templates.newRequest({ reservation, professor });
    await this.send({
      to: adminEmails,
      subject: `[SisLab] Nova solicitação de reserva — ${professor.name}`,
      html
    });
  },

  // RF17 — Reserva sobrescrita: notificar professor afetado
  async notifyProfessorOverwritten({ affectedProfessor, newReservation, cancelledItems }) {
    const html = templates.overwritten({ affectedProfessor, cancelledItems });
    await this.send({
      to: affectedProfessor.email,
      subject: '[SisLab] Sua reserva foi sobrescrita por um administrador',
      html
    });
  },

  // Reserva aprovada
  async notifyProfessorApproved({ reservation, professor }) {
    const html = templates.approved({ reservation, professor });
    await this.send({
      to: professor.email,
      subject: '[SisLab] ✅ Sua reserva foi aprovada!',
      html
    });
  },

  // Reserva rejeitada
  async notifyProfessorRejected({ reservation, professor, reason }) {
    const html = templates.rejected({ reservation, professor, reason });
    await this.send({
      to: professor.email,
      subject: '[SisLab] ❌ Sua reserva foi rejeitada',
      html
    });
  }
};

module.exports = EmailService;
```

**3. emails/templates.js (templates HTML):**
```javascript
const BASE_STYLE = `
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
`;

const HEADER = `
  <div style="background: #c0392b; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 22px;">SisLab — Fatec Zona Leste</h1>
  </div>
`;

const FOOTER = `
  <div style="background: #f5f5f5; padding: 12px; text-align: center; font-size: 12px; color: #888; margin-top: 24px;">
    Esta mensagem foi gerada automaticamente pelo SisLab. Não responda este email.
  </div>
`;

const templates = {

  newRequest: ({ reservation, professor }) => `
    <div style="${BASE_STYLE}">
      ${HEADER}
      <div style="padding: 24px;">
        <h2>Nova solicitação de reserva recorrente</h2>
        <p>O professor <strong>${professor.name}</strong> solicitou uma reserva recorrente.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Professor</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${professor.name} (${professor.email})</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Laboratório</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${reservation.lab_name || 'Ver sistema'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Período</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${reservation.recurrence_start} a ${reservation.recurrence_end}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Ocorrências</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${reservation.total_occurrences || '—'}</td></tr>
        </table>
        <p>Acesse o painel de aprovações para analisar esta solicitação.</p>
      </div>
      ${FOOTER}
    </div>
  `,

  overwritten: ({ affectedProfessor, cancelledItems }) => `
    <div style="${BASE_STYLE}">
      ${HEADER}
      <div style="padding: 24px;">
        <h2 style="color: #c0392b;">⚠️ Sua reserva foi sobrescrita</h2>
        <p>Olá, <strong>${affectedProfessor.name}</strong>.</p>
        <p>Um administrador sobrescreveu sua(s) reserva(s) nos seguintes horários:</p>
        <ul>
          ${cancelledItems.map(i =>
            `<li>${i.date} — Horário: ${i.time_slot_id}</li>`
          ).join('')}
        </ul>
        <p>Entre em contato com a coordenação se tiver dúvidas.</p>
      </div>
      ${FOOTER}
    </div>
  `,

  approved: ({ reservation, professor }) => `
    <div style="${BASE_STYLE}">
      ${HEADER}
      <div style="padding: 24px;">
        <h2 style="color: #27ae60;">✅ Reserva aprovada!</h2>
        <p>Olá, <strong>${professor.name}</strong>.</p>
        <p>Sua solicitação de reserva foi <strong>aprovada</strong>.</p>
        <p>Acesse o SisLab para ver os detalhes completos.</p>
      </div>
      ${FOOTER}
    </div>
  `,

  rejected: ({ reservation, professor, reason }) => `
    <div style="${BASE_STYLE}">
      ${HEADER}
      <div style="padding: 24px;">
        <h2 style="color: #c0392b;">❌ Reserva não aprovada</h2>
        <p>Olá, <strong>${professor.name}</strong>.</p>
        <p>Sua solicitação de reserva foi <strong>rejeitada</strong>.</p>
        <p><strong>Motivo:</strong> ${reason}</p>
        <p>Se tiver dúvidas, entre em contato com a coordenação.</p>
      </div>
      ${FOOTER}
    </div>
  `
};

module.exports = templates;
```

**Critérios de Aceite:**
- [x] `.env` configurado com credenciais SMTP (não commitar senha — usar `.env.example`)
- [x] `transporter.verify()` loga sucesso na inicialização
- [x] Email de nova solicitação chega para ADMIN ao criar reserva recorrente (professor)
- [x] Email de aprovação chega para professor ao ADMIN aprovar
- [x] Email de rejeição chega para professor com motivo visível
- [x] Email de sobrescrita chega para professor afetado com datas canceladas listadas
- [x] Falha de envio (SMTP fora) não derruba a operação (erro isolado no EventBus listener)
- [x] Templates respeitam identidade visual CPS (vermelho, branco, preto)
- [x] Testado com Mailtrap ou Gmail sandbox:
  - [x] Criar reserva recorrente → email para ADMIN
  - [x] ADMIN aprova → email para professor
  - [x] ADMIN rejeita → email para professor com motivo
  - [x] Sobrescrever reserva → email para professor afetado

**Status:** 💚 Concluído  
**Responsável:** kaique
**Depende de:** F7-BE-01

---

## 🔹 Frontend

### [F7-FE-01] Sistema de Notificações Toast

**Descrição:**  
Contexto global de notificações toast usando MUI Snackbar + Alert. Todas as páginas e componentes da aplicação usam este contexto para exibir feedback ao usuário.

**Entregáveis:**
- [x] `src/contexts/NotificationContext.jsx`
- [x] Integrar ao `App.jsx` (ou provider raiz)
- [x] Substituir qualquer `alert()` ou toast avulso existente pelo contexto

**Componentes:**

**1. NotificationContext.jsx:**
```javascript
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
    duration: 4000
  });

  const show = useCallback((message, severity = 'success', duration = 4000) => {
    setNotification({ open: true, message, severity, duration });
  }, []);

  // Atalhos semânticos
  const showSuccess = useCallback((msg) => show(msg, 'success'), [show]);
  const showError   = useCallback((msg) => show(msg, 'error', 6000), [show]); // erros ficam mais tempo
  const showWarning = useCallback((msg) => show(msg, 'warning'), [show]);
  const showInfo    = useCallback((msg) => show(msg, 'info'), [show]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%', minWidth: 300 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

// Hook de uso
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
}
```

**2. Integrar ao App.jsx:**
```javascript
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      {/* ... demais providers e rotas ... */}
    </NotificationProvider>
  );
}
```

**3. Uso nos componentes existentes:**
```javascript
// Em qualquer componente/página:
import { useNotification } from '../../contexts/NotificationContext';

function MinhaPage() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  async function handleAction() {
    try {
      await algumService.fazerAlgo();
      showSuccess('Operação realizada com sucesso!');
    } catch (error) {
      showError(error.response?.data?.error || 'Erro inesperado');
    }
  }
}
```

**4. Mapeamento de mensagens padronizadas:**

| Ação | Tipo | Mensagem |
|------|------|----------|
| Reserva simples criada | success | "Reserva criada com sucesso!" |
| Reserva recorrente criada | info | "Solicitação enviada com X ocorrências. Aguardando aprovação." |
| Reserva aprovada | success | "Reserva aprovada!" |
| Reserva rejeitada | warning | "Reserva rejeitada" |
| Conflito detectado | error | "Conflito detectado nos horários: M1, M2" |
| Período exclusivo ADMIN | warning | "Reservas abertas para professores após DD/MM" |
| Sobrescrita realizada | success | "Sobrescrita realizada! X reserva(s) cancelada(s)." |
| Bulk cancel realizado | success | "X reserva(s) cancelada(s)" |

**Critérios de Aceite:**
- [x] Toast aparece no canto inferior direito
- [x] Erros ficam visíveis por 6s; demais por 4s
- [x] Click fora ou no X fecha o toast
- [x] Apenas um toast visível por vez (novo substitui anterior)
- [x] `showError`, `showSuccess`, `showWarning`, `showInfo` funcionam em todos os componentes
- [x] Nenhum `alert()` nativo permanece na aplicação
- [x] `useNotification()` fora do provider lança erro descritivo

**Status:** 💚 Concluído  
**Responsável:** kaique
**Depende de:** F4-FE-01

---

## 🔹 Teste Final de Fase

### [F7-INT-01] Teste de Integração da FASE 7

**Descrição:**  
Validar o fluxo completo de notificações: eventos emitidos, emails enviados e toasts exibidos corretamente em cada cenário.

**Checklist de Testes:**

**Cenário 1: Notificação de Nova Solicitação (RF16)**
- [x] 1. Configurar Mailtrap (ou equivalente) como SMTP de testes
- [x] 2. Professor cria reserva recorrente → status PENDING
- [x] 3. ADMIN recebe email com assunto "[SisLab] Nova solicitação de reserva — [Nome]"
- [x] 4. Email contém nome do professor, laboratório, período e total de ocorrências
- [x] 5. ADMIN não recebe email quando reserva simples é criada (status APPROVED direto)
- [x] 6. Professor vê toast info: "Solicitação enviada com X ocorrências. Aguardando aprovação."

**Cenário 2: Notificação de Aprovação**
- [x] 1. ADMIN aprova reserva pendente
- [x] 2. Professor recebe email "[SisLab] ✅ Sua reserva foi aprovada!"
- [x] 3. ADMIN vê toast success: "Reserva aprovada!"
- [x] 4. Professor recarrega "Minhas Reservas" → status APPROVED visível

**Cenário 3: Notificação de Rejeição**
- [x] 1. ADMIN rejeita reserva com motivo "Lab em reforma"
- [x] 2. Professor recebe email "[SisLab] ❌ Sua reserva foi rejeitada"
- [x] 3. Email contém o motivo "Lab em reforma"
- [x] 4. ADMIN vê toast success: "Reserva rejeitada"

**Cenário 4: Notificação de Sobrescrita (RF17)**
- [x] 1. Professor A tem reserva APPROVED em Lab 01, 10/03, M1
- [x] 2. ADMIN sobrescreve o mesmo horário
- [x] 3. Professor A recebe email "⚠️ Sua reserva foi sobrescrita" com a data afetada listada
- [x] 4. ADMIN vê toast success: "Sobrescrita realizada! 1 reserva(s) cancelada(s)."

**Cenário 5: Resiliência de Email**
- [x] 1. Desconectar SMTP (credencial inválida)
- [x] 2. ADMIN aprova reserva
- [x] 3. Aprovação é salva no banco normalmente
- [x] 4. Nenhum erro 500 na API
- [x] 5. Console exibe "[Event reservation:approved] Falha no email: ..."
- [x] 6. Toast de sucesso aparece normalmente no frontend

**Cenário 6: Toast Global**
- [x] 1. Todas as ações CRUD exibem toast adequado (success/error/warning/info)
- [x] 2. Nenhum `alert()` nativo aparece em nenhum fluxo
- [x] 3. Toast de erro permanece 6s, demais 4s
- [x] 4. Múltiplas ações rápidas: apenas o último toast é exibido

**Critérios de Aceite:**
- [x] Todos os 6 cenários passam sem bugs
- [x] Falha de SMTP nunca derruba operação principal (verificado no Cenário 5)
- [x] Templates HTML renderizam corretamente nos clientes de email testados
- [x] Nenhum console.error não tratado no backend
- [x] Pronto para avançar para FASE 8

**Status:** 💚 Concluída  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F7-* concluídas

---

---

# 🟡 FASE 8 – Visualização e Calendário

**Requisitos:** RF20  
**Status Geral:** 🔴 PENDENTE  
**Meta:** Professores e ADMINs têm visão clara da ocupação dos laboratórios via calendário e métricas no dashboard

---

## 🔹 Backend

### [F8-BE-01] Endpoints de Agregação para Dashboard e Calendário

**Descrição:**  
Criar endpoints otimizados que retornam dados agregados para o calendário e para os cards do dashboard. Evitar N+1 queries no frontend.

**Entregáveis:**

**1. ReservationRepository.js (adicionar):**
- [x] `findByLabAndMonth(labId, year, month)` → reservas de um lab em um mês
  ```javascript
  async findByLabAndMonth(labId, year, month) {
    const query = `
      SELECT ri.date, ri.time_slot_id, ri.status,
             r.professor_id, r.status as reservation_status, r.type,
             u.name as professor_name,
             ts.name as time_slot_name, ts.start_time, ts.end_time
      FROM reservation_items ri
      INNER JOIN reservations r ON r.id = ri.reservation_id
      INNER JOIN users u ON u.id = r.professor_id
      INNER JOIN time_slots ts ON ts.id = ri.time_slot_id
      WHERE ri.lab_id = ?
        AND YEAR(ri.date) = ?
        AND MONTH(ri.date) = ?
        AND ri.status = 'ACTIVE'
        AND r.status IN ('APPROVED', 'PENDING')
      ORDER BY ri.date ASC, ts.start_time ASC
    `;
    return await db.query(query, [labId, year, month]);
  }
  ```

- [x] `getStats(cycleId)` → agregações para o dashboard
  ```javascript
  async getStats(cycleId) {
    const [activeCount] = await db.query(
      `SELECT COUNT(DISTINCT r.id) as count
       FROM reservations r WHERE r.academic_cycle_id = ? AND r.status = 'APPROVED'`,
      [cycleId]
    );
    const [pendingCount] = await db.query(
      `SELECT COUNT(DISTINCT r.id) as count
       FROM reservations r WHERE r.academic_cycle_id = ? AND r.status = 'PENDING'`,
      [cycleId]
    );
    const [labCount] = await db.query(
      `SELECT COUNT(*) as count FROM laboratories WHERE is_active = true`
    );
    return {
      active_reservations: activeCount.count,
      pending_reservations: pendingCount.count,
      active_labs: labCount.count
    };
  }
  ```

**2. ReservationController.js (adicionar):**
- [x] `calendarData(req, res)` → GET /api/reservations/calendar
  - Query params: `?lab_id=1&year=2026&month=3`
  ```javascript
  async calendarData(req, res) {
    try {
      const { lab_id, year, month } = req.query;
      if (!lab_id || !year || !month) {
        return res.status(400).json({ error: 'lab_id, year e month são obrigatórios' });
      }
      const items = await ReservationRepository.findByLabAndMonth(
        lab_id, year, month
      );
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ```

- [x] `stats(req, res)` → GET /api/reservations/stats
  ```javascript
  async stats(req, res) {
    try {
      const activeCycle = await AcademicCycleRepository.findActive();
      if (!activeCycle) return res.json({ active_reservations: 0, pending_reservations: 0, active_labs: 0 });
      const data = await ReservationRepository.getStats(activeCycle.id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ```

**3. routes/reservation.routes.js (adicionar):**
```javascript
// Autenticado — qualquer role
router.get('/calendar', verifyToken, ReservationController.calendarData);
router.get('/stats', verifyToken, ReservationController.stats);
```

**Critérios de Aceite:**
- [ ] GET /calendar retorna items agrupáveis por data para o frontend
- [ ] GET /stats retorna contagens corretas para o ciclo ativo
- [ ] Ambos retornam 200 com dados vazios (não 404) quando não há reservas
- [ ] PROFESSOR e ADMIN acessam ambos os endpoints

**Status:** 🟡 EM REVISÃO  
**Responsável:** Nicole Carvalho  
**Depende de:** F4-BE-02

---

## 🔹 Frontend

### [F8-FE-01] Calendário Visual de Reservas

**Descrição:**  
Visualização mensal da ocupação dos laboratórios com código de cores, filtro por lab e ação de criar reserva ao clicar em data disponível.

**Entregáveis:**
- [ ] `src/pages/CalendarPage.jsx`
- [ ] Instalar dependência: `npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction`

**Componentes:**

**1. Estado do Componente:**
```javascript
const [selectedLab, setSelectedLab] = useState('');
const [labs, setLabs] = useState([]);
const [events, setEvents] = useState([]);
const [holidays, setHolidays] = useState([]);
const [currentMonth, setCurrentMonth] = useState({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
});
const [loading, setLoading] = useState(false);
```

**2. Carregar Dados do Calendário:**
```javascript
useEffect(() => {
  if (!selectedLab) return;
  
  async function loadCalendar() {
    setLoading(true);
    try {
      const items = await reservationService.getCalendarData({
        lab_id: selectedLab,
        year: currentMonth.year,
        month: currentMonth.month
      });
      
      // Converter para formato FullCalendar
      const calEvents = items.map(item => ({
        id: `${item.date}-${item.time_slot_id}`,
        title: `${item.time_slot_name} — ${item.professor_name}`,
        date: item.date,
        color: item.reservation_status === 'PENDING' ? '#f39c12' : '#e74c3c',
        extendedProps: { ...item }
      }));
      
      // Adicionar feriados como eventos bloqueados
      const holidayEvents = holidays.map(h => ({
        id: `holiday-${h.date}`,
        title: h.description || 'Feriado',
        date: h.date,
        color: '#95a5a6',
        display: 'background'
      }));
      
      setEvents([...calEvents, ...holidayEvents]);
    } finally {
      setLoading(false);
    }
  }
  loadCalendar();
}, [selectedLab, currentMonth]);
```

**3. Renderizar FullCalendar:**
```javascript
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

<FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  locale="pt-br"
  events={events}
  dateClick={handleDateClick}  // Abrir modal de criação
  eventClick={handleEventClick} // Ver detalhes da reserva
  datesSet={({ view }) => {
    // Atualiza mês ao navegar
    setCurrentMonth({
      year: view.currentStart.getFullYear(),
      month: view.currentStart.getMonth() + 1
    });
  }}
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: ''
  }}
  height="auto"
/>
```

**4. Legenda de Cores:**
```javascript
<Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
  <Chip sx={{ bgcolor: '#e74c3c', color: 'white' }} label="Ocupado (Aprovado)" size="small" />
  <Chip sx={{ bgcolor: '#f39c12', color: 'white' }} label="Pendente" size="small" />
  <Chip sx={{ bgcolor: '#95a5a6', color: 'white' }} label="Feriado" size="small" />
  <Chip sx={{ bgcolor: '#27ae60', color: 'white' }} label="Disponível" size="small" />
</Box>
```

**5. Click em Data Disponível:**
```javascript
function handleDateClick({ dateStr }) {
  // Verificar se é feriado ou data passada
  if (holidays.some(h => h.date === dateStr)) {
    showWarning('Esta data é feriado e não pode ser reservada');
    return;
  }
  if (new Date(dateStr) < new Date()) {
    showWarning('Não é possível reservar datas passadas');
    return;
  }
  // Navegar para criação com data pré-preenchida
  navigate(`/create-reservation?date=${dateStr}&lab=${selectedLab}`);
}
```

**6. Click em Evento Existente:**
- [ ] Abrir popover/tooltip com:
  - Professor
  - Horários
  - Status
  - Tipo (SIMPLES/RECORRENTE)

**7. Select de Laboratório:**
- [ ] Select no topo da página — obrigatório para carregar o calendário
- [ ] Placeholder: "Selecione um laboratório para visualizar"

**Atualizar src/services/reservation.service.js:**
```javascript
async getCalendarData({ lab_id, year, month }) {
  const response = await api.get(
    `/reservations/calendar?lab_id=${lab_id}&year=${year}&month=${month}`
  );
  return response.data;
}
```

**Critérios de Aceite:**
- [ ] Calendário exibe reservas APPROVED em vermelho e PENDING em amarelo
- [ ] Feriados aparecem como fundo cinza no dia
- [ ] Navegar para mês anterior/seguinte recarrega os dados
- [ ] Click em data disponível → navega para criação com data e lab pré-preenchidos
- [ ] Click em evento → exibe detalhes (professor, horários, status)
- [ ] Sem lab selecionado: calendário não carrega (placeholder visível)
- [ ] Loading visual enquanto busca dados do mês
- [ ] Responsivo (mobile: calendário em lista)

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F8-BE-01, F4-FE-01

---

### [F8-FE-02] Dashboard com Métricas

**Descrição:**  
Página inicial pós-login com cards de métricas contextuais por role e lista de próximas reservas do usuário.

**Entregáveis:**
- [ ] `src/pages/DashboardPage.jsx`
- [ ] `src/components/dashboard/StatCard.jsx`
- [ ] `src/components/dashboard/UpcomingReservations.jsx`

**Componentes:**

**1. StatCard.jsx (componente reutilizável):**
```javascript
function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color }}>{value}</Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}20`, color }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
```

**2. Estado do Dashboard:**
```javascript
const [stats, setStats] = useState(null);
const [myUpcoming, setMyUpcoming] = useState([]);
const [activeCycle, setActiveCycle] = useState(null);
const [loading, setLoading] = useState(true);
const { user } = useAuth(); // role: ADMIN | PROFESSOR
```

**3. Cards por Role:**

**Para PROFESSOR:**
```javascript
// Cards: Minhas reservas ativas | Reservas pendentes minhas | Próximas reservas
<Grid container spacing={3}>
  <Grid item xs={12} sm={4}>
    <StatCard
      title="Minhas Reservas Ativas"
      value={myStats.active}
      icon={<EventAvailableIcon />}
      color="#27ae60"
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <StatCard
      title="Aguardando Aprovação"
      value={myStats.pending}
      icon={<HourglassEmptyIcon />}
      color="#f39c12"
      subtitle="Reservas recorrentes pendentes"
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <StatCard
      title="Labs Disponíveis"
      value={stats?.active_labs || 0}
      icon={<ComputerIcon />}
      color="#2980b9"
    />
  </Grid>
</Grid>
```

**Para ADMIN:**
```javascript
// Cards: Total reservas ativas | Pendentes de aprovação | Labs ativos | Ciclo ativo
<Grid container spacing={3}>
  <Grid item xs={12} sm={3}>
    <StatCard title="Reservas Ativas" value={stats?.active_reservations} icon={<EventIcon />} color="#27ae60" />
  </Grid>
  <Grid item xs={12} sm={3}>
    <StatCard
      title="Pendentes de Aprovação"
      value={stats?.pending_reservations}
      icon={<PendingIcon />}
      color="#f39c12"
      subtitle={stats?.pending_reservations > 0 ? 'Requer atenção' : undefined}
    />
  </Grid>
  <Grid item xs={12} sm={3}>
    <StatCard title="Labs Ativos" value={stats?.active_labs} icon={<ComputerIcon />} color="#2980b9" />
  </Grid>
  <Grid item xs={12} sm={3}>
    <StatCard
      title="Ciclo Ativo"
      value={activeCycle?.name || '—'}
      icon={<SchoolIcon />}
      color="#8e44ad"
      subtitle={activeCycle ? `até ${activeCycle.end_date}` : 'Nenhum ciclo ativo'}
    />
  </Grid>
</Grid>
```

**4. UpcomingReservations.jsx:**
- [ ] Lista das próximas 5 reservas do usuário logado (data >= hoje, status APPROVED)
- [ ] Cada linha: Lab, Data, Horários, Tipo
- [ ] Botão "Ver todas" → navega para /my-reservations
- [ ] Se vazio: "Nenhuma reserva próxima. [+ Criar reserva]"

**5. Atalhos Rápidos (botões no dashboard):**
- [ ] PROFESSOR: "+ Nova Reserva" | "📅 Ver Calendário"
- [ ] ADMIN: "⏳ Aprovar Pendentes (N)" | "📅 Ver Calendário" | "⚙️ Gestão"

**Critérios de Aceite:**
- [ ] Cards exibem valores corretos do endpoint /stats
- [ ] ADMIN vê card de "Pendentes de Aprovação" com badge de alerta se > 0
- [ ] PROFESSOR não vê métricas gerais do sistema
- [ ] Próximas reservas listam apenas do usuário logado, ordenadas por data
- [ ] Atalhos rápidos funcionam (navegação correta)
- [ ] Responsivo: cards empilham em mobile (xs=12)
- [ ] Loading skeleton enquanto carrega os dados

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F8-BE-01, F7-FE-01

---

## 🔹 Teste Final de Fase

### [F8-INT-01] Teste de Integração da FASE 8

**Descrição:**  
Validar que o calendário reflete a realidade do banco e o dashboard exibe métricas corretas por role.

**Checklist de Testes:**

**Cenário 1: Calendário de Ocupação**
- [ ] 1. Garantir que Lab 01 tem reservas APPROVED e PENDING no mês atual
- [ ] 2. Acessar CalendarPage, selecionar Lab 01
- [ ] 3. Reservas APPROVED aparecem em vermelho nas datas corretas
- [ ] 4. Reservas PENDING aparecem em amarelo
- [ ] 5. Feriados aparecem como fundo cinza
- [ ] 6. Navegar para próximo mês → calendar recarrega dados do novo mês
- [ ] 7. Click em data disponível (não feriado, não passada) → navega com data pré-preenchida
- [ ] 8. Click em evento → popover exibe professor, horário e status

**Cenário 2: Calendário sem Lab Selecionado**
- [ ] 1. Acessar CalendarPage sem selecionar lab
- [ ] 2. Placeholder visível, calendário não carrega dados
- [ ] 3. Selecionar lab → calendário popula corretamente

**Cenário 3: Dashboard — Visão ADMIN**
- [ ] 1. ADMIN loga → redireciona para DashboardPage
- [ ] 2. 4 cards visíveis: Reservas Ativas, Pendentes, Labs Ativos, Ciclo Ativo
- [ ] 3. Card "Pendentes" exibe N corretamente (criar/aprovar reservas e verificar)
- [ ] 4. Card "Ciclo Ativo" exibe nome e data de fim do ciclo ativo
- [ ] 5. Próximas reservas listam apenas as do admin logado
- [ ] 6. Botão "Aprovar Pendentes" navega para o painel de pendentes

**Cenário 4: Dashboard — Visão PROFESSOR**
- [ ] 1. Professor loga → DashboardPage
- [ ] 2. Cards de sistema geral NÃO aparecem (pendentes totais, labs ativos globais)
- [ ] 3. Cards pessoais: Minhas Reservas Ativas, Aguardando Aprovação, Labs Disponíveis
- [ ] 4. "Aguardando Aprovação" mostra reservas recorrentes pendentes do professor
- [ ] 5. Próximas reservas pessoais listadas
- [ ] 6. Botão "+ Nova Reserva" navega para criação

**Cenário 5: Consistência de Dados**
- [ ] 1. Criar reserva → verificar que aparece no calendário E no dashboard
- [ ] 2. Cancelar reserva → verificar que some do calendário E stats diminuem
- [ ] 3. GET /api/reservations/stats retorna 200 quando não há ciclo ativo (objeto zerado)

**Critérios de Aceite:**
- [ ] Todos os 5 cenários passam sem bugs
- [ ] Calendário e dashboard são consistentes com o estado do banco
- [ ] Nenhum console.error no frontend
- [ ] Nenhum erro 500 no backend
- [ ] Pronto para avançar para FASE 9

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F8-* concluídas

---

---

# 🎯 FASE 9 – Refinamentos e Extras

**Status Geral:** 🔴 PENDENTE  
**Meta:** Polir a experiência do usuário, garantir responsividade total e entregar funcionalidades complementares de qualidade

---

## 🔹 Backend

### [F9-BE-01] Relatórios e Exportação

**Descrição:**  
Exportar listagem de reservas do ciclo ativo em CSV, permitindo que ADMINs gerem relatórios para controle institucional.

**Entregáveis:**

**Instalação:**
```bash
npm install json2csv
```

**1. ReservationRepository.js (adicionar):**
- [ ] `findForExport(filters)` → SELECT completo com JOINs para exportação
  ```javascript
  async findForExport(filters = {}) {
    let where = ['1=1'];
    const params = [];
    
    if (filters.cycle_id) {
      where.push('r.academic_cycle_id = ?');
      params.push(filters.cycle_id);
    }
    if (filters.status) {
      where.push('r.status = ?');
      params.push(filters.status);
    }
    if (filters.lab_id) {
      where.push('ri.lab_id = ?');
      params.push(filters.lab_id);
    }
    if (filters.start_date) {
      where.push('ri.date >= ?');
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      where.push('ri.date <= ?');
      params.push(filters.end_date);
    }
    
    const query = `
      SELECT
        r.id as reserva_id,
        u.name as professor,
        u.email as email_professor,
        l.name as laboratorio,
        ri.date as data,
        ts.name as horario,
        ts.start_time as inicio,
        ts.end_time as fim,
        r.type as tipo,
        r.status as status,
        r.notes as observacoes,
        r.created_at as data_solicitacao
      FROM reservations r
      INNER JOIN users u ON u.id = r.professor_id
      INNER JOIN reservation_items ri ON ri.reservation_id = r.id
      INNER JOIN laboratories l ON l.id = ri.lab_id
      INNER JOIN time_slots ts ON ts.id = ri.time_slot_id
      WHERE ${where.join(' AND ')}
      ORDER BY ri.date ASC, ts.start_time ASC
    `;
    return await db.query(query, params);
  }
  ```

**2. ReservationController.js (adicionar):**
- [ ] `exportCsv(req, res)` → GET /api/reservations/export
  ```javascript
  async exportCsv(req, res) {
    try {
      const { Parser } = require('json2csv');
      const activeCycle = await AcademicCycleRepository.findActive();
      
      const data = await ReservationRepository.findForExport({
        cycle_id: req.query.cycle_id || activeCycle?.id,
        status: req.query.status,
        lab_id: req.query.lab_id,
        start_date: req.query.start_date,
        end_date: req.query.end_date
      });
      
      if (data.length === 0) {
        return res.status(404).json({ error: 'Nenhum dado encontrado para exportação' });
      }
      
      const parser = new Parser({ withBOM: true }); // BOM para encoding PT-BR no Excel
      const csv = parser.parse(data);
      
      const filename = `sislab_reservas_${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  ```

**3. routes/reservation.routes.js (adicionar):**
```javascript
// ADMIN only
router.get('/export', verifyToken, authorize(['ADMIN']), ReservationController.exportCsv);
```

**Query params suportados:**
- `cycle_id` → filtrar por ciclo (default: ciclo ativo)
- `status` → APPROVED | PENDING | CANCELLED | REJECTED
- `lab_id` → filtrar por lab
- `start_date` / `end_date` → intervalo de datas

**Critérios de Aceite:**
- [ ] GET /export retorna arquivo .csv com headers corretos
- [ ] BOM UTF-8 incluído (colunas com acentos abrem corretamente no Excel)
- [ ] Filtros funcionam combinados ou separados
- [ ] Sem dados: retorna 404 com mensagem (não arquivo vazio)
- [ ] PROFESSOR não consegue acessar (403)
- [ ] Testado no Postman: download do CSV abre corretamente no Excel/Google Sheets

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F4-BE-02

---

## 🔹 Frontend

### [F9-FE-01] Responsividade Mobile

**Descrição:**  
Garantir que todas as páginas da aplicação funcionam em dispositivos móveis e tablets. Menu hambúrguer no mobile, DataGrids adaptados e formulários legíveis em tela pequena.

**Entregáveis:**
- [ ] `src/components/layout/AppLayout.jsx` (layout base com sidebar/drawer)
- [ ] Revisar todas as páginas com breakpoints MUI

**Componentes:**

**1. Layout Responsivo (AppLayout.jsx):**
```javascript
const DRAWER_WIDTH = 240;

function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar com hambúrguer no mobile */}
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6">SisLab</Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer: permanente no desktop, temporário no mobile */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{ width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        <SidebarMenu />
      </Drawer>

      {/* Conteúdo principal */}
      <Box component="main" sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        mt: '64px',
        ml: isMobile ? 0 : `${DRAWER_WIDTH}px`
      }}>
        {children}
      </Box>
    </Box>
  );
}
```

**2. Checklist de Responsividade por Página:**

- [ ] **DashboardPage** — cards em `xs=12 sm=6 md=3`, sem overflow horizontal
- [ ] **CalendarPage** — FullCalendar em `listWeek` no mobile (`initialView` condicional)
- [ ] **CreateReservationPage** — formulário full-width em mobile, checkboxes de time_slots em grid `xs=6`
- [ ] **MyReservationsPage** — DataGrid com `autoHeight`, scroll horizontal habilitado em mobile
- [ ] **AcademicCyclesPage** — DataGrid com colunas essenciais visíveis, demais ocultadas em mobile
- [ ] **HolidaysPage** — formulário inline empilhado verticalmente em mobile
- [ ] **PendingReservationsPage** — colunas reduzidas em mobile, ações em menu dropdown

**3. DataGrid Responsivo (padrão para todas as páginas):**
```javascript
// Ocultar colunas em mobile com `hideable`
const columns = [
  { field: 'professor_name', headerName: 'Professor', flex: 1, minWidth: 150 },
  { field: 'lab_name', headerName: 'Laboratório', flex: 1, minWidth: 120,
    hideable: true }, // Ocultar em xs
  { field: 'date', headerName: 'Data', width: 110 },
  { field: 'status', headerName: 'Status', width: 120,
    renderCell: (params) => <StatusChip status={params.value} /> },
  { field: 'actions', headerName: 'Ações', width: 120,
    renderCell: (params) => <ActionButtons row={params.row} /> }
];

<DataGrid
  rows={rows}
  columns={columns}
  autoHeight
  pageSizeOptions={[10, 25, 50]}
  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
  sx={{ '& .MuiDataGrid-root': { border: 'none' } }}
/>
```

**Critérios de Aceite:**
- [ ] Testado em 375px (iPhone SE), 768px (tablet), 1280px (desktop)
- [ ] Menu hambúrguer abre e fecha corretamente
- [ ] Sem overflow horizontal em nenhuma página
- [ ] Formulários utilizáveis com teclado virtual (campos com `inputMode` adequado)
- [ ] Calendário exibe modo lista no mobile (legível)
- [ ] DataGrids têm scroll horizontal quando necessário (não cortam dados)

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F4-FE-01, F8-FE-01

---

### [F9-FE-02] Tela de Perfil do Usuário

**Descrição:**  
Página para o usuário visualizar e editar seus dados pessoais e alterar a senha.

**Entregáveis:**
- [ ] `src/pages/ProfilePage.jsx`
- [ ] Atualizar `src/services/user.service.js` (adicionar métodos de perfil)
- [ ] Adicionar endpoints no backend: PUT /api/users/me e PUT /api/users/me/password

**1. Backend (adicionar antes de prosseguir para o frontend):**

- [ ] **UserService.js (adicionar):**
  - `updateProfile(userId, dto)` → atualiza name, department
    - Não permite alterar email (campo exibido mas desabilitado)
    - Retorna usuário atualizado
  - `changePassword(userId, currentPassword, newPassword)` → troca senha
    - Validar currentPassword com bcrypt.compare
    - Se inválida: erro "Senha atual incorreta"
    - newPassword mínimo 6 caracteres
    - Hash com bcrypt e atualizar

- [ ] **UserController.js (adicionar):**
  - `me(req, res)` → GET /api/users/me → retorna dados do usuário logado
  - `updateMe(req, res)` → PUT /api/users/me
  - `changePassword(req, res)` → PUT /api/users/me/password
    - Body: `{ current_password, new_password }`

- [ ] **routes/user.routes.js (adicionar):**
  ```javascript
  router.get('/me', verifyToken, UserController.me);
  router.put('/me', verifyToken, UserController.updateMe);
  router.put('/me/password', verifyToken, UserController.changePassword);
  ```

**2. Estado do Componente (frontend):**
```javascript
const [profileData, setProfileData] = useState({ name: '', email: '', department: '' });
const [passwordData, setPasswordData] = useState({
  current_password: '',
  new_password: '',
  confirm_password: ''
});
const [editingProfile, setEditingProfile] = useState(false);
const [savingProfile, setSavingProfile] = useState(false);
const [savingPassword, setSavingPassword] = useState(false);
```

**3. Seção: Dados Pessoais:**
- [ ] Avatar com inicial do nome (MUI Avatar)
- [ ] TextField: Nome — editável
- [ ] TextField: Email — desabilitado (não editável)
- [ ] TextField: Departamento — editável
- [ ] Chip: Role (ADMIN / PROFESSOR) — somente leitura
- [ ] Botão "Editar" → habilita campos
- [ ] Botões "Cancelar" | "Salvar" aparecem no modo edição

**4. Seção: Alterar Senha:**
- [ ] TextField: Senha Atual (type=password)
- [ ] TextField: Nova Senha (type=password, helperText: "Mínimo 6 caracteres")
- [ ] TextField: Confirmar Nova Senha (type=password)
- [ ] Validação: new_password === confirm_password antes de submeter
  ```javascript
  if (passwordData.new_password !== passwordData.confirm_password) {
    return showError('Nova senha e confirmação não coincidem');
  }
  ```
- [ ] Botão "Alterar Senha"

**5. Submit de Senha:**
```javascript
async function handleChangePassword() {
  if (passwordData.new_password.length < 6)
    return showError('Nova senha deve ter ao menos 6 caracteres');
  if (passwordData.new_password !== passwordData.confirm_password)
    return showError('Nova senha e confirmação não coincidem');
  
  setSavingPassword(true);
  try {
    await userService.changePassword({
      current_password: passwordData.current_password,
      new_password: passwordData.new_password
    });
    showSuccess('Senha alterada com sucesso!');
    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
  } catch (error) {
    showError(error.response?.data?.error || 'Erro ao alterar senha');
  } finally {
    setSavingPassword(false);
  }
}
```

**Atualizar src/services/user.service.js:**
```javascript
async getMe() {
  const response = await api.get('/users/me');
  return response.data;
},

async updateMe(data) {
  const response = await api.put('/users/me', data);
  return response.data;
},

async changePassword(data) {
  const response = await api.put('/users/me/password', data);
  return response.data;
}
```

**Critérios de Aceite:**
- [ ] Dados do perfil carregam corretamente ao montar
- [ ] Email não é editável (campo desabilitado)
- [ ] Editar nome/departamento → salva e exibe toast de sucesso
- [ ] Alterar senha com senha atual incorreta → erro claro
- [ ] Alterar senha com confirmação diferente → validação frontend bloqueia
- [ ] Alterar senha com sucesso → campos limpos
- [ ] Responsivo
- [ ] Qualquer role acessa /profile

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F1-BE-04, F7-FE-01

---

## 🔹 Teste Final de Fase

### [F9-INT-01] Teste de Integração da FASE 9

**Descrição:**  
Validar relatórios, responsividade e perfil do usuário, além de uma rodada final de smoke tests em todo o sistema.

**Checklist de Testes:**

**Cenário 1: Exportação de Relatório (CSV)**
- [ ] 1. ADMIN acessa GET /api/reservations/export → download de arquivo .csv
- [ ] 2. Abrir CSV no Excel → colunas sem caracteres corrompidos (acentos OK)
- [ ] 3. Filtrar por status=APPROVED → CSV contém apenas aprovadas
- [ ] 4. Filtrar por lab_id + start_date + end_date → dados filtrados corretamente
- [ ] 5. Filtro sem resultados → retorna 404, não arquivo vazio
- [ ] 6. PROFESSOR tenta acessar → 403

**Cenário 2: Responsividade Mobile**
- [ ] 1. Redimensionar browser para 375px (ou usar DevTools device mode)
- [ ] 2. Todas as páginas sem overflow horizontal
- [ ] 3. Menu hambúrguer abre sidebar
- [ ] 4. Formulário de criação de reserva utilizável no mobile
- [ ] 5. DataGrids com scroll horizontal (não cortam dados)
- [ ] 6. Calendário exibe modo lista (listWeek)

**Cenário 3: Perfil do Usuário**
- [ ] 1. Professor loga e acessa /profile
- [ ] 2. Dados carregam: nome, email (desabilitado), departamento, role chip
- [ ] 3. Clicar "Editar" → campos habilitam
- [ ] 4. Alterar nome → salvar → toast de sucesso → nome atualizado na sidebar
- [ ] 5. Tentar alterar senha com senha atual errada → erro "Senha atual incorreta"
- [ ] 6. Alterar senha corretamente → campos limpos + toast de sucesso
- [ ] 7. Fazer logout e login com nova senha → funciona

**Cenário 4: Smoke Tests Gerais (regressão)**
- [ ] 1. Cadastro de usuário → aprovação → login → funcional
- [ ] 2. Criar ciclo → ativar → criar feriado
- [ ] 3. Professor cria reserva simples → APPROVED → aparece no calendário e dashboard
- [ ] 4. Professor cria recorrente → PENDING → ADMIN aprova → professor recebe email
- [ ] 5. ADMIN sobrescreve → professor afetado recebe email → audit_log registrado
- [ ] 6. Professor cancela em lote (bulk) → reservas somem
- [ ] 7. ADMIN exporta CSV → abre corretamente no Excel

**Critérios de Aceite:**
- [ ] Todos os 4 cenários passam sem bugs
- [ ] Nenhum console.error no frontend em nenhum fluxo
- [ ] Nenhum erro 500 no backend em nenhum endpoint
- [ ] Smoke test geral (Cenário 4) valida o sistema como um todo
- [ ] SisLab pronto para entrega / demonstração

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F9-* concluídas


---

# 🚀 FASE 10 – Testes e Documentação

**Status Geral:** 🔴 PENDENTE  
**Meta:** Cobertura de testes automatizados ≥ 70% no backend, componentes React críticos cobertos, e documentação completa para entrega e manutenção

---

## 🔹 Backend

### [F10-BE-01] Testes Unitários (Jest)

**Descrição:**  
Testar Services e Repositories de forma isolada com mocks. Foco nas regras de negócio críticas: conflito de reservas, validações de ciclo, aprovação/rejeição e geração de datas recorrentes.

**Entregáveis:**

**Instalação e Configuração:**
```bash
npm install --save-dev jest @jest/globals
```

**jest.config.js (raiz do backend):**
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/services/**/*.js',
    'src/repositories/**/*.js',
    'src/utils/**/*.js',
    '!src/**/*.routes.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterFramework: ['<rootDir>/__tests__/setup.js']
};
```

**package.json (scripts):**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**__tests__/setup.js:**
```javascript
// Mock global do banco de dados
jest.mock('../src/database/db', () => ({
  query: jest.fn()
}));

// Limpar mocks entre testes
beforeEach(() => {
  jest.clearAllMocks();
});
```

---

**1. __tests__/services/ReservationService.test.js:**
- [ ] Suite: `createSimpleReservation`
  ```javascript
  describe('ReservationService.createSimpleReservation', () => {
    
    // Mock dos repositórios
    const mockCycle = {
      id: 1, name: '2026-1',
      start_date: '2026-02-01', end_date: '2026-06-30',
      exclusive_admin_end_date: '2026-01-25',
      is_active: true
    };
    const mockLab = { id: 1, name: 'Lab 01', is_active: true };
    const mockProfessor = { id: 10, role: 'PROFESSOR' };
    const mockAdmin = { id: 1, role: 'ADMIN' };
    
    test('deve criar reserva simples sem conflito', async () => {
      // Arrange
      AcademicCycleRepository.findActive.mockResolvedValue(mockCycle);
      HolidayRepository.findByDateAndCycle.mockResolvedValue(null); // não é feriado
      LaboratoryRepository.findById.mockResolvedValue(mockLab);
      ConflictService.checkConflict.mockResolvedValue({ hasConflict: false });
      ReservationRepository.create.mockResolvedValue({ id: 99, status: 'APPROVED' });
      ReservationRepository.createItem.mockResolvedValue({ id: 1 });
      
      // Act
      const result = await ReservationService.createSimpleReservation(
        { lab_id: 1, date: '2026-03-10', time_slot_ids: [1, 2] },
        mockProfessor
      );
      
      // Assert
      expect(result.status).toBe('APPROVED');
      expect(ReservationRepository.create).toHaveBeenCalledTimes(1);
      expect(ReservationRepository.createItem).toHaveBeenCalledTimes(2); // 2 time slots
    });
    
    test('deve lançar erro se data for feriado', async () => {
      AcademicCycleRepository.findActive.mockResolvedValue(mockCycle);
      HolidayRepository.findByDateAndCycle.mockResolvedValue({ id: 5, date: '2026-03-03' });
      
      await expect(
        ReservationService.createSimpleReservation(
          { lab_id: 1, date: '2026-03-03', time_slot_ids: [1] },
          mockProfessor
        )
      ).rejects.toThrow('Não é possível reservar em feriados');
    });
    
    test('deve lançar erro se data estiver fora do ciclo', async () => {
      AcademicCycleRepository.findActive.mockResolvedValue(mockCycle);
      HolidayRepository.findByDateAndCycle.mockResolvedValue(null);
      
      await expect(
        ReservationService.createSimpleReservation(
          { lab_id: 1, date: '2026-07-15', time_slot_ids: [1] }, // fora do ciclo
          mockProfessor
        )
      ).rejects.toThrow('A data não pertence ao ciclo acadêmico ativo');
    });
    
    test('deve lançar erro se professor reservar no período exclusivo ADMIN', async () => {
      const cycleWithActiveExclusive = {
        ...mockCycle,
        exclusive_admin_end_date: '2026-12-31' // ainda no período exclusivo
      };
      AcademicCycleRepository.findActive.mockResolvedValue(cycleWithActiveExclusive);
      HolidayRepository.findByDateAndCycle.mockResolvedValue(null);
      
      await expect(
        ReservationService.createSimpleReservation(
          { lab_id: 1, date: '2026-03-10', time_slot_ids: [1] },
          mockProfessor
        )
      ).rejects.toThrow(/Reservas abertas para professores apenas após/);
    });
    
    test('ADMIN deve criar reserva mesmo com conflito', async () => {
      AcademicCycleRepository.findActive.mockResolvedValue(mockCycle);
      HolidayRepository.findByDateAndCycle.mockResolvedValue(null);
      LaboratoryRepository.findById.mockResolvedValue(mockLab);
      ConflictService.checkConflict.mockResolvedValue({
        hasConflict: true,
        conflictingSlots: [1]
      });
      ReservationRepository.create.mockResolvedValue({ id: 100, status: 'APPROVED' });
      ReservationRepository.createItem.mockResolvedValue({ id: 2 });
      
      const result = await ReservationService.createSimpleReservation(
        { lab_id: 1, date: '2026-03-10', time_slot_ids: [1] },
        mockAdmin
      );
      
      expect(result.status).toBe('APPROVED'); // ADMIN não é bloqueado
    });
    
    test('PROFESSOR deve receber erro de conflito', async () => {
      AcademicCycleRepository.findActive.mockResolvedValue(mockCycle);
      HolidayRepository.findByDateAndCycle.mockResolvedValue(null);
      LaboratoryRepository.findById.mockResolvedValue(mockLab);
      ConflictService.checkConflict.mockResolvedValue({
        hasConflict: true,
        conflictingSlots: [1]
      });
      
      await expect(
        ReservationService.createSimpleReservation(
          { lab_id: 1, date: '2026-03-10', time_slot_ids: [1] },
          mockProfessor
        )
      ).rejects.toThrow(/Conflito de horário/);
    });
    
    test('deve lançar erro se nenhum ciclo estiver ativo', async () => {
      AcademicCycleRepository.findActive.mockResolvedValue(null);
      
      await expect(
        ReservationService.createSimpleReservation(
          { lab_id: 1, date: '2026-03-10', time_slot_ids: [1] },
          mockProfessor
        )
      ).rejects.toThrow('Nenhum ciclo acadêmico ativo');
    });
  });
  ```

- [ ] Suite: `approveReservation`
  ```javascript
  describe('ReservationService.approveReservation', () => {
    
    test('deve aprovar reserva PENDING', async () => {
      ReservationRepository.findById.mockResolvedValue({ id: 1, status: 'PENDING', professor_id: 10 });
      ConflictService.checkConflict.mockResolvedValue({ hasConflict: false });
      ReservationRepository.updateStatus.mockResolvedValue({ id: 1, status: 'APPROVED' });
      
      const result = await ReservationService.approveReservation(1, 99);
      
      expect(result.status).toBe('APPROVED');
      expect(ReservationRepository.updateStatus).toHaveBeenCalledWith(
        1, 'APPROVED', expect.objectContaining({ approved_by: 99 })
      );
    });
    
    test('deve lançar erro ao aprovar reserva não-PENDING', async () => {
      ReservationRepository.findById.mockResolvedValue({ id: 1, status: 'APPROVED' });
      
      await expect(
        ReservationService.approveReservation(1, 99)
      ).rejects.toThrow('Apenas reservas pendentes podem ser aprovadas');
    });
    
    test('deve lançar erro ao rejeitar sem motivo', async () => {
      await expect(
        ReservationService.rejectReservation(1, 99, '')
      ).rejects.toThrow('Motivo da rejeição é obrigatório');
    });
  });
  ```

---

**2. __tests__/utils/RecurrenceHelper.test.js:**
- [ ] Suite: `generateDates`
  ```javascript
  describe('RecurrenceHelper.generateDates', () => {
    
    const holidays = ['2026-03-03']; // Carnaval
    const cycleStart = '2026-02-01';
    const cycleEnd = '2026-06-30';
    
    test('deve gerar apenas segundas e quartas no período', () => {
      const dates = generateDates(
        '2026-03-01', '2026-03-31',
        [1, 3], // seg=1, qua=3
        holidays,
        cycleStart, cycleEnd
      );
      
      // Verificar que todas as datas são segunda ou quarta
      dates.forEach(d => {
        const day = new Date(d).getDay();
        expect([1, 3]).toContain(day);
      });
    });
    
    test('deve excluir feriados da lista gerada', () => {
      const dates = generateDates(
        '2026-03-01', '2026-03-10',
        [2], // terças
        ['2026-03-03'],
        cycleStart, cycleEnd
      );
      expect(dates).not.toContain('2026-03-03');
    });
    
    test('deve retornar array vazio se nenhum dia válido no período', () => {
      const dates = generateDates(
        '2026-03-01', '2026-03-07',
        [6], // apenas sábados
        [],
        cycleStart, cycleEnd
      );
      // Pode ser 1 sábado (07/03) dependendo do range — ajustar conforme calendário
      dates.forEach(d => {
        expect(new Date(d).getDay()).toBe(6);
      });
    });
    
    test('deve respeitar os limites do ciclo acadêmico', () => {
      const dates = generateDates(
        '2026-01-01', // antes do ciclo
        '2026-07-31', // depois do ciclo
        [1],
        [],
        cycleStart, cycleEnd
      );
      dates.forEach(d => {
        expect(d >= cycleStart).toBe(true);
        expect(d <= cycleEnd).toBe(true);
      });
    });
  });
  ```

---

**3. __tests__/services/AcademicCycleService.test.js:**
- [ ] Suite: `createCycle` e `activateCycle`
  ```javascript
  describe('AcademicCycleService', () => {
    
    test('deve lançar erro se start_date >= end_date', async () => {
      await expect(
        AcademicCycleService.createCycle({
          name: '2026-1',
          start_date: '2026-06-30',
          end_date: '2026-02-01', // invertido
          exclusive_admin_end_date: '2026-01-25'
        })
      ).rejects.toThrow('Data de início deve ser anterior à data de fim');
    });
    
    test('deve lançar erro se exclusive_admin_end_date > start_date', async () => {
      await expect(
        AcademicCycleService.createCycle({
          name: '2026-1',
          start_date: '2026-02-01',
          end_date: '2026-06-30',
          exclusive_admin_end_date: '2026-03-01' // depois do início
        })
      ).rejects.toThrow(/Período exclusivo/);
    });
    
    test('activateCycle deve desativar todos e ativar o selecionado', async () => {
      AcademicCycleRepository.findById.mockResolvedValue({ id: 2, is_active: false });
      AcademicCycleRepository.deactivateAll.mockResolvedValue();
      AcademicCycleRepository.activate.mockResolvedValue({ id: 2, is_active: true });
      
      await AcademicCycleService.activateCycle(2, 1);
      
      expect(AcademicCycleRepository.deactivateAll).toHaveBeenCalledTimes(1);
      expect(AcademicCycleRepository.activate).toHaveBeenCalledWith(2);
    });
    
    test('deve lançar erro ao ativar ciclo já ativo', async () => {
      AcademicCycleRepository.findById.mockResolvedValue({ id: 2, is_active: true });
      
      await expect(
        AcademicCycleService.activateCycle(2, 1)
      ).rejects.toThrow('Este ciclo já está ativo');
    });
  });
  ```

---

**4. __tests__/services/ConflictService.test.js:**
- [ ] Suite: `checkConflict`
  ```javascript
  describe('ConflictService.checkConflict', () => {
    
    test('deve retornar hasConflict: false quando lab livre', async () => {
      ReservationRepository.findConflicting.mockResolvedValue([]);
      
      const result = await ConflictService.checkConflict(1, '2026-03-10', [1, 2]);
      
      expect(result.hasConflict).toBe(false);
      expect(result.conflicts).toHaveLength(0);
    });
    
    test('deve retornar hasConflict: true e slots conflitantes', async () => {
      ReservationRepository.findConflicting.mockResolvedValue([
        { id: 5, time_slot_id: 1, date: '2026-03-10', reservation_id: 20 }
      ]);
      
      const result = await ConflictService.checkConflict(1, '2026-03-10', [1, 2]);
      
      expect(result.hasConflict).toBe(true);
      expect(result.conflictingSlots).toContain(1);
      expect(result.conflictingSlots).not.toContain(2); // slot 2 está livre
    });
  });
  ```

**Critérios de Aceite:**
- [ ] `npm test` executa todos os testes sem falhas
- [ ] `npm run test:coverage` exibe ≥ 70% em statements, branches, functions e lines
- [ ] Nenhum teste acessa banco real (tudo mockado)
- [ ] Testes de erro validam tanto a mensagem quanto o tipo de exceção
- [ ] Organização: 1 arquivo de teste por service/utility

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F6-BE-03

---

### [F10-BE-02] Testes de Integração (Supertest)

**Descrição:**  
Testar os endpoints da API end-to-end usando um banco de dados de teste, validando status HTTP, corpo das respostas e comportamento de permissões.

**Entregáveis:**

**Instalação:**
```bash
npm install --save-dev supertest
```

**Configuração do banco de teste:**

**.env.test:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=sislab_test   # banco separado do desenvolvimento
NODE_ENV=test
JWT_SECRET=test_secret_sislab
```

**__tests__/integration/setup.integration.js:**
```javascript
const db = require('../../src/database/db');

// Rodar antes de TODOS os testes de integração
beforeAll(async () => {
  // Aplicar migrations no banco de teste
  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.query('TRUNCATE TABLE reservation_items');
  await db.query('TRUNCATE TABLE reservations');
  await db.query('TRUNCATE TABLE holidays');
  await db.query('TRUNCATE TABLE academic_cycles');
  await db.query('TRUNCATE TABLE time_slots');
  await db.query('TRUNCATE TABLE laboratories');
  await db.query('TRUNCATE TABLE audit_logs');
  await db.query('TRUNCATE TABLE users');
  await db.query('SET FOREIGN_KEY_CHECKS = 1');
});

afterAll(async () => {
  await db.end(); // fechar pool de conexões
});
```

**Helpers de teste (__tests__/integration/helpers.js):**
```javascript
const request = require('supertest');
const app = require('../../src/app');
const bcrypt = require('bcrypt');
const db = require('../../src/database/db');

async function createUser(overrides = {}) {
  const defaults = {
    name: 'Usuário Teste',
    email: `test_${Date.now()}@fatec.sp.gov.br`,
    password: await bcrypt.hash('senha123', 10),
    role: 'PROFESSOR',
    status: 'APPROVED',
    department: 'DSM'
  };
  const user = { ...defaults, ...overrides };
  const [result] = await db.query('INSERT INTO users SET ?', [user]);
  return { ...user, id: result.insertId };
}

async function loginAs(user) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: 'senha123' });
  return res.body.token;
}

async function createCycle(overrides = {}) {
  const defaults = {
    name: `Ciclo-${Date.now()}`,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    exclusive_admin_end_date: '2025-12-31',
    is_active: true
  };
  const cycle = { ...defaults, ...overrides };
  const [result] = await db.query('INSERT INTO academic_cycles SET ?', [cycle]);
  return { ...cycle, id: result.insertId };
}

async function createLab(overrides = {}) {
  const defaults = {
    name: `Lab-${Date.now()}`,
    capacity: 40,
    type: 'LABORATORIO',
    is_active: true
  };
  const lab = { ...defaults, ...overrides };
  const [result] = await db.query('INSERT INTO laboratories SET ?', [lab]);
  return { ...lab, id: result.insertId };
}

module.exports = { createUser, loginAs, createCycle, createLab };
```

---

**1. __tests__/integration/auth.integration.test.js:**
- [ ] Suite: `POST /api/auth/register`
  ```javascript
  describe('POST /api/auth/register', () => {
    test('deve registrar usuário com status PENDING', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Prof Teste',
          email: 'prof@fatec.sp.gov.br',
          password: 'senha123',
          department: 'DSM'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('PENDING');
      expect(res.body).not.toHaveProperty('password'); // nunca retornar hash
    });
    
    test('deve retornar 400 para email duplicado', async () => {
      await createUser({ email: 'dup@fatec.sp.gov.br' });
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Outro', email: 'dup@fatec.sp.gov.br', password: '123456' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/já cadastrado/i);
    });
  });
  
  describe('POST /api/auth/login', () => {
    test('deve retornar token para usuário APPROVED', async () => {
      const user = await createUser({ email: 'login@fatec.sp.gov.br', status: 'APPROVED' });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@fatec.sp.gov.br', password: 'senha123' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
    
    test('deve retornar 401 para usuário PENDING', async () => {
      const user = await createUser({ email: 'pending@fatec.sp.gov.br', status: 'PENDING' });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'pending@fatec.sp.gov.br', password: 'senha123' });
      
      expect(res.status).toBe(401);
    });
    
    test('deve retornar 401 para senha errada', async () => {
      const user = await createUser({ email: 'wrong@fatec.sp.gov.br' });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@fatec.sp.gov.br', password: 'senhaerrada' });
      
      expect(res.status).toBe(401);
    });
  });
  ```

---

**2. __tests__/integration/reservations.integration.test.js:**
- [ ] Suite: Fluxo de reserva simples
  ```javascript
  describe('Reservas — fluxo completo', () => {
    let professorToken, adminToken, lab, cycle, timeSlot;
    
    beforeAll(async () => {
      const professor = await createUser({ role: 'PROFESSOR' });
      const admin = await createUser({ role: 'ADMIN' });
      professorToken = await loginAs(professor);
      adminToken = await loginAs(admin);
      lab = await createLab();
      cycle = await createCycle();
      const [ts] = await db.query(
        'INSERT INTO time_slots SET ?',
        [{ name: 'M1', start_time: '07:30:00', end_time: '08:20:00', is_active: true }]
      );
      timeSlot = { id: ts.insertId };
    });
    
    test('professor cria reserva simples → status 201 APPROVED', async () => {
      const res = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${professorToken}`)
        .send({
          type: 'SIMPLE',
          lab_id: lab.id,
          date: '2026-03-10',
          time_slot_ids: [timeSlot.id]
        });
      
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('APPROVED');
      expect(res.body.items).toHaveLength(1);
    });
    
    test('conflito detectado → professor recebe 400', async () => {
      // Reserva já existe do teste anterior (2026-03-10, timeSlot.id)
      const res = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${professorToken}`)
        .send({
          type: 'SIMPLE',
          lab_id: lab.id,
          date: '2026-03-10',
          time_slot_ids: [timeSlot.id]
        });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/conflito/i);
    });
    
    test('GET /reservations/check-conflict → retorna hasConflict correto', async () => {
      const res = await request(app)
        .get(`/api/reservations/check-conflict`)
        .query({ lab_id: lab.id, date: '2026-03-10', time_slots: timeSlot.id })
        .set('Authorization', `Bearer ${professorToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.hasConflict).toBe(true);
    });
    
    test('sem token → 401 em qualquer rota de reserva', async () => {
      const res = await request(app).post('/api/reservations').send({});
      expect(res.status).toBe(401);
    });
  });
  ```

- [ ] Suite: Permissões de ADMIN
  ```javascript
  describe('Proteção de rotas de ADMIN', () => {
    let professorToken;
    
    beforeAll(async () => {
      const professor = await createUser({ role: 'PROFESSOR' });
      professorToken = await loginAs(professor);
    });
    
    const adminRoutes = [
      { method: 'get',    path: '/api/reservations/pending' },
      { method: 'put',    path: '/api/reservations/1/approve' },
      { method: 'put',    path: '/api/reservations/1/reject' },
      { method: 'post',   path: '/api/reservations/overwrite' },
      { method: 'post',   path: '/api/laboratories' },
      { method: 'post',   path: '/api/academic-cycles' },
      { method: 'post',   path: '/api/holidays' },
      { method: 'get',    path: '/api/reservations/export' }
    ];
    
    adminRoutes.forEach(({ method, path }) => {
      test(`PROFESSOR em ${method.toUpperCase()} ${path} → 403`, async () => {
        const res = await request(app)
          [method](path)
          .set('Authorization', `Bearer ${professorToken}`)
          .send({});
        expect(res.status).toBe(403);
      });
    });
  });
  ```

- [ ] Suite: Performance de conflito (RNF05)
  ```javascript
  describe('Performance — detecção de conflito (RNF05)', () => {
    test('check-conflict deve responder em menos de 500ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/reservations/check-conflict')
        .query({ lab_id: 1, date: '2026-03-10', time_slots: '1,2,3' })
        .set('Authorization', `Bearer ${adminToken}`);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500);
    });
  });
  ```

**Critérios de Aceite:**
- [ ] Testes de integração usam banco `sislab_test` — nunca o de desenvolvimento
- [ ] `beforeAll` limpa tabelas antes de cada suite
- [ ] Todos os códigos HTTP validados (201, 200, 400, 401, 403, 404)
- [ ] Teste de permissões cobre todas as rotas ADMIN-only
- [ ] Teste de performance do check-conflict passa consistentemente (RNF05)
- [ ] `npm test` executa unitários e de integração com um só comando

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F10-BE-01

---

## 🔹 Frontend

### [F10-FE-01] Testes de Componentes (React Testing Library)

**Descrição:**  
Testar componentes React críticos: fluxo de login, formulário de reserva, exibição de conflito, e o NotificationContext. Foco em comportamento do usuário, não em implementação.

**Entregáveis:**

**Instalação:**
```bash
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

**src/setupTests.js:**
```javascript
import '@testing-library/jest-dom';

// Mock do serviço de API (evitar chamadas reais)
jest.mock('./services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));
```

---

**1. __tests__/components/LoginPage.test.jsx:**
```javascript
describe('LoginPage', () => {
  
  test('exibe campos de email e senha', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
  
  test('exibe erro ao submeter com campos vazios', async () => {
    render(<LoginPage />);
    const user = userEvent.setup();
    
    await user.click(screen.getByRole('button', { name: /entrar/i }));
    
    expect(await screen.findByText(/email é obrigatório/i)).toBeInTheDocument();
  });
  
  test('chama authService.login com dados corretos', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ token: 'abc', user: { role: 'PROFESSOR' } });
    jest.spyOn(authService, 'login').mockImplementation(mockLogin);
    
    render(<LoginPage />);
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/email/i), 'prof@fatec.sp.gov.br');
    await user.type(screen.getByLabelText(/senha/i), 'senha123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'prof@fatec.sp.gov.br',
      password: 'senha123'
    });
  });
  
  test('exibe mensagem de erro da API', async () => {
    jest.spyOn(authService, 'login').mockRejectedValue({
      response: { data: { error: 'Credenciais inválidas' } }
    });
    
    render(
      <NotificationProvider>
        <LoginPage />
      </NotificationProvider>
    );
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/email/i), 'x@x.com');
    await user.type(screen.getByLabelText(/senha/i), 'errado');
    await user.click(screen.getByRole('button', { name: /entrar/i }));
    
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });
});
```

---

**2. __tests__/components/CreateReservationPage.test.jsx:**
```javascript
describe('CreateReservationPage', () => {
  
  const mockLabs = [{ id: 1, name: 'Lab 01' }];
  const mockSlots = [
    { id: 1, name: 'M1', start_time: '07:30:00', end_time: '08:20:00' },
    { id: 2, name: 'M2', start_time: '08:30:00', end_time: '09:20:00' }
  ];
  
  beforeEach(() => {
    laboratoryService.getAll.mockResolvedValue(mockLabs);
    timeSlotService.getAll.mockResolvedValue(mockSlots);
    academicCycleService.getActive.mockResolvedValue({
      id: 1, name: '2026-1',
      start_date: '2026-01-01', end_date: '2026-12-31'
    });
    holidayService.getByCycle.mockResolvedValue([]);
  });
  
  test('renderiza select de laboratório e checkboxes de horários', async () => {
    render(
      <NotificationProvider>
        <CreateReservationPage />
      </NotificationProvider>
    );
    
    expect(await screen.findByLabelText(/laboratório/i)).toBeInTheDocument();
    expect(await screen.findByText('M1')).toBeInTheDocument();
    expect(await screen.findByText('M2')).toBeInTheDocument();
  });
  
  test('exibe banner de conflito quando checkConflict retorna hasConflict: true', async () => {
    reservationService.checkConflict.mockResolvedValue({
      hasConflict: true,
      conflictingSlots: [1]
    });
    
    render(
      <NotificationProvider>
        <CreateReservationPage />
      </NotificationProvider>
    );
    
    // Simular seleção de lab, data e horário
    // ... (detalhes de interação dependem da implementação exata do formulário)
    
    expect(await screen.findByText(/conflito detectado/i)).toBeInTheDocument();
  });
  
  test('botão "Criar Reserva" fica desabilitado quando há conflito', async () => {
    reservationService.checkConflict.mockResolvedValue({
      hasConflict: true, conflictingSlots: [1]
    });
    
    // ... setup de interação
    
    const btn = screen.getByRole('button', { name: /criar reserva/i });
    expect(btn).toBeDisabled();
  });
  
  test('toggle de recorrente exibe campos de data range e dias da semana', async () => {
    render(
      <NotificationProvider>
        <CreateReservationPage />
      </NotificationProvider>
    );
    
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /reserva recorrente/i }));
    
    expect(screen.getByLabelText(/data de início/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de fim/i)).toBeInTheDocument();
    expect(screen.getByText(/seg/i)).toBeInTheDocument(); // dia da semana
  });
});
```

---

**3. __tests__/contexts/NotificationContext.test.jsx:**
```javascript
describe('NotificationContext', () => {
  
  function TestComponent() {
    const { showSuccess, showError, showWarning, showInfo } = useNotification();
    return (
      <div>
        <button onClick={() => showSuccess('Sucesso!')}>success</button>
        <button onClick={() => showError('Erro!')}>error</button>
        <button onClick={() => showWarning('Aviso!')}>warning</button>
        <button onClick={() => showInfo('Info!')}>info</button>
      </div>
    );
  }
  
  test('exibe toast de sucesso ao chamar showSuccess', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    const user = userEvent.setup();
    
    await user.click(screen.getByText('success'));
    
    expect(await screen.findByText('Sucesso!')).toBeInTheDocument();
  });
  
  test('exibe toast de erro ao chamar showError', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    const user = userEvent.setup();
    
    await user.click(screen.getByText('error'));
    
    expect(await screen.findByText('Erro!')).toBeInTheDocument();
  });
  
  test('lança erro ao usar useNotification fora do provider', () => {
    // Suprimir console.error do React para o teste
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow(
      'useNotification deve ser usado dentro de NotificationProvider'
    );
    
    console.error.mockRestore();
  });
});
```

**Critérios de Aceite:**
- [ ] `npm test` no frontend executa todos os testes sem falhas
- [ ] Nenhum teste faz chamadas HTTP reais (tudo mockado via `jest.mock`)
- [ ] LoginPage: 4 testes (render, validação vazia, chamada correta, erro de API)
- [ ] CreateReservationPage: 4 testes (render, banner de conflito, botão desabilitado, toggle recorrente)
- [ ] NotificationContext: 3 testes (success, error, fora do provider)
- [ ] Testes escritos em termos de comportamento do usuário (sem testar implementação interna)

**Status:** 🔴 PENDENTE  
**Responsável:** -  
**Depende de:** F7-FE-01

---

## 🔹 Geral

### [F10-GE-01] Documentação Final

**Descrição:**  
README completo para onboarding de novos desenvolvedores, collection Postman exportável com todos os endpoints, e Swagger via swagger-autogen para documentação interativa da API.

**Entregáveis:**

**Instalação (Swagger):**
```bash
npm install swagger-autogen swagger-ui-express
```

---

**1. README.md (raiz do repositório):**
```markdown
# SisLab — Sistema de Reserva de Laboratórios
**Fatec Zona Leste | DSM — Desenvolvimento de Software Multiplataforma**

## Visão Geral
Sistema web para gerenciamento de reservas de laboratórios da Fatec ZL.
Permite que professores solicitem reservas e administradores gerenciem aprovações.

## Stack Tecnológico
| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js 20 + Express 4 |
| Frontend | React 18 + MUI 5 |
| Banco de Dados | MySQL 8 |
| Autenticação | JWT (jsonwebtoken) |
| Validação | Zod |
| Testes (BE) | Jest + Supertest |
| Testes (FE) | React Testing Library |

## Pré-requisitos
- Node.js 20+
- MySQL 8+
- npm 9+

## Instalação

### 1. Clonar o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/sislab.git
cd sislab
\`\`\`

### 2. Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas credenciais de banco e SMTP
npm run migrate     # Criar tabelas
npm run seed        # Popular dados iniciais (admin padrão)
npm run dev         # Iniciar em desenvolvimento
\`\`\`

### 3. Frontend
\`\`\`bash
cd frontend
npm install
cp .env.example .env
# Editar REACT_APP_API_URL=http://localhost:3001/api
npm start
\`\`\`

## Variáveis de Ambiente

### Backend (.env.example)
\`\`\`env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=sislab
JWT_SECRET=troque_por_chave_forte_aqui
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sislab.fatec@gmail.com
SMTP_PASS=app_password_aqui
EMAIL_FROM="SisLab Fatec ZL <sislab.fatec@gmail.com>"
\`\`\`

### Frontend (.env.example)
\`\`\`env
REACT_APP_API_URL=http://localhost:3001/api
\`\`\`

## Credenciais Padrão (seed)
| Role | Email | Senha |
|------|-------|-------|
| ADMIN | admin@fatec.sp.gov.br | admin123 |

> ⚠️ Trocar a senha do ADMIN antes de qualquer uso em produção.

## Arquitetura do Backend
\`\`\`
src/
├── controllers/      # Receber req, delegar para Service, devolver res
├── services/         # Regras de negócio
├── repositories/     # Queries SQL (acesso a dados)
├── middlewares/      # auth, authorize, errorHandler
├── routes/           # Definição de rotas
├── events/           # EventBus + listeners de notificação
├── emails/           # Templates HTML de email
├── utils/            # RecurrenceHelper, statusValidator
└── database/         # Configuração de conexão MySQL
\`\`\`

## Executar Testes
\`\`\`bash
# Backend
cd backend
npm test                  # Unitários + Integração
npm run test:coverage     # Com relatório de cobertura

# Frontend
cd frontend
npm test                  # Componentes (React Testing Library)
\`\`\`

## Documentação da API
Com o backend rodando, acessar:
\`\`\`
http://localhost:3001/api-docs
\`\`\`

## Fases de Desenvolvimento
| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Autenticação e JWT | ✅ |
| 2 | CRUDs de Configuração | ✅ |
| 3 | Ciclos e Feriados | ✅ |
| 4 | Reservas Simples | ✅ |
| 5 | Reservas Recorrentes + Aprovações | ✅ |
| 6 | Sobrescrita e Auditoria | ✅ |
| 7 | Notificações por Email | ✅ |
| 8 | Calendário e Dashboard | ✅ |
| 9 | Refinamentos e Exportação | ✅ |
| 10 | Testes e Documentação | ✅ |
```

---

**2. swagger/swagger.js (gerador automático):**
```javascript
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'SisLab API',
    version: '1.0.0',
    description: 'API do Sistema de Reserva de Laboratórios — Fatec Zona Leste'
  },
  host: 'localhost:3001',
  basePath: '/api',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer {token}'
    }
  },
  tags: [
    { name: 'Auth', description: 'Autenticação' },
    { name: 'Users', description: 'Gestão de usuários' },
    { name: 'Laboratories', description: 'Gestão de laboratórios' },
    { name: 'TimeSlots', description: 'Gestão de horários' },
    { name: 'AcademicCycles', description: 'Ciclos acadêmicos' },
    { name: 'Holidays', description: 'Feriados' },
    { name: 'Reservations', description: 'Reservas' },
    { name: 'Audit', description: 'Logs de auditoria' }
  ]
};

const outputFile = './swagger/swagger_output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
```

**Anotações nos controllers (exemplo):**
```javascript
// Adicionar nos controllers para enriquecer a documentação gerada

async create(req, res) {
  /*
    #swagger.tags = ['Reservations']
    #swagger.summary = 'Criar reserva simples ou recorrente'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        type: 'SIMPLE',
        lab_id: 1,
        date: '2026-03-10',
        time_slot_ids: [1, 2]
      }
    }
    #swagger.responses[201] = { description: 'Reserva criada' }
    #swagger.responses[400] = { description: 'Conflito ou validação' }
    #swagger.responses[401] = { description: 'Não autenticado' }
  */
}
```

**Registrar Swagger no app.js:**
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger_output.json');

// Após as rotas da API:
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
```

**package.json (adicionar script):**
```json
{
  "scripts": {
    "swagger": "node swagger/swagger.js"
  }
}
```

---

**3. Postman Collection (sislab.postman_collection.json):**
- [ ] Exportar collection com todas as pastas organizadas por recurso:
  - Auth (register, login)
  - Users (pending, approve, reject, me, me/password)
  - Laboratories (CRUD)
  - TimeSlots (CRUD)
  - AcademicCycles (CRUD + activate)
  - Holidays (list, create, delete)
  - Reservations (create, my, pending, approve, reject, redirect, overwrite, bulk, check-conflict, calendar, stats, export)
  - Audit (by record, by user)
- [ ] Environment: `sislab_local` com variáveis:
  ```json
  {
    "base_url": "http://localhost:3001/api",
    "token_admin": "",
    "token_professor": "",
    "lab_id": "",
    "cycle_id": ""
  }
  ```
- [ ] Scripts de pré-request nos endpoints de login para salvar token automaticamente:
  ```javascript
  // No teste de POST /auth/login:
  pm.test('Login OK', function() {
    pm.response.to.have.status(200);
    const json = pm.response.json();
    pm.environment.set('token_admin', json.token);
  });
  ```

**Critérios de Aceite:**
- [ ] `npm run swagger` gera `swagger_output.json` sem erros
- [ ] Swagger UI acessível em `http://localhost:3001/api-docs`
- [ ] Todos os endpoints documentados com tags, parâmetros e responses
- [ ] README contém todos os passos de instalação e consegue onboardar novo dev sem suporte
- [ ] Collection Postman importável com um clique, environment pré-configurado
- [ ] Scripts de login na collection salvam token automaticamente nas variáveis

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** F10-BE-02, F10-FE-01

---

## 🔹 Teste Final de Fase

### [F10-INT-01] Teste de Integração da FASE 10

**Descrição:**  
Validar cobertura de testes, qualidade da documentação e executar rodada final de smoke tests com tudo integrado.

**Checklist de Testes:**

**Cenário 1: Cobertura de Testes Backend**
- [ ] 1. Rodar `npm run test:coverage` no backend
- [ ] 2. Verificar relatório: statements ≥ 70%, branches ≥ 70%, functions ≥ 70%, lines ≥ 70%
- [ ] 3. Nenhum teste falhando
- [ ] 4. Verificar que testes de integração usam `sislab_test`, não o banco de dev
- [ ] 5. Teste de performance: check-conflict responde < 500ms

**Cenário 2: Testes Frontend**
- [ ] 1. Rodar `npm test` no frontend
- [ ] 2. Todos os testes passam sem warnings de deprecação
- [ ] 3. LoginPage: 4 testes ✓
- [ ] 4. CreateReservationPage: 4 testes ✓
- [ ] 5. NotificationContext: 3 testes ✓

**Cenário 3: Documentação**
- [ ] 1. Clonar repositório em pasta limpa, seguir README do zero
- [ ] 2. Backend sobe sem erros após seguir o guia
- [ ] 3. Frontend conecta à API sem configuração extra
- [ ] 4. Swagger UI em /api-docs exibe todos os endpoints organizados por tag
- [ ] 5. Importar collection Postman → fazer login e salvar token automaticamente
- [ ] 6. Executar 3 requests da collection com token → todas retornam 200/201

**Cenário 4: Smoke Test Final de Todo o Sistema**
- [ ] 1. Registro e aprovação de professor
- [ ] 2. Criação e ativação de ciclo + feriados
- [ ] 3. Reserva simples → APPROVED
- [ ] 4. Reserva recorrente → PENDING → email para ADMIN → ADMIN aprova → email para professor
- [ ] 5. Sobrescrita → email para professor afetado → audit_log
- [ ] 6. Bulk cancel → reservas canceladas
- [ ] 7. Exportar CSV → abre corretamente
- [ ] 8. Dashboard exibe métricas corretas
- [ ] 9. Calendário reflete todas as reservas
- [ ] 10. Perfil: editar nome + trocar senha → login com nova senha funciona

**Critérios de Aceite Final (Todo o SisLab):**
- [ ] Cobertura de testes backend ≥ 70%
- [ ] Todos os testes (unitários, integração, componentes) passam
- [ ] README onboarda novo desenvolvedor sem suporte adicional
- [ ] Swagger documenta 100% dos endpoints
- [ ] Collection Postman exportável e funcional
- [ ] Smoke test completo (10 passos) sem nenhum bug
- [ ] Nenhum console.error ou erro 500 em nenhum fluxo
- [ ] **SisLab pronto para apresentação e entrega**

**Status:** 🔴 PENDENTE  
**Responsável:** Kaique  
**Depende de:** Todas as tasks F10-* concluídas

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
- **Backend:** 26 tasks
- **Frontend:** 22 tasks
- **Geral:** 11 tasks
- **TOTAL:** **60 tasks**

---

## ✅ PROGRESSO GERAL

- **Concluídas:** 30 tasks (68%)
- **Em Andamento:** 1 task (2%)
- **Pendentes:** 13 tasks (30%)

---

## 👥 RESPONSABILIDADE DE DEV

- Kaique — 31 tasks
- Vinicius — 6 tasks
- Luiz — 8 tasks
- Nicole — 5 tasks
