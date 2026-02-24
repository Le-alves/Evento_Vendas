import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AppHeader from "../../components/AppHeader"
import { EventType, CreateEventRequest } from "../../types/events"
import api from "../../services/api"

function CreateEvent() {
  const navigate = useNavigate()
  
 
  const [formData, setFormData] = useState<CreateEventRequest>({
    description: "",
    type: "PALESTRA",
    date: "",
    startSales: "",
    endSales: "",
    price: 0
  })
  

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  
  
  const eventTypeOptions: { value: EventType; label: string }[] = [
    { value: "PALESTRA", label: "Palestra" },
    { value: "SHOW", label: "Show" },
    { value: "TEATRO", label: "Teatro" },
    { value: "CURSO", label: "Curso" },
    { value: "WORKSHOP", label: "Workshop" },
    { value: "CONFERENCIA", label: "Conferência" },
    { value: "SEMINARIO", label: "Seminário" }
  ]

 
  const validateDates = (): boolean => {
    const startDate = new Date(formData.startSales)
    const endDate = new Date(formData.endSales)
    const eventDate = new Date(formData.date)
    
    if (startDate >= endDate) {
      setError("A data de início das vendas deve ser anterior à data de fim das vendas")
      return false
    }
    
    if (endDate >= eventDate) {
      setError("A data de fim das vendas deve ser anterior à data do evento")
      return false
    }
    
    return true
  }

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }))
    
   
    setError("")
    setSuccess("")
  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    
    if (!formData.description.trim()) {
      setError("A descrição é obrigatória")
      return
    }
    
    if (formData.price <= 0) {
      setError("O preço deve ser maior que zero")
      return
    }
    
    if (!validateDates()) {
      return
    }
    
    setLoading(true)
    setError("")
    
    try {
      console.log('Enviando dados para main-service (porta 4000):', formData)
      
      // Usando axios configurado para main-service diretamente
      const response = await api.post("/events", formData)  // SEM /api/ pois vai direto pro main-service
      
      console.log('Resposta do main-service:', response)
      
      if (response.status === 201 || response.status === 200) {
        setSuccess("Evento criado com sucesso!")
        
        // Resetar formulário
        setFormData({
          description: "",
          type: "PALESTRA",
          date: "",
          startSales: "",
          endSales: "",
          price: 0
        })
        
        // Navegar de volta após 2 segundos
        setTimeout(() => {
          navigate("/")
        }, 2000)
      }
    } catch (err: any) {
      console.error("Erro completo:", err)
      
      if (err.code === 'ERR_NETWORK') {
        setError("Erro de conexão - verifique se o main-service (porta 4000) está rodando.")
      } else {
        const errorMessage = err.response?.data?.message || "Erro ao criar evento. Tente novamente."
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AppHeader title="Cadastro de Eventos" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Criar Novo Evento</h1>
          
          {/* Mensagens de feedback */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite a descrição do evento"
              />
            </div>

            {/* Tipo de Evento */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Evento *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {eventTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data do Evento */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Data e Hora do Evento *
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Data de Início das Vendas */}
            <div>
              <label htmlFor="startSales" className="block text-sm font-medium text-gray-700 mb-2">
                Início das Vendas *
              </label>
              <input
                type="datetime-local"
                id="startSales"
                name="startSales"
                value={formData.startSales}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Data de Fim das Vendas */}
            <div>
              <label htmlFor="endSales" className="block text-sm font-medium text-gray-700 mb-2">
                Fim das Vendas *
              </label>
              <input
                type="datetime-local"
                id="endSales"
                name="endSales"
                value={formData.endSales}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Preço */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {loading ? "Criando..." : "Criar Evento"}
              </button>
            </div>
          </form>
          
          {/* Informações de validação */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Validações:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• A data de início das vendas deve ser anterior à data de fim das vendas</li>
              <li>• A data de fim das vendas deve ser anterior à data do evento</li>
              <li>• O preço deve ser maior que zero</li>
              <li>• Todos os campos são obrigatórios</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}

export default CreateEvent