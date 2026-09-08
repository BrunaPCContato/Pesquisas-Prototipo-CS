import { useState } from 'react'
import {
  Typography,
  Divider,
  Select,
  Button,
  Space,
  Avatar,
  Modal,
  Form,
  Input,
  Radio,
  ColorPicker,
  Alert,
  Tooltip,
  Empty,
  Tag,
  Checkbox,
  App,
} from 'antd'
import {
  Lightbulb,
  Compass,
  PuzzlePiece,
  UsersThree,
  Flask,
  Handshake,
  Hourglass,
  Bank,
  Plus,
  Trash,
  CaretRight,
  CaretDown,
  DotsSixVertical,
  Info,
  Question,
  ListChecks,
  SquaresFour,
  List,
  GitBranch,
  Star,
} from '@phosphor-icons/react'
import { brand } from '../theme'

const { Title, Text } = Typography

// --- Ícones disponíveis (aproximação dos ícones do DS) ---
const iconOptions: { key: string; node: React.ReactNode }[] = [
  { key: 'bulb', node: <Lightbulb /> },
  { key: 'compass', node: <Compass /> },
  { key: 'puzzle', node: <PuzzlePiece /> },
  { key: 'team', node: <UsersThree /> },
  { key: 'brain', node: <Flask /> },
  { key: 'handshake', node: <Handshake /> },
  { key: 'hourglass', node: <Hourglass /> },
  { key: 'building', node: <Bank /> },
]
export const iconNode = (key: string) => iconOptions.find((i) => i.key === key)?.node ?? <Lightbulb />

// --- Dimensões pré-definidas ---
export type Condicao = { baseId: number; valores: string[] }
export type Question = {
  id: number
  titulo: string
  tipo: string
  sentido?: string
  escala?: string
  opcoes?: string[]
  condicao?: Condicao
}

/**
 * Tipos que podem ser PERGUNTA BASE (o gatilho da condição) — inclui Likert.
 */
const TIPOS_BASE = ['likert', 'simnao', 'multipla', 'checkbox']
export const podeSerBase = (q: Question) => TIPOS_BASE.includes(q.tipo)

/** Tipos que podem ser PERGUNTA CONDICIONAL (a exibida) — qualquer um, menos Likert e Importância. */
const podeSerCondicional = (tipo?: string) => tipo !== 'likert' && tipo !== 'importancia'
export type Dimension = {
  id: number
  name: string
  icon: string
  color: string
  questions: Question[]
}

const predefinedDims = [
  { value: 'ambiente', label: 'Ambiente de Trabalho', icon: 'bulb', color: '#1677ff' },
  { value: 'lideranca', label: 'Liderança e Gestão', icon: 'team', color: '#722ed1' },
  { value: 'reputacao', label: 'Reputação e Marca empregadora', icon: 'building', color: '#13a8e6' },
  { value: 'diversidade', label: 'Diversidade e Inclusão', icon: 'team', color: '#52c41a' },
  { value: 'eficacia', label: 'Eficácia operacional e Processos', icon: 'building', color: '#263072' },
  { value: 'carreira', label: 'Carreira e Desenvolvimento', icon: 'hourglass', color: '#9254de' },
  { value: 'seguranca', label: 'Segurança Psicológica', icon: 'brain', color: '#ff4d4f' },
]

const tipoPergunta = [
  { value: 'likert', label: 'Escala Likert', desc: 'Mede o grau de concordância com uma afirmação' },
  { value: 'simnao', label: 'Sim/Não', desc: 'Permite que o colaborador confirme ou negue uma afirmação' },
  { value: 'multipla', label: 'Múltipla escolha', desc: 'Permite selecionar uma opção de uma lista pré-definida' },
  { value: 'checkbox', label: 'Checkbox de seleção', desc: 'Permite selecionar varias opções de uma lista pré-definida' },
  { value: 'aberta', label: 'Aberta', desc: 'Permite digitar uma resposta livre' },
  { value: 'importancia', label: 'Pergunta de importância', desc: 'Mede o quanto a dimensão é importante para o respondente (priorização)' },
]

/** Texto padrão da pergunta de importância — usa o nome da dimensão como variável. */
const textoImportanciaPadrao = (dimensao: string) =>
  `Quão importante é "${dimensao}" para você?`
// Escala fixa exibida ao respondente na pergunta de importância
const opcoesImportancia = [
  'Nada importante',
  'Pouco importante',
  'Moderadamente importante',
  'Importante',
  'Muito importante',
]
export const tipoLabel = (v: string) => tipoPergunta.find((t) => t.value === v)?.label ?? v

// Variações da escala Likert
const likertScales: Record<string, { label: string; options: string[] }> = {
  concordancia: {
    label: 'Concordância',
    options: ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'],
  },
  frequencia: {
    label: 'Frequência',
    options: ['Muito frequente', 'Frequentemente', 'Eventualmente', 'Raramente', 'Nunca'],
  },
}

/** Respostas possíveis de uma pergunta base, para montar a condição. */
function valoresBase(q: Question): string[] {
  if (q.tipo === 'likert') return likertScales[q.escala ?? 'concordancia'].options
  if (q.tipo === 'simnao') return ['Sim', 'Não']
  if (q.tipo === 'multipla' || q.tipo === 'checkbox') return q.opcoes ?? []
  return []
}

export const exibicaoOptions = [
  { value: 'individual', title: 'Uma pergunta por página', sub: 'Exibição individual', icon: <ListChecks /> },
  { value: 'dimensao', title: 'Uma página por dimensão', sub: 'Agrupado por tema', icon: <SquaresFour /> },
  { value: 'todas', title: 'Todas as perguntas em uma página', sub: 'Visualização completa', icon: <List /> },
]
export const exibicaoLabel = (v: string) => exibicaoOptions.find((o) => o.value === v)?.title ?? v

let uid = 100
const nextId = () => ++uid

// ============ Modal: Criar dimensão ============
function CreateDimensionModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (d: Omit<Dimension, 'id' | 'questions'>) => void
}) {
  const [form] = Form.useForm()

  const submit = async () => {
    const v = await form.validateFields()
    const color = typeof v.color === 'string' ? v.color : v.color?.toHexString?.() ?? '#1677ff'
    onCreate({ name: v.name, icon: v.icon, color })
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Criar dimensão"
      open={open}
      onCancel={onClose}
      onOk={submit}
      okText="Criar dimensão"
      cancelText="Cancelar"
    >
      <Text type="secondary">Configure nome, ícone e cor da nova dimensão</Text>
      <Form form={form} layout="vertical" style={{ marginTop: 16 }} initialValues={{ color: '#1677FF' }}>
        <Form.Item
          name="name"
          label="Nome da dimensão"
          rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
        >
          <Input placeholder="Ex: Ambiente de Trabalho" />
        </Form.Item>

        <Form.Item
          name="icon"
          label="Ícone"
          rules={[{ required: true, message: 'Selecione um ícone' }]}
        >
          <Radio.Group style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {iconOptions.map((opt) => (
                <Radio.Button
                  key={opt.key}
                  value={opt.key}
                  style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  {opt.node}
                </Radio.Button>
              ))}
            </div>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="color"
          label="Cor de fundo"
          rules={[{ required: true, message: 'Selecione uma cor' }]}
        >
          <ColorPicker showText format="hex" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ============ Modal: Adicionar pergunta ============
function AddQuestionModal({
  open,
  onClose,
  onAdd,
  baseQuestions,
  dimensionName,
}: {
  open: boolean
  onClose: () => void
  onAdd: (q: Omit<Question, 'id'>) => void
  baseQuestions: Question[]
  dimensionName: string
}) {
  const [form] = Form.useForm()
  const tipo = Form.useWatch('tipo', form) as string | undefined
  const textoPadrao = textoImportanciaPadrao(dimensionName)
  const escala = (Form.useWatch('escala', form) as string | undefined) ?? 'concordancia'
  const condicional = Form.useWatch('condicional', form) as boolean | undefined
  const condBaseId = Form.useWatch('condBaseId', form) as number | undefined
  const baseSelecionada = baseQuestions.find((q) => q.id === condBaseId)

  const temBase = baseQuestions.length > 0
  // Aviso "sem base" também nos tipos que podem ser base (inclui Likert)
  const ehTipoEscolha = TIPOS_BASE.includes(tipo ?? '')
  // Checkbox de condicional: qualquer tipo (exceto importância) quando há base.
  // Aviso "sem base": só nos tipos de escolha (Sim/Não, Múltipla, Checkbox).
  const mostrarSecaoCondicional =
    (podeSerCondicional(tipo) && temBase) || (!temBase && ehTipoEscolha)

  const submit = async () => {
    const v = await form.validateFields()
    onAdd({
      // Importância: se esvaziado, reverte ao texto padrão (nome da dimensão)
      titulo: v.tipo === 'importancia' && !v.titulo?.trim() ? textoPadrao : v.titulo,
      tipo: v.tipo,
      sentido: v.sentido,
      escala: v.tipo === 'likert' ? v.escala : undefined,
      opcoes: v.opcoes?.filter(Boolean),
      condicao: v.condicional
        ? { baseId: v.condBaseId, valores: v.condValores }
        : undefined,
    })
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Adicionar pergunta"
      open={open}
      onCancel={onClose}
      onOk={submit}
      okText="Adicionar"
      cancelText="Cancelar"
      destroyOnHidden
    >
      <Text type="secondary">Configure os detalhes da nova pergunta para esta dimensão</Text>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        initialValues={{
          tipo: 'likert',
          escala: 'concordancia',
          sentido: 'positivo',
          condicional: false,
        }}
      >
        <Form.Item
          name="titulo"
          label={
            tipo === 'importancia' ? (
              <Space size={6}>
                Título da pergunta
                <Tooltip
                  title={
                    <div style={{ lineHeight: 1.6 }}>
                      Pergunta de <b>priorização</b>: mede o quanto esta dimensão importa para o
                      respondente. O texto padrão usa o <b>nome da dimensão como variável</b> (acompanha
                      renomeações) e <b>volta ao padrão</b> se você esvaziar o campo. Esta pergunta fica
                      sempre <b>ao final do bloco da dimensão</b>.
                    </div>
                  }
                >
                  <Info style={{ color: brand.primary }} />
                </Tooltip>
              </Space>
            ) : (
              'Título da pergunta'
            )
          }
          rules={
            tipo === 'importancia'
              ? []
              : [{ required: true, message: 'Campo de preenchimento obrigatório' }]
          }
        >
          <Input
            placeholder={
              tipo === 'importancia'
                ? `Ex: ${textoPadrao}`
                : 'Ex: Como você avalia sua satisfação no trabalho?'
            }
          />
        </Form.Item>

        <Form.Item
          name="tipo"
          label="Tipo de pergunta"
          rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
        >
          <Select
            options={tipoPergunta}
            optionRender={(opt) => (
              <div style={{ paddingBlock: 4 }}>
                <div style={{ fontWeight: 600 }}>{opt.data.label}</div>
                <div style={{ fontSize: 12, color: brand.textMuted }}>{opt.data.desc}</div>
              </div>
            )}
          />
        </Form.Item>

        {tipo === 'likert' && (
          <>
            <Form.Item
              name="escala"
              label="Escala"
              rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
            >
              <Radio.Group buttonStyle="solid">
                {Object.entries(likertScales).map(([value, s]) => (
                  <Radio.Button key={value} value={value}>
                    {s.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
              message={
                <div>
                  As opções exibidas para o respondente serão:
                  <div style={{ marginTop: 4 }}>
                    {likertScales[escala].options
                      .map((o, i) => `${i + 1} - ${o}`)
                      .join(' · ')}
                  </div>
                </div>
              }
            />
            <Form.Item
              name="sentido"
              label={
                <Space size={6}>
                  Sentido da afirmação
                  <Tooltip title="Positivo: concordar é bom. Negativo: concordar indica um problema.">
                    <Question style={{ color: brand.textMuted }} />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="positivo">Positivo</Radio.Button>
                <Radio.Button value="negativo">Negativo</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </>
        )}

        {tipo === 'importancia' && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
            message={
              <div>
                As opções exibidas para o respondente serão:
                <div style={{ marginTop: 4 }}>
                  {opcoesImportancia.map((o, i) => `${i + 1} - ${o}`).join(' · ')}
                </div>
              </div>
            }
          />
        )}

        {(tipo === 'multipla' || tipo === 'checkbox') && (
          <Form.List name="opcoes" initialValue={['', '']}>
            {(fields, { add, remove }) => (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Opções de resposta</div>
                {fields.map((field, index) => (
                  <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item name={field.name} noStyle>
                      <Input placeholder={`Opção ${index + 1}`} style={{ width: 380, maxWidth: '100%' }} />
                    </Form.Item>
                    {fields.length > 2 && (
                      <Button type="text" icon={<Trash />} onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Button block icon={<Plus />} onClick={() => add()}>
                  Opção
                </Button>
              </div>
            )}
          </Form.List>
        )}

        {/* Condicional: checkbox p/ qualquer tipo (com base); aviso "sem base" só
            nos tipos de escolha. Base sempre restrita aos tipos de escolha. */}
        {mostrarSecaoCondicional && (
          <>
            <Divider />
            {baseQuestions.length === 0 ? (
              <Alert
                type="info"
                showIcon
                message="Para exibir esta pergunta condicionalmente, adicione antes uma pergunta base (Escala Likert, Sim/Não, Múltipla escolha ou Checkbox)."
              />
            ) : (
              <>
                <Form.Item name="condicional" valuePropName="checked" style={{ marginBottom: condicional ? 12 : 0 }}>
                  <Checkbox>Exibir esta pergunta condicionalmente</Checkbox>
                </Form.Item>
                {condicional && (
              <>
                <Form.Item
                  name="condBaseId"
                  label="Pergunta base"
                  rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
                >
                  <Select
                    placeholder="Selecione a pergunta"
                    options={baseQuestions.map((q) => ({ value: q.id, label: q.titulo }))}
                    onChange={() => form.setFieldValue('condValores', undefined)}
                  />
                </Form.Item>
                <Form.Item
                  name="condValores"
                  label="Exibir quando a resposta for"
                  rules={[{ required: true, message: 'Selecione ao menos uma resposta' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Selecione as respostas"
                    disabled={!baseSelecionada}
                    options={(baseSelecionada ? valoresBase(baseSelecionada) : []).map((v) => ({
                      value: v,
                      label: v,
                    }))}
                  />
                </Form.Item>
                <Alert
                  type="info"
                  showIcon
                  message="Somente quem escolher uma dessas respostas na pergunta base verá esta pergunta."
                />
                    <div style={{ height: 8 }} />
                  </>
                )}
              </>
            )}
          </>
        )}
      </Form>
    </Modal>
  )
}

// ============ Item de dimensão ============
function DimensionItem({
  dim,
  onAddQuestion,
  onDelete,
  onDeleteQuestion,
  resolveTitulo,
}: {
  dim: Dimension
  onAddQuestion: () => void
  onDelete: () => void
  onDeleteQuestion: (qid: number) => void
  resolveTitulo: (id: number) => string | undefined
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
        <DotsSixVertical style={{ color: '#bfbfbf', cursor: 'grab' }} />
        <Avatar size={32} style={{ backgroundColor: dim.color }} icon={iconNode(dim.icon)} />
        <Text strong style={{ flex: 1, color: '#1f1f1f' }}>
          {dim.name}
        </Text>
        <Button icon={<Plus />} onClick={onAddQuestion}>
          Pergunta
        </Button>
        <Button shape="circle" icon={<Trash />} onClick={onDelete} />
        <Button
          shape="circle"
          type="text"
          icon={expanded ? <CaretDown /> : <CaretRight />}
          onClick={() => setExpanded((e) => !e)}
        />
      </div>

      {expanded && (
        <div style={{ padding: '0 12px 12px 56px' }}>
          {dim.questions.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Nenhuma pergunta ainda"
              style={{ margin: '8px 0' }}
            />
          ) : (
            // Importância sempre ao final do bloco da dimensão
            [...dim.questions]
              .sort(
                (a, b) =>
                  (a.tipo === 'importancia' ? 1 : 0) - (b.tipo === 'importancia' ? 1 : 0),
              )
              .map((q) => (
              <div
                key={q.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 12px',
                  borderTop: '1px solid #f5f5f5',
                }}
              >
                <Text style={{ flex: 1 }}>{q.titulo}</Text>
                {q.tipo === 'importancia' && (
                  <Tooltip title="Pergunta de priorização — mede a importância desta dimensão. Fica ao final do bloco.">
                    <Tag color="gold" icon={<Star />}>
                      Priorização
                    </Tag>
                  </Tooltip>
                )}
                {q.condicao && (
                  <Tooltip
                    title={`Exibida quando "${
                      resolveTitulo(q.condicao.baseId) ?? 'pergunta base'
                    }" for respondida com: ${q.condicao.valores.join(', ')}`}
                  >
                    <Tag color="blue" icon={<GitBranch />}>
                      Condicional
                    </Tag>
                  </Tooltip>
                )}
                <Tag>{tipoLabel(q.tipo)}</Tag>
                <Button
                  type="text"
                  size="small"
                  icon={<Trash />}
                  onClick={() => onDeleteQuestion(q.id)}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ============ Step principal ============
export default function PerguntasStep({
  dimensions,
  setDimensions,
  exibicao,
  setExibicao,
}: {
  dimensions: Dimension[]
  setDimensions: React.Dispatch<React.SetStateAction<Dimension[]>>
  exibicao: string
  setExibicao: (v: string) => void
}) {
  const { message } = App.useApp()
  const [selected, setSelected] = useState<string | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const [addQuestionFor, setAddQuestionFor] = useState<number | null>(null)

  // Perguntas já criadas que podem servir de base para lógica condicional
  const baseQuestions = dimensions.flatMap((d) => d.questions).filter(podeSerBase)

  // Opções do select = pré-definidas ainda não adicionadas
  const usedNames = new Set(dimensions.map((d) => d.name))
  const options = predefinedDims
    .filter((d) => !usedNames.has(d.label))
    .map((d) => ({
      value: d.value,
      label: (
        <Space>
          <Avatar size={22} style={{ backgroundColor: d.color }} icon={iconNode(d.icon)} />
          {d.label}
        </Space>
      ),
      searchLabel: d.label,
    }))

  const addSelectedDimension = () => {
    const dim = predefinedDims.find((d) => d.value === selected)
    if (!dim) return
    setDimensions((prev) => [
      ...prev,
      { id: nextId(), name: dim.label, icon: dim.icon, color: dim.color, questions: [] },
    ])
    setSelected(undefined)
  }

  const createDimension = (d: Omit<Dimension, 'id' | 'questions'>) => {
    setDimensions((prev) => [...prev, { id: nextId(), ...d, questions: [] }])
    message.success(`Dimensão "${d.name}" criada.`)
  }

  const addQuestion = (q: Omit<Question, 'id'>) => {
    setDimensions((prev) =>
      prev.map((d) =>
        d.id === addQuestionFor ? { ...d, questions: [...d.questions, { id: nextId(), ...q }] } : d,
      ),
    )
  }

  return (
    <>
      <Title level={4} style={{ color: '#1f1f1f', marginBottom: 4 }}>
        Pergunta
      </Title>
      <Text type="secondary">Adicione uma dimensão para iniciar a criação das perguntas</Text>
      <Divider />

      <div style={{ marginBottom: 8 }}>
        <Text strong>
          <span style={{ color: brand.danger, marginRight: 4 }}>*</span>
          Dimensões
        </Text>{' '}
        <Tooltip title="Dimensões agrupam perguntas por tema.">
          <Info style={{ color: brand.textMuted }} />
        </Tooltip>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Select
          style={{ flex: 1 }}
          placeholder="Selecione ou crie uma nova dimensão"
          value={selected}
          onChange={setSelected}
          options={options}
          showSearch
          optionFilterProp="searchLabel"
          popupRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '4px 0' }} />
              <Button type="text" block icon={<Plus />} onClick={() => setCreateOpen(true)}>
                Criar dimensão
              </Button>
            </>
          )}
        />
        <Button type="primary" disabled={!selected} onClick={addSelectedDimension}>
          Adicionar
        </Button>
      </div>

      {dimensions.map((dim) => (
        <DimensionItem
          key={dim.id}
          dim={dim}
          onAddQuestion={() => setAddQuestionFor(dim.id)}
          onDelete={() => setDimensions((prev) => prev.filter((d) => d.id !== dim.id))}
          onDeleteQuestion={(qid) =>
            setDimensions((prev) =>
              prev.map((d) =>
                d.id === dim.id ? { ...d, questions: d.questions.filter((q) => q.id !== qid) } : d,
              ),
            )
          }
          resolveTitulo={(id) =>
            dimensions.flatMap((d) => d.questions).find((q) => q.id === id)?.titulo
          }
        />
      ))}

      {/* Exibição */}
      <Divider style={{ marginTop: 32 }} />
      <Title level={4} style={{ color: '#1f1f1f', marginBottom: 4 }}>
        Exibição
      </Title>
      <Text type="secondary">Escolha como as perguntas serão apresentadas ao respondente</Text>
      <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
        {exibicaoOptions.map((opt) => {
          const active = exibicao === opt.value
          return (
            <div
              key={opt.value}
              onClick={() => setExibicao(opt.value)}
              style={{
                flex: '1 1 240px',
                border: `1px solid ${active ? brand.primary : '#f0f0f0'}`,
                boxShadow: active ? `0 0 0 1px ${brand.primary}` : 'none',
                borderRadius: 12,
                padding: '32px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              <div style={{ fontSize: 34, color: brand.primary, marginBottom: 16 }}>{opt.icon}</div>
              <div style={{ fontSize: 16, color: '#1f1f1f' }}>{opt.title}</div>
              <Text type="secondary">{opt.sub}</Text>
            </div>
          )
        })}
      </div>

      <CreateDimensionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createDimension}
      />
      <AddQuestionModal
        open={addQuestionFor !== null}
        onClose={() => setAddQuestionFor(null)}
        onAdd={addQuestion}
        baseQuestions={baseQuestions}
        dimensionName={dimensions.find((d) => d.id === addQuestionFor)?.name ?? ''}
      />
    </>
  )
}
