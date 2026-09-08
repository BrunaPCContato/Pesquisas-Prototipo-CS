import { Select } from 'antd'
import { Bank } from '@phosphor-icons/react'
import { brand } from '../theme'
import { useSession } from '../session'

/**
 * Seletor de empresa (RN_03) — exibido em Home, Pesquisas, Estatísticas e Grupos.
 * Só aparece quando o usuário tem acesso a mais de uma empresa (AC_01/AC_03).
 */
export default function EmpresaSelector({ style }: { style?: React.CSSProperties }) {
  const { empresas, empresaAtual, setEmpresaAtualId } = useSession()
  if (empresas.length <= 1) return null
  return (
    <Select
      value={empresaAtual.id}
      onChange={setEmpresaAtualId}
      style={{ width: 240, ...style }}
      prefix={<Bank style={{ color: brand.textMuted }} />}
      options={empresas.map((e) => ({ value: e.id, label: e.nome }))}
    />
  )
}
