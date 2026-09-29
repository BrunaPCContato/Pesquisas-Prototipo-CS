// Planos de ação criados a partir de pesquisas (fonte = pesquisa + dimensão).
// O módulo real vive na Gestão de Relatos; aqui os dados são mock (read-only),
// compartilhados entre o bloco da Home e a tela de detalhe do plano.

export type StatusPlano = 'Não iniciado' | 'Em andamento' | 'Concluído' | 'Atrasado'
export type StatusTarefa = 'Não iniciado' | 'Em andamento' | 'Aguardando aprovação' | 'Concluído'

export type Tarefa = {
  id: number
  titulo: string
  responsavel: string
  categoria?: string
  status: StatusTarefa
  inicio: string
  prazo: string
}

export type PlanoAcao = {
  id: number
  titulo: string
  responsavel: string
  categoria: string
  fonte: string
  status: StatusPlano
  inicio: string
  prazo: string
  descricao: string
  requerAprovacao: boolean
  tarefas: Tarefa[]
}

export const planosAcao: PlanoAcao[] = [
  {
    id: 21,
    titulo: 'Melhorar confiança e sigilo na equipe',
    responsavel: 'Bruna Pereira',
    categoria: 'Clima Organizacional',
    fonte: 'tst encerramento · Segurança e Sigilo',
    status: 'Em andamento',
    inicio: '20/09/2026',
    prazo: '30/10/2026',
    descricao:
      'Plano de ação voltado a fortalecer a percepção de segurança e sigilo na equipe, a partir do recorte da dimensão "Segurança e Sigilo" da pesquisa.',
    requerAprovacao: true,
    tarefas: [
      {
        id: 1,
        titulo: 'Rodada de conversas com lideranças',
        responsavel: 'Bruna Pereira',
        categoria: 'Clima Organizacional',
        status: 'Em andamento',
        inicio: '22/09/2026',
        prazo: '05/10/2026',
      },
      {
        id: 2,
        titulo: 'Revisar política de confidencialidade',
        responsavel: 'Júlia Klug',
        categoria: 'Governança e Políticas',
        status: 'Não iniciado',
        inicio: '01/10/2026',
        prazo: '20/10/2026',
      },
      {
        id: 3,
        titulo: 'Comunicado interno sobre canais seguros',
        responsavel: 'Carla Menezes',
        categoria: 'Comunicação e Treinamento',
        status: 'Aguardando aprovação',
        inicio: '06/10/2026',
        prazo: '15/10/2026',
      },
    ],
  },
  {
    id: 20,
    titulo: 'Plano de comunicação interna',
    responsavel: 'Carla Menezes',
    categoria: 'Comunicação e Treinamento',
    fonte: 'Clima 2026 · Comunicação Interna',
    status: 'Não iniciado',
    inicio: '16/09/2026',
    prazo: '22/11/2026',
    descricao:
      'Estruturar um plano de comunicação interna para melhorar a percepção de transparência apontada na pesquisa Clima 2026.',
    requerAprovacao: false,
    tarefas: [
      {
        id: 1,
        titulo: 'Mapear canais de comunicação atuais',
        responsavel: 'Carla Menezes',
        status: 'Não iniciado',
        inicio: '16/09/2026',
        prazo: '30/09/2026',
      },
    ],
  },
  {
    id: 18,
    titulo: 'Reforço de liderança — Operações',
    responsavel: 'Marcos Andrade',
    categoria: 'Liderança e Gestão',
    fonte: 'Clima 2026 · Liderança e Gestão',
    status: 'Atrasado',
    inicio: '01/08/2026',
    prazo: '15/09/2026',
    descricao:
      'Programa de desenvolvimento de lideranças da área de Operações, motivado pelo baixo score da dimensão "Liderança e Gestão".',
    requerAprovacao: true,
    tarefas: [
      {
        id: 1,
        titulo: 'Diagnóstico de necessidades de treinamento',
        responsavel: 'Marcos Andrade',
        categoria: 'Liderança e Gestão',
        status: 'Concluído',
        inicio: '01/08/2026',
        prazo: '20/08/2026',
      },
      {
        id: 2,
        titulo: 'Contratar programa de mentoria',
        responsavel: 'Renata Souza',
        status: 'Aguardando aprovação',
        inicio: '21/08/2026',
        prazo: '10/09/2026',
      },
    ],
  },
  {
    id: 15,
    titulo: 'Ações de bem-estar',
    responsavel: 'Renata Souza',
    categoria: 'Saúde e Bem-estar',
    fonte: 'Pulso Q3 · Saúde e Bem-estar',
    status: 'Concluído',
    inicio: '10/06/2026',
    prazo: '10/08/2026',
    descricao:
      'Conjunto de ações de saúde e bem-estar implementadas após o resultado da dimensão "Saúde e Bem-estar" na pesquisa Pulso Q3.',
    requerAprovacao: false,
    tarefas: [
      {
        id: 1,
        titulo: 'Campanha de saúde mental',
        responsavel: 'Renata Souza',
        categoria: 'Saúde e Bem-estar',
        status: 'Concluído',
        inicio: '10/06/2026',
        prazo: '30/06/2026',
      },
      {
        id: 2,
        titulo: 'Ginástica laboral',
        responsavel: 'Carla Menezes',
        status: 'Concluído',
        inicio: '01/07/2026',
        prazo: '10/08/2026',
      },
    ],
  },
]

// ---- Listas de apoio (criação de plano de ação) ----

/** Pessoas do Banco de Pessoas (responsável do plano/tarefa). */
export const bancoPessoas = [
  { value: 'renata', label: 'Renata Souza', cargo: 'RH · Gestão de Pessoas' },
  { value: 'julia', label: 'Júlia Klug', cargo: 'Compliance' },
  { value: 'bruna', label: 'Bruna Pereira', cargo: 'RH · Compliance' },
  { value: 'marcos', label: 'Marcos Andrade', cargo: 'Liderança · Operações' },
  { value: 'carla', label: 'Carla Menezes', cargo: 'Comunicação Interna' },
]

/** Categorias do plano de ação. */
export const categoriasPlano = [
  { value: 'com-treino', label: 'Comunicação e Treinamento' },
  { value: 'governanca', label: 'Governança e Políticas' },
  { value: 'clima', label: 'Clima Organizacional' },
  { value: 'lideranca', label: 'Liderança e Gestão' },
  { value: 'saude', label: 'Saúde e Bem-estar' },
  { value: 'outros', label: 'Outros' },
]

/** Dimensões da pesquisa (recorte de origem do plano). */
export const dimensoesPesquisa = [
  'Segurança e Sigilo',
  'Liderança e Gestão',
  'Comunicação Interna',
  'Saúde e Bem-estar',
  'Desenvolvimento pessoal',
  'Reconhecimento',
]

/** Pesquisas que podem ser fonte de um plano de ação. */
export const pesquisasFonte = ['tst encerramento', 'Clima 2026', 'Pulso Q3', 'Engajamento 2026']

/** Tarefa achatada com referência ao plano de origem (para blocos de tarefas). */
export type TarefaComPlano = Tarefa & { planoId: number; planoTitulo: string }

/** Todas as tarefas de todos os planos, com o plano de origem. */
export function tarefasDosPlanos(): TarefaComPlano[] {
  return planosAcao.flatMap((p) =>
    p.tarefas.map((t) => ({ ...t, planoId: p.id, planoTitulo: p.titulo })),
  )
}

export const corStatusPlano: Record<StatusPlano, string> = {
  'Não iniciado': 'blue',
  'Em andamento': 'processing',
  Concluído: 'success',
  Atrasado: 'error',
}

export const corStatusTarefa: Record<StatusTarefa, string> = {
  'Não iniciado': 'blue',
  'Em andamento': 'processing',
  'Aguardando aprovação': 'warning',
  Concluído: 'success',
}
