import axios from "axios"


const SERVER = 'http://localhost:8080' 

const api = axios.create({
    baseURL: SERVER,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

// Interceptadores para debug
api.interceptors.request.use(
    (config) => {
        console.log('Requisição VIA GATEWAY:', config.method?.toUpperCase(), config.url, config.data)
        return config
    },
    (error) => {
        console.error('Erro na requisição:', error)
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        console.log('Resposta recebida via GATEWAY:', response.status, response.data)
        return response
    },
    (error) => {
        console.error('Erro na resposta:', error)
        return Promise.reject(error)
    }
)

const api_fetch = async (endpoint: string,
    config?: RequestInit
) => {

    const result = await fetch(SERVER + endpoint, config)
    return await result.json()

}

export default api
export { api_fetch }