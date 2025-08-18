# FCHost Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  <strong>Sistema de aluguel de máquinas virtuais com monitoramento de saldo e detecção de fraudes</strong>
</p>

## 📋 Índice

- [O que é a aplicação](#-o-que-é-a-aplicação)
- [Funcionalidades](#-funcionalidades)
- [Como executar a aplicação](#-como-executar-a-aplicação)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)

## 🚀 O que é a aplicação

O **FCHost Backend** é uma plataforma que simula o aluguel de máquinas virtuais construída com arquitetura de microserviços usando NestJS.

### Arquitetura

O projeto segue uma arquitetura de monorepo com múltiplas aplicações especializadas:

- **API Gateway**: Interface principal para clientes
- **Balance Monitor**: Monitoramento automático de saldos
- **Invoice Consumer**: Processamento de faturas e detecção de fraudes
- **Transaction Consumer**: Processamento de transações financeiras
- **Transaction Producer**: Geração automática de transações

## ⚡ Funcionalidades

### 🔐 Gestão de Contas

- Criação e validação de contas de usuário
- Sistema de API keys para autenticação
- Controle de saldo e créditos
- Histórico de transações

### 🖥️ Gestão de Máquinas

- Aluguel de máquinas
- Cálculo automático de custos baseado no uso
- Controle de status (On e Off)

### 💰 Sistema Financeiro

- Geração automática de faturas
- Processamento de transações (crédito/débito)
- Histórico completo de movimentações

### 🚨 Detecção de Fraudes

- Análise de padrões suspeitos
- Detecção de uso anormal de recursos
- Sistema de especificações configuráveis

### 📧 Notificações

- Envio de emails via AWS SES
- Templates personalizáveis com Handlebars
- Notificações automáticas para eventos importantes

## 🛠️ Como executar a aplicação

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL 16
- RabbitMQ 3

### 1. Configuração do ambiente

```bash
# Clone o repositório
git clone <repository-url>
cd fchost-backend

# Instale as dependências
npm install
```

### 2. Configuração dos serviços

```bash
# Inicie os serviços de infraestrutura
docker-compose up -d

# Aguarde os serviços estarem prontos
docker-compose ps
```

### 3. Configuração do banco de dados

```bash
# Execute as migrações
npm run migration:run

# (Opcional) Popule o banco com dados de teste
npm run seed
```

### 4. Executando as aplicações

#### API Gateway (Porta 8081)

```bash
# Desenvolvimento
npm run start:debug:api

# Produção
npm run build:api
npm run start:prod:api
```

#### Balance Monitor (Porta 8082)

```bash
# Desenvolvimento
npm run start:debug:balance-monitor

# Produção
npm run build:balance-monitor
npm run start:prod:balance-monitor
```

#### Invoice Consumer (Porta 8083)

```bash
# Desenvolvimento
npm run start:debug:invoice-consumer

# Produção
npm run build:invoice-consumer
npm run start:prod:invoice-consumer
```

#### Transaction Consumer (Porta 8084)

```bash
# Desenvolvimento
npm run start:debug:transaction-consumer

# Produção
npm run build:transaction-consumer
npm run start:prod:transaction-consumer
```

#### Transaction Producer (Porta 8085)

```bash
# Desenvolvimento
npm run start:debug:transaction-producer

# Produção
npm run build:transaction-producer
npm run start:prod:transaction-producer
```

### 5. Scripts úteis

```bash
# Build de todas as aplicações
npm run build

# Build de uma aplicação específica
npm run build:api
npm run build:balance-monitor
npm run build:invoice-consumer
npm run build:transaction-consumer
npm run build:transaction-producer

# Executar testes
npm run test
npm run test:e2e

# Formatação de código
npm run format

# Linting
npm run lint

# Migrações
npm run migration:generate
npm run migration:run
npm run migration:revert
```

### 6. Acessos aos serviços

- **PostgreSQL**: `localhost:5432` (usuário: `postgres`, senha: `postgres`)
- **RabbitMQ**: `localhost:5672` (usuário: `rabbitmq`, senha: `rabbitmq`)
- **RabbitMQ Management**: `http://localhost:15672`

## 🏗️ Estrutura do projeto

```
fchost-backend/
├── apps/                          # Aplicações do monorepo
│   ├── api/                      # API Gateway principal
│   ├── balance-monitor/          # Monitor de saldo
│   ├── invoice-consumer/         # Consumidor de faturas
│   ├── transaction-consumer/     # Consumidor de transações
│   └── transaction-producer/     # Produtor de transações
├── libs/                         # Bibliotecas compartilhadas
│   ├── common/                   # Tipos e interfaces comuns
│   ├── config/                   # Configurações
│   └── db/                       # Entidades e migrações
├── infra/                        # Configurações de infraestrutura
│   ├── aws/                      # Configurações AWS
│   └── k8s/                      # Manifests Kubernetes
└── scripts/                      # Scripts de build e deploy
```

## 🛠️ Tecnologias utilizadas

### Backend

- **NestJS**: Framework principal para construção de aplicações
- **TypeScript**: Linguagem de programação
- **TypeORM**: ORM para banco de dados
- **PostgreSQL**: Banco de dados principal
- **RabbitMQ**: Message broker para comunicação entre serviços

### Infraestrutura

- **Docker**: Containerização das aplicações
- **Docker Compose**: Orquestração local dos serviços
- **Kubernetes**: Orquestração em produção
- **AWS**: Serviços em nuvem (ECR, SES)

### Desenvolvimento

- **Jest**: Framework de testes
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **SWC**: Compilador TypeScript rápido

## 📚 Documentação adicional

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
