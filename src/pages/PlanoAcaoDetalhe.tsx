import { useNavigate, useParams } from 'react-router-dom'
import {
  Typography,
  Tag,
  Button,
  Space,
  Card,
  Row,
  Col,
  Input,
  Table,
  Dropdown,
  FloatButton,
  Empty,
  App,
} from 'antd'
import type { MenuProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  CaretLeft,
  DotsThreeVertical,
  Plus,
  Question,
  MagnifyingGlass,
  PencilSimple,
  Trash,
} from '@phosphor-icons/react'
import { brand } from '../theme'
import { planosAcao, corStatusPlano, corStatusTarefa, type Tarefa } from '../data/planos'

const { Title, Text, Paragraph } = Typography

/** Campo somente-leitura (label + valor em caixa branca), como no módulo real. */
function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ color: brand.primary, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  )
}

function CampoTexto({ label, value }: { label: string; value: string }) {
  return (
    <Campo label={label}>
      <Input value={value} readOnly variant="outlined" style={{ background: '#fff' }} />
    </Campo>
  )
}

const tarefaColumns: ColumnsType<Tarefa> = [
  {
    title: 'Título',
    dataIndex: 'titulo',
    onCell: () => ({ style: { borderLeft: `3px solid ${brand.warning}` } }),
    render: (t: string) => <Text style={{ fontWeight: 600, color: brand.primary }}>{t}</Text>,
  },
  { title: 'Responsável', dataIndex: 'responsavel' },
  {
    title: 'Categoria',
    dataIndex: 'categoria',
    render: (c?: string) => (c ? <Tag>{c}</Tag> : <Text type="secondary">-</Text>),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (s: Tarefa['status']) => <Tag color={corStatusTarefa[s]}>{s}</Tag>,
  },
  { title: 'Data de início', dataIndex: 'inicio', width: 130 },
  { title: 'Prazo', dataIndex: 'prazo', width: 130 },
  {
    title: '',
    key: 'acoes',
    width: 56,
    render: () => (
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            { key: 'editar', icon: <PencilSimple />, label: 'Editar' },
            { key: 'excluir', icon: <Trash />, label: 'Excluir', danger: true },
          ],
        }}
      >
        <Button type="text" icon={<DotsThreeVertical />} />
      </Dropdown>
    ),
  },
]

export default function PlanoAcaoDetalhe() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { message } = App.useApp()
  const plano = planosAcao.find((p) => p.id === Number(id))

  if (!plano) {
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
        <Empty description="Plano de ação não encontrado" style={{ marginTop: 80 }} />
      </div>
    )
  }

  const moreActions: MenuProps['items'] = [
    { key: 'editar', icon: <PencilSimple />, label: 'Editar' },
    { type: 'divider' },
    { key: 'excluir', icon: <Trash />, label: 'Excluir', danger: true },
  ]

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
          <Space align="center" size={12} wrap>
            <Title level={3} style={{ margin: 0 }}>
              {plano.titulo}
            </Title>
            <Tag color={corStatusPlano[plano.status]} style={{ borderRadius: 12 }}>
              {plano.status}
            </Tag>
          </Space>
          <div style={{ color: brand.textMuted, marginTop: 4 }}>ID do plano: #{plano.id}</div>
        </div>
        <Dropdown menu={{ items: moreActions }} trigger={['click']}>
          <Button icon={<DotsThreeVertical />} />
        </Dropdown>
      </div>

      {/* Detalhes do plano */}
      <Card title="Detalhes do plano de ação" style={{ marginTop: 16 }}>
        <Paragraph style={{ color: brand.textMuted }}>
          Nesta seção você pode visualizar as informações deste plano de ação: responsável, status
          atual, categoria, prazos e descrição. Em seguida, a listagem das tarefas necessárias para
          a realização do plano.
        </Paragraph>

        <div
          style={{
            background: '#eaf4fb',
            border: '1px solid #d6eaf7',
            borderRadius: 10,
            padding: 20,
            marginTop: 8,
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <CampoTexto label="Responsável" value={plano.responsavel} />
            </Col>
            <Col xs={24} md={12}>
              <CampoTexto label="Status" value={plano.status} />
            </Col>

            <Col xs={24} md={12}>
              <CampoTexto label="Categoria" value={plano.categoria || 'Não informado'} />
            </Col>
            <Col xs={12} md={6}>
              <CampoTexto label="Data de início" value={plano.inicio} />
            </Col>
            <Col xs={12} md={6}>
              <CampoTexto label="Prazo de conclusão" value={plano.prazo} />
            </Col>

            <Col xs={24}>
              <Campo label="Pesquisa vinculada (fonte)">
                <Tag color="blue" style={{ padding: '4px 10px', fontSize: 13 }}>
                  {plano.fonte}
                </Tag>
              </Campo>
            </Col>

            <Col xs={24}>
              <Campo label="Descrição">
                <Input.TextArea value={plano.descricao} readOnly autoSize={{ minRows: 2 }} style={{ background: '#fff' }} />
              </Campo>
            </Col>

            <Col xs={24}>
              <Campo label="Requer aprovação do dono para conclusão?">
                <Text style={{ color: '#1f1f1f' }}>{plano.requerAprovacao ? 'Sim' : 'Não'}</Text>
              </Campo>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Tarefas */}
      <Card style={{ marginTop: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            Tarefas
          </Text>
          <Space size={8} wrap>
            <Input
              prefix={<MagnifyingGlass style={{ color: brand.textMuted }} />}
              placeholder="Pesquisar..."
              style={{ width: 240 }}
            />
            <Button
              type="primary"
              icon={<Plus />}
              onClick={() => message.info('Adicionar nova tarefa.')}
            >
              Tarefa
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          size="middle"
          columns={tarefaColumns}
          dataSource={plano.tarefas}
          pagination={false}
          scroll={{ x: 800 }}
          locale={{ emptyText: 'Nenhuma tarefa cadastrada' }}
        />
      </Card>

      <FloatButton icon={<Question />} type="primary" tooltip="Ajuda" />
    </div>
  )
}
