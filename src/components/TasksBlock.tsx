import { Card, Tabs, Badge, Carousel, Typography, Space } from 'antd'
import { CalendarBlank } from '@phosphor-icons/react'
import { brand } from '../theme'

const { Text, Paragraph } = Typography

type Task = { id: number; title: string; desc: string; date: string }

const pendentes: Task[] = [
  { id: 1, title: 'Revisar o código de conduta', desc: 'Analisar e atualizar o código de conduta para garantir conformidade com as novas diretrizes.', date: '16/01/2026' },
  { id: 2, title: 'nova task', desc: 'rerererer', date: '05/03/2026' },
  { id: 3, title: 'asdasd', desc: 'dsadsad', date: '19/03/2026' },
  { id: 4, title: 'rerererere', desc: 'xxxx', date: '19/03/2026' },
  { id: 5, title: 'Plano de ação — Segurança e Sigilo', desc: 'Ações para elevar o score de confiança da equipe.', date: '22/03/2026' },
  { id: 6, title: 'Reunião de feedback', desc: 'Agendar rodada de feedbacks com as lideranças.', date: '25/03/2026' },
  { id: 7, title: 'Atualizar treinamento', desc: 'Revisar conteúdo do treinamento de compliance.', date: '28/03/2026' },
  { id: 8, title: 'Comunicado interno', desc: 'Divulgar resultados da pesquisa de clima.', date: '30/03/2026' },
]

const aprovacao: Task[] = [
  { id: 101, title: 'Aprovar plano de ação', desc: 'Plano de ação criado a partir da pesquisa "Clima 2026".', date: '20/03/2026' },
]

function TaskCard({ t }: { t: Task }) {
  return (
    <Card size="small" style={{ height: '100%' }} styles={{ body: { padding: 16 } }}>
      <Text
        strong
        ellipsis
        style={{ display: 'block', color: brand.primary, fontSize: 15 }}
        title={t.title}
      >
        {t.title}
      </Text>
      <Paragraph
        type="secondary"
        ellipsis={{ rows: 2 }}
        style={{ marginTop: 6, marginBottom: 12, minHeight: 44 }}
      >
        {t.desc}
      </Paragraph>
      <Space size={6}>
        <CalendarBlank style={{ color: brand.textMuted }} />
        <Text type="secondary" style={{ fontSize: 13 }}>
          {t.date}
        </Text>
      </Space>
    </Card>
  )
}

function TaskCarousel({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <Text type="secondary" style={{ display: 'block', padding: '24px 0', textAlign: 'center' }}>
        Nenhuma tarefa.
      </Text>
    )
  }
  return (
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
      {tasks.map((t) => (
        <div key={t.id} style={{ padding: '4px 8px' }}>
          <TaskCard t={t} />
        </div>
      ))}
    </Carousel>
  )
}

const countBadge = (n: number) => (
  <Badge
    count={n}
    style={{ backgroundColor: '#eef0f8', color: brand.primary, boxShadow: 'none' }}
  />
)

export default function TasksBlock() {
  return (
    <Card styles={{ body: { paddingTop: 8 } }}>
      <Tabs
        items={[
          {
            key: 'pendentes',
            label: <Space size={8}>Tarefas pendentes {countBadge(pendentes.length)}</Space>,
            children: <TaskCarousel tasks={pendentes} />,
          },
          {
            key: 'aprovacao',
            label: (
              <Space size={8}>
                Tarefas pendentes de aprovação {countBadge(aprovacao.length)}
              </Space>
            ),
            children: <TaskCarousel tasks={aprovacao} />,
          },
        ]}
      />
    </Card>
  )
}
