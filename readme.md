# 🎓 Sistema de Gestão e Reserva de Laboratórios Acadêmicos (SisLab)

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat-square&logo=material-ui&logoColor=white)](https://mui.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

Projeto desenvolvido no 4º semestre do curso de Desenvolvimento de Software Multiplataforma (DSM) com o objetivo de modernizar o processo de reserva de laboratórios da **FATEC Zona Leste**.

O sistema substitui uma solução legada em PHP por uma arquitetura moderna, escalável e automatizada, desenhada com rigorosos padrões de Engenharia de Software.

---

## 🎯 Objetivo

Criar uma plataforma web robusta para:
- Gerenciamento eficiente de laboratórios e equipamentos.
- Solicitação e aprovação de reservas simples e recorrentes, prevenindo choques de horários.
- Fluxo de aprovação hierárquico isolado e regras de sobrescrita (Overwrite).
- Visualização de agendas em painel interativo (Calendário).
- Redução drástica de trabalho manual da coordenação através de automações de feriados e semestres.
- Feedback transacional e relatórios acadêmicos automatizados.

---

## 🏗 Arquitetura e Stack Tecnológico

O projeto adota uma arquitetura modular baseada em **MVC + Service Layer**, garantindo separação clara de responsabilidades:

### **Frontend**
- **Core:** React 19 construído com Vite.
- **Roteamento & Requisições:** React Router Dom v7 e Axios (com interceptors de autenticação).
- **Interface e UX:** Material UI (MUI v7), MUI DataGrid para listagens complexas e MUI DatePickers. Estilização baseada em tokens com suporte a Light/Dark Mode.
- **Componentes Avançados:** FullCalendar para a malha visual de agendamentos.
- **Utilitários:** Day.js para manipulação de fusos e datas, e jwt-decode para extração de sessão segura.

### **Backend**
- **Core:** Node.js + Express (Padrão ES Modules).
- **Persistência e Banco:** MySQL (driver `mysql2` operando com queries SQL puras otimizadas).
- **Segurança:** Criptografia Bcrypt e autenticação JWT (JSON Web Tokens).
- **Validação e Blindagem (Fail-Fast):** Implementação estrita de schemas de validação utilizando **Zod** nos middlewares de entrada.
- **Serviços Assíncronos e Automação:** 
  - `nodemailer` para envio de e-mails transacionais e magic links.
  - `node-cron` para agendamento de rotinas de fundo (como relatórios trimestrais).
  - `exceljs` para formatação e exportação de dados analíticos.

---

## 🚀 Status e Roadmap do Projeto

O desenvolvimento do núcleo acadêmico (MVP Estendido) foi concluído com sucesso e validado integralmente em suas 8 fases.

- [x] **Fases 1 e 2: Infraestrutura, Autenticação e Cadastros**
  - Setup do banco, JWT, RBAC e envio de "Magic Links" por e-mail.
  - CRUDs essenciais de Laboratórios, Horários e gestão de Usuários Pendentes.
- [x] **Fase 3: Automação de Ciclos e Feriados**
  - Motor de geração de semestre letivo acadêmico.
  - Sincronização automática de datas via BrasilAPI.
- [x] **Fases 4 a 6: Motor de Reservas e Conflitos**
  - Lógica heurística de detecção de choque de horários (Reservas Simples e Recorrentes).
  - Controle avançado de aprovação, rejeição, redirecionamento e sobrescrita transacional por coordenadores.
  - Cancelamento em lote (Exclusão múltipla segura).
- [x] **Fases 7 e 8: View, Notificações e Dashboards**
  - Integração do FullCalendar com mapeamento visual de status.
  - Disparo de eventos de sistema via e-mail e widget de Pesquisa de Satisfação.
  - Dashboard analítico dinâmico por perfil (Professor e Coordenador).
- [ ] **Próxima Etapa: Containerização e Deploy**
  - **Docker:** Implementação do ambiente orquestrado (Docker Compose, Dockerfile) como última camada do semestre, padronizando a infraestrutura e viabilizando o deploy para produção.

---

## 👥 Perfis de Acesso (RBAC)

O sistema possui controle granular de permissões:
- **Administrador / Coordenador (ADMIN):** Acesso irrestrito a configurações globais, gestão laboratorial, motor de ciclos, e poder máximo para aprovar, rejeitar ou forçar sobrescritas de reservas.
- **Suporte (SUPPORT):** Gerenciamento geral da saúde da base de contas e redefinição de perfis.
- **Professor (PROFESSOR):** Visualização de disponibilidades, solicitação de reservas (respeitando travas de fim de semana, feriados e limites do ciclo letivo) e gestão do próprio calendário.

---

## 📌 Diferenciais Técnicos

Este repositório representa não apenas uma evolução visual do sistema legado, mas um enorme salto estrutural focado em:
- **Prevenção de Bugs:** Validação ponta a ponta com Zod.
- **Segurança Fail-Safe:** Sistema de logs independentes de auditoria em operações de banco.
- **Design Patterns Aplicados:** Emprego de Singleton, Observer (EventBus) para mensageria assíncrona.
- **Manutenibilidade e UI/UX:** Código limpo, componentizado no React e desenhado com foco na redução da carga cognitiva de coordenadores.

---

*Desenvolvido como projeto acadêmico aplicado à realidade institucional da FATEC Zona Leste - Centro Paula Souza.*