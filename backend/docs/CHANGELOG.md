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