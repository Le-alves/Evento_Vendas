# Trabalho Prático 1 - Sistema de Eventos e Vendas

Sistema de gerenciamento de eventos e vendas de ingressos desenvolvido como Trabalho Prático 1.

## Tecnologias Utilizadas

- **Java 17**
- **Spring Boot 3.5.6**
- **Spring Data JPA**
- **PostgreSQL**
- **Spring Cloud 2025.0.0**
- **Lombok**

## Configuração e Execução

### 1. Iniciar o Banco de Dados
```bash
docker-compose up -d
```

### 2. Executar a Aplicação
```bash
mvn spring-boot:run
```

A aplicação será iniciada na porta **4000**.

## Endpoints da API

### Status da Aplicação
- `GET /status` - Verificar se a aplicação está funcionando

### Eventos  
- `GET /events` - Listar todos os eventos
- `POST /events` - Criar novo evento
- `PUT /events/{id}` - Atualizar evento
- `DELETE /events/{id}` - Remover evento

### Vendas
- `GET /sales` - Listar todas as vendas
- `POST /sales` - Registrar nova venda
- `PUT /sales/{id}` - Atualizar venda
- `DELETE /sales/{id}` - Remover venda

## Estrutura do Banco de Dados

O sistema utiliza duas tabelas principais:
- `tb_events` - Armazena informações dos eventos
- `tb_sales` - Registra as vendas dos ingressos