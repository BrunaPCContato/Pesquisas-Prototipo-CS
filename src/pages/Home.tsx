import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Collapse,
  List,
  Badge,
  Space,
  FloatButton,
} from 'antd'
import {
  WifiHigh,
  ChartLine,
  Plus,
  ListChecks,
  ChartPie,
  Question,
  WarningCircle,
} from '@phosphor-icons/react'
import { brand } from '../theme'
import TasksBlock from '../components/TasksBlock'
import PlanoTasksBlock from '../components/PlanoTasksBlock'
import EmpresaSelector from '../components/EmpresaSelector'

const { Title, Text } = Typography

type MetricProps = {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  value: string
  label: string
}

function MetricCard({ icon, iconBg, iconColor, value, label }: MetricProps) {
  return (
    <Card>
      <Space size={20} align="center">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
          }}
        >
          {icon}
        </div>
        <Statistic
          value={value}
          valueStyle={{ fontSize: 40, fontWeight: 700, color: brand.primary }}
          title={<span style={{ fontSize: 16, color: brand.textMuted }}>{label}</span>}
        />
      </Space>
    </Card>
  )
}

const quickActions = [
  { key: 'nova', icon: <Plus />, label: 'Pesquisa', to: '/pesquisas/criar' },
  { key: 'gerenciar', icon: <ListChecks />, label: 'Gerenciar pesquisas', to: '/pesquisas' },
  { key: 'estatisticas', icon: <ChartPie />, label: 'Acessar estatísticas', to: '/estatisticas' },
  { key: 'suporte', icon: <Question />, label: 'Consultar suporte' },
]

type Attention = { id: number; title: string; highlight: string; description: string }

const attentionPoints: Attention[] = [
  {
    id: 1,
    title: 'Score baixo no departamento',
    highlight: 'Departamento teste',
    description:
      'O departamento apresenta score de 25/100 na pesquisa "tst encerramento", sinalizando possíveis problemas específicos na área',
  },
  {
    id: 2,
    title: 'Desempenho crítico na pergunta',
    highlight: 'ff',
    description:
      'O score da pergunta "ff" está 18.75/100 na pesquisa "tst encerramento", destacando um possível ponto de insatisfação',
  },
  {
    id: 3,
    title: 'Baixa adesão na pesquisa',
    highlight: 'Clima 2026',
    description:
      'A pesquisa "Clima 2026" está com 9% de adesão, abaixo da meta mínima recomendada de 30%',
  },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div style={{ maxWidth: 1360, margin: '0 auto' }}>
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
            Olá, Bruna Pereira!
          </Title>
          <Text style={{ fontSize: 16, color: brand.textMuted }}>
            Acompanhe as principais métricas e pesquisas da sua empresa
          </Text>
        </div>
        <EmpresaSelector />
      </div>

      {/* Métricas */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <MetricCard
            icon={<WifiHigh />}
            iconBg={brand.successBg}
            iconColor={brand.success}
            value="12"
            label="Pesquisas ativas"
          />
        </Col>
        <Col xs={24} lg={12}>
          <MetricCard
            icon={<ChartLine />}
            iconBg={brand.infoBg}
            iconColor={brand.primary}
            value="18.52%"
            label="Taxa Média de Adesão (TMA)"
          />
        </Col>
      </Row>

      {/* Ações rápidas */}
      <Card title="Ações rápidas" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col xs={24} sm={12} lg={6} key={action.key}>
              <Button
                block
                size="large"
                icon={action.icon}
                onClick={() => action.to && navigate(action.to)}
              >
                {action.label}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Tarefas */}
      <div style={{ marginTop: 24 }}>
        <TasksBlock />
      </div>

      {/* Minhas tarefas em planos de ação */}
      <div style={{ marginTop: 24 }}>
        <PlanoTasksBlock />
      </div>

      {/* Pontos de atenção */}
      <Collapse
        defaultActiveKey={['atencao']}
        style={{ marginTop: 24, background: '#fff' }}
        items={[
          {
            key: 'atencao',
            label: (
              <Space>
                <Text strong style={{ fontSize: 16 }}>
                  Pontos de atenção
                </Text>
                <Badge
                  count={14}
                  style={{
                    backgroundColor: brand.warningBg,
                    color: brand.warning,
                    fontWeight: 600,
                    boxShadow: 'none',
                  }}
                />
              </Space>
            ),
            children: (
              <List
                itemLayout="horizontal"
                dataSource={attentionPoints}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        key="acessar"
                        style={{ paddingInline: 0 }}
                        onClick={() => navigate(`/pesquisa/${item.id}`)}
                      >
                        Acessar pesquisa
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: brand.warningBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <WarningCircle
                            weight="fill"
                            style={{ color: brand.warning, fontSize: 18 }}
                          />
                        </div>
                      }
                      title={
                        <span style={{ fontWeight: 600, color: brand.primary }}>
                          {item.title} <strong>{item.highlight}</strong>
                        </span>
                      }
                      description={
                        <Text style={{ color: brand.textMuted }}>{item.description}</Text>
                      }
                    />
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />

      <FloatButton
        icon={<Question />}
        type="primary"
        tooltip="Ajuda"
      />
    </div>
  )
}
