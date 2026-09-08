import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, App as AntApp } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import { BrowserRouter } from 'react-router-dom'
import { csTheme } from './theme'
import { SessionProvider } from './session'
import PasswordGate from './components/PasswordGate'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={csTheme} locale={ptBR}>
      <AntApp>
        <PasswordGate>
          <SessionProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SessionProvider>
        </PasswordGate>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
)
