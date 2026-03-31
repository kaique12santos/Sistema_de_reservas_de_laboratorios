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

### POST /api/auth/forgot-password

**Descrição:** Inicia o fluxo de recuperação de senha. Recebe o e-mail do usuário, gera um token seguro via `crypto.randomBytes`, salva o hash SHA-256 no banco com expiração de 1 hora e envia um link de redefinição por e-mail. Por segurança, retorna a mesma mensagem independente de o e-mail existir ou não no sistema.

**Corpo da Requisição (JSON):**
```json
{
  "email": "professor@fatec.sp.gov.br"
}
```

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
{
  "message": "Se este e-mail estiver cadastrado, você receberá as instruções em breve."
}
```

**Resposta de Erro:** `400 Bad Request`
*(Ex: "E-mail não fornecido.")*

---

### POST /api/auth/reset-password

**Descrição:** Finaliza o fluxo de recuperação de senha. Recebe o token bruto enviado no link do e-mail e a nova senha. Valida o token recriando o hash SHA-256 e verificando a expiração diretamente no banco (`expires > NOW()`). Após redefinição, o token é apagado garantindo uso único do link.

**Corpo da Requisição (JSON):**
```json
{
  "token": "d7f8a9b2c3d4e5f6...",
  "newPassword": "nova_senha_segura_123"
}
```

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
{
  "message": "Senha redefinida com sucesso!"
}
```

**Respostas de Erro:** `400 Bad Request`
*(Ex: "Token inválido ou expirado. Solicite um novo link de recuperação.", "A senha deve ter no mínimo 6 caracteres.", "Token não fornecido.", "Nova senha não fornecida.")*

---
Aqui está a documentação atualizada para o `endpoints.md`, seguindo o modelo que você enviou e incorporando todas as regras de negócio, validações e permissões que implementamos hoje na task do CRUD de Laboratórios. 


## Laboratórios

### GET /api/laboratories

**Descrição:** Retorna a lista de laboratórios cadastrados no sistema. Professores visualizam apenas laboratórios ativos. Administradores podem visualizar todos.

**Parâmetros de Consulta (Opcional):**
- `includeInactive=true` - Inclui na listagem os laboratórios inativos (Requer permissão ADMIN).

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
[
  {
    "id": 1,
    "name": "Laboratório de Redes",
    "location": "Bloco B - 1º Andar",
    "capacity": 40,
    "description_lab": "Equipado com roteadores Cisco e switches",
    "type": "LABORATORIO",
    "is_active": true
  },
  {
    "id": 2,
    "name": "Auditório Principal",
    "location": "Térreo",
    "capacity": 120,
    "description_lab": "Projetor 4k e sistema de som surround",
    "type": "AUDITORIO",
    "is_active": true
  }
]
```

**Respostas de Erro:** `401 Unauthorized` (Token ausente ou inválido)

---

### GET /api/laboratories/:id

**Descrição:** Retorna os dados de um laboratório específico pelo seu ID.

**Parâmetro de URL:**
- `id` - ID do laboratório no banco de dados

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
{
  "id": 1,
  "name": "Laboratório de Redes",
  "location": "Bloco B - 1º Andar",
  "capacity": 40,
  "description_lab": "Equipado com roteadores Cisco e switches",
  "type": "LABORATORIO",
  "is_active": true
}
```

**Respostas de Erro:** - `404 Not Found` (Laboratório não encontrado)
- `401 Unauthorized`

---

### POST /api/laboratories

**Descrição:** Cria um novo laboratório no sistema.

**Corpo da Requisição (JSON):**
```json
{
  "name": "Sala 305",
  "location": "Bloco A - 3º Andar",
  "capacity": 35,
  "description_lab": "Sala com lousa digital",
  "type": "SALA DE AULA"
}
```

**Resposta de Sucesso:** `201 Created`

**Exemplo de Retorno:**
```json
{
  "id": 3,
  "name": "Sala 305",
  "location": "Bloco A - 3º Andar",
  "capacity": 35,
  "description_lab": "Sala com lousa digital",
  "type": "SALA DE AULA",
  "is_active": true
}
```

**Respostas de Erro:** - `400 Bad Request` (Nome duplicado, capacidade igual a 0 ou tipo inválido)
- `403 Forbidden` (Usuário não tem permissão de ADMIN)
- `401 Unauthorized`

**Observação:** Requer nível de acesso Administrador (`ADMIN`). Os tipos permitidos são: `LABORATORIO`, `SALA DE AULA`, `AUDITORIO`.

---

### PUT /api/laboratories/:id

**Descrição:** Atualiza os dados de um laboratório específico.

**Parâmetro de URL:**
- `id` - ID do laboratório no banco de dados

**Corpo da Requisição (JSON):**
```json
{
  "name": "Sala 305 - Modificada",
  "capacity": 40,
  "description_lab": "Sala com lousa digital e novos projetores",
  "type": "SALA DE AULA"
}
```

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
{
  "id": 3,
  "name": "Sala 305 - Modificada",
  "location": "Bloco A - 3º Andar",
  "capacity": 40,
  "description_lab": "Sala com lousa digital e novos projetores",
  "type": "SALA DE AULA",
  "is_active": true
}
```

**Respostas de Erro:** - `400 Bad Request` (Nome duplicado ou dados inválidos)
- `404 Not Found` (Laboratório não encontrado)
- `403 Forbidden` (Apenas ADMIN)

**Observação:** Requer nível de acesso Administrador (`ADMIN`).

---

### DELETE /api/laboratories/:id

**Descrição:** Inativa (soft-delete) um laboratório no sistema, colocando-o em manutenção ou bloqueando novas reservas.

**Parâmetro de URL:**
- `id` - ID do laboratório no banco de dados

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
{
  "message": "Laboratório inativado com sucesso",
  "is_active": false
}
```

**Respostas de Erro:** - `400 Bad Request` (Existem reservas futuras ativas para este laboratório. Não é possível inativar.)
- `404 Not Found` (Laboratório não encontrado)
- `403 Forbidden` (Acesso negado)

```

---

## Ciclos Acadêmicos

### GET /api/academic-cycles
**Descrição:** Retorna a lista de todos os semestres letivos cadastrados no sistema, ordenados do mais recente para o mais antigo.
**Resposta de Sucesso:** `200 OK`
**Exemplo de Retorno:**
```json
[
  {
    "id": 2,
    "name": "2026-2",
    "start_date": "2026-08-01T00:00:00.000Z",
    "end_date": "2026-12-15T00:00:00.000Z",
    "admin_exclusive_end_date": "2026-07-25T00:00:00.000Z",
    "is_active": false
  },
  {
    "id": 1,
    "name": "2026-1",
    "start_date": "2026-02-01T00:00:00.000Z",
    "end_date": "2026-06-30T00:00:00.000Z",
    "admin_exclusive_end_date": "2026-01-25T00:00:00.000Z",
    "is_active": true
  }
]
```

---

### `GET /api/academic-cycles/active`
**Descrição:** Retorna exclusivamente o ciclo acadêmico que está ativo no momento para recebimento de reservas.  
**Resposta de Sucesso:** `200 OK`  
**Resposta de Erro:** `404 Not Found` (Se não houver ciclo ativo).

---

### `POST /api/academic-cycles/generate` 
> **Apenas ADMIN**

**Descrição:** Rota de automação (Motor). Calcula qual deve ser o próximo semestre, gera as datas padrão letivas da Fatec ZL, insere no banco (inativo por padrão) e dispara a sincronização automática de feriados na BrasilAPI para o período gerado.  
**Corpo da Requisição:** Vazio.  
**Resposta de Sucesso:** `201 Created`

**Exemplo de Retorno:**
```json
{
  "message": "Ciclo 2026-1 gerado com sucesso!",
  "cycle": {
    "id": 1,
    "name": "2026-1",
    "start_date": "2026-02-01",
    "end_date": "2026-06-30",
    "admin_exclusive_end_date": "2026-01-25",
    "is_active": false
  },
  "holidays_synced": 14
}
```

---

### `PUT /api/academic-cycles/:id/activate`
> **Apenas ADMIN**

**Descrição:** Ativa um ciclo acadêmico específico e desativa todos os outros automaticamente.  
**Resposta de Sucesso:** `200 OK`

---

## Feriados e Recessos

### `GET /api/holidays`
**Descrição:** Retorna a lista de feriados bloqueados. Se nenhum `cycle_id` for passado, retorna os feriados do ciclo ativo atual.  
**Parâmetros de Consulta (Opcional):**
* `cycle_id=1` - Filtra os feriados de um ciclo específico.

**Resposta de Sucesso:** `200 OK`

**Exemplo de Retorno:**
```json
[
  {
    "id": 1,
    "cycle_id": 1,
    "date": "2026-02-17T00:00:00.000Z",
    "description": "Carnaval"
  },
  {
    "id": 2,
    "cycle_id": 1,
    "date": "2026-04-03T00:00:00.000Z",
    "description": "Paixão de Cristo"
  }
]
```

---

### `POST /api/holidays/sync`
> **Apenas ADMIN**

**Descrição:** Força a ressincronização dos feriados de um ciclo específico com a BrasilAPI e com as regras institucionais (wipe & load).  
**Corpo da Requisição (JSON):**
```json
{
  "cycle_id": 1
}
```
**Resposta de Sucesso:** `200 OK`