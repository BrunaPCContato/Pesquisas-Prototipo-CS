import { useNavigate, useParams } from 'react-router-dom'
import { Typography, Button, Card, Result } from 'antd'
import { CaretLeft, Lock } from '@phosphor-icons/react'
import { brand } from '../theme'
import { useSession } from '../session'

const { Title, Text } = Typography

export default function RascunhoPesquisa() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { somenteLeitura } = useSession()

  // AC_05 — acesso direto a rascunho é bloqueado para perfil somente leitura
  if (somenteLeitura) {
    return (
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <Button
          type="link"
          icon={<CaretLeft />}
          onClick={() => navigate('/pesquisas')}
          style={{ paddingInline: 0, marginBottom: 8 }}
        >
          Voltar
        </Button>
        <Result
          icon={<Lock style={{ color: brand.danger }} />}
          status="403"
          title="Acesso bloqueado"
          subTitle="Seu perfil (somente leitura) não tem permissão para acessar pesquisas em rascunho."
          extra={
            <Button type="primary" onClick={() => navigate('/pesquisas')}>
              Voltar para Pesquisas
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto' }}>
      <Button
        type="link"
        icon={<CaretLeft />}
        onClick={() => navigate('/pesquisas')}
        style={{ paddingInline: 0, marginBottom: 8 }}
      >
        Voltar
      </Button>
      <Title level={2} style={{ marginBottom: 4 }}>
        Rascunho da pesquisa
      </Title>
      <Text style={{ fontSize: 16, color: brand.textMuted }}>
        Continue a edição do rascunho #{id}
      </Text>
      <Card style={{ marginTop: 24 }}>
        <Text type="secondary">
          Editor do rascunho (em construção). Aqui abriria o assistente de criação com os
          dados já preenchidos.
        </Text>
      </Card>
    </div>
  )
}
