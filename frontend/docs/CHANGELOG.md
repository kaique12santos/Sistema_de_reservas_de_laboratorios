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