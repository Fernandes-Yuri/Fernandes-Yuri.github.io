# SmartKey BLE — Apresentação Interativa

Apresentação de 17 slides sobre a solução **SmartKey BLE** para gestão digital de chaves de frota — Programa Mais com Menos · Localiza.

Projeto refatorado em arquitetura **frontend / backend** separados, com autenticação JWT e conteúdo protegido.

---

## Estrutura de pastas

```
smartkey-ble/
├── frontend/
│   ├── index.html          # Página de login (senha)
│   ├── dashboard.html      # Apresentação de slides (protegida)
│   ├── css/
│   │   └── style.css       # Todos os estilos
│   ├── js/
│   │   ├── utils.js        # Funções auxiliares e constantes
│   │   ├── auth.js         # Autenticação JWT
│   │   └── slides.js       # Busca e renderiza slides dinamicamente
│   └── assets/             # Imagens / ícones (se houver)
└── backend/
    ├── server.js           # API Node.js + Express (esqueleto funcional)
    ├── package.json
    ├── .env.example        # Modelo de variáveis de ambiente
    └── data/
        └── content.json    # Conteúdo de todos os 17 slides
```

---

## Executar localmente (modo mock — sem backend)

O frontend pode rodar sem o backend em **modo mock**, que valida a senha localmente.

### Pré-requisitos
- Qualquer servidor HTTP local. Exemplo com Python:

```bash
cd frontend
python3 -m http.server 8080
```

Ou com Node.js (`npx serve`):

```bash
npx serve frontend -p 8080
```

### Ativar o modo mock

Antes de carregar `auth.js` e `slides.js`, defina `window.MOCK_MODE = true`.  
A forma mais simples é adicionar ao `<head>` de ambos os arquivos HTML:

```html
<script>window.MOCK_MODE = true;</script>
```

No modo mock:
- Senha de acesso: **`smartkey`** (hardcoded apenas em modo de desenvolvimento)
- O `content.json` é lido de `../backend/data/content.json`
- Nenhuma requisição de rede é feita

---

## Configurar e executar o backend

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Criar o arquivo `.env`

```bash
cp .env.example .env
```

Edite `.env` com seus valores reais:

| Variável        | Descrição                                      |
|-----------------|------------------------------------------------|
| `SECRET_KEY`    | Chave JWT — use uma string aleatória longa     |
| `SENHA_ACESSO`  | Senha de acesso à apresentação                 |
| `PORT`          | Porta do servidor (padrão: 3000)               |
| `ALLOWED_ORIGIN`| Domínio do frontend (para CORS)                |

### 3. Iniciar o servidor

```bash
# Produção
npm start

# Desenvolvimento (com hot-reload via nodemon)
npm run dev
```

O servidor sobe em `http://localhost:3000`.

---

## Rotas da API

| Método | Endpoint      | Auth | Descrição                         |
|--------|---------------|------|-----------------------------------|
| POST   | `/api/auth`   | ✗    | Recebe `{ senha }`, retorna JWT   |
| GET    | `/api/slides` | JWT  | Retorna o `content.json` completo |
| GET    | `/api/health` | ✗    | Healthcheck                       |

### Exemplo de autenticação

```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"senha":"smartkey2025"}'
```

Resposta:
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Exemplo de busca dos slides

```bash
curl http://localhost:3000/api/slides \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Conectar o frontend ao backend real

1. No arquivo `frontend/js/utils.js`, substitua:

```js
const API_BASE = 'https://seudominio.com';
```

pelo endereço real do seu backend.

2. **Remova** `window.MOCK_MODE = true` dos HTMLs (se tiver adicionado).

3. Certifique-se de que o `ALLOWED_ORIGIN` no `.env` aponta para o domínio do frontend.

---

## Hospedar o frontend no GitHub Pages

1. Crie um repositório no GitHub.
2. Faça push da pasta `frontend/` (ou do repositório inteiro).
3. Em **Settings → Pages**, configure a branch e a pasta `/frontend` como root.
4. Acesse via `https://seuusuario.github.io/nome-do-repo/`.

> **Atenção:** O backend precisa estar em um servidor separado (ex: Railway, Render, Fly.io, VPS).
> O GitHub Pages serve apenas arquivos estáticos.

---

## Informações sensíveis removidas

O projeto foi refatorado para **não conter** nenhuma das seguintes informações:
- Nome completo do autor
- Matrícula funcional
- Senhas hardcoded no frontend
- Dados pessoais identificáveis nos slides

O slide 16 ("Perspectiva do Pátio") exibe informações institucionais genéricas (`Colaborador de Operações`).

---

## Tecnologias utilizadas

| Camada   | Tecnologia                              |
|----------|-----------------------------------------|
| Frontend | HTML5, CSS3, JavaScript puro (Vanilla)  |
| Fontes   | Google Fonts (Syne + DM Sans)           |
| Ícones   | Font Awesome 6                          |
| Backend  | Node.js + Express                       |
| Auth     | JSON Web Tokens (jsonwebtoken)          |
| Config   | dotenv                                  |
