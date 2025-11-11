# 🧠 Vibe Intel Monorepo

**Vibe Intel** é um monorepo modular que unifica o núcleo de agentes, API pública e utilitários compartilhados da organização **@devflow-modules**.  
O projeto segue arquitetura escalável, automação total de builds, versionamento semântico e publicação contínua no npm com Trusted Publishing.

---

## 📦 Estrutura do Monorepo

```bash
/vibe-intel
  ├── packages/
  │   ├── api/        # API pública (Fastify 5 + JWT + Rate Limit)
  │   ├── core/       # Núcleo do agente e roteamento de skills
  │   └── shared/     # Tipos, clients e utilitários compartilhados
  ├── .github/workflows/release.yml  # CI/CD de release automático
  ├── tsconfig.base.json
  ├── turbo.json
  └── package.json
```

---

## 🚀 Desenvolvimento Local

1. Clonar e instalar dependências

```bash
git clone https://github.com/devflow-modules/vibe-intel.git
cd vibe-intel
pnpm install
```

2. Rodar localmente cada módulo

```bash
pnpm dev:api     # inicia servidor Fastify
pnpm dev:core    # executa agente/skills
pnpm build       # compila todos os pacotes
```

3. Build de produção

```bash
pnpm build
```

---

## 🧩 Publicação Automática (CI/CD)

A publicação é 100% automatizada via GitHub Actions e Trusted Publishing (sem tokens).

Fluxo:
   1. Commits seguem o padrão Conventional Commits
   2. `semantic-release` calcula versão automaticamente.
   3. Gera `CHANGELOG.md`, cria tag, e publica no npm.

Cada pacote (`@devflow-modules/vibe-core`, `@devflow-modules/vibe-shared`, etc.) é publicado de forma independente conforme detectadas alterações.

---

## 🧠 Tecnologias-Chave

---

## 🧪 Padrão de Commit

Cada commit deve seguir o formato:

```makefile
<tipo>(escopo): descrição curta
```

Exemplos:

```java
feat(core): adiciona roteador de intenções
fix(shared): corrige import do OpenAI client
chore(ci): ajusta pipeline de release
```

---

## 🔄 Versionamento e Releases

Versões são publicadas automaticamente com base nos commits:

`feat`: → minor

`fix`: → patch

`BREAKING CHANGE`: → major

---

## 🧰 Scripts úteis

| Comando | Descrição | 
| pnpm build | Compila todos os pacotes |
| pnpm dev:api | Roda a API localmente |
| pnpm dev:core | Roda o core localmente |
| pnpm test | Executa testes (quando adicionados) |

---

## 🛠 Requisitos

* Node.js: >= 20
* PNPM: >= 10.21.0
* TypeScript: >= 5.9
* GitHub OIDC Trusted Publisher configurado no npm

---

## 📄 Licença

Este projeto é mantido sob a licença MIT — livre para uso e modificação, com atribuição.

---

## 💡 Autor

Gustavo Marques
Criador e mantenedor do ecossistema DevFlow Modules.