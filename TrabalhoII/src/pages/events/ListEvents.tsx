import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AppHeader from "../../components/AppHeader"
import { EventInterface } from "../../types/events"
import api from "../../services/api"

function ListEvents() {
  const [events, setEvents] = useState<EventInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>("")

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      
      console.log("Carregando eventos...")
      const response = await api.get("/events")
      
      console.log("Resposta da API:", response.data)
      setEvents(response.data)
      
    } catch (error: any) {
      console.error("Erro ao carregar eventos:", error)
      setError(
        error.response?.data?.message || 
        "Erro ao carregar a lista de eventos. Verifique se o servidor está rodando."
      )
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (eventId: string, eventDescription: string) => {
    try {
      setDeletingId(eventId)
      setError("")
      setSuccess("")
      
      console.log("Excluindo evento:", eventId)
      await api.delete(`/events/${eventId}`)
      
      console.log("Evento excluído com sucesso")
      
     
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId))
      
    
      setSuccess(`Evento "${eventDescription}" excluído com sucesso!`)
      
      
      setTimeout(() => setSuccess(""), 3000)
      
    } catch (error: any) {
      console.error("Erro ao excluir evento:", error)
      setError(
        error.response?.data?.message || 
        `Erro ao excluir o evento "${eventDescription}". Tente novamente.`
      )
    } finally {
      setDeletingId(null)
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

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando eventos...</span>
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
          <h1 className="text-3xl font-bold text-gray-800">Lista de Eventos</h1>
          <Link 
            to="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Novo Evento
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="font-semibold">Erro:</span>
              <span className="ml-2">{error}</span>
            </div>
            <button 
              onClick={loadEvents}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            <div className="flex items-center">
              <span className="font-semibold">Sucesso:</span>
              <span className="ml-2">{success}</span>
            </div>
          </div>
        )}

        {events.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum evento cadastrado
            </h2>
            <p className="text-gray-500 mb-4">
              Comece criando seu primeiro evento
            </p>
            <Link 
              to="/events/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cadastrar Primeiro Evento
            </Link>
          </div>
        )}

        {events.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período de Venda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {event.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {event.id}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatEventType(event.type)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(event.date)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {event.price.toFixed(2)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Início: {formatDate(event.startSales)}</div>
                        <div>Fim: {formatDate(event.endSales)}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/sales/create?eventId=${event.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Vender Ingresso
                        </Link>
                        <button 
                          className={`text-red-600 hover:text-red-900 ${
                            deletingId === event.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={deletingId === event.id}
                          onClick={() => {
                            if (window.confirm(`Deseja realmente excluir o evento "${event.description}"?`)) {
                              deleteEvent(event.id, event.description)
                            }
                          }}
                        >
                          {deletingId === event.id ? "Excluindo..." : "Excluir"}
                        </button>
                      </td>
                    </tr>
                  ))}
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

export default ListEvents