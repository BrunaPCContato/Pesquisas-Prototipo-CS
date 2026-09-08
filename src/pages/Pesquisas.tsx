import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Button,
  Card,
  Badge,
  Space,
  Select,
  DatePicker,
  Input,
  Table,
  Tag,
  Progress,
  Modal,
  Checkbox,
  App,
} from 'antd'
import type { TableProps } from 'antd'
import type { Dayjs } from 'dayjs'
import { useSession } from '../session'
import EmpresaSelector from '../components/EmpresaSelector'
import {
  WarningCircle,
  Plus,
  Trash,
  CaretRight,
  MagnifyingGlass,
  ChartBar,
  Copy,
  ArrowClockwise,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { brand } from '../theme'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

type Draft = { id: number; title: string; author: string }

const drafts: Draft[] = [
  { id: 1, title: 'Pesquisa de Clima Organizacional 2026', author: 'Renata' },
  { id: 2, title: 'Bem-Estar, Estresse, Assédio e Saúde Mental', author: 'Júlia Klug' },
  { id: 3, title: 'eNPS e Percepção da Empresa', author: 'Júlia Klug' },
  { id: 4, title: 'Avaliação de Liderança', author: 'Renata' },
  { id: 5, title: 'Pesquisa de Desligamento', author: 'Júlia Klug' },
]

type SurveyStatus = 'Concluída' | 'Ativa'
type SurveyTipo = 'unica' | 'recorrente'
type SurveyRow = {
  key: number
  nome: string
  status: SurveyStatus
  tipo: SurveyTipo
  lancamento: string
  encerramento: string
  taxa: number
}

const surveys: SurveyRow[] = [
  { key: 1, nome: 'Clima Organizacional', status: 'Concluída', tipo: 'unica', lancamento: '23/12/2025', encerramento: '25/12/2025', taxa: 16 },
  { key: 2, nome: 'Pesquisa de Clima Q4-2025 teste', status: 'Concluída', tipo: 'unica', lancamento: '23/12/2025', encerramento: '28/04/2026', taxa: 4 },
  { key: 3, nome: 'Pesquisa Global', status: 'Ativa', tipo: 'recorrente', lancamento: '23/12/2025', encerramento: 'Não definido', taxa: 0 },
  { key: 4, nome: 'tst encerramento', status: 'Ativa', tipo: 'unica', lancamento: '28/04/2026', encerramento: 'Não definido', taxa: 28 },
  { key: 5, nome: 'Engajamento 2025', status: 'Concluída', tipo: 'recorrente', lancamento: '01/10/2025', encerramento: '30/10/2025', taxa: 62 },
]

function StatusTag({ status }: { status: SurveyStatus }) {
  if (status === 'Ativa') return <Tag color="success">Ativa</Tag>
  return <Tag>Concluída</Tag>
}

function DraftCard({
  draft,
  onOpen,
  onDelete,
}: {
  draft: Draft
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <Card
      size="small"
      hoverable
      style={{ minWidth: 320, flex: '0 0 auto' }}
      styles={{ body: { display: 'flex', alignItems: 'center', gap: 12 } }}
    >
      <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={onOpen}>
        <div
          style={{
            fontWeight: 600,
            color: brand.primary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {draft.title}
        </div>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Criado por {draft.author}
        </Text>
      </div>
      <Button type="text" icon={<Trash />} onClick={onDelete} />
    </Card>
  )
}

export default function Pesquisas() {
  const navigate = useNavigate()
  const { message, modal } = App.useApp()
  const { somenteLeitura } = useSession()
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Modal "Reabrir pesquisa"
  const [reopen, setReopen] = useState<SurveyRow | null>(null)
  const [scheduleEnd, setScheduleEnd] = useState(true)
  const [newEndDate, setNewEndDate] = useState<Dayjs | null>(null)
  const [dateError, setDateError] = useState(false)

  const scrollNext = () => {
    scrollerRef.current?.scrollBy({ left: 360, behavior: 'smooth' })
  }

  const deleteDraft = (draft: Draft) => {
    modal.confirm({
      title: 'Excluir rascunho',
      content: `Excluir "${draft.title}"?`,
      okText: 'Excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
    })
  }

  const duplicateSurvey = () => {
    modal.confirm({
      title: 'Deseja duplicar essa pesquisa?',
      icon: <WarningCircle weight="fill" style={{ color: brand.warning }} />,
      content: 'Uma cópia da pesquisa será criada como rascunho.',
      okText: 'OK',
      cancelText: 'Cancelar',
      onOk: () => message.success('Cópia criada como rascunho.'),
    })
  }

  const openReopen = (row: SurveyRow) => {
    setReopen(row)
    setScheduleEnd(true)
    setNewEndDate(null)
    setDateError(false)
  }

  const confirmReopen = () => {
    if (scheduleEnd && !newEndDate) {
      setDateError(true)
      return
    }
    setReopen(null)
    message.success('Pesquisa reaberta.')
  }

  const columns: TableProps<SurveyRow>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      render: (nome: string) => <Text style={{ color: '#1f1f1f' }}>{nome}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SurveyStatus) => <StatusTag status={status} />,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (tipo: SurveyTipo) =>
        tipo === 'recorrente' ? (
          <Tag color="blue" icon={<ArrowsClockwise />}>
            Recorrente
          </Tag>
        ) : (
          <Tag>Única</Tag>
        ),
    },
    { title: 'Data de lançamento', dataIndex: 'lancamento', key: 'lancamento' },
    { title: 'Data de encerramento', dataIndex: 'encerramento', key: 'encerramento' },
    {
      title: 'Taxa de resposta (%)',
      dataIndex: 'taxa',
      key: 'taxa',
      width: 240,
      render: (taxa: number) => (
        <Space size={12} style={{ width: '100%' }}>
          <Progress
            percent={taxa}
            showInfo={false}
            strokeColor={brand.primary}
            trailColor="#e9e9e9"
            strokeLinecap="round"
            style={{ width: 150, marginBottom: 0 }}
          />
          <Text style={{ color: brand.textMuted }}>{taxa}%</Text>
        </Space>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 160,
      render: (_, row) => (
        <Space size={8}>
          <Button
            shape="circle"
            icon={<ChartBar />}
            title="Ver estatísticas"
            onClick={() => navigate(`/pesquisa/${row.key}?tipo=${row.tipo}`)}
          />
          <Button
            shape="circle"
            icon={<Copy />}
            title="Duplicar"
            onClick={duplicateSurvey}
          />
          <Button
            shape="circle"
            icon={<ArrowClockwise />}
            title="Reabrir"
            onClick={() => openReopen(row)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto' }}>
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
          <Title level={2} style={{ marginBottom: 4 }}>
            Pesquisas
          </Title>
          <Text style={{ fontSize: 16, color: brand.textMuted }}>
            Gerencie todas as pesquisas da sua empresa
          </Text>
        </div>
        {!somenteLeitura && (
          <Button
            type="primary"
            icon={<Plus />}
            onClick={() => navigate('/pesquisas/criar')}
          >
            Pesquisa
          </Button>
        )}
      </div>


      {/* Rascunhos — ocultos para perfil somente leitura (AC_04) */}
      {!somenteLeitura && (
        <Card
          style={{ marginTop: 24 }}
          title={
            <Space>
              <Text strong style={{ fontSize: 16 }}>
                Rascunhos
              </Text>
              <Badge
                count={drafts.length}
                style={{ backgroundColor: brand.infoBg, color: brand.primary, boxShadow: 'none' }}
              />
            </Space>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              ref={scrollerRef}
              style={{
                display: 'flex',
                gap: 16,
                overflowX: 'auto',
                flex: 1,
                paddingBottom: 4,
                scrollbarWidth: 'none',
              }}
            >
              {drafts.map((d) => (
                <DraftCard
                  key={d.id}
                  draft={d}
                  onOpen={() => navigate(`/pesquisas/rascunho/${d.id}`)}
                  onDelete={() => deleteDraft(d)}
                />
              ))}
            </div>
            <Button shape="circle" icon={<CaretRight />} onClick={scrollNext} />
          </div>
        </Card>
      )}

      {/* Lista */}
      <Card style={{ marginTop: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Space size={12} wrap>
            <Select
              placeholder="Status"
              style={{ width: 180 }}
              allowClear
              options={[
                { value: 'ativa', label: 'Ativa' },
                { value: 'concluida', label: 'Concluída' },
                // "Rascunho" indisponível para perfil somente leitura (AC_04)
                ...(somenteLeitura ? [] : [{ value: 'rascunho', label: 'Rascunho' }]),
              ]}
            />
            <RangePicker placeholder={['Data inicial', 'Data final']} format="DD/MM/YYYY" />
          </Space>
          <Space size={12} wrap>
            {/* Seletor de empresa ao lado da busca (RN_03 / AC_01/03) */}
            <EmpresaSelector />
            <Space.Compact style={{ width: 320, maxWidth: '100%' }}>
              <Input placeholder="Pesquisar..." allowClear />
              <Button icon={<MagnifyingGlass />} />
            </Space.Compact>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={surveys}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
        />
      </Card>

      {/* Modal: Reabrir pesquisa */}
      <Modal
        title="Reabrir pesquisa"
        open={reopen !== null}
        onCancel={() => setReopen(null)}
        onOk={confirmReopen}
        okText="Reabrir pesquisa"
        cancelText="Cancelar"
      >
        <Checkbox
          checked={scheduleEnd}
          onChange={(e) => setScheduleEnd(e.target.checked)}
          style={{ marginBottom: 4 }}
        >
          Agendar data de encerramento
        </Checkbox>
        <div style={{ color: brand.textMuted, fontSize: 13, marginBottom: 20 }}>
          Os respondentes não terão mais acesso à pesquisa na data agendada
        </div>

        {scheduleEnd && (
          <>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              <span style={{ color: brand.danger, marginRight: 4 }}>*</span>
              Nova data de encerramento
            </div>
            <DatePicker
              placeholder="Selecionar data"
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              status={dateError ? 'error' : undefined}
              value={newEndDate}
              onChange={(d) => {
                setNewEndDate(d)
                if (d) setDateError(false)
              }}
            />
            {dateError && (
              <div style={{ color: brand.danger, fontSize: 13, marginTop: 6 }}>
                Selecione a nova data de encerramento.
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  )
}
