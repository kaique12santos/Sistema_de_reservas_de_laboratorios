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