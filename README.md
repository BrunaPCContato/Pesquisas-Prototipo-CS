# Plataforma de Pesquisas — Protótipo (Contato Seguro)

Protótipo navegável da plataforma de **Pesquisas** (clima, engajamento, eNPS, etc.) da
Contato Seguro. Construído em **React + Ant Design** seguindo o Design System da CS.
Os dados são **de exemplo (mock)** — o objetivo é validar fluxo, telas e interações.

> ⚠️ Conteúdo interno. Protótipo para validação — não é a aplicação de produção.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Ant Design 5** (Design System da CS via `ConfigProvider`)
- **@ant-design/plots** — gráficos do dashboard
- **@phosphor-icons/react** — ícones
- **react-router-dom** — navegação
- Fonte **Montserrat**, cor primária `#263072`

## Como rodar

```bash
npm install
npm run dev
```

Acesse **http://localhost:5173**. Vai aparecer uma **tela de senha** (ver abaixo).

## Acesso (tela de senha)

O protótipo é protegido por uma tela de senha *client-side* (apenas para impedir
acesso casual — não é segurança real).

- **Senha:** `pesquisas2026`
- Para alterar: `src/components/PasswordGate.tsx` (constante `SENHA`).

## Build e deploy

```bash
npm run build      # gera a pasta dist/
```

Publicado no **Cloudflare Pages** (upload da pasta `dist/`). Deploy via CLI:

```bash
npx wrangler@4.128.0 pages deploy dist --project-name=pesquisas-cs --branch=main
```

O arquivo `public/_redirects` (`/* /index.html 200`) e o `vercel.json` garantem o
roteamento SPA no host (Cloudflare Pages / Netlify / Vercel).

## Estrutura

```
src/
├── main.tsx              # bootstrap (ConfigProvider + PasswordGate + Router)
├── App.tsx               # rotas
├── theme.ts              # tokens da marca (cor, fonte, componentes)
├── session.tsx           # contexto de sessão (empresas + perfil de acesso)
├── pages/
│   ├── Home.tsx          # métricas, ações rápidas, tarefas, pontos de atenção
│   ├── Pesquisas.tsx     # rascunhos + tabela (duplicar/reabrir), seletor de empresa
│   ├── CriarPesquisa.tsx # galeria de modelos / pesquisa em branco
│   ├── NovaPesquisa.tsx  # wizard de 4 passos (Config/Perguntas/Comunicação/Lançamento)
│   ├── SurveyDetail.tsx  # resultados (Geral/Individual ou Ciclos), Resumo inteligente
│   ├── Estatisticas.tsx  # dashboard com filtros e gráficos
│   └── RascunhoPesquisa.tsx
└── components/
    ├── AppLayout.tsx     # sidebar + header
    ├── PasswordGate.tsx  # tela de senha
    ├── EmpresaSelector.tsx
    ├── PerguntasStep.tsx # construtor de perguntas (dimensões, tipos, condicional)
    ├── TasksBlock.tsx    # bloco de tarefas da Home
    └── LikertChart.tsx
```

## Principais funcionalidades

- **Home**: métricas, ações rápidas, bloco de tarefas, pontos de atenção.
- **Pesquisas**: rascunhos + listagem com filtros; duplicar, reabrir, ver estatísticas.
- **Criar pesquisa**: galeria de modelos + wizard de 4 passos.
  - Perguntas por **dimensão**; tipos: Escala Likert (concordância/frequência),
    Sim/Não, Múltipla escolha, Checkbox, Aberta e **Pergunta de importância**.
  - **Lógica condicional** (branching) entre perguntas.
  - **Lançamento único ou recorrente** (quinzenal/mensal/trimestral/…).
- **Resultados**: aba Geral (consolidada) + Individual/Ciclos; **Resumo inteligente (IA)**;
  criação de **plano de ação** a partir de uma dimensão.
  - Resultados só exibidos após **3 respostas** (privacidade/anonimato).
- **Estatísticas**: dashboard com filtros (período, pesquisa, vínculo) e vários gráficos;
  tooltip de origem dos dados.
- **Multiempresa e perfis** (`session.tsx`): seletor de empresa (Home/Pesquisas/
  Estatísticas) e perfil somente-leitura (oculta rascunhos).

## Observações

- Todos os números, pesquisas, respondentes e resumos são **dados mock**.
- A tela de senha e os toggles de demonstração (perfil/empresas, no menu do usuário)
  existem apenas para o protótipo; em produção viriam da autenticação/backend.
