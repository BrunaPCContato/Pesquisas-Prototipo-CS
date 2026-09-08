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
} from '@phosphor-icons/react'
import { brand } from '../theme'
import LikertChart from '../components/LikertChart'

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

function DimensionRow({
  name,
  score,
  onCreatePlan,
}: {
  name: string
  score: number
  onCreatePlan?: (name: string) => void
}) {
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
        <Space size={16} align="center">
          {onCreatePlan && (
            <Button
              type="link"
              size="small"
              icon={<Target />}
              style={{ paddingInline: 0 }}
              onClick={() => onCreatePlan(name)}
            >
              Criar plano de ação
            </Button>
          )}
          <Text style={{ fontSize: 16, color: brand.dimension, fontWeight: 500 }}>
            {score.toFixed(1).replace('.', ',')}
          </Text>
        </Space>
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

type ResumoData = {
  tag?: string
  subtitulo: string
  info?: string
  aviso?: string
  corpo: React.ReactNode
  destaques: string[]
  pontosAtencao: string[]
  planoDimensao: string
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
        height: '100%',
      }}
    >
      <Space size={8} align="center" style={{ marginBottom: 10 }}>
        {icon}
        <Text strong>{titulo}</Text>
      </Space>
      <Space direction="vertical" size={10} style={{ width: '100%' }}>
        {itens.map((t, i) => (
          <Text key={i} style={{ color: brand.textMuted }}>
            {t}
          </Text>
        ))}
      </Space>
    </div>
  )
}

/**
 * Resumo inteligente (IA) — card rico: cabeçalho com ícone, feedback e recolher;
 * alertas contextuais (info/aviso); corpo; Destaques × Pontos de atenção; botão de
 * plano de ação e rodapé. Segue o padrão do "Resumo inteligente" da plataforma.
 */
function ResumoInteligente({
  data,
  onCreatePlan,
}: {
  data: ResumoData
  onCreatePlan?: (name: string) => void
}) {
  const [aberto, setAberto] = useState(true)
  return (
    <div
      style={{
        background: '#f2f7ff',
        border: '1px solid #d6e6ff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Space size={8} align="center" wrap>
          <Sparkle size={20} weight="fill" style={{ color: '#7c5cff' }} />
          <Text strong style={{ fontSize: 16, color: brand.primary }}>
            Resumo inteligente
          </Text>
          {data.tag && <Tag color="processing">{data.tag}</Tag>}
        </Space>
        <Space size={2} align="center">
          <Button type="text" size="small" icon={<ThumbsUp />} />
          <Button type="text" size="small" icon={<ThumbsDown />} />
          <Button
            type="text"
            size="small"
            icon={aberto ? <CaretUp /> : <CaretDown />}
            onClick={() => setAberto((a) => !a)}
          />
        </Space>
      </div>
      <Text type="secondary" style={{ fontSize: 13 }}>
        {data.subtitulo}
      </Text>

      {aberto && (
        <div style={{ marginTop: 16 }}>
          {data.info && (
            <Alert type="info" showIcon style={{ marginBottom: 12 }} message={data.info} />
          )}
          {data.aviso && (
            <Alert
              type="warning"
              showIcon
              icon={<WarningCircle weight="fill" style={{ color: brand.warning }} />}
              style={{ marginBottom: 16 }}
              message={data.aviso}
            />
          )}

          <div style={{ color: '#1f1f1f', lineHeight: 1.7, marginBottom: 16 }}>{data.corpo}</div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <BoxColuna
                icon={<CheckCircle weight="fill" style={{ color: brand.success }} />}
                titulo="Destaques"
                itens={data.destaques}
              />
            </Col>
            <Col xs={24} md={12}>
              <BoxColuna
                icon={<WarningCircle weight="fill" style={{ color: brand.warning }} />}
                titulo="Pontos de atenção"
                itens={data.pontosAtencao}
              />
            </Col>
          </Row>

          <Button
            type="primary"
            style={{ marginTop: 16 }}
            onClick={() => onCreatePlan?.(data.planoDimensao)}
          >
            Criar plano de ação para {data.planoDimensao}
          </Button>

          <Divider style={{ margin: '16px 0 0' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Resumo gerado por IA a partir dos dados desta pesquisa. Revise antes de compartilhar.
          </Text>
        </div>
      )}
    </div>
  )
}

const hl = (t: string) => <Text strong style={{ color: brand.primary }}>{t}</Text>

const resumoUnica: ResumoData = {
  subtitulo: 'Gerado sobre as 4 respostas do encerramento',
  aviso:
    'Leitura indicativa. A adesão de 28,57% ficou abaixo do esperado, então quem não respondeu pode ter percepção diferente de quem respondeu.',
  corpo: (
    <>
      O clima está crítico: score de {hl('18,8 de 100')}, concentrando forte discordância. A
      dimensão “Segurança e Sigilo” puxa o resultado para baixo e merece atenção prioritária.
    </>
  ),
  destaques: [
    'Respostas objetivas facilitam a definição do plano de ação.',
    'Participação concentrada no Departamento de RH.',
  ],
  pontosAtencao: [
    'Segurança e Sigilo é a menor dimensão: 18,8.',
    'Adesão de 28,57% abaixo da meta mínima recomendada.',
  ],
  planoDimensao: 'Segurança e Sigilo',
}

const resumoRecorrente: ResumoData = {
  tag: 'Ciclo anterior',
  subtitulo: 'Gerado sobre as respostas do último encerramento',
  info:
    'A pesquisa é recorrente. Este resumo considera o encerramento mais recente; um novo resumo será gerado no próximo ciclo.',
  aviso:
    'Leitura indicativa. A adesão do ciclo ficou abaixo do esperado, então quem não respondeu pode ter percepção diferente de quem respondeu.',
  corpo: (
    <>
      Ao longo dos ciclos, o score evoluiu de {hl('18,8')} para {hl('55,0 de 100')} — tendência
      positiva. Ainda assim, a dimensão “Segurança e Sigilo” segue como a menor e limita o avanço.
    </>
  ),
  destaques: [
    'Score subiu 36 pontos entre o 1º e o 3º ciclo.',
    'Adesão aumentou de forma consistente a cada ciclo.',
  ],
  pontosAtencao: [
    'Segurança e Sigilo continua sendo a menor dimensão.',
    '3º ciclo ainda com poucas respostas (em andamento).',
  ],
  planoDimensao: 'Segurança e Sigilo',
}

/** Mínimo de respostas para exibir resultados (proteção de anonimato). */
const MIN_RESPOSTAS = 3

type CycleData = { respostas: number; convidados: number; taxa: number; score: number }

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
        <DimensionRow name="Segurança e Sigilo" score={score} onCreatePlan={onCreatePlan} />
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

type Cycle = CycleData & { id: number; nome: string; periodo: string; status: string }
const cycles: Cycle[] = [
  { id: 1, nome: 'Ciclo 1', periodo: '01/03/2026 – 15/03/2026', status: 'Concluído', respostas: 4, convidados: 14, taxa: 28.57, score: 18.8 },
  { id: 2, nome: 'Ciclo 2', periodo: '01/04/2026 – 15/04/2026', status: 'Concluído', respostas: 9, convidados: 14, taxa: 64.29, score: 42.5 },
  { id: 3, nome: 'Ciclo 3', periodo: '01/05/2026 – 15/05/2026', status: 'Em andamento', respostas: 2, convidados: 14, taxa: 14.29, score: 55 },
]

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
  return (
    <Tabs
      items={[
        {
          key: 'geral',
          label: 'Geral',
          children: (
            <GeralResults
              respostas={cycle.respostas}
              convidados={cycle.convidados}
              taxa={cycle.taxa}
              score={cycle.score}
              onCreatePlan={onCreatePlan}
            />
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

export default function SurveyDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isRecorrente =
    searchParams.get('tipo') === 'recorrente' || recurringSurveyIds.has(Number(id))
  const { modal, message } = App.useApp()
  const [planDim, setPlanDim] = useState<string | null>(null)
  const [planForm] = Form.useForm()

  const submitPlan = async () => {
    await planForm.validateFields()
    setPlanDim(null)
    planForm.resetFields()
    message.success('Plano de ação criado. Você pode acompanhá-lo na Home.')
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


  // Geral: para recorrente, consolida (soma respostas/convidados, média de score)
  const totalRespostas = cycles.reduce((a, c) => a + c.respostas, 0)
  const totalConvidados = cycles.reduce((a, c) => a + c.convidados, 0)
  const aggTaxa = (totalRespostas / totalConvidados) * 100
  const aggScore = cycles.reduce((a, c) => a + c.score, 0) / cycles.length

  const geralContent = isRecorrente ? (
    <>
      <ResumoInteligente data={resumoRecorrente} onCreatePlan={setPlanDim} />
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={`Resultado consolidado dos ${cycles.length} ciclos. Veja cada ciclo na aba "Ciclos".`}
      />
      <GeralResults
        respostas={totalRespostas}
        convidados={totalConvidados}
        taxa={aggTaxa}
        score={aggScore}
        onCreatePlan={setPlanDim}
      />
    </>
  ) : (
    <>
      <ResumoInteligente data={resumoUnica} onCreatePlan={setPlanDim} />
      <GeralResults onCreatePlan={setPlanDim} />
    </>
  )

  const ciclosContent = (
    <Collapse
      accordion
      defaultActiveKey={[String(cycles[0].id)]}
      style={{ background: '#fff' }}
      items={cycles.map((c) => ({
        key: String(c.id),
        label: (
          <Space size={12} align="center" wrap>
            <Text strong style={{ fontSize: 16, color: brand.primary }}>
              {c.nome}
            </Text>
            <Text type="secondary">{c.periodo}</Text>
            <Tag color={c.status === 'Em andamento' ? 'success' : 'default'}>{c.status}</Tag>
          </Space>
        ),
        children: <CicloConteudo cycle={c} onCreatePlan={setPlanDim} />,
      }))}
    />
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
            <Tag color="success" style={{ borderRadius: 12, marginTop: 4 }}>
              Ativa
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

      {/* Abas — recorrente troca "Individual" por "Ciclos" */}
      <Tabs
        defaultActiveKey="geral"
        style={{ marginTop: 16 }}
        items={[
          { key: 'geral', label: 'Geral', children: geralContent },
          isRecorrente
            ? { key: 'ciclos', label: 'Ciclos', children: ciclosContent }
            : {
                key: 'individual',
                label: 'Individual',
                children: <IndividualView respondentes={respondents} />,
              },
        ]}
      />

      {/* Modal: Criar plano de ação a partir do resultado */}
      <Modal
        title="Criar plano de ação"
        open={planDim !== null}
        onCancel={() => setPlanDim(null)}
        onOk={submitPlan}
        okText="Criar plano"
        cancelText="Cancelar"
        destroyOnHidden
      >
        <Text type="secondary">
          Defina o plano de ação a partir deste recorte da pesquisa.
        </Text>

        {/* Fonte: pesquisa + dimensão + segmento */}
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
          <Space direction="vertical" size={4}>
            <Text type="secondary">
              Pesquisa: <Text style={{ color: '#1f1f1f' }}>tst encerramento</Text>
            </Text>
            <Text type="secondary">
              Dimensão: <Text style={{ color: '#1f1f1f' }}>{planDim}</Text>
            </Text>
          </Space>
        </div>

        <Form form={planForm} layout="vertical" initialValues={{ segmento: 'todos' }}>
          <Form.Item
            name="segmento"
            label="Segmento"
            rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
          >
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
            name="titulo"
            label="Título do plano"
            rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
          >
            <Input placeholder="Ex: Melhorar confiança e sigilo na equipe" />
          </Form.Item>
          <Form.Item name="responsavel" label="Responsável">
            <Select
              placeholder="Selecione"
              options={[
                { value: 'renata', label: 'Renata' },
                { value: 'julia', label: 'Júlia Klug' },
                { value: 'bruna', label: 'Bruna Pereira' },
              ]}
            />
          </Form.Item>
          <Form.Item name="prazo" label="Prazo">
            <DatePicker placeholder="Selecionar data" format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="descricao" label="Descrição">
            <Input.TextArea rows={3} placeholder="Descreva as ações previstas..." />
          </Form.Item>
        </Form>
      </Modal>

      <FloatButton icon={<Question />} type="primary" tooltip="Ajuda" />
    </div>
  )
}
