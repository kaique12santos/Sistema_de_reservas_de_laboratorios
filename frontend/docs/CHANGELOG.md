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

## 14/03/2026
### 1. Criação do Componente de Feedback Flutuante (Toast)
- Descrição: Desenvolvimento de um componente reutilizável (Toast.jsx) localizado na pasta de utilitários. 
- O componente integra os módulos Snackbar e Alert do Material UI para criar notificações sobrepostas ao conteúdo (flutuantes). 
- Foi configurado com suporte a diferentes severidades (success, error, warning, info) e fechamento automático após 4 segundos.

**Autor**: Luiz Carlos

### 2. Substituição de Alertas Estáticos por Notificações Dinâmicas
- Descrição: Refatoração das telas de LoginPage e RegisterPage para remover os componentes <Alert> que deslocavam o layout e os alert() nativos do navegador. 
- Implementação de estados de notificação (notify) para gerenciar feedbacks de erro vindos do backend e mensagens de sucesso de forma elegante e consistente com a identidade visual do sistema.

**Autor**: Luiz Carlos

### 3. Ajuste de Fluxo: Feedback com Delay de Navegação
- Descrição: Implementação de uma lógica de temporização (setTimeout) nos métodos de handleSubmit das páginas de autenticação. 
- Essa alteração garante que o usuário receba a confirmação visual de sucesso (ex: "Login realizado" ou "Token enviado") antes do redirecionamento de rota, resolvendo o problema de desmontagem precoce do componente de feedback.

**Autor**: Luiz Carlos

## [19/03/2026]
### 1. Refatoração Arquitetural e BaseLayout
- **Descrição:** Extração do Header e Menu Lateral do Dashboard para um componente central (`BaseLayout`), utilizando `<Outlet />` do React Router para aninhamento de rotas e aplicação do princípio DRY.
- **Autor:** Kaique Caitano

### 2. Menu Dinâmico com Controle de Acesso (RBAC)
- **Descrição:** Implementação de configuração de menu baseada em permissões (Role-Based Access Control) na Sidebar do `BaseLayout`, garantindo que Professores, Coordenadores e Suporte vejam apenas as rotas autorizadas.
- **Autor:** Kaique Caitano

### 3. Página de Laboratórios e Grid Responsivo
- **Descrição:** Criação da `LaboratoriesPage` com barra de filtros e listagem em CSS Grid blindado (travado em máximo de 3 cards por linha no desktop, com altura fixa e truncamento de texto inteligente usando `break-word` e `line-clamp` para impedir a quebra do layout).
- **Autor:** Kaique Caitano

## [23/03/2026]
### 1. Gestão de Reservas (MinhasReservasPage)
- **Descrição:** Implementação da tabela de listagem das solicitações do usuário com filtros dinâmicos de status. Criação de modais interativos baseados no MUI `<Dialog>` para visualização de detalhes completos da reserva e confirmação segura de cancelamento.
- **Autor:** Kaique Caitano

### 2. Microinterações e Utilitários Globais de UX
- **Descrição:** Desenvolvimento de componentes utilitários universais para elevar a experiência do usuário sem dependências pesadas: 
  - `StaggerItem`: Efeito visual de entrada em cascata (Staggered Animation) adaptável a cards e listas (Data Grids).
  - `LoadingOverlay`: Backdrop de carregamento global para bloqueio de interações durante chamadas de API.
- **Autor:** Kaique Caitano

### 3. Refatoração do BaseLayout (App Shell)
- **Descrição:** Evolução da navegação principal para o padrão "Mini Sidebar" (colapsável) no Desktop, otimizando o espaço de tela com suporte a tooltips em ícones. Inclusão de modal de confirmação customizado para a ação de Logout, prevenindo cliques acidentais e perda de contexto.
- **Autor:** Kaique Caitano


## [24/03/2026]
### 1. RBAC (Role-Based Access Control) e Proteção de Rotas
- **Descrição:** Implementação de controle de acesso baseado em papéis (Cargos: `PROFESSOR`, `ADMIN`, `SUPORT`) no front-end para isolamento de funcionalidades da Fase 2.
  - Criação do componente utilitário `RoleRoute` para atuar como guardião de rotas, redirecionando acessos não autorizados para o Dashboard.
  - Refatoração do `AppRoutes` para blindar as rotas privadas (ex: `/gestao-cadastros` exclusiva para `ADMIN`).
- **Autor:** Kaique Caitano 

### 2. Tela de Aprovação de Cadastros [Task F2-FE-01]
- **Descrição:** Desenvolvimento da interface de gestão de usuários pendentes (`PendingUsersPage`) para os coordenadores (Administradores do departamento).
  - Listagem em Tabela com animações de entrada em cascata (`StaggerItem`).
  - Implementação de filtros dinâmicos por Nome, E-mail e Departamento.
  - Modais interativos de confirmação: Aprovação simples e Rejeição com obrigatoriedade de preenchimento de motivo (validação de formulário).
  - Integração padronizada de feedback visual utilizando o componente global `Toast`.
- **Autor:** Kaique Caitano

### 3. Camada de Serviços (Padrão Singleton/OO)
- **Descrição:** Estruturação inicial do `user.service.js` utilizando classes (Orientação a Objetos) e exportação em padrão Singleton. 
  - Criação dos métodos `getPending`, `approve` e `reject` com simulações assíncronas (Mocks) para permitir a validação e testes de UI/UX da equipe de front-end de forma isolada, enquanto a API (F2-BE-01) está em desenvolvimento.
- **Autor:** Kaique Caitano 

### 4. Gestão de Laboratórios (CRUD) [Task F2-FE-02]
- **Descrição:** Implementação da tela administrativa exclusiva para coordenadores gerenciarem os laboratórios físicos da instituição (`ManageLaboratoriesPage`).
  - **Arquitetura de Rotas:** Separação clara entre a tela de "Visualização de Laboratórios" (Professor/Admin) e a tela de "Gestão de Laboratórios" (Exclusiva Admin), evitando conflitos de imports e melhorando a escalabilidade.
  - **Interface (UI):** Tabela nativa do MUI otimizada com `StaggerItem` para entrada em cascata. Filtros dinâmicos por Tipo de sala e toggle para "Mostrar Inativos".
  - **Formulários e Validação:** Criação do componente isolado `LaboratoryFormModal` para inserção e edição, com validação de campos obrigatórios e tipagem (ex: capacidade > 0).
  - **Tratamento de Regras de Negócio (Front-end):** Interceptação de erros específicos simulados no `laboratory.service.js` (ex: bloqueio de deleção de laboratórios com reservas ativas e verificação de nome duplicado), exibindo feedback claro via `Toast`.
- **Autor:** Kaique Caitano

## [30/03/2026]

### 1. Gestão de Ciclos Acadêmicos [Task F3-FE-01]
- **Descrição:** Desenvolvimento da interface administrativa para gerenciamento de ciclos acadêmicos (`AcademicCyclesPage`), exclusiva para coordenadores.
  - **Listagem:** Tabela nativa do MUI com `StaggerItem` para entrada em cascata, exibindo Nome, Datas de Início/Fim, Fim do Período Exclusivo Coordenador e Status (Ativo/Inativo) com `Chip` colorido.
  - **Formulário:** Criação do componente isolado `AcademicCycleFormModal` para inserção e edição, com validação de campos obrigatórios, verificação de nome duplicado, datas inválidas (início no passado, início ≥ fim, período exclusivo fora do intervalo do ciclo).
  - **Ativar Ciclo:** Ação exclusiva com modal de confirmação. Ao ativar, o ciclo anterior é automaticamente desativado e o novo passa a ser o vigente.
  - **Proteção de Deleção:** Botão de excluir desabilitado para o ciclo atualmente ativo, prevenindo inconsistências.
  - **Camada de Serviço:** Criação do `academicCycle.service.js` com os métodos `getAll`, `create`, `update`, `delete` e `activate`.
  - **Feedback:** Integração com o componente global `Toast` e `LoadingOverlay` para todas as ações assíncronas.
- **Autor:** - Luiz 


## [31/03/2026]

### 1. Gestão de Feriados [Task F3-FE-02]
- **Descrição:** Desenvolvimento da interface administrativa para cadastro, edição e remoção de feriados vinculados ao ciclo ativo (`HolidaysPage`), exclusiva para coordenadores.
  - **Header Dinâmico:** Exibe o nome do ciclo ativo no título ("Feriados — Ciclo 2026-1"). Caso nenhum ciclo esteja ativo, exibe um banner de alerta orientando o usuário a ativar um ciclo antes de prosseguir.
  - **Formulário Inline:** Campos de Data (`type="date"`) e Descrição (opcional) com botão de adição rápida, sem necessidade de modal.
  - **Validações de Duplicidade (Frontend):** Impede a criação de feriados com data já cadastrada no ciclo ou com descrição idêntica a um feriado existente, exibindo feedback via `Toast` antes de qualquer chamada à API.
  - **Listagem:** Tabela com colunas de Data (formatada pt-BR), Dia da Semana (calculado no frontend via `Date`) e Descrição, ordenada por data crescente com animações de entrada via `StaggerItem`.
  - **Edição:** Modal de edição (`Dialog`) com os mesmos campos do formulário inline, aplicando as mesmas validações de duplicidade e ignorando o próprio registro na comparação.
  - **Deleção Rápida:** Remoção direta pelo ícone de lixeira, sem modal de confirmação, com feedback via `Toast`.
  - **Estado Vazio:** Mensagem amigável quando nenhum feriado está cadastrado para o ciclo.
  - **Camada de Serviço:** Criação do `holiday.service.js` com os métodos `getByCycle`, `create`, `update` e `delete`.
- **Autor:** - Luiz 

## [31/03/2026]
### 1. Refatoração UI/UX e Integração do Motor de Ciclos e Feriados [F3-FE-AUTO]
- **Descrição:** Remoção de modais, estados locais e formulários complexos para criação e edição manual de Semestres Letivos e Feriados. A interface foi totalmente refatorada para um padrão de listagem simplificada (Read-Only), guiada por automação. Foram introduzidos os botões de ação única "Gerar Próximo Semestre" e "Ressincronizar Feriados", conectados diretamente ao novo motor do backend.
- **Autor:** Kaique Caitano

## [07/04/2026]
### 1. Implementação do Dark Mode e Padronização de Tema (MUI)
**Descrição:** Criação de um ThemeContext dinâmico envelopando a aplicação para alternância de temas (Light/Dark). Refatoração completa do arquivo theme.js implementando uma paleta customizada e cores semânticas (como custom.sectionTitle). Remoção de cores hexadecimais inline (chumbadas) nos layouts (BaseLayout, DashboardPage) para permitir a herança correta do Material UI, além da substituição de sombras manuais opacas por elevações nativas (elevation={1}).

**Autor:** Kaique Caitano

### 2. Blindagem de Autenticação e Validação de Token (JWT)
**Descrição:** Refatoração do componente <PrivateRoute> para realizar a decodificação e validação de expiração do token JWT localmente, evitando requisições desnecessárias. Implementação de um Interceptor global no Axios (api.js) para capturar respostas 401 Unauthorized, limpando o storage e forçando o redirecionamento para a tela de login, com exceção de falhas ocorridas na própria rota de autenticação.
**Autor:** Kaique Caitano

### 3. Ajuste Fino de UX e Autocomplete de Navegadores
**Descrição:** Correção de bugs visuais em inputs renderizados com cores de preenchimento automático (autocomplete) do navegador (Chrome/Edge) na página de Login, injetando uma sombra interna (inset box-shadow) vinculada ao tema atual para forçar a renderização limpa do MuiOutlinedInput.
**Autor:** Kaique Caitano

### 4. Integração de Motor de Acessibilidade (UserWay)
**Descrição:** Injeção e configuração do widget de acessibilidade UserWay no index.html. Implementação da variável global _userway_config para forçar o posicionamento do ícone no canto inferior da tela, garantindo conformidade com os critérios WCAG de acessibilidade para a avaliação.
**Autor:** Kaique Caitano

## [12/04/2026]
### 1. Refatoração e Componentização de "Minhas Reservas" (Task F4-FE-02)
**Descrição:** Remodelação da página de histórico de reservas do professor. Criação do componente de domínio `ReservationTable` para isolar a lógica de renderização da tabela e status. Substituição de modais locais redundantes pelo novo utilitário genérico `ConfirmDialog`. Atualização do `reservation.service.js` para atuar como um *stateful mock* (memória viva), permitindo o fluxo completo de cancelamento de reservas e atualização da interface em tempo real sem a necessidade do backend concluído.
**Autor:** Kaique Caitano

### 2. Implementação do Formulário de Nova Reserva (Task F4-FE-01)
- **Descrição:** Criação da interface de solicitação de reservas (`CreateReservationPage`) e extração do componente de domínio `ReservationForm` para manter a arquitetura limpa. Implementação de regras de negócio avançadas no front-end: bloqueio de datas (fins de semana, feriados e fora do ciclo letivo) via `DatePicker` e checagem de conflito de horários em tempo real (com *debounce* para otimizar requisições). Integração com os modais globais (`Toast` e `ConfirmDialog`) para feedback e confirmação antes do envio para a fila de aprovação.
- **Autor:** Kaique Caitano

## [13/04/2026]
### 1. Criação da Tela de Gestão de Usuários (Front-End)
**Descrição:** Desenvolvimento da interface central de gerenciamento de usuários (UserManagementPage e UserTable) dedicada ao perfil de Suporte. A tela conta com tabelas dinâmicas, filtros por status, badges visuais com base no estado do banco (status e is_active) e modais interativos para aprovação de cadastros, bloqueio/desbloqueio de acesso e alteração de cargos.
**Autor:** Kaique Caitano

### 2. Refatoração de Responsividade no Layout Base (Front-End)
**Descrição:** Ajuste fino de CSS e refatoração da estrutura de Grid do Material UI nas páginas CreateReservationPage e MinhasReservasPage. Remoção de larguras fixas (maxWidth) e aplicação combinada de flexGrow e minWidth para garantir a fluidez perfeita da página ao abrir e fechar a Sidebar lateral, evitando quebra dos campos do formulário.
**Autor:** Kaique Caitano

## [19/04/2026]
### 1. Integração de UI para Cancelamento e Permissões Visuais de Admin
**Descrição:** Integração da chamada de API de cancelamento na tela de "Minhas Reservas", com botões funcionais e tratamento de erros. Adaptação do componente `ReservationForm` para consumir a prop `userRole`, alterando o alerta de conflito para informativo e destravando o botão de submissão para administradores. Melhoria de performance e UX na listagem utilizando `useMemo` para filtrar e ocultar instantaneamente as reservas com status `CANCELED`.
**Autor:** Kaique Caitano
**Impacto:** `src/services/Reservation.service.js`, `src/pages/MinhasReservasPage.jsx`, `src/pages/CreateReservationPage.jsx`, `src/components/ReservationForm.jsx`


## [04/05/2026]
### 1. Sistema de Gestão de Reservas e Refatoração de UX
**Descrição:** Implementação da interface de gestão para Coordenadores e Professores. No painel administrativo, foi criada a PendingReservationsPage utilizando DataGrid do MUI com paginação numerada customizada (centralizada) para evitar conflitos com o widget UserWay. Introdução de modais de Aprovação, Rejeição e Redirecionamento padronizados com o ConfirmDialog do sistema. Na visão do Professor, a MinhasReservasPage foi refatorada para suportar filtros bilíngues (Status em Inglês/Português) e lógica de visibilidade condicional para reservas canceladas. Adição de alertas dinâmicos de conflito no formulário de reserva utilizando dayjs para tratamento de timezones UTC.
**Autor:** Kaique Caitano


## [11/05/2026]
### 1. Contexto Global de Notificações (Toast Global)
- **Descrição:** Elevação do componente de Toast para um Contexto Global (`NotificationContext`). Remoção da redundância de código (`useState` locais para abrir/fechar alertas) em favor de hooks padronizados (`showSuccess`, `showError`, `showWarning`, `showInfo`). A aplicação agora possui um feedback efêmero centralizado e sobreposto a modais (`z-index: 9999`).
- **Autor:** Kaique Caitano
- **Impacto:** Criação de `contexts/NotificationContext.jsx`. Atualização no `App.jsx` (Provider) e limpeza massiva de boilerplate de estado no `LoginPage.jsx` e demais páginas da aplicação. Atualização do componente base `Toast.jsx`.

### 2. Hotfix: Payload "#null" no Cancelamento de Reservas
- **Descrição:** Correção de bug no envio do payload para a rota de cancelamento, onde o ID da reserva não estava sendo mapeado corretamente para o modal, resultando em requisições para `/api/reservations/null/cancel`.
- **Autor:** Kaique Caitano
- **Impacto:** Ajustes de passagem de props/estado na `pages/MinhasReservasPage.jsx`.

## [11/05/2026]
### 1. Interface de Sobrescrita de Reserva (Fase 6 - ADMIN)
- **Descrição:** Adição do fluxo visual de sobrescrita. O sistema agora intercepta conflitos durante a criação de reserva: se o usuário for ADMIN, exibe um alerta permitindo forçar a reserva. Inclui um modal de confirmação dedicado informando o cancelamento definitivo das reservas anteriores.
- **Autor:** Kaique Caitano
- **Impacto:** Criação do componente `components/OverwriteConfirmModal.jsx` (ou similar). Refatoração da lógica de `handlePreSubmit` na página `pages/professor/CreateReservationPage.jsx` e adição do endpoint `overwrite` no `services/Reservation.service.js`.

## [17/05/2026]
### 1. Exclusão Múltipla e Cancelamento em Lote (Fase 6 - MVP)
- **Descrição:** Implementação do fluxo visual de seleção múltipla e cancelamento em lote para otimizar a gestão de reservas. Foi adicionada uma coluna de checkboxes na tabela de listagem e uma barra de ações dinâmica que surge ao selecionar um ou mais registros. Seguindo estritamente as regras de negócio do MVP, o sistema desabilita a seleção e o cancelamento de reservas que já estejam aprovadas, rejeitadas ou canceladas, restringindo o lote apenas a solicitações com status `PENDENTE`. Inclui um diálogo de confirmação em bloco e atualização em tempo real do estado local após o sucesso da requisição.
- **Autor:** Kaique Caitano
- **Impacto:** Alterações em `src/services/reservation.service.js` (criação do método `bulkDelete`), `src/pages/professor/MinhasReservasPage.jsx` (injeção dos estados de lote, tratamento do loading e barra de controle) e `src/components/reservation/ReservationTable.jsx` (reestruturação do cabeçalho, lógica de "Selecionar Todos" condicional e bloqueio de checkboxes por status).

## [19/05/2026]
### 1. Widget Interativo de Pesquisa de Satisfação e UX
- **Descrição:** Desenvolvimento do componente reutilizável `FeedbackWidget.jsx` baseado no Material-UI (`Snackbar`, `Rating`, `TextField`, `Fade`). O componente coleta avaliações transacionais (1 a 5 estrelas) com revelação progressiva de campo de texto para comentários opcionais, garantindo uma interface não intrusiva. O gatilho foi integrado na tela `AcademicCyclesPage` (após a ativação de um ciclo) e na `CreateReservationPage` (interceptando o fluxo de redirecionamento normal caso o backend solicite o feedback via flag `promptFeedback`). O widget se comunica diretamente com a API e consome o contexto global de notificações (`NotificationContext`) para feedback visual.
- **Autor:** Kaique Caitano

## [24/05/2026]
### 1. Integração Visual do FullCalendar
**Descrição:** Estilização avançada da grade do calendário de ocupação com bordas personalizadas, identificação visual para domingos/feriados e integração completa com o tema global do sistema (Dark/Light mode).
**Autor:** Kaique Caitano
**Impacto:** `src/pages/CalendarPage.jsx`

### 2. Cadastro e Visualização Detalhada de Laboratórios
**Descrição:** Refatoração do modal de cadastro para um fluxo de 2 passos (Wizard) permitindo definir quantidades de equipamentos (serializados na descrição). Implementação de parser e modal secundário para exibir esses equipamentos estruturados em Chips na listagem.
**Autor:** Kaique Caitano
**Impacto:** `src/components/LaboratoryFormModal.jsx`, `src/pages/LaboratoriesPage.jsx`

### 3. Modal de Datas nas Aprovações Pendentes
**Descrição:** Modificação da tag de "Tipo" de reserva (Simples/Recorrente) para um botão clicável que aciona um modal. O modal renderiza de forma dinâmica as datas de início/fim, dias da semana múltiplos e matriz de horários solicitados.
**Autor:** Kaique Caitano
**Impacto:** `src/pages/PendingReservationsPage.jsx`

### 4. Correção de Redirecionamento de Reserva
**Descrição:** Correção do hook useSearchParams para capturar adequadamente o parâmetro date repassado pela URL e injetar o estado inicial no DatePicker.
**Autor:** Kaique Caitano
**Impacto:** `src/pages/CreateReservationPage.jsx`