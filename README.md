# 🎲 Sorte Lançada - Sistema de Rifas Online

**Versão:** 1.0.0  
**Desenvolvedor:** Lucas IT Dias (@lucasitdias)  
**Data:** Novembro 2025  
**Status:** ✅ Produção

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Tecnologias](#-tecnologias)
3. [Arquitetura](#-arquitetura)
4. [Pré-requisitos](#-pré-requisitos)
5. [Instalação](#-instalação)
6. [Configuração](#-configuração)
7. [Execução](#-execução)
8. [Estrutura do Projeto](#-estrutura-do-projeto)
9. [Funcionalidades](#-funcionalidades)
10. [Banco de Dados](#-banco-de-dados)
11. [API Endpoints](#-api-endpoints)
12. [Deploy](#-deploy)
13. [Troubleshooting](#-troubleshooting)
14. [Licença](#-licença)

---

## 🎯 Visão Geral

**Sorte Lançada** é uma plataforma completa de rifas online que permite:

- ✅ Criação e gerenciamento de rifas
- ✅ Compra de cotas via PIX (Mercado Pago)
- ✅ Geração automática de números
- ✅ Sistema de sorteio com números premiados
- ✅ Painel administrativo completo
- ✅ Notificações em tempo real
- ✅ Upload de imagens (Cloudinary)
- ✅ Autenticação JWT
- ✅ Responsivo (mobile-first)

---

## 🛠️ Tecnologias

### **Backend (API)**

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Node.js | v20.19.5 LTS | Runtime JavaScript |
| NestJS | 10.4.20 | Framework backend |
| TypeScript | 5.7.2 | Linguagem tipada |
| TypeORM | 0.3.20 | ORM para PostgreSQL |
| PostgreSQL | 15.1 | Banco de dados |
| Passport JWT | 4.0.1 | Autenticação |
| Cloudinary | 2.5.1 | Upload de imagens |
| Sharp | 0.33.5 | Processamento de imagens |
| Mercado Pago SDK | - | Pagamentos PIX |
| SendGrid | 8.1.3 | Envio de e-mails |
| Bcrypt | 5.1.1 | Hash de senhas |

### **Frontend (Web)**

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Next.js | 14.2.33 | Framework React |
| React | 18.3.1 | Biblioteca UI |
| TypeScript | 5.7.3 | Linguagem tipada |
| TailwindCSS | 3.4.17 | Estilização |
| NextUI | 2.6.10 | Componentes UI |
| Redux Toolkit | 2.10.1 | Gerenciamento de estado |
| React Query | 5.90.10 | Fetch de dados |
| Axios | 1.7.9 | Cliente HTTP |
| Framer Motion | 11.18.2 | Animações |
| React Toastify | 10.0.6 | Notificações |
| Dinero.js | 1.9.1 | Formatação monetária |

### **Infraestrutura**

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Docker | 29.0.2 | Containerização |
| Docker Compose | 2.40.3 | Orquestração |
| Yarn | 4.5.3 | Gerenciador de pacotes |
| Git | 2.52.0 | Controle de versão |

---

## 🏗️ Arquitetura

### **Diagrama de Alto Nível**

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Cliente   │◄────►│   Next.js   │◄────►│   NestJS    │
│  (Browser)  │      │  (Frontend) │      │  (Backend)  │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
                     ┌────────────────────────────┼────────────────┐
                     │                            │                │
              ┌──────▼──────┐            ┌───────▼───────┐  ┌────▼─────┐
              │  PostgreSQL │            │  Cloudinary   │  │ SendGrid │
              │  (Database) │            │   (Storage)   │  │  (Email) │
              └─────────────┘            └───────────────┘  └──────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  Mercado Pago   │
                                         │   (Pagamentos)  │
                                         └─────────────────┘
```

### **Fluxo de Dados**

1. **Usuário** acessa frontend (Next.js)
2. **Frontend** faz requisição para API (NestJS)
3. **API** valida JWT e processa lógica de negócio
4. **TypeORM** faz query no PostgreSQL
5. **API** retorna dados para frontend
6. **Frontend** renderiza interface

---

## ✅ Pré-requisitos

### **Sistema Operacional**
- Linux (Ubuntu 22.04+, Mint 22.2+, Debian 12+)
- macOS 12+
- Windows 11 (com WSL2)

### **Software Necessário**

| Software | Versão Mínima | Instalação |
|----------|---------------|------------|
| Node.js | v20.19.5 | [nvm](https://github.com/nvm-sh/nvm) |
| Yarn | 4.5.3 | `corepack enable` |
| Docker | 29.0+ | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| Git | 2.40+ | `sudo apt install git` |

---

## 📦 Instalação

### **1. Clonar Repositório**

```bash
git clone https://github.com/seu-usuario/sorte-lancada.git
cd sorte-lancada
```

### **2. Instalar Node.js v20 (via NVM)**

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Instalar Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verificar
node -v  # Deve mostrar v20.19.5
npm -v   # Deve mostrar v10.8.2
```

### **3. Habilitar Yarn 4.5.3**

```bash
# Habilitar Corepack
corepack enable

# Ativar Yarn 4.5.3
corepack prepare yarn@4.5.3 --activate

# Verificar
yarn --version  # Deve mostrar 4.5.3
```

### **4. Configurar Banco de Dados (Docker)**

```bash
# Criar container PostgreSQL
docker run -d \
  --name postgresql-sortelancada \
  -e POSTGRES_USER= \
  -e POSTGRES_PASSWORD= \
  -e POSTGRES_DB= \
  -p 5436:5432 \
  postgres:15.1

# Verificar container rodando
docker ps | grep sortelancada
```

### **5. Instalar Dependências - Backend (API)**

```bash
cd api

# Criar .yarnrc.yml
cat > .yarnrc.yml << 'EOF'
nodeLinker: node-modules
enableGlobalCache: true
nmMode: hardlinks-local
compressionLevel: mixed
enableImmutableInstalls: false
packageExtensions:
  ts-node-dev@2.0.0:
    dependencies:
      '@types/node': '*'
npmRegistryServer: "https://registry.npmjs.org"
httpTimeout: 120000
networkConcurrency: 8
enableNetwork: true
EOF

# Instalar dependências
yarn install

# Compilar projeto
yarn build
```

### **6. Instalar Dependências - Frontend (WEB)**

```bash
cd ../web

# Criar .yarnrc.yml
cat > .yarnrc.yml << 'EOF'
nodeLinker: node-modules
enableGlobalCache: true
nmMode: hardlinks-local
compressionLevel: mixed
enableImmutableInstalls: false
npmRegistryServer: "https://registry.npmjs.org"
httpTimeout: 120000
networkConcurrency: 8
enableNetwork: true
EOF

# Instalar dependências
yarn install

# Build de produção (opcional)
yarn build
```

---

## ⚙️ Configuração

### **Backend (API) - Variáveis de Ambiente**

**Arquivo:** `api/.env`

```env
# Servidor
PORT=1337
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5436
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# JWT
JWT_SECRET=

# Cloudinary (Upload de Imagens)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mercado Pago (Pagamentos PIX)
MERCADO_PAGO_ACCESS_TOKEN=

# SendGrid (E-mails)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
SENDGRID_FROM_NAME=

# URL Frontend
FRONTEND_URL=http://localhost:3000
```

### **Frontend (WEB) - Variáveis de Ambiente**

**Arquivo:** `web/.env.local`

```env
# URL da API
NEXT_PUBLIC_API_URL=http://localhost:1337
```

---

## 🚀 Execução

### **1. Iniciar Banco de Dados**

```bash
# Iniciar container PostgreSQL (se não estiver rodando)
docker start postgresql-sortelancada

# Verificar
docker ps | grep sortelancada
```

### **2. Iniciar Backend (API)**

```bash
cd api

# Modo desenvolvimento (com hot reload)
yarn start:dev

# Modo produção
yarn start:prod
```

**✅ Deve aparecer:**
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [NestApplication] Nest application successfully started
App listening in 1337
```

**API disponível em:** `http://localhost:1337`

### **3. Iniciar Frontend (WEB)**

```bash
cd web

# Modo desenvolvimento
yarn dev

# Modo produção
yarn start
```

**✅ Deve aparecer:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
✓ Ready in 2.7s
```

**Frontend disponível em:** `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
sorte-lancada/
├── api/                          # Backend (NestJS)
│   ├── src/
│   │   ├── auth/                 # Módulo de autenticação
│   │   ├── common/               # Utilitários compartilhados
│   │   ├── modules/
│   │   │   ├── admin-user/       # Usuários admin
│   │   │   ├── common-user/      # Usuários comuns
│   │   │   ├── raffle/           # Rifas
│   │   │   ├── payment/          # Pagamentos
│   │   │   └── users-raffle-number/  # Números de rifas
│   │   ├── config.ts             # Configuração TypeORM
│   │   ├── main.ts               # Entry point
│   │   └── app.module.ts         # Módulo raiz
│   ├── .env                      # Variáveis de ambiente
│   ├── package.json              # Dependências
│   ├── tsconfig.json             # Config TypeScript
│   └── yarn.lock                 # Lock de dependências
│
├── web/                          # Frontend (Next.js)
│   ├── public/                   # Arquivos estáticos
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── admin/            # Componentes admin
│   │   │   └── common/           # Componentes compartilhados
│   │   ├── hooks/                # Custom hooks
│   │   ├── lib/                  # Utilitários
│   │   ├── pages/                # Páginas Next.js
│   │   │   ├── admin/            # Páginas admin
│   │   │   ├── rifas/            # Páginas de rifas
│   │   │   ├── pagamentos/       # Páginas de pagamento
│   │   │   └── _app.tsx          # App wrapper
│   │   ├── services/             # Serviços API
│   │   └── store/                # Redux store
│   ├── .env.local                # Variáveis de ambiente
│   ├── next.config.mjs           # Config Next.js
│   ├── tailwind.config.ts        # Config Tailwind
│   ├── package.json              # Dependências
│   └── yarn.lock                 # Lock de dependências
│
└── README.md                     # Este arquivo
```

---

## 🎮 Funcionalidades

### **Usuário Comum**
- ✅ Visualizar rifas disponíveis
- ✅ Comprar cotas de rifas
- ✅ Pagamento via PIX (Mercado Pago)
- ✅ Ver minhas cotas
- ✅ Histórico de pagamentos
- ✅ Acompanhar sorteios
- ✅ Ver ganhadores

### **Administrador**
- ✅ Criar/editar/excluir rifas
- ✅ Upload de imagens da rifa
- ✅ Definir números premiados
- ✅ Finalizar rifas
- ✅ Confirmar pagamentos manualmente
- ✅ Listar usuários
- ✅ Listar todos os pagamentos
- ✅ Relatórios de vendas

---

## 🗄️ Banco de Dados

### **Schema PostgreSQL**

#### **Tabela: admin_users**
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabela: common_users**
```sql
CREATE TABLE common_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabela: raffles**
```sql
CREATE TABLE raffles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date_description VARCHAR(100),
  medias_url TEXT[],
  cover_url TEXT,
  prize_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'open',
  prize_number INTEGER,
  gift_numbers TEXT[],
  gift_numbers_winners JSONB,
  initial_numbers_qtd INTEGER,
  min_quantity INTEGER,
  price_number DECIMAL(10,2),
  admin_user_id INTEGER REFERENCES admin_users(id),
  winner_common_user_id INTEGER REFERENCES common_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabela: payments**
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  raffle_id INTEGER REFERENCES raffles(id),
  common_user_id INTEGER REFERENCES common_users(id),
  value DECIMAL(10,2),
  raffles_quantity INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  pix_code TEXT,
  pix_qr_code TEXT,
  expires_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabela: users_raffle_number**
```sql
CREATE TABLE users_raffle_number (
  id SERIAL PRIMARY KEY,
  raffle_id INTEGER REFERENCES raffles(id),
  common_user_id INTEGER REFERENCES common_users(id),
  payment_id INTEGER REFERENCES payments(id),
  number INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Relacionamentos**

```
admin_users ─┬─< raffles
             │
common_users ─┼─< payments
             ├─< users_raffle_number
             └─< raffles (winner)

raffles ─────┬─< payments
            └─< users_raffle_number

payments ────┴─< users_raffle_number
```

---

## 🔌 API Endpoints

### **Autenticação**

```http
POST /auth/authenticate
Body: { "email": "admin@example.com", "password": "senha" }
Response: { "access_token": "jwt-token" }

POST /auth/verify-jwt
Headers: { "Authorization": "Bearer jwt-token" }
Response: { "ok": true, "user": {...} }
```

### **Rifas**

```http
GET /raffles/list
Response: { "ok": true, "raffles": [...], "total": 10 }

GET /raffles/:raffleId
Response: { "ok": true, "raffle": {...} }

POST /raffles/create (Admin)
Headers: { "Authorization": "Bearer jwt-token" }
Body: { "name": "...", "description": "...", ... }

POST /raffles/finish/:raffleId (Admin)
Headers: { "Authorization": "Bearer jwt-token" }
```

### **Pagamentos**

```http
POST /payment/generate-payment
Body: {
  "raffle_id": 1,
  "user_phone": "38999999999",
  "user_name": "João Silva",
  "raffles_quantity": 10
}
Response: {
  "ok": true,
  "payment": {
    "id": "...",
    "pix_code": "...",
    "pix_qr_code": "base64..."
  }
}

GET /payment/find-one/:paymentId
Response: { "ok": true, "payment": {...} }
```

### **Usuários**

```http
GET /common-user/list (Admin)
Headers: { "Authorization": "Bearer jwt-token" }
Response: { "ok": true, "users": [...] }

POST /common-user/create-or-return
Body: { "phone": "38999999999", "name": "João Silva" }
Response: { "ok": true, "user": {...} }
```

---

## 🚢 Deploy

### **Backend (API) - Produção**

#### **1. Build**

```bash
cd api
yarn build
```

#### **2. Variáveis de Ambiente**

Configurar `.env` com valores de produção:
- Trocar `DB_HOST` para servidor PostgreSQL
- Usar `JWT_SECRET` forte e único
- Configurar credenciais Cloudinary/Mercado Pago/SendGrid

#### **3. Executar**

```bash
yarn start:prod
```

### **Frontend (WEB) - Produção**

#### **1. Build**

```bash
cd web
yarn build
```

#### **2. Variáveis de Ambiente**

```env
NEXT_PUBLIC_API_URL=https://api.sortelancada.com
```

#### **3. Executar**

```bash
yarn start
```

### **Docker Compose (Recomendado)**

**Arquivo:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15.1
    environment:
      POSTGRES_USER: 
      POSTGRES_PASSWORD: 
      POSTGRES_DB: 
    ports:
      - "5436:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: ./api
    ports:
      - "1337:1337"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
    depends_on:
      - postgres

  web:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://api:1337
    depends_on:
      - api

volumes:
  postgres_data:
```

**Executar:**

```bash
docker-compose up -d
```

---

## 🔧 Troubleshooting

### **Problema: Porta 1337 já em uso**

```bash
# Encontrar processo usando porta
lsof -i :1337

# Matar processo
kill -9 PID

# Ou usar outra porta no .env
PORT=1338
```

### **Problema: Erro de conexão com banco**

```bash
# Verificar container rodando
docker ps | grep postgresql-sortelancada

# Verificar logs
docker logs postgresql-sortelancada

# Reiniciar container
docker restart postgresql-sortelancada
```

### **Problema: Erro ao instalar dependências**

```bash
# Limpar cache
yarn cache clean --all

# Remover node_modules e yarn.lock
rm -rf node_modules yarn.lock

# Reinstalar
yarn install
```

### **Problema: Build do frontend falha**

```bash
# Verificar versão ESLint
cat package.json | grep eslint
# Deve ser 8.57.1

# Limpar build anterior
rm -rf .next

# Rebuild
yarn build
```

---

## 📜 Licença

**Proprietário:** Lucas Dias  
**Licença:** Todos os direitos reservados  
**Uso:** Privado

---

## 👨‍💻 Desenvolvedor

**Lucas IT Dias**  
GitHub: [@lucasitdias](https://github.com/lucasitdias)  
Email: contato@sortelancada.com

---

## 📊 Métricas do Projeto

| Métrica | Valor |
|---------|-------|
| **Linhas de Código** | ~15.000 |
| **Arquivos TypeScript** | ~80 |
| **Componentes React** | ~40 |
| **Endpoints API** | 16 |
| **Tabelas Banco** | 6 |
| **Tempo Build** | ~30s |
| **Tempo Instalação** | ~45s |
| **Tamanho Build** | 135MB |

---

## 🔄 Histórico de Versões

### **v1.0.0** - 2025-11-21
- ✅ Lançamento inicial
- ✅ Sistema completo de rifas
- ✅ Pagamentos PIX via Mercado Pago
- ✅ Painel administrativo
- ✅ Upload de imagens Cloudinary
- ✅ Autenticação JWT
- ✅ Responsivo mobile-first

---

**Última atualização:** 2025-11-21 16:22:42 UTC  
**Status:** ✅ Produção  
**Ambiente validado:** 100%

---
