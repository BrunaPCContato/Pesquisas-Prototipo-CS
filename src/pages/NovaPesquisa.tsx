import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Button,
  Card,
  Steps,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Divider,
  Alert,
  Checkbox,
  Tooltip,
  Space,
  Tag,
  Avatar,
  Collapse,
  DatePicker,
  App,
} from 'antd'
import {
  CaretLeft,
  WarningCircle,
  Info,
  Question,
  Envelope,
} from '@phosphor-icons/react'
import { brand } from '../theme'
import PerguntasStep, {
  exibicaoLabel,
  tipoLabel,
  iconNode,
} from '../components/PerguntasStep'
import type { Dimension } from '../components/PerguntasStep'

const { Title, Text } = Typography

const steps = [
  { title: 'Configuração' },
  { title: 'Perguntas' },
  { title: 'Comunicação' },
  { title: 'Lançamento' },
]

const REQUIRED = { required: true, message: 'Campo de preenchimento obrigatório' }

const departamentos = [
  { value: 'rh', label: 'Departamento de RH (5)' },
  { value: 'financas', label: 'Departamento de Finanças (18)' },
  { value: 'teste', label: 'Departamento teste (9)' },
]
const allDepValues = departamentos.map((d) => d.value)

function CollectAlert({ tipo }: { tipo: string }) {
  const warnIcon = <WarningCircle weight="fill" style={{ color: brand.warning }} />
  if (tipo === 'anonima')
    return (
      <Alert
        type="warning"
        icon={warnIcon}
        showIcon
        style={{ marginBottom: 24 }}
        message="Você está optando pela coleta anônima de respostas. Público-alvo com menos de 3 pessoas serão ocultados da listagem para proteger a privacidade. Por favor, evite perguntas que permitam deduzir a identidade dos respondentes"
      />
    )
  if (tipo === 'identificada')
    return (
      <Alert
        type="warning"
        icon={warnIcon}
        showIcon
        style={{ marginBottom: 24 }}
        message="Você está optando pela coleta identificada de respostas. Os respondentes serão informados que suas respostas serão identificadas e analisadas individualmente"
      />
    )
  return null
}

function ConfiguracaoStep() {
  const form = Form.useFormInstance()
  const tipoColeta = Form.useWatch('tipoColeta', form) as string | undefined
  const publico = (Form.useWatch('publico', form) as string[] | undefined) ?? []

  const allSelected = publico.length === allDepValues.length
  const someSelected = publico.length > 0 && !allSelected

  return (
    <>
      <Title level={4} style={{ color: '#1f1f1f', marginBottom: 4 }}>
        Configuração
      </Title>
      <Text type="secondary">Configure os detalhes básicos</Text>
      <Divider />

      <Form.Item name="nome" label="Nome da pesquisa" rules={[REQUIRED]}>
        <Input placeholder="Ex: Onboarding" />
      </Form.Item>

      <Form.Item name="descricao" label="Descrição">
        <Input.TextArea rows={3} placeholder="Ex: Pesquisa com o objetivo de..." />
      </Form.Item>

      <Form.Item name="tipoColeta" label="Tipo de coleta de respostas" rules={[REQUIRED]}>
        <Radio.Group buttonStyle="solid">
          <Radio.Button value="anonima">Anônima</Radio.Button>
          <Radio.Button value="identificada">Identificada</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="publico" label="Público-alvo" rules={[REQUIRED]}>
        <Select
          mode="multiple"
          placeholder="Selecione"
          options={departamentos}
          showSearch
          optionFilterProp="label"
          popupRender={(menu) => (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 12px',
                }}
              >
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) =>
                    form.setFieldValue('publico', e.target.checked ? allDepValues : [])
                  }
                >
                  Selecionar todos
                </Checkbox>
                <Button
                  type="link"
                  size="small"
                  onClick={() => form.setFieldValue('publico', [])}
                >
                  Limpar seleção
                </Button>
              </div>
              <Divider style={{ margin: 0 }} />
              {menu}
            </>
          )}
        />
      </Form.Item>

      {tipoColeta === 'identificada' && (
        <Form.Item
          name="publicoPersonalizado"
          label={
            <Space size={6}>
              Público-alvo personalizado
              <Tooltip title="Selecione pessoas específicas além dos departamentos.">
                <Info style={{ color: brand.textMuted }} />
              </Tooltip>
            </Space>
          }
        >
          <Select
            mode="multiple"
            placeholder="Selecione"
            options={departamentos}
          />
        </Form.Item>
      )}

      <CollectAlert tipo={tipoColeta ?? ''} />
    </>
  )
}

const DEFAULT_EMAIL = `Olá, tudo bem?

Você foi convidado(a) para participar da nossa iniciativa. Sua contribuição é fundamental para criarmos um ambiente de trabalho cada vez mais colaborativo.

Contamos com a sua participação e comprometimento. Acesse a pesquisa através do link abaixo utilizando seu e-mail e senha de colaborador.

Atenciosamente,`

const tipoColetaLabel = (v?: string) =>
  v === 'anonima' ? 'Anônima' : v === 'identificada' ? 'Identificada' : '—'

const depLabel = (v: string) =>
  departamentos.find((d) => d.value === v)?.label.replace(/\s*\(\d+\)$/, '') ?? v

const frequencias = [
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
]
const freqLabel = (v?: string) => frequencias.find((f) => f.value === v)?.label.toLowerCase()

// ============ Passo 3 — Comunicação ============
function ComunicacaoStep() {
  return (
    <>
      <Title level={4} style={{ color: '#1f1f1f', marginBottom: 4 }}>
        Comunicação
      </Title>
      <Text type="secondary">Configure a forma de comunicação com os respondentes</Text>
      <Divider />

      <Collapse
        defaultActiveKey={['email']}
        style={{ background: '#fff' }}
        items={[
          {
            key: 'email',
            label: (
              <Space>
                <Envelope style={{ color: brand.primary }} />
                <Text strong>E-mail</Text>
              </Space>
            ),
            children: (
              <>
                <Form.Item name="assunto" label="Assunto" rules={[REQUIRED]}>
                  <Input placeholder="Assunto do e-mail" />
                </Form.Item>
                <Form.Item name="conteudo" label="Conteúdo" rules={[REQUIRED]}>
                  <Input.TextArea rows={8} />
                </Form.Item>
                <Form.Item name="lembrete" valuePropName="checked" style={{ marginBottom: 4 }}>
                  <Checkbox>Habilitar lembrete automático</Checkbox>
                </Form.Item>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Um lembrete será enviado ao respondente um dia antes do prazo, caso ainda não
                  tenha respondido
                </Text>
              </>
            ),
          },
        ]}
      />

      <Alert
        type="info"
        showIcon
        style={{ marginTop: 24 }}
        message="O link de compartilhamento da pesquisa estará disponível no último passo, após o lançamento"
      />
    </>
  )
}

// ============ Passo 4 — Revisão / Lançamento ============
function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
      <Text style={{ color: brand.textMuted, minWidth: 220 }}>{label}</Text>
      <div style={{ color: '#1f1f1f' }}>{children}</div>
    </div>
  )
}

function RevisaoStep({
  config,
  com,
  dimensions,
  exibicao,
}: {
  config: any
  com: any
  dimensions: Dimension[]
  exibicao: string
}) {
  const launchForm = Form.useFormInstance()
  const agendarLanc = Form.useWatch('agendarLancamento', launchForm)
  const agendarEnc = Form.useWatch('agendarEncerramento', launchForm)
  const tipoLancamento = Form.useWatch('tipoLancamento', launchForm)
  const frequencia = Form.useWatch('frequencia', launchForm) as string | undefined
  const diasAberta = Form.useWatch('diasAberta', launchForm) as number | undefined
  const totalPerguntas = dimensions.reduce((acc, d) => acc + d.questions.length, 0)
  const publico = (config?.publico as string[] | undefined) ?? []

  return (
    <>
      <Title level={4} style={{ color: '#1f1f1f', marginBottom: 4 }}>
        Revisão
      </Title>
      <Text type="secondary">Revise todas as configurações antes de lançar a pesquisa</Text>
      <Divider />

      {/* Configuração */}
      <Title level={5}>Configuração</Title>
      <ReviewRow label="Nome da pesquisa">{config?.nome || '—'}</ReviewRow>
      <ReviewRow label="Tipo de coleta de respostas">
        {tipoColetaLabel(config?.tipoColeta)}
      </ReviewRow>
      <ReviewRow label="Público-alvo">
        <Space size={4} wrap>
          {publico.length ? (
            publico.map((p) => (
              <Tag key={p} style={{ background: brand.infoBg, border: '1px solid #adc6ff', color: brand.primary }}>
                {depLabel(p)}
              </Tag>
            ))
          ) : (
            '—'
          )}
        </Space>
      </ReviewRow>

      {/* Perguntas */}
      <Title level={5} style={{ marginTop: 24 }}>
        Perguntas
      </Title>
      <ReviewRow label="Quantidade de perguntas">{totalPerguntas}</ReviewRow>
      <ReviewRow label="Exibição">{exibicaoLabel(exibicao)}</ReviewRow>
      {dimensions.map((dim) => (
        <div key={dim.id} style={{ marginTop: 12 }}>
          <Space size={10} align="center" style={{ marginBottom: 8 }}>
            <Avatar size={28} style={{ backgroundColor: dim.color }} icon={iconNode(dim.icon)} />
            <Text strong>{dim.name}</Text>
          </Space>
          {dim.questions.map((q, i) => (
            <div key={q.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 0 4px 38px' }}>
              <Text type="secondary">#{i + 1}</Text>
              <Tag>{tipoLabel(q.tipo)}</Tag>
              <Text>{q.titulo}</Text>
            </div>
          ))}
        </div>
      ))}

      {/* Canal */}
      <Title level={5} style={{ marginTop: 24 }}>
        Canal E-mail
      </Title>
      <ReviewRow label="Assunto">
        <Input readOnly value={com?.assunto} variant="filled" style={{ width: 480, maxWidth: '100%' }} />
      </ReviewRow>
      <ReviewRow label="Conteúdo">
        <Input.TextArea readOnly value={com?.conteudo} rows={6} variant="filled" style={{ width: 480, maxWidth: '100%' }} />
      </ReviewRow>
      <ReviewRow label="Lembrete automático">
        {com?.lembrete ? (
          <Tag color="success">Ativado</Tag>
        ) : (
          <Tag color="error">Desativado</Tag>
        )}
      </ReviewRow>

      {/* Lançamento */}
      <Divider />
      <Title level={5}>Lançamento</Title>
      <Text type="secondary">Configure os parâmetros de lançamento da pesquisa</Text>

      <div style={{ marginTop: 20 }}>
        <Form.Item
          name="minutos"
          label={
            <Space size={6}>
              Média de minutos necessários para responder à pesquisa
              <Tooltip title="Tempo médio estimado, exibido ao respondente.">
                <Question style={{ color: brand.textMuted }} />
              </Tooltip>
            </Space>
          }
        >
          <InputNumber min={1} style={{ width: 120 }} />
        </Form.Item>

        {/* Escopo: única ou recorrente */}
        <Form.Item name="tipoLancamento" label="Tipo de lançamento" rules={[REQUIRED]}>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="unica">Única</Radio.Button>
            <Radio.Button value="recorrente">Recorrente</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {tipoLancamento === 'unica' && (
          <>
            <Form.Item name="agendarLancamento" valuePropName="checked" style={{ marginBottom: 4 }}>
              <Checkbox>Agendar data de lançamento</Checkbox>
            </Form.Item>
            <div style={{ color: brand.textMuted, fontSize: 13, marginBottom: 16 }}>
              O e-mail será disparado aos respondentes na data agendada
            </div>
            {agendarLanc && (
              <Form.Item name="dataLancamento" label="Data de lançamento" rules={[REQUIRED]}>
                <DatePicker placeholder="Selecionar data" format="DD/MM/YYYY" style={{ width: 260 }} />
              </Form.Item>
            )}

            <Form.Item name="agendarEncerramento" valuePropName="checked" style={{ marginBottom: 4 }}>
              <Checkbox>Agendar data de encerramento</Checkbox>
            </Form.Item>
            <div style={{ color: brand.textMuted, fontSize: 13, marginBottom: 16 }}>
              Os respondentes não terão mais acesso à pesquisa na data agendada
            </div>
            {agendarEnc && (
              <Form.Item name="dataEncerramento" label="Data de encerramento" rules={[REQUIRED]}>
                <DatePicker placeholder="Selecionar data" format="DD/MM/YYYY" style={{ width: 260 }} />
              </Form.Item>
            )}
          </>
        )}

        {tipoLancamento === 'recorrente' && (
          <>
            <Form.Item name="frequencia" label="Frequência" rules={[REQUIRED]}>
              <Select
                placeholder="Selecione a frequência"
                style={{ maxWidth: 300 }}
                options={frequencias}
              />
            </Form.Item>
            <Form.Item name="dataInicio" label="Data de início" rules={[REQUIRED]}>
              <DatePicker placeholder="Selecionar data" format="DD/MM/YYYY" style={{ width: 260 }} />
            </Form.Item>
            <Form.Item
              name="diasAberta"
              label={
                <Space size={6}>
                  Período que ficará aberta (dias)
                  <Tooltip title="Quantos dias a pesquisa fica disponível a cada ciclo.">
                    <Question style={{ color: brand.textMuted }} />
                  </Tooltip>
                </Space>
              }
              rules={[REQUIRED]}
            >
              <InputNumber min={1} style={{ width: 160 }} addonAfter="dias" />
            </Form.Item>
            <Alert
              type="info"
              showIcon
              message={
                frequencia && diasAberta
                  ? `A pesquisa será reaberta automaticamente na frequência ${freqLabel(
                      frequencia,
                    )} e ficará disponível por ${diasAberta} dia(s) a cada ciclo.`
                  : 'Defina a frequência e o período (dias) para ver o resumo da recorrência.'
              }
            />
          </>
        )}
      </div>
    </>
  )
}

export default function NovaPesquisa() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [comForm] = Form.useForm()
  const [launchForm] = Form.useForm()
  const [current, setCurrent] = useState(0)
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [exibicao, setExibicao] = useState('individual')

  const next = async () => {
    if (current === 0) {
      try {
        await form.validateFields()
      } catch {
        return
      }
    }
    if (current === 1 && dimensions.length === 0) {
      message.error('Adicione ao menos uma dimensão.')
      return
    }
    if (current === 2) {
      try {
        await comForm.validateFields()
      } catch {
        return
      }
    }
    setCurrent((c) => Math.min(steps.length - 1, c + 1))
  }

  const prev = () => setCurrent((c) => Math.max(0, c - 1))

  const saveDraft = () => message.success('Rascunho salvo.')

  const finish = async () => {
    try {
      await launchForm.validateFields()
    } catch {
      return
    }
    message.success('Pesquisa lançada com sucesso!')
    navigate('/pesquisas')
  }

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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Criar pesquisa
          </Title>
          <Text style={{ fontSize: 16, color: brand.textMuted }}>
            Estruture sua pesquisa e configure os detalhes do seu novo formulário
          </Text>
        </div>
        <Button onClick={saveDraft}>Salvar rascunho</Button>
      </div>

      <Steps
        current={current}
        items={steps}
        style={{ marginTop: 32, marginBottom: 24 }}
      />

      <Card>
        {current === 0 && (
          <Form form={form} layout="vertical" requiredMark>
            <ConfiguracaoStep />
          </Form>
        )}
        {current === 1 && (
          <PerguntasStep
            dimensions={dimensions}
            setDimensions={setDimensions}
            exibicao={exibicao}
            setExibicao={setExibicao}
          />
        )}
        {current === 2 && (
          <Form
            form={comForm}
            layout="vertical"
            requiredMark
            initialValues={{ conteudo: DEFAULT_EMAIL, lembrete: false }}
          >
            <ComunicacaoStep />
          </Form>
        )}
        {current === 3 && (
          <Form
            form={launchForm}
            layout="vertical"
            requiredMark
            initialValues={{
              minutos: 5,
              tipoLancamento: 'unica',
              agendarLancamento: false,
              agendarEncerramento: false,
            }}
          >
            <RevisaoStep
              config={form.getFieldsValue(true)}
              com={comForm.getFieldsValue(true)}
              dimensions={dimensions}
              exibicao={exibicao}
            />
          </Form>
        )}

        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button icon={<CaretLeft />} onClick={prev} disabled={current === 0}>
            Anterior
          </Button>
          {current < steps.length - 1 ? (
            <Button type="primary" onClick={next}>
              Próximo
            </Button>
          ) : (
            <Button type="primary" onClick={finish}>
              Lançar pesquisa agora
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
