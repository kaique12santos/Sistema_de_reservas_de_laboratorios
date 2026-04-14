# Registro de Funcionalidades - Backend

## [DD/MM/AAAA]
### 1. Nome da Feature
- **Descrição:** Breve explicação do que foi feito.
- **Autor:** Nome do integrante.
- **Impacto:** Quais arquivos ou rotas foram alterados.

---

<!--  documentação começa aqui -->

## 02/03/2026

### 1. Inicialização da Arquitetura e Conexão com Banco de Dados

* 
**Descrição:** Configuração inicial do servidor Express e estrutura de pastas seguindo o padrão MVC + Service Layer definido no Documento de Arquitetura . Implementação da classe de conexão com MySQL (Singleton) utilizando `mysql2` com pool de conexões.


* **Autor:** Kaique Caitano
* **Impacto:** Criação de `src/server.js`, `src/app.js`, `src/config/database.js`.

### 2. Módulo de Autenticação (Auth)

* **Descrição:** Desenvolvimento das rotas de `login` e `register`. Implementação da lógica de criptografia de senha (Bcrypt) e geração de Token JWT (JsonWebToken) para atender ao Requisito Não Funcional de segurança. Separação de responsabilidades em Controller, Service e Repository .


* **Autor:** Kaique Caitano
* **Impacto:**
* `src/routes/auth.routes.js`
* `src/controllers/AuthController.js`
* `src/services/AuthService.js`
* `src/repositories/UserRepository.js`

## 04/03/2026

### 1. Módulo de Departamentos
- **Descrição:** Criação da rota pública para listagem de departamentos/cursos cadastrados no banco de dados para popular dinamicamente o formulário de cadastro.
- **Autor:** Kaique Caitano
- **Impacto:** Criação dos arquivos `src/controllers/DepartmentController.js`, `src/services/DepartmentService.js`, `src/repositories/DepartmentRepository.js`, `src/routes/department.routes.js` e registro da rota no `src/app.js`.

### 2. Serviço de E-mail e Geração de Tokens de Verificação
- **Descrição:** Configuração do `EmailService` utilizando Nodemailer via SMTP (Gmail com senha de app e forçando IPv4). Refatoração da lógica de registro no `AuthService` para gerar tokens seguros usando `crypto`, salvar corretamente no banco de dados e enviar o e-mail contendo o *magic link* para o usuário.
- **Autor:** Kaique Caitano
- **Impacto:** Atualização do `src/services/EmailService.js`, `src/services/AuthService.js` e ajustes nas queries de INSERT/UPDATE no `src/repositories/UserRepository.js`.

### 3. Validação de E-mail (Magic Link)
- **Descrição:** Criação do endpoint `POST /auth/verify-email` que extrai o token do body da requisição, valida sua existência no banco de dados, anula o token após o uso (para evitar reuso) e mantém a conta como `PENDING` aguardando a aprovação do Administrador.
- **Autor:** Kaique Caitano
- **Impacto:** Novos métodos no `src/controllers/AuthController.js`, `src/services/AuthService.js`, `src/repositories/UserRepository.js` e nova rota em `src/routes/auth.routes.js`.

### 4. Adicionado (Added)
- **DTO de Criação de Usuário:** Implementado o `CreateUserDTO` para centralizar e blindar a validação de dados de entrada na rota de registro.
- **Model de Usuário:** Implementado o `UserModel` para formatar a saída de dados do banco, garantindo que informações sensíveis (como `password_hash` e `verification_token`) não vazem para o cliente.

### 5. Corrigido (Fixed)
- Ajuste na configuração do Nodemailer para forçar o uso de IPv4 (`family: 4`) e TLS moderno, resolvendo os erros de `ETIMEDOUT` e `ECONNREFUSED`.
- Correção nas queries SQL do `UserRepository` para garantir que a coluna `verification_token` seja preenchida corretamente no `INSERT` e no `UPDATE`.
- Ajuste na desestruturação de dados no `AuthController.verifyEmail` para ler corretamente o `token` a partir do `req.body`.

## 05/03/2026

### Middleware de Autenticação e Autorização (RBAC)
- **Descrição:** Adaptação do arquivo de proteção de rotas para o padrão ES Modules (`import/export`). Implementação do `authMiddleware` para validação de JWT e extração de dados do usuário.
- **Controle de Acesso por Cargo:** Criação da função `requireRole` para aplicar o padrão Role-Based Access Control (RBAC), permitindo restringir endpoints específicos apenas para perfis autorizados (ex: `ADMIN`), atendendo aos requisitos de segurança da arquitetura.

## 14/03/2026

### 1. Validação de Status no Login (F1-BE-03)
- **Descrição:** Implementação das verificações de status da conta no fluxo de login. 
O endpoint agora bloqueia acessos de contas com status `PENDING` e `REJECTED` antes de validar a senha. Mensagens de erro padronizadas para cada estado da conta.
- **Autor:** Nicole Lisboa
- **Impacto:** `src/services/AuthService.js`, `src/routes/auth.routes.js`

### 2. Recuperação de Senha - Forgot Password (F1-BE-06)
- **Descrição:** Implementação do endpoint `POST /auth/forgot-password`. O fluxo gera um token bruto via `crypto.randomBytes`, salva apenas o hash SHA-256 no banco com expiração de 1 hora e envia o link de redefinição por e-mail via `EmailService`. Retorna mensagem genérica independente de o e-mail existir ou não, prevenindo enumeração de usuários.
- **Autor:** Nicole Lisboa
- **Impacto:** `src/services/AuthService.js`, `src/controllers/AuthController.js`, `src/repositories/UserRepository.js`, `src/routes/auth.routes.js`

### 3. Redefinição de Senha - Reset Password (F1-BE-07)
- **Descrição:** Implementação do endpoint `POST /auth/reset-password`. Valida o token recebido recriando o hash SHA-256 e comparando com o banco, verifica a expiração diretamente na query SQL (`expires > NOW()`), atualiza a senha com Bcrypt e limpa os campos de token após o uso, garantindo uso único do link.
- **Autor:** Nicole Lisboa
- **Impacto:** `src/services/AuthService.js`, `src/controllers/AuthController.js`, `src/repositories/UserRepository.js`

## 15/03/2026

### 1. Corrigido (Fixed)
- **Refatoração da Arquitetura do Banco:** Reversão do tipo de dado da coluna `department` (de VARCHAR para `department_id` INT) nas queries e migrations, restaurando a integridade referencial com a tabela de departamentos.
- **Tratamento de Dados no Login:** Ajuste na assinatura do método `AuthService.login` para usar desestruturação de objetos (`{ email, password }`), corrigindo o erro de passagem de parâmetros (`undefined`) entre o Controller e o Service.
- **Segurança de Autenticação:** Correção na ordem de validação do login. A verificação da senha (Bcrypt) agora ocorre *antes* da validação do status da conta (PENDING/REJECTED), prevenindo ataques de enumeração de usuários.
- **UX do Front-End:** Inclusão de mensagens acionáveis nos retornos de erro do Back-End e ajuste no CSS (`maxWidth` e `wordBreak`) do componente `Toast` no React para evitar quebra de layout com mensagens longas.
- **Validação do Axios:** Teste e homologação do Interceptor do Front-End (Injeção de Header Authorization e redirecionamento de Logout no 401) usando a rota dummy `/teste-seguranca`.

## [24/03/2026]
### 1. Refatoração da Camada de Validação (SOLID - SRP)
- **Descrição:** Substituição da validação manual nos DTOs por um padrão de validação robusto utilizando a biblioteca `zod`. 
  - Criação de schemas estáticos no `CreateUserDTO` para definir os contratos de dados (tipagem, obrigatoriedade, tamanho mínimo e formato de e-mail institucional).
- **Autor:** Kaique Caitano dos Santos

### 2. Implementação de Middleware Interceptador
- **Descrição:** Criação do middleware genérico `validateRequest` para atuar como "segurança de borda". 
  - Ele intercepta a requisição, valida o `req.body` contra o schema do Zod, sanitiza os dados (trim, toLowerCase) e aplica o conceito de *Fail Fast*.
  - Se os dados forem inválidos, bloqueia a chamada ao Controller e retorna um HTTP 400 padronizado com o array de erros (campo `details`) para ser consumido pelos Toasts do Front-end.
- **Autor:** Kaique Caitano dos Santos

### 3. Limpeza dos Controllers
- **Descrição:** Com a validação transferida para os Middlewares, os Controllers (ex: `UserController.register`) foram enxugados para focar apenas na orquestração do fluxo de sucesso (chamar o Service e retornar HTTP 201), melhorando drasticamente a legibilidade e rastreabilidade do código.
- **Autor:** Kaique Caitano dos Santos

## [25/03/2026]
### 1. [F2-BE-02] CRUD de Laboratórios
**Descrição:** Implementação do gerenciamento completo de laboratórios no backend.
- Foram criadas as funções de listagem (com filtro de inativos para admins), criação com validações (nome único, capacidade maior que zero e tipo válido), edição e inativação (soft-delete).
- A inativação conta com uma regra de negócio crítica que impede a exclusão lógica caso existam reservas ativas futuras para o ambiente.
**Impacto:** Criação da estrutura completa nos arquivos `LaboratoryRepository.js` `LaboratoryService.js`, `LaboratoryController.js` e `routes/laboratory.routes.js`. 
-Implementação das rotas `GET`, `POST`, `PUT` e `PATCH` em `/api/laboratories` com verificação de token e controle de acesso (middlewares `authorize` para roles `ADMIN` e `PROFESSOR`).
- **Autor:** Kaique Caitano

## [26/03/2026]
### 1. [F2-BE-03] CRUD de Horários
**Descrição:** Implementação do gerenciamento completo de horários no backend.
- Implementadas funcionalidades de listagem de horários ativos ordenados por start_time, criação, atualização e inativação (soft delete).
- A inativação inclui regra de negócio que impede desativar horários que possuem reservas futuras vinculadas.
- Proteção de rotas com autenticação (verifyToken) e autorização por perfil (ADMIN e PROFESSOR), garantindo que apenas administradores possam criar, editar ou remover horários.
- Controllers organizados para responder corretamente aos endpoints REST (GET, POST, PUT, DELETE).
- **Observação**: Validações de entrada (como obrigatoriedade de campos e consistência de horários) ainda estão pendentes de implementação/teste.
- **Autor:** Nicole Lisboa
**Impacto:** Criação da estrutura completa nos arquivos `TimeSlotRepository.js` `TimeSlotService.js`, `TimeSlotController.js` e `routes/timeSlot.routes.js`. 
-Implementação das rotas `GET`, `POST`, `PUT` e `DELETE` em `/api/time-slots` com integração com middleware de autencação e autorização (verifyToken, authorize).

## [31/03/2026]
### 1. Motor de Geração Automática de Ciclos e Feriados [F3-BE-AUTO]
- **Descrição:** Substituição dos CRUDs manuais de Semestres e Feriados por um motor de automação. O sistema agora prevê e gera o próximo semestre letivo (com datas baseadas no calendário da Fatec ZL) e sincroniza automaticamente os feriados nacionais, estaduais e recessos institucionais utilizando a BrasilAPI.
- **Autor:** Kaique Caitano
- **Impacto:** Alterações profundas nos fluxos de `AcademicCycleService` e `HolidayService`. Criação da rota automatizada `POST /api/academic-cycles/generate`. Inclusão dos módulos nas rotas principais do servidor (`app.js`).

## [13/04/2026]
### 1. Implementação da Gestão Global de Usuários (Back-End)
**Descrição:** Expansão da arquitetura de usuários (UserController, UserService e UserRepository) para suportar as requisições do perfil de Suporte. Foi implementada uma lógica de bypass para listar a base completa (ignorando os filtros de departamento) e criados os métodos de changeRole e toggleStatus. A lógica do banco foi ajustada para separar o controle do fluxo de aprovação (status) da permissão de login (is_active).
**Autor:** Kaique Caitano

### 2. Blindagem do Middleware de Validação com Zod (Back-End)
**Descrição:** Refatoração crítica na camada de segurança e validação (validateRequest.js e UserApprovalDTO.js). O middleware foi ajustado para processar objetos vazios com segurança e utilizar .issues de forma padronizada. Os schemas de aprovação receberam tratamento de fallback (.nullish() e .catch(undefined)) para garantir compatibilidade retroativa com requisições legadas do painel Administrativo.
**Autor:** Kaique Caitano