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

**Descrição:** Realiza o cadastro inicial de um novo usuário. O usuário é criado (ou atualizado, caso já esteja pendente) com status `PENDING`, a senha é criptografada e um token de verificação é gerado. Um e-mail contendo um *magic link* é disparado para validar a propriedade da conta.

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
  "message": "Cadastro registrado com sucesso. Verifique seu e-mail para confirmar a conta.",
  "userId": 1,
  "email": "kaique@fatec.sp.gov.br"
}

```

**Resposta de Erro:** `400 Bad Request`
*(Ex: "Este e-mail já está cadastrado e a conta encontra-se: APPROVED" ou dados inválidos)*

---

### POST /api/auth/verify-email

**Descrição:** Rota acessada indiretamente quando o usuário clica no *magic link* recebido por e-mail. Valida o token e confirma que o e-mail pertence ao solicitante. Após a verificação, o token é anulado e a conta aguarda a aprovação final do Administrador.

**Corpo da Requisição (JSON):**

```json
{
  "token": "d7f8a9b2c3d4e5f6g7h8..."
}

```

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**

```json
{
  "message": "E-mail verificado com sucesso! Sua conta agora aguarda aprovação do administrador."
}

```

**Resposta de Erro:** `400 Bad Request`
*(Ex: "Link de verificação inválido ou já utilizado." ou "Token não fornecido.")*

---

## Departamentos e Cursos

---

### GET /api/departments

**Descrição:** Rota pública para listar todos os departamentos/cursos cadastrados no sistema. Utilizada para popular dinamicamente formulários de seleção (como o de cadastro de usuários).

**Parâmetros de Requisição:** Nenhum.

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**

```json
[
  {
    "id": 1,
    "name": "Desenv. Software Multiplataforma",
    "code": "DSM"
  },
  {
    "id": 2,
    "name": "Gestão da Produção Industrial",
    "code": "GPI"
  }
]

```


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
