import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AppHeader from "../../components/AppHeader"
import { PurchaseStatus, CreateSaleRequest } from "../../types/sales"
import { EventInterface } from "../../types/events"
import api from "../../services/api"

function CreateSale() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Estado do formulário
  const [formData, setFormData] = useState<CreateSaleRequest>({
    userId: "",
    eventId: searchParams.get("eventId") || "",
    purchaseDate: new Date().toISOString().slice(0, 16),
    purchaseStatus: "EM_ABERTO"
  })
  
  // Estados de controle
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [events, setEvents] = useState<EventInterface[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  // Opções para o dropdown de status
  const statusOptions: { value: PurchaseStatus; label: string }[] = [
    { value: "EM_ABERTO", label: "Em Aberto" },
    { value: "PAGO", label: "Pago" },
    { value: "CANCELADO", label: "Cancelado" },
    { value: "ESTORNADO", label: "Estornado" }
  ]

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoadingEvents(true)
      const response = await api.get("/events")
      setEvents(response.data)
    } catch (error) {
      console.error("Erro ao carregar eventos:", error)
      setError("Erro ao carregar eventos.")
    } finally {
      setLoadingEvents(false)
    }
  }

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar mensagens ao editar 
    if (error) setError("")
    if (success) setSuccess("")
  }

  const validateForm = () => {
    if (!formData.userId.trim()) {
      setError("ID do usuário é obrigatório")
      return false
    }
    
    if (!formData.eventId) {
      setError("Selecione um evento")
      return false
    }
    
    if (!formData.purchaseDate) {
      setError("Data de compra é obrigatória")
      return false
    }
    
    // Validar se a data não está no passado (exceto se for hoje)
    const purchaseDate = new Date(formData.purchaseDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (purchaseDate < today) {
      setError("Data de compra não pode ser no passado")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      
      // Formatar data para o backend (ISO string)
      const saleData = {
        ...formData,
        purchaseDate: new Date(formData.purchaseDate).toISOString()
      }
      
      console.log("Enviando venda:", saleData)
      const response = await api.post("/sales", saleData)
      
      console.log("Venda criada:", response.data)
      setSuccess("Venda registrada com sucesso!")
      
      // Limpar formulário após sucesso
      setFormData({
        userId: "",
        eventId: "",
        purchaseDate: new Date().toISOString().slice(0, 16),
        purchaseStatus: "EM_ABERTO"
      })
      
      // Navegar para lista de vendas após 2 segundos
      setTimeout(() => {
        navigate("/sales")
      }, 2000)
      
    } catch (error: any) {
      console.error("Erro ao criar venda:", error)
      setError(
        error.response?.data?.message || 
        "Erro ao registrar venda. Verifique os dados e tente novamente."
      )
    } finally {
      setLoading(false)
    }
  }

  // Encontrar evento selecionado
  const selectedEvent = events.find(event => event.id === formData.eventId)

  return (
    <>
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Cadastro de Venda</h1>
          
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

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            
            {/* Campo ID do Usuário */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                ID do Usuário *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="Digite o ID do usuário (UUID)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userId: generateUUID() }))}
                  className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  Gerar UUID
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Exemplo: 550e8400-e29b-41d4-a716-446655440000 (você pode gerar um automaticamente)
              </p>
            </div>

            {/* Seleção do Evento */}
            <div>
              <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                Evento *
              </label>
              {loadingEvents ? (
                <div className="text-gray-500 text-sm">Carregando eventos...</div>
              ) : (
                <select
                  id="eventId"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um evento</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.description} - R$ {event.price.toFixed(2)} ({new Date(event.date).toLocaleDateString("pt-BR")})
                    </option>
                  ))}
                </select>
              )}
              
              {selectedEvent && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Evento selecionado:</strong> {selectedEvent.description}
                  </p>
                  <p className="text-sm text-blue-600">
                    Data: {new Date(selectedEvent.date).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })} | Preço: R$ {selectedEvent.price.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Data de Compra */}
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                Data e Hora da Compra *
              </label>
              <input
                type="datetime-local"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Status da Compra */}
            <div>
              <label htmlFor="purchaseStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Status da Compra *
              </label>
              <select
                id="purchaseStatus"
                name="purchaseStatus"
                value={formData.purchaseStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || loadingEvents}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Registrando..." : "Registrar Venda"}
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
        </div>
      </main>
    </>
  )
}

export default CreateSale