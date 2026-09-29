import { useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import {
  Typography,
  Tag,
  Button,
  Space,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Tabs,
  Segmented,
  Avatar,
  Collapse,
  FloatButton,
  Popover,
  Dropdown,
  Input,
  QRCode,
  Alert,
  Form,
  Select,
  DatePicker,
  Modal,
  Divider,
  App,
} from 'antd'
import type { MenuProps } from 'antd'
import {
  CaretLeft,
  CaretRight,
  XCircle,
  LinkSimple,
  DotsThreeVertical,
  CalendarBlank,
  User,
  SealCheck,
  Question,
  PencilSimple,
  FileText,
  Trash,
  Copy,
  DownloadSimple,
  WarningCircle,
  Target,
  Sparkle,
  ThumbsUp,
  ThumbsDown,
  CaretUp,
  CaretDown,
  CheckCircle,
  TrendUp,
  TrendDown,
  Lightbulb,
} from '@phosphor-icons/react'
import { brand } from '../theme'
import LikertChart from '../components/LikertChart'
import { bancoPessoas, categoriasPlano, dimensoesPesquisa } from '../data/planos'

const { Title, Text, Paragraph } = Typography

const descricaoPesquisa =
  'Pesquisa voltada à análise do bem-estar no ambiente de trabalho, considerando aspectos como satisfação profissional, qualidade das relações interpessoais, equilíbrio entre vida pessoal e profissional, saúde mental, condições de trabalho e percepção dos colaboradores. O objetivo é identificar fatores que influenciam o bem-estar dos funcionários e compreender oportunidades de melhoria no ambiente organizacional.'

function MetaItem({ icon, label, value, muted }: {
  icon: React.ReactNode
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <Space size={6} align="center">
      <span style={{ color: brand.textMuted }}>{icon}</span>
      <Text strong style={{ color: brand.primary }}>
        {label}
      </Text>
      <Text style={{ color: muted ? '#bfbfbf' : brand.textMuted }}>{value}</Text>
    </Space>
  )
}

const statValueStyle = {
  fontSize: 44,
  fontWeight: 700,
  color: '#1f1f1f',
  lineHeight: 1.1,
}

function DimensionRow({ name, score }: { name: string; score: number }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Space size={12} align="center">
          <Avatar
            size={32}
            style={{ backgroundColor: brand.dimension }}
            icon={<SealCheck />}
          />
          <Text style={{ fontSize: 16, color: '#1f1f1f' }}>{name}</Text>
        </Space>
        <Text style={{ fontSize: 16, color: brand.dimension, fontWeight: 500 }}>
          {score.toFixed(1).replace('.', ',')}
        </Text>
      </div>
      <Progress
        percent={score}
        showInfo={false}
        strokeColor={brand.dimension}
        trailColor="#e9e9e9"
        strokeLinecap="round"
      />
    </div>
  )
}

const likertData = [
  { label: 'Discordo totalmente', value: 3 },
  { label: 'Discordo', value: 0 },
  { label: 'Neutro', value: 0 },
  { label: 'Concordo', value: 0 },
  { label: 'Concordo totalmente', value: 1 },
]

const SHARE_URL = 'https://portal.tst.contatoseguro.io/pesquisa/tst-encerramento'

type Respondent = {
  id: number
  department: string
  answeredAt: string
  dimensions: { name: string; questions: { label: string; answer: string }[] }[]
}

const respondents: Respondent[] = [
  {
    id: 1,
    department: 'Departamento de RH',
    answeredAt: '11/05/2026 16:44',
    dimensions: [
      { name: 'Segurança e Sigilo', questions: [{ label: 'ff', answer: 'Discordo totalmente' }] },
    ],
  },
  {
    id: 2,
    department: 'Departamento teste',
    answeredAt: '10/05/2026 09:12',
    dimensions: [
      { name: 'Segurança e Sigilo', questions: [{ label: 'ff', answer: 'Discordo' }] },
    ],
  },
  {
    id: 3,
    department: 'Financeiro',
    answeredAt: '09/05/2026 14:30',
    dimensions: [
      { name: 'Segurança e Sigilo', questions: [{ label: 'ff', answer: 'Concordo totalmente' }] },
    ],
  },
  {
    id: 4,
    department: 'Operações',
    answeredAt: '08/05/2026 18:05',
    dimensions: [
      { name: 'Segurança e Sigilo', questions: [{ label: 'ff', answer: 'Discordo totalmente' }] },
    ],
  },
]

// Gera respondentes mock para um ciclo (determinístico)
const deptosMock = [
  'Departamento de RH',
  'Departamento de Finanças',
  'Financeiro',
  'Operações',
  'Comercial',
]
const likertMock = ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente']
const datasMock = [
  '11/05/2026 16:44',
  '10/05/2026 09:12',
  '09/05/2026 14:30',
  '08/05/2026 18:05',
  '07/05/2026 10:20',
]
function gerarRespondentes(n: number): Respondent[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    department: deptosMock[i % deptosMock.length],
    answeredAt: datasMock[i % datasMock.length],
    dimensions: [
      {
        name: 'Segurança e Sigilo',
        questions: [{ label: 'ff', answer: likertMock[i % likertMock.length] }],
      },
    ],
  }))
}

/** Visão individual (por respondente), com navegação própria. */
function IndividualView({ respondentes }: { respondentes: Respondent[] }) {
  const [respIndex, setRespIndex] = useState(0)
  const respondent = respondentes[Math.min(respIndex, respondentes.length - 1)]
  if (!respondent) return null

  return (
    <Card>
      {/* Navegação de respondentes */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Space size={8} align="baseline">
            <Text strong style={{ fontSize: 18, color: brand.primary }}>
              Respondente #{respondent.id}
            </Text>
            <Text style={{ color: brand.textMuted }}>{respondent.department}</Text>
          </Space>
          <div style={{ color: brand.textMuted, fontSize: 13, marginTop: 4 }}>
            Respondido em {respondent.answeredAt}
          </div>
        </div>
        <Space align="center">
          <Button
            shape="circle"
            icon={<CaretLeft />}
            disabled={respIndex === 0}
            onClick={() => setRespIndex((i) => Math.max(0, i - 1))}
          />
          <Text style={{ color: brand.textMuted }}>
            {respIndex + 1} de {respondentes.length}
          </Text>
          <Button
            shape="circle"
            icon={<CaretRight />}
            disabled={respIndex === respondentes.length - 1}
            onClick={() => setRespIndex((i) => Math.min(respondentes.length - 1, i + 1))}
          />
        </Space>
      </div>

      {/* Dimensões e respostas */}
      <Collapse
        defaultActiveKey={respondent.dimensions.map((d) => d.name)}
        style={{ marginTop: 20, background: '#fff' }}
        items={respondent.dimensions.map((dim) => ({
          key: dim.name,
          label: (
            <Space size={12} align="center">
              <Avatar
                size={32}
                style={{ backgroundColor: brand.dimension }}
                icon={<SealCheck />}
              />
              <Text strong style={{ fontSize: 16 }}>
                {dim.name}
              </Text>
            </Space>
          ),
          children: (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {dim.questions.map((q) => (
                <div key={q.label}>
                  <Text strong style={{ color: brand.success }}>
                    {q.label}
                  </Text>
                  <div style={{ marginTop: 8, marginBottom: 6, fontWeight: 600 }}>Resposta:</div>
                  <Input readOnly value={q.answer} />
                </div>
              ))}
            </Space>
          ),
        }))}
      />
    </Card>
  )
}

function ShareContent() {
  const { message } = App.useApp()

  const downloadQRCode = () => {
    const canvas = document
      .getElementById('share-qrcode')
      ?.querySelector<HTMLCanvasElement>('canvas')
    if (canvas) {
      const a = document.createElement('a')
      a.download = 'qrcode-pesquisa.png'
      a.href = canvas.toDataURL()
      a.click()
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      message.success('Link copiado!')
    } catch {
      message.error('Não foi possível copiar o link.')
    }
  }

  return (
    <div style={{ width: 280 }}>
      <div
        id="share-qrcode"
        style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
      >
        <QRCode value={SHARE_URL} size={180} bordered={false} />
      </div>
      <Button block icon={<DownloadSimple />} onClick={downloadQRCode} style={{ marginBottom: 12 }}>
        Baixar
      </Button>
      <Space.Compact style={{ width: '100%' }}>
        <Input readOnly value={SHARE_URL} />
        <Button icon={<Copy />} onClick={copyLink} />
      </Space.Compact>
    </div>
  )
}

// Ícone de IA (sparkle)
function AiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l1.7 4.8L18.5 8.5l-4.8 1.7L12 15l-1.7-4.8L5.5 8.5l4.8-1.7z"
        fill="#3bb54a"
      />
      <path d="M18 13.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="#7ed957" />
    </svg>
  )
}

type ResumoData = {
  subtitulo: string
  info?: string
  aviso?: string
  corpo: React.ReactNode
  destaques: string[]
  pontosAtencao: string[]
}

function BoxColuna({
  icon,
  titulo,
  itens,
}: {
  icon: React.ReactNode
  titulo: string
  itens: string[]
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <Space size={10} align="center" style={{ marginBottom: 8 }}>
        {icon}
        <Text strong style={{ fontSize: 15 }}>
          {titulo}
        </Text>
      </Space>
      <div style={{ paddingLeft: 30 }}>
        {itens.map((t, i) => (
          <div key={i} style={{ color: brand.textMuted, marginBottom: 2 }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Resumo inteligente (IA) — card recolhível com texto, destaques e pontos de atenção. */
function AIResumo({ data, emAndamento }: { data: ResumoData; emAndamento?: boolean }) {
  const [aberto, setAberto] = useState(true)

  // AC_03 — pesquisa em andamento: resumo ainda não disponível
  if (emAndamento) {
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #eaeaea',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
        }}
      >
        <Space size={8} align="center">
          <AiIcon />
          <Text strong style={{ fontSize: 16, color: brand.primary }}>
            Resumo indisponível no momento
          </Text>
        </Space>
        <div style={{ color: brand.textMuted, fontSize: 13, marginTop: 4 }}>
          A pesquisa ainda está em andamento. O resumo será gerado automaticamente quando a pesquisa
          for encerrada.
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: 12,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          padding: '16px 20px',
          borderBottom: aberto ? '1px solid #f0f0f0' : 'none',
        }}
      >
        <div>
          <Space size={8} align="center">
            <AiIcon />
            <Text strong style={{ fontSize: 16, color: brand.primary }}>
              Resumo inteligente
            </Text>
          </Space>
          <div style={{ color: brand.textMuted, fontSize: 13, marginTop: 2 }}>{data.subtitulo}</div>
        </div>
        <Button
          type="text"
          size="small"
          icon={aberto ? <CaretUp /> : <CaretDown />}
          onClick={() => setAberto((a) => !a)}
        />
      </div>

      {aberto && (
        <div style={{ padding: '16px 20px' }}>
          {data.info && (
            <Alert type="info" showIcon closable style={{ marginBottom: 12 }} message={data.info} />
          )}
          {data.aviso && (
            <Alert
              type="warning"
              showIcon
              closable
              icon={<WarningCircle weight="fill" style={{ color: brand.warning }} />}
              style={{ marginBottom: 16 }}
              message={data.aviso}
            />
          )}

          <div style={{ color: '#1f1f1f', lineHeight: 1.7, marginBottom: 16 }}>{data.corpo}</div>

          <BoxColuna
            icon={<CheckCircle weight="fill" style={{ color: brand.success, fontSize: 18 }} />}
            titulo="Destaques"
            itens={data.destaques}
          />
          <div style={{ height: 12 }} />
          <BoxColuna
            icon={<WarningCircle weight="fill" style={{ color: brand.warning, fontSize: 18 }} />}
            titulo="Pontos de atenção"
            itens={data.pontosAtencao}
          />

          <Divider style={{ margin: '16px 0 10px' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Resumo gerado por IA a partir dos dados desta pesquisa. Revise antes de compartilhar.
          </Text>
        </div>
      )}
    </div>
  )
}

const resumoIAUnica: ResumoData = {
  subtitulo: 'Gerado sobre as 4 respostas do encerramento',
  corpo:
    'O cenário é positivo: score de 82,4 de 100, com 5 das 6 dimensões acima de 60. O desempenho geral demonstra um bom nível de maturidade, com destaque para "Segurança e Sigilo", que apresenta resultados consistentes e contribui para o bom resultado.',
  destaques: [
    'Adesão de 79,90% acima da meta mínima recomendada.',
    'Participação concentrada no Departamento de TI.',
  ],
  pontosAtencao: [
    'Desenvolvimento pessoal é a menor dimensão: 18,8.',
    'Participação baixa no Departamento de RH.',
  ],
}

const resumoIARecorrente: ResumoData = {
  subtitulo: 'Gerado sobre as respostas do último encerramento',
  info:
    'A pesquisa foi reaberta em 20/02. Este resumo refere-se ao encerramento anterior e não inclui as respostas recebidas depois disso. Um novo resumo será gerado no próximo encerramento.',
  aviso:
    'Leitura indicativa. A adesão de 28,57% ficou abaixo do esperado, então quem não respondeu pode ter percepção diferente de quem respondeu.',
  corpo:
    'O cenário é positivo e em evolução: o score médio subiu ao longo dos ciclos e a maioria das dimensões está acima de 60. A tendência indica amadurecimento consistente do clima.',
  destaques: [
    'Score em crescimento a cada ciclo.',
    'Adesão aumentou de forma consistente.',
  ],
  pontosAtencao: [
    'Desenvolvimento pessoal segue como a menor dimensão.',
    'Ciclo em andamento ainda com poucas respostas.',
  ],
}

/** Mínimo de respostas para exibir resultados (proteção de anonimato). */
const MIN_RESPOSTAS = 3

type CycleData = { respostas: number; convidados: number; taxa: number; score: number }

/** Banner de destaque (Opção 1) para criar plano de ação a partir dos resultados. */
function PlanoCTA({ onClick }: { onClick: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        background: brand.infoBg,
        border: `1px solid ${brand.primary}22`,
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <Space size={14} align="center">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: brand.primary,
            fontSize: 22,
            flex: '0 0 auto',
          }}
        >
          <Target weight="fill" />
        </div>
        <div>
          <Text strong style={{ fontSize: 16, color: brand.primary, display: 'block' }}>
            Identificou um ponto de melhoria?
          </Text>
          <Text style={{ color: brand.textMuted }}>
            Crie um plano de ação a partir dos resultados desta pesquisa.
          </Text>
        </div>
      </Space>
      <Button type="primary" size="large" icon={<Target />} onClick={onClick}>
        Criar plano de ação
      </Button>
    </div>
  )
}

function GeralResults({
  respostas = 4,
  convidados = 14,
  taxa = 28.57,
  score = 18.8,
  onCreatePlan,
}: Partial<CycleData> & { onCreatePlan?: (name: string) => void }) {
  // Resultados só aparecem após o mínimo de respostas (privacidade)
  if (respostas < MIN_RESPOSTAS) {
    return (
      <Alert
        type="warning"
        showIcon
        icon={<WarningCircle weight="fill" style={{ color: brand.warning }} />}
        message="Resultados indisponíveis"
        description={`Os resultados são exibidos somente após ${MIN_RESPOSTAS} respostas enviadas, para preservar o anonimato dos respondentes. Recebidas até o momento: ${respostas} de ${convidados}.`}
      />
    )
  }
  return (
    <>
      {/* Opção 1: banner de destaque no topo dos resultados */}
      {onCreatePlan && <PlanoCTA onClick={() => onCreatePlan('')} />}

      {/* Cards de topo */}
      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic value={respostas} valueStyle={statValueStyle} />
            <div style={{ marginTop: 8, fontSize: 16, color: brand.textMuted }}>Respostas</div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              de {convidados} convidados
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic value={`${taxa.toFixed(2)}%`} valueStyle={statValueStyle} />
            <div style={{ marginTop: 8, fontSize: 16, color: brand.textMuted }}>
              Taxa de resposta geral
            </div>
            <Progress
              percent={taxa}
              showInfo={false}
              strokeColor={brand.primary}
              trailColor="#e9e9e9"
              strokeLinecap="round"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic value={score.toFixed(1)} valueStyle={statValueStyle} />
            <div style={{ marginTop: 8, fontSize: 16, color: brand.textMuted }}>Score médio</div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Escala de 1 a 100
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Score por dimensão */}
      <Card title="Score por dimensão" style={{ marginTop: 24 }}>
        <DimensionRow name="Segurança e Sigilo" score={score} />
      </Card>

      {/* Score por pergunta */}
      <Card title="Score por pergunta" style={{ marginTop: 24 }}>
        <Collapse
          defaultActiveKey={['seg']}
          items={[
            {
              key: 'seg',
              label: (
                <Space size={12} align="center">
                  <Avatar
                    size={32}
                    style={{ backgroundColor: brand.dimension }}
                    icon={<SealCheck />}
                  />
                  <Text strong style={{ fontSize: 16 }}>
                    Segurança e Sigilo
                  </Text>
                </Space>
              ),
              children: (
                <div>
                  <Text strong style={{ color: brand.dimension }}>
                    ff
                  </Text>
                  <LikertChart data={likertData} />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </>
  )
}

// Ids de pesquisas recorrentes (espelha a coluna Tipo da tabela de Pesquisas)
const recurringSurveyIds = new Set([3, 5])

type Dimensao = { nome: string; score: number }
type Cycle = CycleData & {
  id: number
  nome: string
  periodo: string
  status: string
  dimensoes: Dimensao[]
}
const cycles: Cycle[] = [
  {
    id: 1,
    nome: 'Ciclo 1',
    periodo: '01/03/2026 – 15/03/2026',
    status: 'Concluído',
    respostas: 4,
    convidados: 14,
    taxa: 28.57,
    score: 18.8,
    dimensoes: [
      { nome: 'Segurança e Sigilo', score: 18.8 },
      { nome: 'Liderança e Gestão', score: 22.0 },
      { nome: 'Comunicação Interna', score: 15.5 },
    ],
  },
  {
    id: 2,
    nome: 'Ciclo 2',
    periodo: '01/04/2026 – 15/04/2026',
    status: 'Concluído',
    respostas: 9,
    convidados: 14,
    taxa: 64.29,
    score: 42.5,
    dimensoes: [
      { nome: 'Segurança e Sigilo', score: 42.5 },
      { nome: 'Liderança e Gestão', score: 48.0 },
      { nome: 'Comunicação Interna', score: 38.0 },
    ],
  },
  {
    id: 3,
    nome: 'Ciclo 3',
    periodo: '01/05/2026 – 15/05/2026',
    status: 'Em andamento',
    respostas: 2,
    convidados: 14,
    taxa: 14.29,
    score: 55,
    dimensoes: [
      { nome: 'Segurança e Sigilo', score: 55.0 },
      { nome: 'Liderança e Gestão', score: 60.0 },
      { nome: 'Comunicação Interna', score: 50.0 },
    ],
  },
]

/** Um ciclo tem resultado exibível se está encerrado e atingiu o mínimo de respostas. */
const cicloExibivel = (c: Cycle) => c.status === 'Concluído' && c.respostas >= MIN_RESPOSTAS

/** Tag de variação (delta) entre dois scores, com seta e cor. */
function VariacaoTag({ delta }: { delta: number }) {
  if (Math.abs(delta) < 0.05) return <Tag>estável</Tag>
  const subiu = delta > 0
  return (
    <Tag
      color={subiu ? 'success' : 'error'}
      icon={subiu ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
    >
      {subiu ? '+' : '−'}
      {Math.abs(delta).toFixed(1).replace('.', ',')} pts
    </Tag>
  )
}

/** Conteúdo de um ciclo: sub-abas Geral (resultados) e Individual (respondentes). */
function CicloConteudo({
  cycle,
  onCreatePlan,
}: {
  cycle: Cycle
  onCreatePlan?: (name: string) => void
}) {
  // Abaixo do mínimo de respostas, mostra o bloqueio (sem individual, por privacidade)
  if (cycle.respostas < MIN_RESPOSTAS) {
    return (
      <GeralResults
        respostas={cycle.respostas}
        convidados={cycle.convidados}
        taxa={cycle.taxa}
        score={cycle.score}
      />
    )
  }
  const cicloEmAndamento = cycle.status === 'Em andamento'
  return (
    <Tabs
      items={[
        {
          key: 'geral',
          label: 'Geral',
          children: (
            <>
              <AIResumo data={resumoIARecorrente} emAndamento={cicloEmAndamento} />
              <GeralResults
                respostas={cycle.respostas}
                convidados={cycle.convidados}
                taxa={cycle.taxa}
                score={cycle.score}
                onCreatePlan={onCreatePlan}
              />
            </>
          ),
        },
        {
          key: 'individual',
          label: 'Individual',
          children: <IndividualView respondentes={gerarRespondentes(cycle.respostas)} />,
        },
      ]}
    />
  )
}

/**
 * Aba "Ciclos" (pesquisa recorrente): seletor de ciclos posicionado no ciclo
 * mais recente. Ao escolher um ciclo, exibe seu período, o card de respostas e
 * as sub-abas Geral/Individual daquele ciclo (AC_01, AC_02, AC_05).
 */
function CiclosView({
  cycles,
  onCreatePlan,
}: {
  cycles: Cycle[]
  onCreatePlan?: (name: string) => void
}) {
  // Posiciona no ciclo mais recente (último da lista)
  const [sel, setSel] = useState<number>(cycles[cycles.length - 1].id)
  const cycle = cycles.find((c) => c.id === sel) ?? cycles[cycles.length - 1]
  const emAndamento = cycle.status === 'Em andamento'

  return (
    <>
      <Segmented
        value={sel}
        onChange={(v) => setSel(Number(v))}
        options={cycles.map((c, i) => ({
          value: c.id,
          label: `${c.nome}${i === cycles.length - 1 ? ' · mais recente' : ''}`,
        }))}
        style={{ marginBottom: 16 }}
      />

      {/* Período + status do ciclo selecionado */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <Space size={6} align="center">
          <CalendarBlank style={{ color: brand.textMuted }} />
          <Text strong style={{ color: brand.primary }}>
            {cycle.nome}
          </Text>
          <Text style={{ color: brand.textMuted }}>{cycle.periodo}</Text>
        </Space>
        <Tag color={emAndamento ? 'success' : 'default'}>{cycle.status}</Tag>
      </div>

      <CicloConteudo cycle={cycle} onCreatePlan={onCreatePlan} />
    </>
  )
}

/** Comparação de score/dimensões de um ciclo (usado na aba Evolução). */
function ColunaCiclo({ cycle }: { cycle: Cycle }) {
  return (
    <Card size="small" style={{ height: '100%' }}>
      <Text strong style={{ color: brand.primary }}>
        {cycle.nome}
      </Text>
      <div style={{ color: brand.textMuted, fontSize: 13, marginBottom: 12 }}>{cycle.periodo}</div>
      <Statistic
        value={cycle.score.toFixed(1).replace('.', ',')}
        valueStyle={{ fontSize: 32, fontWeight: 700, color: '#1f1f1f' }}
        suffix={<span style={{ fontSize: 14, color: brand.textMuted }}>/ 100</span>}
      />
      <div style={{ fontSize: 13, color: brand.textMuted }}>Score geral</div>
    </Card>
  )
}

/**
 * Aba "Evolução" (pesquisa recorrente): score e dimensões ciclo a ciclo, com a
 * variação entre o último ciclo encerrado e o anterior. Um filtro permite
 * comparar dois ciclos distintos (AC_03, AC_03.1, AC_04, AC_06, AC_09).
 */
function EvolucaoView({ cycles }: { cycles: Cycle[] }) {
  const comparaveis = cycles.filter(cicloExibivel)
  const podeComparar = comparaveis.length >= 2

  // Filtro (AC_09): por padrão, os dois ciclos exibíveis mais recentes (AC_04)
  const defB = comparaveis[comparaveis.length - 1]?.id
  const defA = comparaveis[comparaveis.length - 2]?.id
  const [aId, setA] = useState<number | undefined>(defA)
  const [bId, setB] = useState<number | undefined>(defB)
  const a = cycles.find((c) => c.id === aId)
  const b = cycles.find((c) => c.id === bId)
  const distintos = a && b && a.id !== b.id

  const opcoes = comparaveis.map((c) => ({ value: c.id, label: `${c.nome} — ${c.periodo}` }))

  return (
    <>
      {/* Score por ciclo, com variação em relação ao ciclo exibível anterior */}
      <Card title="Score por ciclo" style={{ marginBottom: 24 }}>
        {cycles.map((c, i) => {
          const anterior = cycles
            .slice(0, i)
            .reverse()
            .find(cicloExibivel)
          return (
            <div
              key={c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                padding: '12px 0',
                borderTop: i === 0 ? 'none' : '1px solid #f0f0f0',
              }}
            >
              <Space size={10} align="center" wrap>
                <Text strong style={{ color: brand.primary }}>
                  {c.nome}
                </Text>
                <Text style={{ color: brand.textMuted, fontSize: 13 }}>{c.periodo}</Text>
                <Tag color={c.status === 'Em andamento' ? 'success' : 'default'}>{c.status}</Tag>
              </Space>
              {cicloExibivel(c) ? (
                <Space size={12} align="center">
                  <Text strong style={{ fontSize: 18, color: '#1f1f1f' }}>
                    {c.score.toFixed(1).replace('.', ',')}
                  </Text>
                  {/* AC_06: ciclo sem resultado exibível não gera ponto de variação */}
                  {anterior && <VariacaoTag delta={c.score - anterior.score} />}
                </Space>
              ) : (
                <Text type="secondary" italic>
                  Sem resultado exibível
                </Text>
              )}
            </div>
          )
        })}
      </Card>

      {/* Comparação entre dois ciclos */}
      {!podeComparar ? (
        // AC_03.1: recorrente sem dois ciclos encerrados → sem comparação
        <Alert
          type="info"
          showIcon
          message="Comparação entre ciclos ainda indisponível"
          description="A evolução comparativa fica disponível a partir de dois ciclos encerrados com resultado exibível (mínimo de respostas atingido)."
        />
      ) : (
        <Card title="Comparar ciclos">
          <Space wrap size={12} style={{ marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: brand.textMuted, marginBottom: 4 }}>Ciclo A</div>
              <Select
                value={aId}
                onChange={setA}
                options={opcoes}
                style={{ minWidth: 260 }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: brand.textMuted, marginBottom: 4 }}>Ciclo B</div>
              <Select
                value={bId}
                onChange={setB}
                options={opcoes}
                style={{ minWidth: 260 }}
              />
            </div>
          </Space>

          {!distintos ? (
            <Alert
              type="warning"
              showIcon
              icon={<WarningCircle weight="fill" style={{ color: brand.warning }} />}
              message="Selecione dois ciclos distintos para visualizar a variação."
            />
          ) : (
            <>
              {/* Score dos dois ciclos + variação (AC_09) */}
              <Row gutter={[16, 16]} align="stretch">
                <Col xs={24} md={9}>
                  <ColunaCiclo cycle={a!} />
                </Col>
                <Col
                  xs={24}
                  md={6}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div style={{ fontSize: 12, color: brand.textMuted, marginBottom: 6 }}>
                    Variação (A → B)
                  </div>
                  <VariacaoTag delta={b!.score - a!.score} />
                </Col>
                <Col xs={24} md={9}>
                  <ColunaCiclo cycle={b!} />
                </Col>
              </Row>

              {/* Dimensões lado a lado + variação */}
              <Divider orientation="left" style={{ color: brand.primary }}>
                Dimensões
              </Divider>
              {a!.dimensoes.map((dim) => {
                const dimB = b!.dimensoes.find((d) => d.nome === dim.nome)
                if (!dimB) return null
                return (
                  <div
                    key={dim.nome}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      flexWrap: 'wrap',
                      padding: '12px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Text style={{ fontSize: 15, color: '#1f1f1f' }}>{dim.nome}</Text>
                    <Space size={16} align="center">
                      <Text style={{ color: brand.textMuted }}>
                        {dim.score.toFixed(1).replace('.', ',')}
                      </Text>
                      <CaretRight style={{ color: '#bfbfbf' }} />
                      <Text strong style={{ color: brand.dimension }}>
                        {dimB.score.toFixed(1).replace('.', ',')}
                      </Text>
                      <VariacaoTag delta={dimB.score - dim.score} />
                    </Space>
                  </div>
                )
              })}
            </>
          )}
        </Card>
      )}
    </>
  )
}

export default function SurveyDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isRecorrente =
    searchParams.get('tipo') === 'recorrente' || recurringSurveyIds.has(Number(id))
  // AC_03 — pesquisa em andamento (não encerrada): resumo de IA fica indisponível
  const emAndamento = searchParams.get('status') === 'andamento'
  const { modal, message } = App.useApp()
  const [planDim, setPlanDim] = useState<string | null>(null)
  const [planForm] = Form.useForm()

  const submitPlan = async () => {
    await planForm.validateFields()
    setPlanDim(null)
    planForm.resetFields()
    message.success('Plano de ação criado com sucesso.')
  }

  const moreActions: MenuProps['items'] = [
    { key: 'editar', icon: <PencilSimple />, label: 'Editar' },
    { key: 'exportar', icon: <FileText />, label: 'Exportar relatório' },
    { type: 'divider' },
    { key: 'excluir', icon: <Trash />, label: 'Excluir', danger: true },
  ]

  const onMoreAction: MenuProps['onClick'] = ({ key }) => {
    if (key === 'excluir') {
      modal.confirm({
        title: 'Excluir pesquisa',
        icon: <WarningCircle weight="fill" style={{ color: brand.danger }} />,
        content: 'Esta ação não pode ser desfeita.',
        okText: 'Excluir',
        okType: 'danger',
        cancelText: 'Cancelar',
      })
    } else {
      message.info(`Ação: ${key}`)
    }
  }

  const confirmEncerrar = () => {
    modal.confirm({
      title: 'Confirmar encerramento',
      icon: <WarningCircle weight="fill" style={{ color: brand.warning }} />,
      content: 'Os respondentes não terão mais acesso à pesquisa',
      okText: 'OK',
      cancelText: 'Cancelar',
      onOk: () => message.success('Pesquisa encerrada.'),
    })
  }


  // Pesquisa de lançamento único (AC_07): mantém a tela atual (Geral + Individual)
  const geralContent = (
    <>
      <AIResumo data={resumoIAUnica} emAndamento={emAndamento} />
      <GeralResults onCreatePlan={setPlanDim} />
    </>
  )

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto' }}>
      <Button
        type="link"
        icon={<CaretLeft />}
        onClick={() => navigate(-1)}
        style={{ paddingInline: 0, marginBottom: 8 }}
      >
        Voltar
      </Button>

      {/* Cabeçalho */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Space align="center" size={12}>
            <Title level={3} style={{ margin: 0 }}>
              tst encerramento
            </Title>
            <Tag
              color={emAndamento ? 'success' : 'default'}
              style={{ borderRadius: 12, marginTop: 4 }}
            >
              {emAndamento ? 'Ativa' : 'Encerrada'}
            </Tag>
          </Space>
        </div>
        <Space size={8}>
          <Button danger icon={<XCircle />} onClick={confirmEncerrar}>
            Encerrar agora
          </Button>
          <Popover
            content={<ShareContent />}
            title="Link de compartilhamento"
            trigger="click"
            placement="bottomRight"
          >
            <Button icon={<LinkSimple />} />
          </Popover>
          <Dropdown menu={{ items: moreActions, onClick: onMoreAction }} trigger={['click']}>
            <Button icon={<DotsThreeVertical />}>Mais ações</Button>
          </Dropdown>
        </Space>
      </div>

      {/* Descrição da pesquisa */}
      <Paragraph style={{ color: brand.textMuted, maxWidth: 980, marginTop: 12, marginBottom: 20 }}>
        {descricaoPesquisa}
      </Paragraph>

      {/* Metadados */}
      <Space size={32} wrap style={{ marginTop: 16 }}>
        <MetaItem
          icon={<CalendarBlank />}
          label="Data de lançamento"
          value="28/04/2026 08:25"
        />
        <MetaItem
          icon={<CalendarBlank />}
          label="Data de encerramento"
          value="Não definido"
          muted
        />
      </Space>
      <div style={{ marginTop: 8 }}>
        <MetaItem
          icon={<User />}
          label="Criado por"
          value="Renata em 28/04/2026 11:25"
        />
      </div>

      {/* Abas — recorrente: Evolução + Ciclos (AC_01, posicionada no ciclo mais
          recente); único: Geral + Individual (AC_07) */}
      <Tabs
        defaultActiveKey={isRecorrente ? 'ciclos' : 'geral'}
        style={{ marginTop: 16 }}
        items={
          isRecorrente
            ? [
                { key: 'evolucao', label: 'Evolução', children: <EvolucaoView cycles={cycles} /> },
                {
                  key: 'ciclos',
                  label: 'Ciclos',
                  children: <CiclosView cycles={cycles} onCreatePlan={setPlanDim} />,
                },
              ]
            : [
                { key: 'geral', label: 'Geral', children: geralContent },
                {
                  key: 'individual',
                  label: 'Individual',
                  children: <IndividualView respondentes={respondents} />,
                },
              ]
        }
      />

      {/* Modal: Criar plano de ação a partir do recorte (EP_04 — pesquisa como fonte) */}
      <Modal
        title="Criar plano de ação"
        open={planDim !== null}
        onCancel={() => setPlanDim(null)}
        onOk={submitPlan}
        okText="Criar"
        cancelText="Cancelar"
        width={560}
        destroyOnHidden
      >
        <Text type="secondary">
          Defina o plano de ação a partir dos resultados desta pesquisa.
        </Text>

        {/* Fonte: pesquisa de origem */}
        <div
          style={{
            background: '#f5f6fa',
            border: '1px solid #eef0f4',
            borderRadius: 8,
            padding: 12,
            margin: '16px 0',
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 8, color: brand.primary }}>
            Fonte
          </Text>
          <Text type="secondary">
            Pesquisa: <Text style={{ color: '#1f1f1f' }}>tst encerramento</Text>
          </Text>
          <div style={{ marginTop: 8 }}>
            <Space size={6} align="center">
              <CheckCircle weight="fill" style={{ color: brand.success }} />
              <Text style={{ fontSize: 12, color: brand.textMuted }}>
                Recorte com anonimato preservado (mínimo de {MIN_RESPOSTAS} respostas atingido).
              </Text>
            </Space>
          </div>
        </div>

        <Form
          form={planForm}
          layout="vertical"
          initialValues={{ segmento: 'todos', aprovacao: 'sim', dimensao: planDim || undefined }}
        >
          <Form.Item
            name="titulo"
            label="Título do plano"
            rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
          >
            <Input placeholder="Ex: Melhorar confiança e sigilo na equipe" />
          </Form.Item>

          <Form.Item
            name="dimensao"
            label="Dimensão (recorte)"
            rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
          >
            <Select
              placeholder="Selecione a dimensão de origem"
              options={dimensoesPesquisa.map((d) => ({ value: d, label: d }))}
            />
          </Form.Item>

          <Form.Item
            name="responsavel"
            label="Responsável"
            rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
            tooltip="Atribuído a partir do Banco de Pessoas"
          >
            <Select
              showSearch
              placeholder="Digite o nome do responsável pelo plano"
              optionFilterProp="label"
              options={bancoPessoas.map((p) => ({ value: p.value, label: p.label, cargo: p.cargo }))}
              optionRender={(opt) => (
                <div>
                  <div style={{ color: '#1f1f1f' }}>{opt.data.label}</div>
                  <div style={{ fontSize: 12, color: brand.textMuted }}>{opt.data.cargo}</div>
                </div>
              )}
            />
          </Form.Item>

          <Form.Item name="categoria" label="Categoria">
            <Select placeholder="Selecione" options={categoriasPlano} allowClear />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dataInicio"
                label="Data de início"
                rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
              >
                <DatePicker
                  placeholder="Selecionar data"
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="prazo"
                label="Prazo de conclusão"
                rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
              >
                <DatePicker
                  placeholder="Selecionar data"
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="segmento" label="Segmento da pesquisa">
            <Select
              options={[
                { value: 'todos', label: 'Todos os respondentes' },
                { value: 'rh', label: 'Departamento de RH' },
                { value: 'financas', label: 'Departamento de Finanças' },
                { value: 'teste', label: 'Departamento teste' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="descricao"
            label="Descrição"
            rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
          >
            <Input.TextArea rows={3} placeholder="Ex: Plano de ação para prevenções em casos de..." />
          </Form.Item>

          <Form.Item
            name="aprovacao"
            label="Este plano de ação requer aprovação do dono para conclusão?"
          >
            <Segmented options={[{ label: 'Sim', value: 'sim' }, { label: 'Não', value: 'nao' }]} />
          </Form.Item>
        </Form>
      </Modal>

      <FloatButton icon={<Question />} type="primary" tooltip="Ajuda" />
    </div>
  )
}
