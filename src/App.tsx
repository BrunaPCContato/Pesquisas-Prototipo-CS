import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Home from './pages/Home'
import Pesquisas from './pages/Pesquisas'
import CriarPesquisa from './pages/CriarPesquisa'
import NovaPesquisa from './pages/NovaPesquisa'
import RascunhoPesquisa from './pages/RascunhoPesquisa'
import Estatisticas from './pages/Estatisticas'
import SurveyDetail from './pages/SurveyDetail'
import PlanosAcao from './pages/PlanosAcao'
import PlanoAcaoDetalhe from './pages/PlanoAcaoDetalhe'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pesquisas" element={<Pesquisas />} />
        <Route path="/pesquisas/criar" element={<CriarPesquisa />} />
        <Route path="/pesquisas/nova" element={<NovaPesquisa />} />
        <Route path="/pesquisas/rascunho/:id" element={<RascunhoPesquisa />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="/pesquisa/:id" element={<SurveyDetail />} />
        <Route path="/planos" element={<PlanosAcao />} />
        <Route path="/plano/:id" element={<PlanoAcaoDetalhe />} />
      </Routes>
    </AppLayout>
  )
}
