import { useNavigate } from 'react-router-dom'
import { Card, Carousel, Typography, Space, Tag, Badge } from 'antd'
import { CalendarBlank } from '@phosphor-icons/react'
import { brand } from '../theme'
import { tarefasDosPlanos, corStatusTarefa, type TarefaComPlano } from '../data/planos'

const { Text, Paragraph } = Typography

// Tarefas de planos de ação que a pessoa ainda precisa concluir.
const minhasTarefas = tarefasDosPlanos().filter((t) => t.status !== 'Concluído')

function TarefaCard({ t, onClick }: { t: TarefaComPlano; onClick: () => void }) {
  return (
    <Card
      size="small"
      hoverable
      onClick={onClick}
      style={{ height: '100%' }}
      styles={{ body: { padding: 16 } }}
    >
      <Text
        strong
        ellipsis
        style={{ display: 'block', color: brand.primary, fontSize: 15 }}
        title={t.titulo}
      >
        {t.titulo}
      </Text>
      <Paragraph
        type="secondary"
        ellipsis={{ rows: 2 }}
        style={{ marginTop: 6, marginBottom: 12, minHeight: 44 }}
        title={t.planoTitulo}
      >
        Plano: {t.planoTitulo}
      </Paragraph>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <Space size={6}>
          <CalendarBlank style={{ color: brand.textMuted }} />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t.prazo}
          </Text>
        </Space>
        <Tag color={corStatusTarefa[t.status]} style={{ marginInlineEnd: 0 }}>
          {t.status}
        </Tag>
      </div>
    </Card>
  )
}

export default function PlanoTasksBlock() {
  const navigate = useNavigate()

  return (
    <Card
      title={
        <Space size={8}>
          Minhas tarefas em planos de ação
          <Badge
            count={minhasTarefas.length}
            style={{ backgroundColor: '#eef0f8', color: brand.primary, boxShadow: 'none' }}
          />
        </Space>
      }
    >
      {minhasTarefas.length === 0 ? (
        <Text type="secondary" style={{ display: 'block', padding: '24px 0', textAlign: 'center' }}>
          Nenhuma tarefa pendente.
        </Text>
      ) : (
        <Carousel
          arrows
          dots
          draggable
          slidesToShow={4}
          slidesToScroll={1}
          infinite={false}
          style={{ paddingBottom: 8 }}
          responsive={[
            { breakpoint: 1400, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
          ]}
        >
          {minhasTarefas.map((t) => (
            <div key={`${t.planoId}-${t.id}`} style={{ padding: '4px 8px' }}>
              <TarefaCard t={t} onClick={() => navigate(`/plano/${t.planoId}`)} />
            </div>
          ))}
        </Carousel>
      )}
    </Card>
  )
}
