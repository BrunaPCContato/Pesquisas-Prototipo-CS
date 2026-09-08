import { useState } from 'react'
import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Checkbox,
  Space,
  Tooltip,
  Tag,
} from 'antd'
import {
  MicrosoftExcelLogo,
  Funnel,
  Smiley,
  UsersThree,
  FileText,
  Info,
} from '@phosphor-icons/react'
import { Line, Column, Bar, Rose } from '@ant-design/plots'
import { brand } from '../theme'
import EmpresaSelector from '../components/EmpresaSelector'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const periodos = [
  'Últimos 12 meses',
  'Últimos 90 dias',
  'Últimos 30 dias',
  'Últimos 7 dias',
  'Últimas 24 horas',
  'Todo o período',
]

const vinculoOptions = ['Colaborador', 'Ex-colaborador', 'Cliente', 'Fornecedor', 'Terceiro', 'Cooperado']

// --- Dados mock ---
const evolucaoData = [
  { mes: 'Dez 2025', valor: 5 },
  { mes: 'Jan 2026', valor: 72 },
  { mes: 'Fev 2026', valor: 66 },
  { mes: 'Mar 2026', valor: 95 },
  { mes: 'Abr 2026', valor: 80 },
  { mes: 'Mai 2026', valor: 58 },
  { mes: 'Jun 2026', valor: 70 },
  { mes: 'Jul 2026', valor: 74 },
  { mes: 'Ago 2026', valor: 61 },
]

const deptData = [
  { dep: 'Departamento teste', score: 52 },
  { dep: 'Departamento de Finanças', score: 54 },
  { dep: 'Departamento de RH', score: 86 },
  { dep: 'departamento vazio', score: 87 },
]

const lowestData = [
  { pergunta: 'Sinto que a liderança reconhece meu trabalho', score: 18 },
  { pergunta: 'Tenho clareza sobre meu plano de carreira', score: 24 },
  { pergunta: 'A comunicação entre áreas é eficaz', score: 29 },
  { pergunta: 'Recebo feedback com frequência', score: 33 },
  { pergunta: 'Meu equilíbrio entre vida e trabalho é respeitado', score: 37 },
]

const dimData = [
  { dimensao: 'Segurança Psicológica', valor: 62 },
  { dimensao: 'Riscos', valor: 48 },
  { dimensao: 'Diversidade e Inclusão', valor: 71 },
  { dimensao: 'Reconhecimento e Valorização', valor: 40 },
  { dimensao: 'Carreira e Desenvolvimento', valor: 55 },
  { dimensao: 'Eficácia operacional e Processos', valor: 66 },
  { dimensao: 'Cultura e Pertencimento', valor: 58 },
  { dimensao: 'Bem-estar e Saúde mental', valor: 45 },
  { dimensao: 'Reputação e Marca empregadora', valor: 90 },
  { dimensao: 'Engajamento e Retenção', valor: 52 },
  { dimensao: 'Ética e Respeito', valor: 60 },
  { dimensao: 'Liderança Humanizada', valor: 44 },
  { dimensao: 'Liderança', valor: 63 },
  { dimensao: 'Ciclo de trabalho', valor: 50 },
]

const meses = ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago']
const climaVsRelatos = meses.flatMap((mes, i) => [
  { mes, tipo: 'Índice de clima', valor: [55, 60, 72, 60, 95, 80][i] },
  { mes, tipo: 'Relatos recebidos', valor: [10, 18, 12, 22, 30, 16][i] },
])

type KpiProps = { value: string; label: string; icon: React.ReactNode; bg: string; color: string }
function KpiCard({ value, label, icon, bg, color }: KpiProps) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 34, fontWeight: 700, color: '#1f1f1f', lineHeight: 1.1 }}>
            {value}
          </div>
          <Text style={{ color: brand.textMuted, fontSize: 15 }}>{label}</Text>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: bg,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}

const pesquisaOptions = [
  { value: 'clima', label: 'Clima Organizacional' },
  { value: 'pulso', label: 'Pulso / Engajamento' },
  { value: 'enps', label: 'eNPS' },
]

export default function Estatisticas() {
  const [periodo, setPeriodo] = useState('Todo o período')
  const [pesquisa, setPesquisa] = useState<string | undefined>()
  const [vinculos, setVinculos] = useState<string[]>([])

  const pesquisaLabel = pesquisa
    ? pesquisaOptions.find((o) => o.value === pesquisa)?.label
    : 'Todas as pesquisas'
  const periodoAplicado = periodo !== 'Todo o período'
  const vinculoAplicado = vinculos.length > 0
  const hasFiltro = periodoAplicado || !!pesquisa || vinculoAplicado

  // Tooltip de origem dos dados de cada gráfico
  const DataOrigin = ({ origem }: { origem: string }) => (
    <div style={{ lineHeight: 1.7 }}>
      <div>
        <b>Origem:</b> {origem}
      </div>
      <div>
        <b>Pesquisa:</b> {pesquisaLabel}
      </div>
      <div>
        <b>Período:</b> {periodo}
      </div>
      <div>
        <b>Departamento/vínculo:</b>{' '}
        {vinculoAplicado ? vinculos.join(', ') : 'Nenhum filtro aplicado'}
      </div>
    </div>
  )

  const ChartTitle = ({ title, origem }: { title: string; origem: string }) => (
    <Space size={8} align="center">
      <span>{title}</span>
      <Tooltip title={<DataOrigin origem={origem} />}>
        <Info
          style={{ color: hasFiltro ? brand.primary : brand.textMuted, fontSize: 15 }}
        />
      </Tooltip>
      {hasFiltro && (
        <Tag color="blue" style={{ marginInlineStart: 4 }}>
          Filtros aplicados
        </Tag>
      )}
    </Space>
  )

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Estatísticas
          </Title>
          <Text style={{ fontSize: 16, color: brand.textMuted }}>
            Dashboard completo com a análise de pesquisas da sua empresa
          </Text>
        </div>
        <Space size={12} wrap>
          <EmpresaSelector />
          <Button type="primary" icon={<MicrosoftExcelLogo />}>
            Exportar relatório
          </Button>
        </Space>
      </div>

      <Row gutter={24}>
        {/* Filtros */}
        <Col xs={24} lg={6}>
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <Funnel />
              <Text strong style={{ fontSize: 16 }}>
                Filtros
              </Text>
            </Space>

            <Card size="small" title="Período" style={{ marginBottom: 16 }}>
              <RangePicker
                placeholder={['Data inicial', 'Data final']}
                format="DD/MM/YYYY"
                style={{ width: '100%', marginBottom: 12 }}
              />
              <Space direction="vertical" style={{ width: '100%' }}>
                {periodos.map((p) => (
                  <Button
                    key={p}
                    block
                    type={periodo === p ? 'primary' : 'default'}
                    onClick={() => setPeriodo(p)}
                  >
                    {p}
                  </Button>
                ))}
              </Space>
            </Card>

            <Card size="small" title="Pesquisa específica" style={{ marginBottom: 16 }}>
              <Select
                placeholder="Selecione"
                style={{ width: '100%' }}
                allowClear
                value={pesquisa}
                onChange={setPesquisa}
                options={pesquisaOptions}
              />
            </Card>

            <Card size="small" title="Departamento / vínculo">
              <Checkbox.Group
                style={{ width: '100%' }}
                value={vinculos}
                onChange={(v) => setVinculos(v as string[])}
              >
                <Space direction="vertical">
                  {vinculoOptions.map((v) => (
                    <Checkbox key={v} value={v}>
                      {v}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </Card>
          </Card>
        </Col>

        {/* Conteúdo */}
        <Col xs={24} lg={18}>
          {/* KPIs */}
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <KpiCard
              value="61.59"
              label="Índice de Clima Geral (ICG)"
              icon={<Smiley />}
              bg="#fff0f6"
              color="#eb2f96"
            />
            <KpiCard
              value="19.15%"
              label="Taxa Média de Adesão (TMA)"
              icon={<UsersThree />}
              bg={brand.infoBg}
              color="#4a90e2"
            />
            <KpiCard
              value="100"
              label="Total de Relatos Recebidos (TRR)"
              icon={<FileText />}
              bg="#f9f0ff"
              color="#722ed1"
            />
          </Space>

          {/* Evolução do clima */}
          <Card
            title={
              <ChartTitle
                title="Evolução do clima ao longo do tempo"
                origem="Índice de clima geral por mês, agregando todas as pesquisas do período."
              />
            }
            style={{ marginTop: 16 }}
          >
            <Line
              data={evolucaoData}
              xField="mes"
              yField="valor"
              height={280}
              style={{ stroke: brand.primary, lineWidth: 2 }}
              point={{ sizeField: 4, style: { fill: brand.primary } }}
              scale={{ y: { domainMin: 0, domainMax: 100 } }}
              axis={{ y: { title: null } }}
            />
          </Card>

          {/* Índice de clima por departamento */}
          <Card
            title={
              <ChartTitle
                title="Índice de clima por departamento"
                origem="Score médio por departamento, agregando as pesquisas do período."
              />
            }
            style={{ marginTop: 16 }}
          >
            <Column
              data={deptData}
              xField="dep"
              yField="score"
              height={360}
              style={{ fill: (d: { score: number }) => (d.score < 60 ? '#3d4491' : '#7ac143') }}
              scale={{ y: { domainMin: 0, domainMax: 90 } }}
              axis={{ y: { title: 'Score' }, x: { title: 'Departamento' } }}
            />
          </Card>

          {/* Perguntas com menor score */}
          <Card
            title={
              <ChartTitle
                title="Perguntas com menor score"
                origem="Perguntas com menor média, considerando as respostas do período."
              />
            }
            style={{ marginTop: 16 }}
          >
            <Bar
              data={lowestData}
              xField="pergunta"
              yField="score"
              height={300}
              style={{ fill: brand.chartBar, maxBarWidth: 28 }}
              scale={{ y: { domainMin: 0, domainMax: 100 } }}
              axis={{ x: { title: null }, y: { title: 'Score' } }}
            />
          </Card>

          {/* Resultados por dimensão */}
          <Card
            title={
              <ChartTitle
                title="Resultados por dimensão"
                origem="Score médio por dimensão, agregando todas as pesquisas do período."
              />
            }
            style={{ marginTop: 16 }}
          >
            <Rose
              data={dimData}
              xField="dimensao"
              yField="valor"
              colorField="dimensao"
              radius={0.9}
              height={420}
              legend={{ color: { position: 'left', rowPadding: 4 } }}
              scale={{ y: { domainMin: 0, domainMax: 100 } }}
            />
          </Card>

          {/* Índice de clima vs relatos */}
          <Card
            title={
              <ChartTitle
                title="Índice de clima vs. N° de relatos recebidos"
                origem="Comparativo mensal entre índice de clima e volume de relatos no período."
              />
            }
            style={{ marginTop: 16 }}
          >
            <Column
              data={climaVsRelatos}
              xField="mes"
              yField="valor"
              colorField="tipo"
              group
              height={320}
              scale={{ color: { range: ['#eb2f96', '#722ed1'] }, y: { domainMin: 0, domainMax: 100 } }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
