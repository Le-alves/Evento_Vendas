import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AppHeader from "../../components/AppHeader"
import { SaleInterface, PurchaseStatus } from "../../types/sales"
import api from "../../services/api"

function ListSales() {
  const [sales, setSales] = useState<SaleInterface[]>([])
  const [filteredSales, setFilteredSales] = useState<SaleInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")

  // Opções de filtro por status
  const statusOptions: { value: string; label: string }[] = [
    { value: "ALL", label: "Todos os Status" },
    { value: "EM_ABERTO", label: "Em Aberto" },
    { value: "PAGO", label: "Pago" },
    { value: "CANCELADO", label: "Cancelado" },
    { value: "ESTORNADO", label: "Estornado" }
  ]

  useEffect(() => {
    loadSales()
  }, [])

  useEffect(() => {
    // Filtrar vendas quando status selecionado mudar
    if (selectedStatus === "ALL") {
      setFilteredSales(sales)
    } else {
      setFilteredSales(sales.filter(sale => sale.purchaseStatus === selectedStatus))
    }
  }, [sales, selectedStatus])

  const loadSales = async () => {
    try {
      setLoading(true)
      setError("")
      
      console.log("Carregando vendas...")
      const response = await api.get("/sales")
      
      console.log("Resposta da API:", response.data)
      setSales(response.data)
      
    } catch (error: any) {
      console.error("Erro ao carregar vendas:", error)
      setError(
        error.response?.data?.message || 
        "Erro ao carregar a lista de vendas. Verifique se o servidor está rodando."
      )
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch {
      return dateString
    }
  }

  const formatPurchaseStatus = (status: PurchaseStatus) => {
    const statusMap: Record<PurchaseStatus, { label: string; color: string }> = {
      "EM_ABERTO": { label: "Em Aberto", color: "bg-yellow-100 text-yellow-800" },
      "PAGO": { label: "Pago", color: "bg-green-100 text-green-800" },
      "CANCELADO": { label: "Cancelado", color: "bg-red-100 text-red-800" },
      "ESTORNADO": { label: "Estornado", color: "bg-gray-100 text-gray-800" }
    }
    return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
  }

  const formatEventType = (type: string) => {
    const typeMap: Record<string, string> = {
      "PALESTRA": "Palestra",
      "SHOW": "Show",
      "TEATRO": "Teatro", 
      "CURSO": "Curso",
      "WORKSHOP": "Workshop",
      "CONFERENCIA": "Conferência",
      "SEMINARIO": "Seminário"
    }
    return typeMap[type] || type
  }

  // Estatísticas resumidas
  const statistics = {
    total: sales.length,
    pago: sales.filter(s => s.purchaseStatus === "PAGO").length,
    emAberto: sales.filter(s => s.purchaseStatus === "EM_ABERTO").length,
    cancelado: sales.filter(s => s.purchaseStatus === "CANCELADO").length + sales.filter(s => s.purchaseStatus === "ESTORNADO").length
  }

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando vendas...</span>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Lista de Vendas</h1>
          <Link 
            to="/sales/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nova Venda
          </Link>
        </div>

        {/* Estatísticas */}
        {sales.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
              <div className="text-sm text-blue-600">Total de Vendas</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{statistics.pago}</div>
              <div className="text-sm text-green-600">Pagas</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{statistics.emAberto}</div>
              <div className="text-sm text-yellow-600">Em Aberto</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{statistics.cancelado}</div>
              <div className="text-sm text-gray-600">Canceladas/Estornadas</div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="font-semibold">Erro:</span>
              <span className="ml-2">{error}</span>
            </div>
            <button 
              onClick={loadSales}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Filtro por Status */}
        {sales.length > 0 && (
          <div className="mb-6">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Status:
            </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.value !== "ALL" && `(${sales.filter(s => s.purchaseStatus === option.value).length})`}
                </option>
              ))}
            </select>
            <span className="ml-3 text-sm text-gray-600">
              Mostrando {filteredSales.length} de {sales.length} vendas
            </span>
          </div>
        )}

        {sales.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎫</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma venda registrada
            </h2>
            <p className="text-gray-500 mb-4">
              Comece registrando sua primeira venda de ingresso
            </p>
            <Link 
              to="/sales/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Primeira Venda
            </Link>
          </div>
        )}

        {sales.length > 0 && filteredSales.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma venda encontrada para o filtro selecionado
            </h2>
            <p className="text-gray-500 mb-4">
              Tente alterar o filtro de status ou limpar os filtros
            </p>
            <button 
              onClick={() => setSelectedStatus("ALL")}
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Mostrar Todas as Vendas
            </button>
          </div>
        )}

        {filteredSales.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Compra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSales.map((sale) => {
                    const status = formatPurchaseStatus(sale.purchaseStatus)
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ID: {sale.id.substring(0, 8)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            Preço: R$ {sale.event.price.toFixed(2)}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {sale.event.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatEventType(sale.event.type)} - {formatDate(sale.event.date)}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.userId.substring(0, 8)}...
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(sale.purchaseDate)}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/sales/update-status?saleId=${sale.id}&currentStatus=${sale.purchaseStatus}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Alterar Status
                          </Link>
                          <button 
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => {
                              navigator.clipboard.writeText(sale.id)
                              alert("ID da venda copiado para a área de transferência!")
                            }}
                          >
                            Copiar ID
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Voltar ao início
          </Link>
        </div>

      </main>
    </>
  )
}

export default ListSales