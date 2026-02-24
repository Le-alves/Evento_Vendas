# Sistema de Vendas de Ingressos - Frontend

> Interface Web administrativa para gerenciamento de eventos e vendas de ingressos


Este projeto corresponde ao **Trabalho II** da disciplina CSI607 - Sistemas WEB II e implementa uma interface web administrativa moderna para o Sistema de Vendas de Ingressos. A aplicação permite gerenciar eventos, visualizar vendas e controlar o status dos pagamentos através de uma interface intuitiva e responsiva.

## Tecnologias Utilizadas

- **React 19** - Biblioteca para construção da interface de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Ferramenta de build e desenvolvimento rápido
- **Tailwind CSS 4** - Framework CSS utilitário para estilização
- **React Router DOM** - Biblioteca para roteamento de páginas
- **Axios** - Cliente HTTP para comunicação com APIs
- **ESLint** - Linter para manter qualidade do código

## Funcionalidades Implementadas

### Gestão de Eventos
- **Cadastro de Eventos**: Criação de novos eventos com validações
  - Tipos: Palestra, Show, Teatro, Curso, Workshop, Conferência, Seminário
  - Informações: Descrição, data do evento, período de vendas, preço
  - Validações de datas e campos obrigatórios
  
- **Lista de Eventos**: Visualização de todos os eventos cadastrados
  - Exibição em cards com informações resumidas
  - Filtros e busca (se implementado)

### Gestão de Vendas
- **Lista de Vendas**: Visualização de todas as vendas realizadas
  - Status: Em Aberto, Pago, Cancelado, Estornado
  - Informações do evento e usuário associados
  
- **Cadastro de Vendas**: Registro de novas vendas de ingressos
  - Seleção de evento disponível
  - Identificação do usuário
  - Status inicial da compra
  
- **Atualização de Status**: Modificação do status de vendas existentes
  - Controle de pagamentos
  - Gerenciamento de cancelamentos e estornos

### Dashboard
- Interface principal com acesso rápido a todas as funcionalidades
- Cards interativos para navegação
- Overview das funcionalidades implementadas

## Configuração e Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Backend (TrabalhoI) em execução na porta 8080

### Instalação

1. **Clone o repositório**
   ```bash
   git clone 
   cd TrabalhoII
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente** (se necessário)
   - Verifique se o backend está rodando em `http://localhost:8080`
   - Ajuste a URL base no arquivo `src/services/api.ts` se necessário

4. **Execute a aplicação**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação**
   - Abra o navegador em `http://localhost:5173`

## Comunicação com Backend

A aplicação se comunica com o backend através do **microsserviço gateway** configurado na porta 8080:

```typescript
// src/services/api.ts
const SERVER = 'http://localhost:8080'
```

### Endpoints Principais
- `GET /events` - Listar eventos
- `POST /events` - Criar evento
- `GET /sales` - Listar vendas
- `POST /sales` - Criar venda
- `PUT /sales/{id}/status` - Atualizar status da venda




## Documentação Relacionada

- [TrabalhoI - Backend](../TrabalhoI/README.md)
- [Atividade Prática 01](../Docs/01-practical.md)
- [Atividade Prática 02](../Docs/02-practical.md)
