# 📈 Match Exchange API

API RESTful para simulação de uma exchange de criptomoedas (BTC/USD), com suporte a matching de ordens em tempo real usando Redis, BullMQ e Socket.IO.

---

## 🚀 Funcionalidades

- Autenticação via JWT
- Criação e cancelamento de ordens (buy/sell)
- Livro de ofertas (asks/bids)
- Histórico de negociações por usuário
- Matching automático com fila Redis
- Estatísticas em tempo real
- Documentação Swagger

---

## 🛠️ Tecnologias

- Node.js + Express + TypeScript
- TypeORM + MySQL
- Redis + BullMQ
- Swagger (OpenAPI 3.0)
- Socket.IO

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 🐳 Subindo dependências com Docker

Execute o seguinte comando para subir MySQL e Redis:

```bash
docker compose up -d
```

Banco de dados:

- Host: `localhost`
- Porta: `3306`
- Database: `match_exchange`
- Usuário: `match`
- Senha: `match123`

Redis:

- Porta: `6379`

---

## 📦 Instalação do projeto

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/match-exchange-api.git
cd match-exchange-api
npm install
```

---

## ▶️ Como subir a aplicação

### 🔧 Modo desenvolvimento (hot reload + watcher)

Esse modo usa `tsx` para auto-recarregar ao alterar arquivos `.ts`.

1. **Suba os serviços com Docker** (MySQL + Redis):

```bash
docker compose up -d
```

2. **Instale as dependências** (se ainda não fez):

```bash
npm install
```

3. **Rode o servidor principal:**

```bash
npm run dev
```

4. **Em outro terminal, rode o worker (processa os matches):**

```bash
npm run worker
```

> 💡 Use dois terminais ou dois painéis no VSCode para deixar o `dev` e `worker` rodando ao mesmo tempo.

---

### 🚀 Modo produção (build + execução)

1. **Compile o TypeScript:**

```bash
npm run build
```

2. **Inicie a aplicação compilada:**

```bash
npm start
```

> Isso executa o `dist/server.js` gerado no build.

3. (Opcional) Rode o worker também no modo produção:

```bash
node dist/common/queue/matchDaemon.js
```

---

## 🧪 Acessando a API

- Documentação Swagger:  
  👉 [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## 🔐 Exemplo de autenticação

```json
POST /api/v1/auth/login
{
  "username": "lais"
}
```

Retorna:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "username": "lais",
    "usdBalance": "929469.58",
    "btcBalance": "59.47999999"
  }
}
```

Use esse token como `Bearer Token` nas rotas autenticadas.

---

## 📡 WebSocket

Socket.IO escutando em `/` para eventos como:

- `matchExecuted`
- `orderBookUpdated`
- `yourOrderMatched`

---

## 📁 Estrutura de pastas

```
src/
├── auth/
├── common/
├── orders/
├── user/
└── docs/            # swagger.yaml
```

---

## ✅ Dicas úteis

- Verifique se o banco está com as tabelas criadas após `npm run build`
- Para resetar o banco, pare o container e remova o volume:

```bash
docker compose down -v
```

- Para resetar o projeto do zero:

```bash
rm -rf node_modules dist
npm install
npm run build
```

---



