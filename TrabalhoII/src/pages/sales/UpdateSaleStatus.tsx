import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AppHeader from "../../components/AppHeader"
import { PurchaseStatus, SaleInterface, UpdateSaleStatusRequest } from "../../types/sales"
import api from "../../services/api"

function UpdateSaleStatus() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const saleId = searchParams.get("saleId") || ""
  const currentStatus = searchParams.get("currentStatus") || ""
  
  // Estados
  const [sale, setSale] = useState<SaleInterface | null>(null)
  const [newStatus, setNewStatus] = useState<PurchaseStatus>(currentStatus as PurchaseStatus || "EM_ABERTO")
  const [loading, setLoading] = useState(!!saleId) // Loading se tem saleId
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  // Opções de status
  const statusOptions: { value: PurchaseStatus; label: string; description: string }[] = [
    { 
      value: "EM_ABERTO", 
      label: "Em Aberto", 
      description: "Venda registrada, aguardando pagamento" 
    },
    { 
      value: "PAGO", 
      label: "Pago", 
      description: "Pagamento confirmado, ingresso liberado" 
    },
    { 
      value: "CANCELADO", 
      label: "Cancelado", 
      description: "Venda cancelada pelo cliente ou sistema" 
    },
    { 
      value: "ESTORNADO", 
      label: "Estornado", 
      description: "Pagamento devolvido ao cliente" 
    }
  ]

  
  useEffect(() => {
    if (saleId) {
      loadSale()
    }
  }, [saleId])

  const loadSale = async () => {
    try {
      setLoading(true)
      setError("")
      
      console.log("Carregando venda:", saleId)
      const response = await api.get(`/sales/${saleId}`)
      
      console.log("Venda carregada:", response.data)
      setSale(response.data)
      setNewStatus(response.data.purchaseStatus)
      
    } catch (error: any) {
      console.error("Erro ao carregar venda:", error)
      setError(
        error.response?.data?.message || 
        "Erro ao carregar dados da venda. Verifique se o ID está correto."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value as PurchaseStatus)
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sale) {
      setError("Dados da venda não carregados")
      return
    }
    
    if (newStatus === sale.purchaseStatus) {
      setError("Selecione um status diferente do atual")
      return
    }
    
    try {
      setUpdating(true)
      setError("")
      setSuccess("")
      
      // Preparar dados para update (incluindo todos os campos necessários)
      const updateData = {
        userId: sale.userId,
        eventId: sale.event.id,
        purchaseDate: sale.purchaseDate,
        purchaseStatus: newStatus
      }
      
      console.log("Atualizando status da venda:", updateData)
      const response = await api.put(`/sales/${sale.id}`, updateData)
      
      console.log("Status atualizado:", response.data)
      
      // Atualizar dados locais
      setSale(prevSale => prevSale ? {
        ...prevSale,
        purchaseStatus: newStatus
      } : null)
      
      setSuccess(`Status alterado com sucesso de "${getStatusLabel(sale.purchaseStatus)}" para "${getStatusLabel(newStatus)}"`)
      
      // Navegar de volta para lista após 2 segundos
      setTimeout(() => {
        navigate("/sales")
      }, 2000)
      
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error)
      setError(
        error.response?.data?.message || 
        "Erro ao alterar status da venda. Tente novamente."
      )
    } finally {
      setUpdating(false)
    }
  }

  const getStatusLabel = (status: PurchaseStatus) => {
    return statusOptions.find(option => option.value === status)?.label || status
  }

  const getStatusColor = (status: PurchaseStatus) => {
    const colorMap: Record<PurchaseStatus, string> = {
      "EM_ABERTO": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "PAGO": "bg-green-100 text-green-800 border-green-200",
      "CANCELADO": "bg-red-100 text-red-800 border-red-200",
      "ESTORNADO": "bg-gray-100 text-gray-800 border-gray-200"
    }
    return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200"
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

  // Se não tem saleId, mostrar formulário para inserir
  if (!saleId) {
    return (
      <>
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Alterar Status da Venda</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <label htmlFor="saleIdInput" className="block text-sm font-medium text-gray-700 mb-2">
                ID da Venda:
              </label>
              <input
                type="text"
                id="saleIdInput"
                placeholder="Digite o ID da venda (UUID)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement
                    if (input.value.trim()) {
                      navigate(`/sales/update-status?saleId=${input.value.trim()}`)
                    }
                  }
                }}
              />
              <p className="mt-2 text-sm text-gray-500">
                Pressione Enter ou vá para a lista de vendas para selecionar
              </p>
              
              <div className="mt-4">
                <button
                  onClick={() => navigate("/sales")}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ver Lista de Vendas
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando dados da venda...</span>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Alterar Status da Venda</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              <span className="font-semibold">Erro:</span>
              <span className="ml-2">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
              <span className="font-semibold">Sucesso:</span>
              <span className="ml-2">{success}</span>
            </div>
          )}

          {sale && (
            <>
              {/* Informações da Venda */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados da Venda</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">ID da Venda:</label>
                    <p className="text-sm text-gray-800">{sale.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">ID do Usuário:</label>
                    <p className="text-sm text-gray-800">{sale.userId}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Evento:</label>
                    <p className="text-sm text-gray-800 font-medium">{sale.event.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(sale.event.date)} - R$ {sale.event.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Data da Compra:</label>
                    <p className="text-sm text-gray-800">{formatDate(sale.purchaseDate)}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Status Atual:</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(sale.purchaseStatus)}`}>
                      {getStatusLabel(sale.purchaseStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulário de Alteração */}
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Alterar Status</h2>
                
                <div className="mb-6">
                  <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Novo Status *
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={handleStatusChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  {/* Descrição do status selecionado */}
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>{getStatusLabel(newStatus)}:</strong>{' '}
                      {statusOptions.find(option => option.value === newStatus)?.description}
                    </p>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={updating || newStatus === sale.purchaseStatus}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? "Alterando..." : "Alterar Status"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate("/sales")}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default UpdateSaleStatus