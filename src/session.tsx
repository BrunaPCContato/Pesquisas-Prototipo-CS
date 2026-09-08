import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Empresa = { id: string; nome: string }

const TODAS_EMPRESAS: Empresa[] = [
  { id: 'holding', nome: 'Cliente Holding Re' },
  { id: 'acme', nome: 'ACME S.A.' },
  { id: 'contoso', nome: 'Contoso Ltda.' },
]

type SessionValue = {
  /** Empresas às quais o usuário tem acesso. */
  empresas: Empresa[]
  empresaAtual: Empresa
  setEmpresaAtualId: (id: string) => void
  /** Perfil somente leitura (sem acesso a rascunhos). */
  somenteLeitura: boolean
  // --- controles de demonstração (protótipo) ---
  multiEmpresa: boolean
  setMultiEmpresa: (v: boolean) => void
  setSomenteLeitura: (v: boolean) => void
}

const SessionContext = createContext<SessionValue | null>(null)

const readFlag = (key: string, fallback: boolean) => {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : v === 'true'
  } catch {
    return fallback
  }
}
const writeFlag = (key: string, v: boolean) => {
  try {
    localStorage.setItem(key, String(v))
  } catch {
    /* ignore */
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [multiEmpresa, setMultiEmpresaState] = useState(() => readFlag('demo.multiEmpresa', true))
  const [somenteLeitura, setSomenteLeituraState] = useState(() =>
    readFlag('demo.somenteLeitura', false),
  )
  const [empresaAtualId, setEmpresaAtualId] = useState(TODAS_EMPRESAS[0].id)

  const setMultiEmpresa = (v: boolean) => {
    writeFlag('demo.multiEmpresa', v)
    setMultiEmpresaState(v)
  }
  const setSomenteLeitura = (v: boolean) => {
    writeFlag('demo.somenteLeitura', v)
    setSomenteLeituraState(v)
  }

  const empresas = useMemo(
    () => (multiEmpresa ? TODAS_EMPRESAS : [TODAS_EMPRESAS[0]]),
    [multiEmpresa],
  )

  const empresaAtual =
    empresas.find((e) => e.id === empresaAtualId) ?? empresas[0]

  const value: SessionValue = {
    empresas,
    empresaAtual,
    setEmpresaAtualId,
    somenteLeitura,
    multiEmpresa,
    setMultiEmpresa,
    setSomenteLeitura,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession deve ser usado dentro de SessionProvider')
  return ctx
}
