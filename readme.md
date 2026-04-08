# 🎓 Sistema de Gestão e Reserva de Laboratórios Acadêmicos (SisLab)

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat-square&logo=material-ui&logoColor=white)](https://mui.com/)

Projeto desenvolvido no 4º semestre do curso de Desenvolvimento de Software Multiplataforma (DSM) com o objetivo de modernizar o processo de reserva de laboratórios da **FATEC Zona Leste**.

O sistema substitui uma solução legada em PHP por uma arquitetura moderna, escalável e automatizada, desenhada com rigorosos padrões de Engenharia de Software.

---

## 🎯 Objetivo

Criar uma plataforma web robusta para:
- Gerenciamento eficiente de laboratórios e equipamentos.
- Solicitação e aprovação de reservas sem choques de horários.
- Fluxo de aprovação hierárquico isolado (Multi-tenancy por departamento).
- Visualização de agendas com bloqueio automático de feriados e recessos.
- Redução drástica de trabalho manual da coordenação através de automações.

---

## 🏗 Arquitetura e Padrões

O projeto adota uma arquitetura modular baseada em **MVC + Service Layer**, garantindo separação clara de responsabilidades:

- **Frontend:** React + Material UI (Padrão de Adapters para comunicação com a API).
- **Backend:** Node.js + Express.
- **Persistência:** MySQL (Gerenciado via Repositories com queries SQL puras e otimizadas).
- **Validação e Blindagem:** Implementação estrita de DTOs utilizando **Zod** para garantir integridade absoluta dos dados nas rotas.
- **Segurança:** Autenticação via JWT com Role-Based Access Control (RBAC).

---

## 🚀 Status e Roadmap do Projeto

O desenvolvimento é guiado por entregas incrementais rigorosas. O projeto encontra-se atualmente focado no Motor de Reservas.

- [x] **Fase 1: Infraestrutura e Autenticação**
  - Setup do banco relacional, CI/CD e esteira de desenvolvimento.
  - Login JWT com controle de escopo (Coordenadores restritos aos seus departamentos).
- [x] **Fase 2: Integração End-to-End**
  - CRUDs essenciais (Usuários, Horários, Departamentos).
  - Blindagem de rotas com Middlewares de Validação.
- [x] **Fase 3: Motor de Automação de Ciclos e Feriados**
  - Substituição de trabalho manual por geração "One-Click" de semestres letivos.
  - Sincronização automatizada de feriados nacionais (via BrasilAPI) e recessos institucionais do Centro Paula Souza.
- [ ] **Fase 4: Motor de Reservas e Conflitos (Em andamento)**
  - Lógica de choque de horários e disponibilidade de laboratórios.

---

## 👥 Perfis de Acesso (RBAC)

O sistema possui controle granular de permissões:
- **Administrador Master:** Acesso irrestrito a configurações globais (Feriados, Ciclos).
- **Coordenador:** Gestão de professores e aprovação de reservas *exclusivamente* dentro do seu departamento.
- **Professor:** Visualização do calendário, solicitação de reservas e acompanhamento de status.

---

## 📌 Diferenciais Técnicos

Este repositório representa não apenas uma evolução visual do sistema anterior, mas um salto estrutural focado em:
- **Prevenção de Bugs:** Validação de ponta a ponta.
- **UX para Gestão:** Interfaces limpas ("Read-Only" onde aplicável) guiadas por automações de backend.
- **Manutenibilidade:** Código limpo, componentizado e com contratos de API bem definidos.

---

*Desenvolvido como projeto acadêmico aplicado à realidade institucional do Centro Paula Souza.*