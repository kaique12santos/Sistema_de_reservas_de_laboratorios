# Registro de Funcionalidades - Front

## [DD/MM/AAAA]
### 1. Nome da Feature
- **Descrição:** Breve explicação do que foi feito.
- **Autor:** Nome do integrante.

<!-- documentação começa aqui -->

## 02/03/2026

### 1. Configuração Inicial e Estrutura de Pastas

* **Descrição:** Inicialização do projeto com React + Vite e definição da arquitetura de pastas (components, pages, services, context) conforme o Documento de Decisão Arquitetural. Instalação das dependências base: Material UI, Axios, React Router Dom e JWT Decode.
* **Autor:** Kaique Caitano

### 2. Camada de Serviço e Contexto de Autenticação

* **Descrição:** Implementação do `api.js` com interceptors do Axios para injeção automática de Token JWT e criação do `AuthContext.jsx` para gerenciamento global do estado de sessão do usuário (login, logout, persistência).
* **Autor:** Kaique Caitano

### 3. Telas de Autenticação e Dashboard (MVP)

* **Descrição:** Desenvolvimento das telas funcionais de Login, Cadastro de Usuário e Dashboard. Implementação de rotas protegidas (`Private Route`) que impedem acesso não autorizado às áreas internas do sistema.
* **Autor:** Kaique 

## 04/03/2026

### 1. Dinamização do Formulário de Cadastro
- **Descrição:** Refatoração da tela de registro (`RegisterPage`) para consumir a API de departamentos via `useEffect` e renderizar as opções dinamicamente em um componente `<Select>` do Material UI, removendo as opções estáticas.
- **Autor:** Kaique Caitano

### 2. Tela de Verificação de E-mail (Magic Link)
- **Descrição:** Criação da página `VerifyEmailPage`, que não possui formulário visível. Ela automaticamente captura o token passado na URL via `useSearchParams`, envia para validação na API e fornece um feedback visual de carregamento, sucesso ou erro, guiando o usuário para a tela de login.
- **Autor:** Kaique Caitano

## 05/03/2026
### 1. Refatoração Estrutural e Separação de Rotas
- **Descrição:** Reorganização dos componentes principais para alinhar com a documentação de arquitetura. O arquivo `App.jsx` foi movido para a pasta `src/app/`, passando a atuar exclusivamente como wrapper de contextos globais (Providers). Criação do arquivo `src/app/routes.jsx` para centralizar a definição de rotas e implementação do componente `PrivateRoute` para proteção das rotas internas. Atualização do ponto de entrada no `main.jsx`.
- **Autor:** Kaique Caitano

### 2. Adequação Arquitetural: Camada de Serviços
- **Descrição:** Remoção de chamadas diretas à API (`api.get` e `api.post`) de dentro dos componentes `RegisterPage` e `VerifyEmailPage`, adequando o código à Regra de Frontend nº 1 do Documento de Arquitetura. Criação do arquivo `department.service.js` para gerenciar as requisições de cursos e adição do método `verifyEmail` no `auth.service.js` para centralizar a comunicação com o backend e manter as páginas apenas como orquestradoras.
- **Autor:** Kaique Caitano

## 05/03/2026

### 3. Implementação do Layout Institucional nas Telas de Autenticação

- **Descrição:** Padronização visual das telas de autenticação utilizando layout institucional inspirado na identidade visual do Centro Paula Souza / FATEC. Foi implementado um layout de duas colunas, onde a coluna esquerda apresenta imagem institucional da FATEC e a coluna direita contém os formulários e interações do usuário. O objetivo foi melhorar a experiência visual e garantir consistência entre todas as páginas do fluxo de autenticação.

- **Autor:** Luiz Carlos

---

### 4. Implementação da Tela de Login

- **Descrição:** Desenvolvimento da tela de Login com layout institucional de duas colunas. A página permite que usuários autenticados acessem o sistema através de e-mail institucional e senha. A interface foi construída utilizando componentes do Material UI e integrada ao serviço de autenticação existente.

- **Funcionalidades incluídas:**
  - Campo de e-mail institucional
  - Campo de senha
  - Botão de autenticação
  - Link para criação de conta
  - Link para recuperação de senha
  - Integração com o `AuthContext` para gerenciamento da sessão do usuário

- **Autor:** Luiz Carlos

---

### 5. Implementação da Tela de Cadastro de Usuário

- **Descrição:** Desenvolvimento da tela de cadastro de usuário seguindo o mesmo layout institucional aplicado na tela de login. A página permite a criação de novos usuários no sistema utilizando e-mail institucional e demais informações obrigatórias.

- **Funcionalidades incluídas:**
  - Formulário de cadastro com campos obrigatórios
  - Seleção dinâmica de departamentos consumindo a API de cursos
  - Validação de e-mail institucional
  - Integração com os serviços de autenticação
  - Redirecionamento para verificação de e-mail após cadastro

- **Autor:** Luiz Carlos

---

### 6. Implementação da Tela de Verificação de E-mail

- **Descrição:** Criação da página `VerifyEmailPage`, responsável por validar automaticamente o token enviado por e-mail após o cadastro do usuário. A página captura o token presente na URL, realiza a chamada para o backend e exibe feedback visual ao usuário indicando sucesso ou erro no processo de verificação.

- **Funcionalidades incluídas:**
  - Captura automática do token via `useSearchParams`
  - Feedback visual de carregamento durante a validação
  - Exibição de mensagem de sucesso após validação
  - Exibição de mensagem de erro caso o token seja inválido ou expirado
  - Botão de retorno para a tela de login

- **Autor:** Luiz Carlos

---

### 7. Implementação da Tela de Recuperação de Senha (Esqueci a Senha)

- **Descrição:** Criação da página `ForgotPasswordPage`, permitindo que usuários solicitem a redefinição de senha através do e-mail institucional. A interface segue o mesmo padrão visual das demais telas de autenticação, garantindo consistência na experiência do usuário.

- **Funcionalidades incluídas:**
  - Campo para inserção do e-mail institucional
  - Validação do domínio `@cps.sp.gov.br`
  - Exibição de estados de carregamento, sucesso e erro
  - Preparação do fluxo de recuperação de senha no frontend

- **Observações:**
  - O endpoint de recuperação de senha ainda não está disponível no backend.
  - Foi implementado um mock no frontend para simular o comportamento da requisição até que a API seja disponibilizada.

- **Autor:** Luiz Carlos

### 8. Implementação da Tela de Nova Senha (Reset Password)

- **Descrição:** Desenvolvimento da página `ResetPasswordPage`, responsável por permitir que o usuário redefina sua senha após acessar o link de recuperação enviado por e-mail. A tela captura automaticamente o token presente na URL, valida os campos de nova senha e confirmação de senha e envia a requisição para redefinição no backend.

- **Funcionalidades incluídas:**
  - Captura do token de redefinição através da URL utilizando `useSearchParams`
  - Formulário para definição da nova senha
  - Campo de confirmação de senha
  - Validação de preenchimento e correspondência entre as senhas
  - Exibição de estados de carregamento, sucesso e erro
  - Redirecionamento automático para a tela de login após redefinição bem-sucedida

- **Integração:**
  - Implementação do método `resetPassword` no `auth.service.js`
  - Chamada para o endpoint `POST /auth/reset-password`

- **Autor:** Luiz Carlos