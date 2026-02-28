
---

# 📌 Modelo Profissional de Padrão de Commits

## 📁 Padrão Oficial de Commits do Projeto

Este projeto segue um padrão obrigatório de commits para garantir:

* Organização do histórico
* Rastreabilidade de alterações
* Facilidade de manutenção
* Clareza nas revisões de código
* Profissionalismo no versionamento

Todos os membros devem seguir as instruções abaixo.

---

# 🔹 Estrutura Padrão de Mensagem de Commit

Formato obrigatório:

```
tipo: descrição curta da alteração

Descrição detalhada (opcional, mas recomendada quando necessário)
```

---

## 📌 Tipos Permitidos

| Tipo     | Uso                                     |
| -------- | --------------------------------------- |
| feat     | Nova funcionalidade                     |
| fix      | Correção de bug                         |
| refactor | Refatoração sem alterar comportamento   |
| style    | Alterações visuais ou formatação        |
| docs     | Alterações na documentação              |
| chore    | Ajustes internos (config, dependências) |
| test     | Criação ou ajuste de testes             |

---

## 📌 Exemplos de Commits Corretos

```
feat: criação da estrutura inicial de autenticação

fix: correção na validação de conflito de horário

refactor: reorganização da camada de serviços

docs: atualização das instruções de deploy

chore: instalação do MUI e dependências iniciais
```

---

# 🚫 O que NÃO é permitido

❌ Commits genéricos como:

```
update
alterações
teste
mudanças
arrumando
```

❌ Commits sem descrição clara do que foi feito.

❌ Subir múltiplas funcionalidades diferentes em um único commit. (pode ser dificil, porem evitar o maximo possivel).

⚠️ Caso suba muitas feats, detalhe por nome cada um das funçoes nos detalhes do commit para melhorar rastreio caso você erre e nao separe os commits.

---

# 🔹 Como Realizar Commit Pelo GitHub Desktop

1. Abrir o GitHub Desktop
2. Selecionar os arquivos alterados
3. No campo "Summary", escrever a mensagem no padrão definido
4. No campo "Description" (opcional), detalhar alterações relevantes
5. Clicar em "Commit to branch"
6. Clicar em "Push origin"

Antes de dar push, revisar os arquivos selecionados.

---

# 🔹 Como Realizar Commit Pelo Prompt (CLI)

Dentro da pasta do projeto:

## 1️⃣ Verificar alterações

```
git status
```

## 2️⃣ Adicionar arquivos

Adicionar todos:

```
git add .
```

Ou adicionar arquivos específicos:

```
git add caminho/do/arquivo
```

## 3️⃣ Criar commit seguindo padrão

```
git commit -m "feat: criação da tela de login"
```

## 4️⃣ Enviar para o repositório remoto

```
git push origin nome-da-branch
```

---



# 🔹 Boas Práticas Obrigatórias

* Não commitar código quebrado.
* Não commitar arquivos de configuração local (.env).
* Não commitar node_modules.
* Sempre testar antes de dar push.
* Fazer Pull antes de iniciar alterações para evitar conflitos.

---

# 🔹 Responsabilidade

Este padrão foi definido para garantir organização e qualidade do projeto.

Commits fora do padrão poderão ser solicitados para correção.

Todos os membros devem seguir estas diretrizes.

---

