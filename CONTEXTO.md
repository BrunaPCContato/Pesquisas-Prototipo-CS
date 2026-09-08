# Contexto do Projeto — Plataforma "Pesquisas"

> Arquivo de handoff. Ao abrir uma nova sessão do Claude Code nesta pasta,
> peça: **"Claude, leia o CONTEXTO.md e vamos continuar."**

## Objetivo
Criar/copiar uma plataforma que existe no Figma, começando por **uma tela específica**
para validar o padrão antes de escalar para o resto.

## Decisões já tomadas
- **Stack:** React + Ant Design usando o Design System da Contato Seguro (DS CS)
- **Fluxo obrigatório:** seguir a skill `tela-ds-cs` — usar apenas componentes e tokens
  válidos do "Ant Design System for Figma 5.24 (CS)", validando cada componente na
  "Documentação DS CS - Ant design" antes de aplicar.
- **Tokens da marca:** cor primária `#263072`, fonte **Montserrat**.
  (Obs.: o token de fonte do DS CS é "SF Pro Text"/sistema; a fonte da marca no
  protótipo é Montserrat, aplicada via `token.fontFamily` do ConfigProvider.)
- **Escopo inicial:** uma única tela (a definir pelo link do Figma).
- **Pasta do projeto:** `C:\Users\bruna.pereira_contat\Desktop\pesquisas`

## Progresso (2026-08-11)
- [x] Projeto React + Vite + TS iniciado nesta pasta.
- [x] `antd` 5.24 + `@ant-design/icons` instalados; tema da CS em `src/theme.ts`
      (`colorPrimary #263072`, fonte Montserrat via Google Fonts no `index.html`).
- [x] Primeira tela montada a partir de **print** (não do Figma): **Home**.
      - `src/components/AppLayout.tsx` — Sider + Header (Menu, Avatar, Dropdown).
      - `src/components/Logo.tsx` — logo CS (emblema SVG aproximado).
      - `src/pages/Home.tsx` — métricas (Card+Statistic), ações rápidas (Button),
        pontos de atenção (Collapse+List+Badge), FloatButton de ajuda.
- [x] Rodando em `http://localhost:5173` (`npm run dev`), sem erros de console.
- [x] Roteamento com `react-router-dom` (`/` = Home, `/pesquisa/:id` = detalhe).
- [x] Segunda tela: **Detalhe da pesquisa** (`src/pages/SurveyDetail.tsx`),
      aberta ao clicar em "Acessar pesquisa". Contém: header (título + Tag
      "Ativa" + botões Encerrar/link/Mais ações), metadados, abas Geral/Individual,
      3 cards (Respostas/Taxa+Progress/Score), Score por dimensão (Progress),
      Score por pergunta (Collapse + gráfico Likert).
- [x] `src/components/LikertChart.tsx` — gráfico de colunas próprio (ver desvio).
- [x] Fluxo validado no navegador: Home → Acessar pesquisa → Voltar.
- [x] Ações do header do detalhe (todas validadas no navegador):
      - **Encerrar agora** → `Modal.confirm` ("Confirmar encerramento").
      - **Link** → `Popover` com `QRCode` (nativo Ant) + Baixar (PNG) + URL + copiar.
      - **Mais ações** → `Dropdown` (Editar / Exportar relatório / Excluir[danger]).
      - Usa `App.useApp()` para modal/message com contexto do tema.
- [x] Aba **Individual**: card do respondente com navegação (‹ 1 de 4 ›),
      `Collapse` por dimensão com pergunta + `Resposta` (Input readOnly).
      Dados mock de 4 respondentes; navegação prev/next validada.
- [x] Terceira tela: **Pesquisas** (`src/pages/Pesquisas.tsx`, rota `/pesquisas`,
      item do menu). Header + "+ Pesquisa"; **Rascunhos** (carrossel de Cards +
      Badge + next); filtros (`Select` Status, `RangePicker`, busca);
      `Table` (Nome, Status[Tag], datas, Taxa[Progress], ações circulares:
      estatísticas→detalhe, duplicar, reabrir). Dados mock; validado no navegador.
      - **Duplicar** → `Modal.confirm` ("Deseja duplicar essa pesquisa?").
      - **Reabrir** → `Modal` com `Checkbox` "Agendar data de encerramento" +
        `DatePicker` obrigatório (validação: erro se marcado e sem data).
- [x] Quarta tela: **Criar pesquisa** (`src/pages/CriarPesquisa.tsx`, rota
      `/pesquisas/criar`, aberta pelo "+ Pesquisa" e ações rápidas da Home).
      `Segmented` (Todos / Modelos Contato Seguro / Meus modelos) + "+ Modelo";
      grid de `Card`: "Pesquisa em branco" (Criar) + modelos (capa gradiente,
      `Tag` "N perguntas", nome + selo verificado, descrição, "Usar modelo").
      Filtro validado. NOTA: capas são gradientes (placeholder), não fotos reais.
- [x] Navegação da Home ligada: ação rápida "Pesquisa" → criar, "Gerenciar
      pesquisas" → lista.
- [x] Quinta tela: **Assistente de criação** (`src/pages/NovaPesquisa.tsx`, rota
      `/pesquisas/nova`, aberta pelos botões Criar/Usar modelo da galeria).
      `Steps` de 4 passos (Configuração/Perguntas/Comunicação/Lançamento);
      passo 1 = `Form` com validação ("Campo de preenchimento obrigatório"):
      Nome (Input), Descrição (TextArea), Tipo de coleta (`Radio.Group` solid
      Anônima/Identificada), Público-alvo (`Select` multiple c/ departamentos +
      "Selecionar todos"/"Limpar seleção" no dropdown).
      Casos condicionais validados: Anônima→`Alert` privacidade; Identificada→
      `Alert` identificada + campo extra "Público-alvo personalizado".
      Passo 2 implementado (ver abaixo); passos 3–4 placeholders.
      Nav Anterior/Próximo/Lançar. Estado das dimensões elevado ao pai.
- [x] **Passo 2 — Perguntas** (`src/components/PerguntasStep.tsx`): construtor.
      - `Select` de dimensões (opções com ícone colorido) + footer "Criar dimensão"
        + botão Adicionar → adiciona à lista de dimensões.
      - Lista de dimensões: handle (visual), ícone/cor, nome, "+ Pergunta",
        excluir, expandir (mostra perguntas + tipo, com excluir por pergunta).
      - Modal **Criar dimensão**: Nome + seletor de 8 ícones (`Radio.Group`) +
        `ColorPicker` (#1677FF). Cria e adiciona à lista.
      - Modal **Adicionar pergunta**: Título + Tipo (`Select` 5 tipos c/ descrição
        via optionRender). Condicionais: Likert→`Alert` info da escala + Sentido
        (Positivo/Negativo); Múltipla/Checkbox→`Form.List` de opções + "+ Opção";
        Aberta/Sim-Não→sem extras. Tudo validado no navegador.
      NOTA DS: os 8 ícones são aproximações dos ícones do DS; handle de arrastar
      é visual (sem reordenação drag-and-drop implementada).
      - Seção **Exibição** (fim do passo 2): 3 cards selecionáveis (Uma pergunta
        por página / Uma página por dimensão / Todas em uma página).
- [x] **Passo 3 — Comunicação**: `Collapse` "E-mail" com Assunto + Conteúdo
      (texto padrão pré-preenchido) + checkbox "Habilitar lembrete automático" +
      `Alert` info sobre o link no último passo. Validação de Assunto/Conteúdo.
- [x] **Passo 4 — Revisão/Lançamento**: revisão de Configuração/Perguntas/Canal
      (com tags e resumo), + params de Lançamento (`InputNumber` minutos,
      checkboxes Agendar lançamento/encerramento revelando `DatePicker`
      obrigatórios). Botão final "Lançar pesquisa agora" com validação.
- [x] Header ganhou botão "Salvar rascunho". Estado com 3 forms (config/com/launch)
      + dimensions + exibicao no pai; valores persistem entre passos (preserve).
- [x] WIZARD COMPLETO validado no navegador ponta a ponta (passos 1→4).
- [x] Sexta tela: **Estatísticas** (`src/pages/Estatisticas.tsx`, rota
      `/estatisticas`, item do menu). Header + "Exportar relatório"; sidebar de
      filtros (Período com RangePicker + botões, Pesquisa específica, vínculos
      em checkbox); 3 KPIs (ICG 61.59 / TMA 19.15% / TRR 100) com ícones;
      e 5 gráficos com **`@ant-design/plots`** (lib oficial de charts do ecossistema
      Ant — instalada agora): Linha (evolução), Colunas por depto (cor condicional),
      Barras horizontais (perguntas com menor score), **Rose/polar** (resultados
      por dimensão), Colunas agrupadas (clima vs relatos). Validado no navegador.
- [x] Limpeza: `dropdownRender`→`popupRender`, `destroyOnClose`→`destroyOnHidden`,
      e warning de `key` no `Form.List` corrigidos.
- [x] Lançamento com **escopo Única/Recorrente** (`Radio` no passo 4):
      - **Única** → mantém agendamento de datas de lançamento/encerramento.
      - **Recorrente** → `Select` de Frequência (Quinzenal/Mensal/Trimestral/
        Semestral/Anual) + `DatePicker` Data de início + `InputNumber` "Período que
        ficará aberta (dias)" + `Alert` com resumo dinâmico da recorrência.
      Validado no navegador (toggle, opções, resumo dinâmico).
- [x] Coluna **Tipo** (Única / Recorrente) na tabela de Pesquisas (Tag; recorrente
      com ícone Sync). O botão de estatísticas navega com `?tipo=` do row.
- [x] Detalhe da pesquisa: para **recorrente** (`?tipo=recorrente`), a aba Geral
      vira `Collapse` de **cards por ciclo** (Ciclo 1/2/3 com período + status),
      cada um expansível com `>`, mostrando os resultados daquele ciclo
      (respostas/taxa/score/dimensão/pergunta). Para **única**, segue direto.
      Resultados extraídos no componente `GeralResults`. Validado no navegador.
      Recorrência detectada pelo id (`recurringSurveyIds`) OU `?tipo=recorrente`,
      então os ciclos aparecem por qualquer caminho de acesso.
      ESTRUTURA ATUAL das abas:
      - **Única**: Geral (resultado reto) + Individual (por respondente).
      - **Recorrente**: Geral = **consolidado de todos os ciclos** (soma de
        respostas/convidados, média de score, + `Alert` de consolidado); a aba
        Individual é substituída por **Ciclos** (Collapse de cards Ciclo 1/2/3).
        Cada ciclo (`CicloConteudo`) tem **sub-abas Geral/Individual** próprias:
        Geral = `GeralResults` do ciclo; Individual = `IndividualView` com
        respondentes gerados p/ o ciclo (`gerarRespondentes`). Ciclo com <3
        respostas mostra só o bloqueio (sem sub-abas / sem individual).
- [x] **Resumo por IA** no topo da aba Geral (componente `AIResumo` em
      SurveyDetail): mesmo padrão visual do "Resumo do relato" da plataforma —
      caixa azul-clara + rótulo verde com ícone de IA (sparkle SVG) + caixa
      branca com o texto. Texto varia para única vs recorrente. Validado.
      NOTA: o ícone de IA é aproximação (sparkle SVG); trocar pelo oficial se houver.
- [x] **Tipo "Pergunta de importância"** (priorização) no `tipoPergunta`:
      - Título com **placeholder cinza** `Ex: Quão importante é "{dimensão}" para
        você?` (nome da dimensão como variável); se enviado vazio, **reverte ao
        texto padrão** (`textoImportanciaPadrao`). Não é obrigatório digitar.
      - **Tooltip** de informações no rótulo (propósito de priorização, variável,
        reversão, posição ao final).
      - Tag **"Priorização"** (StarOutlined, gold) na lista; ordenada **ao final
        do bloco da dimensão** (sort por tipo importância).
      - Não participa de lógica condicional (não é base nem condicional).
      NOTA: validação no painel MCP ficou bloqueada por bundle velho (aba suspensa
      com painel fechado); código conferido na fonte. Abrir o painel Browser p/ ver.
- [x] Passe de fidelidade de tema (theme.ts + index.css): cards com sombra suave
      e radius 12, sidebar com mais respiro, tabs/tabela/steps em navy, tipografia
      Montserrat peso 600 nos títulos, cinza `#8c8c99` no texto secundário.
- [x] Fonte trocada para **Montserrat** (token `fontFamily` do ConfigProvider +
      Google Fonts). Fundo neutralizado para **cinza** (`#f4f4f5`, era azulado).
- [x] **Ícones migrados de `@ant-design/icons` para `@phosphor-icons/react`** em
      todos os arquivos (o DS CS usa Phosphor). Sem resquício do Ant.
- [x] **Resumo inteligente** (novo `ResumoInteligente` em SurveyDetail, substitui
      o antigo `AIResumo`): card rico com cabeçalho (Sparkle + tag + 👍/👎 +
      recolher), alertas info/aviso, corpo com destaques numéricos, colunas
      **Destaques × Pontos de atenção**, botão "Criar plano de ação para {dimensão}"
      e rodapé "Revise antes de compartilhar". Dados p/ única e recorrente.
- [x] **Bloco de tarefas na Home** (`components/TasksBlock.tsx`, como nos Relatos):
      `Tabs` (Tarefas pendentes / Tarefas pendentes de aprovação, com Badge) +
      `Carousel` (arrows + dots) de cards de tarefa (título, descrição, data).
- [x] **Criar plano de ação a partir do resultado** (SurveyDetail): botão
      "Criar plano de ação" em cada dimensão (Score por dimensão) abre `Modal`
      com **Fonte = Pesquisa + Dimensão + Segmento** (Select) + Título/Responsável/
      Prazo/Descrição. Validado. NOTA: sem os prints do módulo "Planos de Ações"
      de Gestão de Relatos, o fluxo/campos são uma aproximação — alinhar quando
      tiver as telas do módulo existente.
- [x] Estatísticas: **tooltip de origem dos dados** em cada gráfico (ícone info no
      título) mostrando Origem (o que o gráfico agrega) + Pesquisa + Período +
      Departamento/vínculo. Filtros (período/pesquisa/vínculo) agora são
      controlados por estado; quando há filtro ativo o ícone fica navy e aparece
      Tag "Filtros aplicados". Validado no navegador.
- [x] **Sessão/permissões** (`src/session.tsx`, contexto): empresas do usuário,
      empresa atual e perfil (somenteLeitura). Toggles de demonstração no menu do
      usuário (header), persistidos em localStorage. Critérios validados:
      - AC_01/02: seletor de empresa **ao lado da busca** (ícone de prédio) na tela
        Pesquisas quando há >1 empresa; trocar empresa reflete no header.
      - AC_03: com 1 empresa, o seletor não aparece.
      - AC_04: perfil leitura oculta Rascunhos (seção, filtro Status e contador) e o
        botão "+ Pesquisa".
      - AC_05: acesso direto a `/pesquisas/rascunho/:id` em leitura é bloqueado
        (`Result` 403 em `RascunhoPesquisa.tsx`).
- [x] **RN_03**: seletor de empresa extraído em `components/EmpresaSelector.tsx`
      (reutilizável) e colocado em **Home**, **Pesquisas** e **Estatísticas**.
      PENDENTE: **Grupos** — seção ainda não existe no protótipo; adicionar o
      seletor quando a tela de Grupos for criada.
- [x] **Descrição da pesquisa** exibida no Detalhe (abaixo do título, acima dos
      metadados). Hoje é constante mock; em produção viria do campo "Descrição"
      do passo Configuração do wizard.
- [x] **Lógica condicional de perguntas (branching)** (modal Adicionar pergunta):
      checkbox "Exibir esta pergunta condicionalmente" → **Pergunta base** +
      **"Exibir quando a resposta for"** (multi-seleção das respostas da base).
      Modelo: `condicao: { baseId, valores[] }` — quem escolher uma dessas
      respostas na base vê esta pergunta (ex.: resposta B → pergunta X; A → Y).
      Papéis (regra atual):
      - **Pergunta base** (gatilho) — `TIPOS_BASE` = **Likert, Sim/Não, Múltipla,
        Checkbox** (Likert PODE ser base; respostas via `valoresBase`).
      - **Pergunta condicional** (a exibida) — `podeSerCondicional` = qualquer tipo
        **exceto Likert e Importância** (Likert NÃO pode ser condicional).
      - **Aviso "sem base"** — só nos tipos de escolha (`TIPOS_ESCOLHA` = Sim/Não,
        Múltipla, Checkbox).
      Tag "Condicional" com tooltip da regra.
- [x] **Aviso de 3 respostas** (privacidade): `GeralResults` bloqueia os resultados
      de um recorte quando `respostas < MIN_RESPOSTAS` (3), mostrando "Resultados
      indisponíveis... somente após 3 respostas... Recebidas: X de Y". O aviso
      **só aparece quando ainda não há 3 respostas**; com ≥3 os resultados
      aparecem normalmente. Demonstrado pelo Ciclo 3 (2 respostas). Validado.
- [x] Nova **escala Likert de Frequência** no modal Adicionar pergunta: seletor
      "Escala" (Concordância / Frequência). Concordância = Discordo totalmente…
      Concordo totalmente; Frequência = Muito frequente · Frequentemente ·
      Eventualmente · Raramente · Nunca. Caixa de opções e `escala` salva na
      pergunta refletem a escolha. Validado no navegador.

## Dependências extras
- `react-router-dom` (roteamento), `@ant-design/plots` (gráficos do dashboard).
- Charts NÃO existem no Ant DS core → `@ant-design/plots` é a opção oficial mais
  próxima (decisão da skill). O `LikertChart` custom do detalhe pode ser migrado
  para a mesma lib para consistência (pendente, opcional).

## Desvios do DS a revisar
- Logo é **aproximação** (não temos o asset oficial do emblema CS).
- Alguns valores de cor de apoio (fundos dos ícones circulares, badge) foram
  definidos por aproximação da marca, não são tokens exatos do DS.
- **Gráfico Likert** (`LikertChart.tsx`) é componente próprio: gráficos não
  existem no Ant DS core. Substituível por `@ant-design/plots` (lib oficial).
- Ícone da dimensão "Segurança e Sigilo" é aproximação (SafetyCertificate).

## Próximos passos
1. [ ] Comparar a Home no navegador com o print e ajustar detalhes finos.
2. [ ] Substituir o logo aproximado pelo asset oficial da CS, se disponível.
3. [ ] Escalar para as próximas telas (Pesquisas, Estatísticas...).

## Como rodar
```
cd Desktop/Pesquisas
npm run dev   # http://localhost:5173
```
