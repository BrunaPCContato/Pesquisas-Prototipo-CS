import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Card, Tag, Segmented, Row, Col, Space, App } from 'antd'
import {
  CaretLeft,
  Plus,
  SealCheck,
} from '@phosphor-icons/react'
import { brand } from '../theme'

const { Title, Text, Paragraph } = Typography

type Template = {
  id: number
  name: string
  questions: number
  description: string
  gradient: string
  scope: 'cs' | 'meus'
}

const templates: Template[] = [
  {
    id: 1,
    name: 'Clima Organizacional',
    questions: 10,
    description:
      'Diagnóstico abrangente do ambiente, cultura e processos internos. Ajuda a identificar a saúde organizacional e pontos de melhoria no dia a dia da equipe.',
    gradient: 'linear-gradient(135deg, #7c8db5 0%, #263072 100%)',
    scope: 'cs',
  },
  {
    id: 2,
    name: 'Pulso / Engajamento',
    questions: 6,
    description:
      'Mede a motivação, satisfação e o vínculo do colaborador em tempo real. Ideal para acompanhamento rápido e recorrente do engajamento do time.',
    gradient: 'linear-gradient(135deg, #5cb8e6 0%, #263072 100%)',
    scope: 'cs',
  },
  {
    id: 3,
    name: 'eNPS',
    questions: 4,
    description:
      'Employee Net Promoter Score: mede o quanto os colaboradores recomendariam a empresa como um bom lugar para trabalhar.',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #237804 100%)',
    scope: 'cs',
  },
  {
    id: 4,
    name: 'Bem-Estar e Saúde Mental',
    questions: 8,
    description:
      'Avalia níveis de estresse, sobrecarga e bem-estar emocional da equipe, apoiando ações de cuidado e prevenção.',
    gradient: 'linear-gradient(135deg, #9254de 0%, #391085 100%)',
    scope: 'cs',
  },
  {
    id: 5,
    name: 'Avaliação de Liderança',
    questions: 12,
    description:
      'Coleta a percepção da equipe sobre a atuação das lideranças, identificando forças e oportunidades de desenvolvimento.',
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #ad4e00 100%)',
    scope: 'meus',
  },
]

function VerifiedName({ name }: { name: string }) {
  return (
    <Space size={6} align="center">
      <Text strong style={{ fontSize: 18, color: brand.primary }}>
        {name}
      </Text>
      <SealCheck weight="fill" style={{ color: brand.primary, fontSize: 15 }} />
    </Space>
  )
}

export default function CriarPesquisa() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [filter, setFilter] = useState<string>('Todos')

  const visible = templates.filter((t) => {
    if (filter === 'Modelos Contato Seguro') return t.scope === 'cs'
    if (filter === 'Meus modelos') return t.scope === 'meus'
    return true
  })

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

      <Title level={2} style={{ marginBottom: 4 }}>
        Criar pesquisa
      </Title>
      <Text style={{ fontSize: 16, color: brand.textMuted }}>
        Comece com uma pesquisa em branco ou use um de nossos modelos para agilizar o processo
      </Text>

      {/* Filtro */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 32,
          marginBottom: 24,
        }}
      >
        <Segmented
          value={filter}
          onChange={(v) => setFilter(v as string)}
          options={['Todos', 'Modelos Contato Seguro', 'Meus modelos']}
        />
        <Button icon={<Plus />} onClick={() => message.info('Novo modelo')}>
          Modelo
        </Button>
      </div>

      {/* Grid de cards */}
      <Row gutter={[24, 24]}>
        {/* Pesquisa em branco */}
        {filter !== 'Meus modelos' && (
          <Col xs={24} sm={12} lg={8}>
            <Card
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              styles={{ body: { display: 'flex', flexDirection: 'column', flex: 1 } }}
            >
              <div
                style={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus style={{ fontSize: 64, color: '#8c8c8c' }} />
              </div>
              <Text strong style={{ fontSize: 18, color: brand.primary }}>
                Pesquisa em branco
              </Text>
              <Text type="secondary" style={{ marginTop: 4, marginBottom: 20 }}>
                Sem perguntas pré-definidas.
              </Text>
              <Button
                block
                style={{ marginTop: 'auto' }}
                onClick={() => navigate('/pesquisas/nova')}
              >
                Criar
              </Button>
            </Card>
          </Col>
        )}

        {/* Modelos */}
        {visible.map((tpl) => (
          <Col xs={24} sm={12} lg={8} key={tpl.id}>
            <Card
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              styles={{ body: { display: 'flex', flexDirection: 'column', flex: 1 } }}
              cover={<div style={{ height: 180, background: tpl.gradient }} />}
            >
              <Tag
                style={{
                  background: brand.infoBg,
                  color: brand.primary,
                  border: '1px solid #adc6ff',
                  borderRadius: 12,
                  marginBottom: 12,
                  width: 'fit-content',
                }}
              >
                {tpl.questions} perguntas
              </Tag>
              <VerifiedName name={tpl.name} />
              <Paragraph
                type="secondary"
                ellipsis={{ rows: 3 }}
                style={{ marginTop: 8, marginBottom: 20 }}
              >
                {tpl.description}
              </Paragraph>
              <Button
                block
                style={{ marginTop: 'auto' }}
                onClick={() => navigate(`/pesquisas/nova?modelo=${tpl.id}`)}
              >
                Usar modelo
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
