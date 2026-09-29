import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Typography,
  Card,
  Table,
  Tag,
  Input,
  Button,
  Space,
  Row,
  Col,
  Modal,
  Form,
  Select,
  DatePicker,
  Segmented,
  FloatButton,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { MagnifyingGlass, Plus, Question, Target, CheckCircle } from '@phosphor-icons/react'
import { brand } from '../theme'
import {
  planosAcao,
  corStatusPlano,
  bancoPessoas,
  categoriasPlano,
  dimensoesPesquisa,
  pesquisasFonte,
  type PlanoAcao,
} from '../data/planos'

const { Title, Text } = Typography

const colunas: ColumnsType<PlanoAcao> = [
  {
    title: 'Título',
    dataIndex: 'titulo',
    render: (t: string, row) => (
      <Link to={`/plano/${row.id}`} style={{ fontWeight: 600, color: brand.primary }}>
        {t}
      </Link>
    ),
  },
  { title: 'Responsável', dataIndex: 'responsavel' },
  {
    title: 'Categoria',
    dataIndex: 'categoria',
    render: (c: string) => <Tag>{c}</Tag>,
  },
  {
    title: 'Fonte',
    dataIndex: 'fonte',
    render: (f: string) => <Text style={{ color: brand.textMuted, fontSize: 13 }}>{f}</Text>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (s: PlanoAcao['status']) => <Tag color={corStatusPlano[s]}>{s}</Tag>,
  },
  { title: 'Data de início', dataIndex: 'inicio', width: 130 },
  { title: 'Prazo', dataIndex: 'prazo', width: 130 },
]

export default function PlanosAcao() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [busca, setBusca] = useState('')
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const criarPlano = async () => {
    await form.validateFields()
    setOpen(false)
    form.resetFields()
    message.success('Plano de ação criado com sucesso.')
  }

  const dados = planosAcao.filter(
    (p) =>
      p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      p.responsavel.toLowerCase().includes(busca.toLowerCase()) ||
      p.fonte.toLowerCase().includes(busca.toLowerCase()),
  )

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
          <Space align="center" size={10}>
            <Target weight="fill" style={{ color: brand.primary, fontSize: 26 }} />
            <Title level={2} style={{ margin: 0 }}>
              Planos de ação
            </Title>
          </Space>
          <Text style={{ fontSize: 16, color: brand.textMuted, display: 'block', marginTop: 4 }}>
            Acompanhe os planos de ação criados a partir dos resultados das pesquisas.
          </Text>
        </div>
        <Button type="primary" size="large" icon={<Plus />} onClick={() => setOpen(true)}>
          Plano de ação
        </Button>
      </div>

      {/* Lista de planos */}
      <Card style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Input
            prefix={<MagnifyingGlass style={{ color: brand.textMuted }} />}
            placeholder="Pesquisar..."
            allowClear
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: 280 }}
          />
        </div>
        <Table
          rowKey="id"
          size="middle"
          columns={colunas}
          dataSource={dados}
          onRow={(row) => ({
            onClick: () => navigate(`/plano/${row.id}`),
            style: { cursor: 'pointer' },
          })}
          pagination={false}
          scroll={{ x: 900 }}
          locale={{ emptyText: 'Nenhum plano de ação encontrado' }}
        />
      </Card>

      {/* Modal: criar plano de ação */}
      <Modal
        title="Criar plano de ação"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={criarPlano}
        okText="Criar"
        cancelText="Cancelar"
        width={560}
        destroyOnHidden
      >
        <Text type="secondary">
          Defina o plano de ação, vinculando-o a uma pesquisa como fonte.
        </Text>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ aprovacao: 'sim' }}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="titulo"
            label="Título do plano"
            rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
          >
            <Input placeholder="Ex: Melhorar confiança e sigilo na equipe" />
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
                name="fonte"
                label="Pesquisa (fonte)"
                rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
              >
                <Select
                  placeholder="Selecione a pesquisa"
                  options={pesquisasFonte.map((p) => ({ value: p, label: p }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dimensao"
                label="Dimensão (recorte)"
                rules={[{ required: true, message: 'Campo de preenchimento obrigatório' }]}
              >
                <Select
                  placeholder="Selecione a dimensão"
                  options={dimensoesPesquisa.map((d) => ({ value: d, label: d }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              margin: '-4px 0 16px',
            }}
          >
            <CheckCircle weight="fill" style={{ color: brand.success }} />
            <Text style={{ fontSize: 12, color: brand.textMuted }}>
              Recorte com anonimato preservado (mínimo de 3 respostas).
            </Text>
          </div>

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
