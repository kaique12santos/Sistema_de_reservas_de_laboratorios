# Documentação da API

## Autenticação

### POST /auth/login

**Descrição:** Realiza o login do usuário no sistema.

**Corpo da Requisição (JSON):**
```json
{
  "email": "professor@fatec.sp.gov.br",
  "senha": "123"
}
```

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Edson Júnior",
    "email": "professor@fatec.sp.gov.br",
    "tipo": "professor"
  }
}
```

**Resposta de Erro:** `401 Unauthorized`

---

## Laboratórios

### GET /laboratorios

**Descrição:** Retorna a lista de todos os laboratórios cadastrados no sistema.

**Parâmetros de Consulta (Opcional):**
- `disponivel=true` - Filtra apenas laboratórios disponíveis

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
[
  {
    "id": 1,
    "nome": "Lab 101",
    "localizacao": "1º Andar",
    "capacidade": 30,
    "descricao": "Notebooks Lenovo Thinkpad"
  },
  {
    "id": 2,
    "nome": "Auditório",
    "localizacao": "Térreo",
    "capacidade": 100,
    "descricao": "Projetor e sistema de som"
  }
]
```

---

### PUT /laboratorios/:id

**Descrição:** Atualiza os dados de um laboratório específico.

**Parâmetro de URL:**
- `id` - ID do laboratório no banco de dados

**Corpo da Requisição (JSON):**
```json
{
  "nome": "Lab 101 - Modificado",
  "capacidade": 35,
  "descricao": "Atualizado: 35 notebooks agora"
}
```

**Resposta de Sucesso:** `200 OK` ou `204 No Content`

**Resposta de Erro:** `404 Not Found` (se o ID não existir)

---

### DELETE /laboratorios/:id

**Descrição:** Remove um laboratório do sistema.

**Parâmetro de URL:**
- `id` - ID do laboratório no banco de dados

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
{
  "mensagem": "Laboratório removido com sucesso"
}
```

**Resposta de Erro:** `404 Not Found` (se o ID não existir)

**Observação:** Este método geralmente requer nível de acesso Administrador.

---

## Reservas

### GET /reservas

**Descrição:** Lista as reservas realizadas. Pode ser filtrado por data ou usuário.

**Parâmetros de Consulta (Opcional):**
- `data=2024-02-24` - Filtra reservas por data
- `usuario_id=1` - Filtra reservas por usuário

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
[
  {
    "id_reserva": 50,
    "laboratorio": "Lab 101",
    "professor": "Edson Júnior",
    "data": "2024-02-24",
    "horario": "19:00 - 19:50",
    "status": "APROVADO"
  }
]
```

<!-- inicia a documentação daqui -->

## Cadastro e Autenticação

---

### POST /api/auth/register

**Descrição:** Realiza o cadastro inicial de um novo usuário. O usuário é criado com status `PENDING` (Pendente) aguardando aprovação, e a senha é criptografada antes de ser salva.

**Corpo da Requisição (JSON):**

```json
{
  "name": "Kaique Caitano",
  "email": "kaique@fatec.sp.gov.br",
  "password": "senha_segura_123",
  "department_id": 1
}

```

**Resposta de Sucesso:** `201 Created`

**Exemplo de Retorno:**

```json
{
  "id": 1,
  "name": "Kaique Caitano",
  "email": "kaique@fatec.sp.gov.br",
  "status": "PENDING"
}

```

**Resposta de Erro:** `400 Bad Request` (Ex: Email já cadastrado ou dados inválidos)

---

### POST /api/auth/login

**Descrição:** Realiza a autenticação do usuário no sistema verificando hash de senha e gerando um Token JWT para sessões futuras.

**Corpo da Requisição (JSON):**

```json
{
  "email": "kaique@fatec.sp.gov.br",
  "password": "senha_segura_123"
}

```

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**

```json
{
  "user": {
    "id": 1,
    "name": "Kaique Caetano",
    "email": "kaique@fatec.sp.gov.br",
    "role": "PROFESSOR"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```

**Resposta de Erro:** `401 Unauthorized` (Senha incorreta ou usuário não encontrado)

---
