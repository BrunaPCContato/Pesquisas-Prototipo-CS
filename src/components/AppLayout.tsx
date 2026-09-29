import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Typography, theme } from 'antd'
import type { MenuProps } from 'antd'
import {
  House,
  ListChecks,
  ChartPie,
  Target,
  Question,
  Gear,
  User,
  Clock,
  CaretDown,
  Bell,
} from '@phosphor-icons/react'
import Logo from './Logo'
import { brand } from '../theme'
import { useSession } from '../session'
import { STORAGE_KEY } from './PasswordGate'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const menuItems: MenuProps['items'] = [
  { key: 'home', icon: <House />, label: 'Home' },
  { key: 'pesquisas', icon: <ListChecks />, label: 'Pesquisas' },
  { key: 'estatisticas', icon: <ChartPie />, label: 'Estatísticas' },
  { key: 'planos', icon: <Target />, label: 'Planos de ação' },
  { type: 'divider' },
  {
    key: 'suporte',
    icon: <Question />,
    label: 'Suporte',
    children: [
      { key: 'ajuda', label: 'Central de ajuda' },
      { key: 'contato', label: 'Falar com suporte' },
    ],
  },
  { key: 'config', icon: <Gear />, label: 'Configurações' },
]

const routeByKey: Record<string, string> = {
  home: '/',
  pesquisas: '/pesquisas',
  estatisticas: '/estatisticas',
  planos: '/planos',
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    empresaAtual,
    somenteLeitura,
    setSomenteLeitura,
    multiEmpresa,
    setMultiEmpresa,
  } = useSession()
  const {
    token: { colorBorderSecondary },
  } = theme.useToken()

  const userMenu: MenuProps['items'] = [
    { key: 'perfil', icon: <User />, label: 'Meu perfil' },
    { type: 'divider' },
    {
      key: 'demo',
      label: 'Demonstração',
      type: 'group',
      children: [
        {
          key: 'perfil-toggle',
          label: somenteLeitura ? 'Perfil: Somente leitura ✓' : 'Perfil: Completo',
        },
        {
          key: 'empresas-toggle',
          label: multiEmpresa ? 'Empresas: várias ✓' : 'Empresas: uma',
        },
      ],
    },
    { type: 'divider' },
    { key: 'sair', label: 'Sair' },
  ]

  const onUserMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === 'perfil-toggle') setSomenteLeitura(!somenteLeitura)
    if (key === 'empresas-toggle') setMultiEmpresa(!multiEmpresa)
    if (key === 'sair') {
      // Sair → volta para a tela de senha
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      window.location.href = '/'
    }
  }

  const path = location.pathname
  const selectedKey = path.startsWith('/estatisticas')
    ? 'estatisticas'
    : path.startsWith('/plano')
      ? 'planos'
      : path.startsWith('/pesquisa')
        ? 'pesquisas'
        : path === '/'
          ? 'home'
          : ''

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        width={248}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{
          borderRight: `1px solid ${colorBorderSecondary}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            paddingInline: 20,
          }}
        >
          <Logo showText={!collapsed} />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => {
            if (routeByKey[key]) navigate(routeByKey[key])
          }}
          style={{ borderInlineEnd: 'none', paddingInline: 12 }}
        />
        <div
          style={{
            marginTop: 'auto',
            padding: 16,
            cursor: 'pointer',
            color: brand.textMuted,
          }}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? '›' : '‹'}
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingInline: 32,
            borderBottom: `1px solid ${colorBorderSecondary}`,
          }}
        >
          <Space size={24} align="center">
            <Space size={8} align="center">
              <Avatar
                size={36}
                style={{ backgroundColor: brand.primary }}
                icon={<Bell />}
              />
              <Space size={4} align="center" style={{ color: brand.textMuted }}>
                <Clock />
                <Text style={{ color: brand.textMuted, fontVariantNumeric: 'tabular-nums' }}>
                  04:31:52
                </Text>
              </Space>
            </Space>

            <Dropdown menu={{ items: userMenu, onClick: onUserMenu }} trigger={['click']}>
              <Space size={10} align="center" style={{ cursor: 'pointer' }}>
                <Avatar size={40} icon={<User />} />
                <div style={{ lineHeight: 1.2, textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: brand.primary }}>
                    Bruna Pereira
                  </div>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {empresaAtual.nome}
                    {somenteLeitura ? ' · Leitura' : ''}
                  </Text>
                </div>
                <CaretDown style={{ fontSize: 12, color: brand.textMuted }} />
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: 32 }}>{children}</Content>
      </Layout>
    </Layout>
  )
}
