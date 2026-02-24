import AppHeader from "./components/AppHeader"
import { Link } from "react-router-dom"

function App() {

  return (
    <>
      <AppHeader title="Sistema de Vendas de Ingressos" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link to="/events/create" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Cadastro de Eventos</h2>
            <p className="text-gray-600">Criar novos eventos para venda de ingressos.</p>
            <p className="text-sm text-blue-500 mt-2">→ Acessar</p>
          </Link>
          
          <Link to="/events" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">Lista de Eventos</h2>
            <p className="text-gray-600">Visualizar todos os eventos cadastrados.</p>
            <p className="text-sm text-indigo-500 mt-2">→ Acessar</p>
          </Link>
          
          <Link to="/sales" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Lista de Vendas</h2>
            <p className="text-gray-600">Visualizar todas as vendas realizadas.</p>
            <p className="text-sm text-green-500 mt-2">→ Acessar</p>
          </Link>
          
          <Link to="/sales/create" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Cadastro de Venda</h2>
            <p className="text-gray-600">Registrar nova venda de ingresso.</p>
            <p className="text-sm text-purple-500 mt-2">→ Acessar</p>
          </Link>
          
          <Link to="/sales/update-status" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Alterar Status</h2>
            <p className="text-gray-600">Modificar status das vendas.</p>
            <p className="text-sm text-orange-500 mt-2">→ Acessar</p>
          </Link>
          
        </div>
        
      </main>

    </>
  )
}

export default App
