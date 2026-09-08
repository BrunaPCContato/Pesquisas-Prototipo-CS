import { useState } from 'react'
import type { ReactNode } from 'react'
import { Card, Input, Button, Typography, Alert, Space } from 'antd'
import { Lock } from '@phosphor-icons/react'
import Logo from './Logo'
import { brand } from '../theme'

const { Title, Text } = Typography

/** Senha de acesso ao protótipo. Troque aqui e avise seus gestores. */
const SENHA = 'pesquisas2026'
export const STORAGE_KEY = 'pesquisas.acesso'

/**
 * Portão de senha (client-side) para o protótipo. Não é segurança real — apenas
 * impede o acesso casual de quem não tem a senha.
 */
export default function PasswordGate({ children }: { children: ReactNode }) {
  const [autorizado, setAutorizado] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)

  if (autorizado) return <>{children}</>

  const entrar = () => {
    if (senha === SENHA) {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
      setAutorizado(true)
    } else {
      setErro(true)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f4f5',
        padding: 24,
      }}
    >
      <Card style={{ width: 400, maxWidth: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Logo />
        </div>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 4, color: brand.primary }}>
          Acesso restrito
        </Title>
        <Text
          type="secondary"
          style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}
        >
          Informe a senha para acessar o protótipo.
        </Text>

        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {erro && <Alert type="error" showIcon message="Senha incorreta." />}
          <Input.Password
            prefix={<Lock style={{ color: brand.textMuted }} />}
            placeholder="Senha"
            size="large"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)
              setErro(false)
            }}
            onPressEnter={entrar}
            autoFocus
          />
          <Button type="primary" block size="large" onClick={entrar}>
            Entrar
          </Button>
        </Space>
      </Card>
    </div>
  )
}
