# 🔐 Microsserviço de Autenticação

Microsserviço de autenticação desenvolvido com **Node.js, Express e MySQL**, acompanhado de uma interface web para cadastro e login de usuários.

O projeto implementa operações de cadastro e autenticação, armazenamento de usuários em banco de dados relacional e proteção de senhas utilizando hash com `bcryptjs`.

## ✨ Funcionalidades

- **Cadastro de usuários:** registro com nome, sobrenome, e-mail e senha.
- **Autenticação:** verificação das credenciais durante o login.
- **Proteção de senhas:** utilização de `bcryptjs` para gerar e verificar hashes.
- **Validação de dados:** verificação dos campos obrigatórios e do tamanho mínimo da senha.
- **Prevenção de SQL Injection:** utilização de consultas parametrizadas.
- **Verificação de contas:** bloqueio de login para contas desativadas.
- **Validação de e-mail duplicado:** tratamento de conflitos durante o cadastro.
- **Interface web:** páginas HTML para cadastro, login e acesso à aplicação.
- **Configuração por ambiente:** utilização de variáveis de ambiente para configurar o servidor e a conexão com o banco de dados.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js | Ambiente de execução JavaScript |
| Express 5 | Criação do servidor HTTP e das rotas da API |
| MySQL | Banco de dados relacional |
| mysql2 | Conexão e execução de consultas SQL |
| bcryptjs | Hash e verificação de senhas |
| dotenv | Carregamento de variáveis de ambiente |
| CORS | Configuração do compartilhamento de recursos entre origens |
| HTML5 | Estrutura das páginas web |
| CSS3 | Estilização da interface |
| JavaScript | Interatividade e comunicação com a API |
| Axios | Realização de requisições HTTP pelo frontend |
| Nodemon | Reinicialização automática do servidor durante o desenvolvimento |

## 📁 Estrutura do projeto

```text
microservico-auth/
├── backend/
│   ├── node_modules/
│   ├── .env
│   ├── atualização tabela.sql
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── app.js
│   ├── auth.js
│   ├── cadastro.html
│   ├── index.html
│   ├── login.html
│   └── style.css
│
├── .gitignore
└── README.md
```

**Principais arquivos:**

- `backend/server.js`: inicialização do servidor, definição das rotas de cadastro e login e tratamento das requisições.
- `backend/db.js`: configuração do pool de conexões com o MySQL.
- `backend/atualização tabela.sql`: script SQL para criação da tabela de usuários.
- `backend/.env`: configurações locais e credenciais de acesso ao banco de dados.
- `frontend/auth.js`: comunicação com a API e tratamento dos formulários de cadastro e login.
- `frontend/cadastro.html`: página de cadastro de usuários.
- `frontend/login.html`: página de autenticação.
- `frontend/index.html`: página principal da interface.
- `frontend/style.css`: estilos da interface.

## ⚙️ Pré-requisitos

Antes de iniciar, instale:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) ou um servidor MySQL acessível.
- Git, para clonar o repositório.

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/desenvolvedorback/microservico-auth.git
```

Entre na pasta do projeto:

```bash
cd microservico-auth
```

### 2. Instale as dependências do backend

```bash
cd backend
npm install
```

O comando instala as dependências declaradas no `package.json`, sem necessidade de versionar ou enviar a pasta `node_modules` ao GitHub.

### 3. Configure o banco de dados

Crie o banco de dados `app_estoque` no MySQL:

```sql
CREATE DATABASE IF NOT EXISTS app_estoque;
```

Em seguida, execute o script `backend/atualização tabela.sql` para criar a tabela de usuários.

O script define a seguinte estrutura:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | INT | Identificador do usuário |
| `nome` | VARCHAR(60) | Nome |
| `sobrenome` | VARCHAR(60) | Sobrenome |
| `email` | VARCHAR(100) | E-mail único |
| `senha` | VARCHAR(255) | Hash da senha |
| `ativo` | BOOLEAN | Estado da conta |
| `criado_em` | TIMESTAMP | Data e hora de criação |

O campo `email` possui uma restrição de unicidade, enquanto `ativo` permite identificar contas desativadas.

### 4. Configure as variáveis de ambiente

Crie o arquivo `.env` dentro da pasta `backend`:

```env
PORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=app_estoque
DB_PORT=3306
```

Substitua os valores pelos dados correspondentes à sua instalação do MySQL.

> **Importante:** não compartilhe o arquivo `.env` nem envie credenciais reais para o GitHub. Utilize valores fictícios em exemplos de configuração.

### 5. Inicie o servidor

Dentro da pasta `backend`, execute:

**Modo de desenvolvimento:**

```bash
npm run dev
```

**Modo de execução normal:**

```bash
npm start
```

Por padrão, o backend utiliza a porta `3001`. Se a variável `PORT` estiver definida, o servidor utilizará o valor configurado.

Quando iniciado, o servidor disponibiliza as rotas de autenticação.

## 🌐 Frontend

A interface web utiliza HTML, CSS e JavaScript para apresentar os formulários e enviar os dados à API.

Para visualizar as páginas, abra os arquivos HTML com um servidor estático local, como a extensão Live Server do Visual Studio Code.

**Importante:** antes de testar o cadastro e o login, confira a URL base configurada em `frontend/auth.js`:

```javascript
const authApi = axios.create({
  baseURL: 'http://localhost:3007/api/auth'
});
```

O backend utiliza a porta `3001` por padrão. Para que o frontend se conecte a ele na configuração padrão, ajuste a URL para:

```javascript
const authApi = axios.create({
  baseURL: 'http://localhost:3001/api/auth'
});
```

Se preferir utilizar a porta `3007`, configure o backend para utilizar essa mesma porta. O essencial é que os dois lados estejam alinhados.

## 📡 Endpoints da API

A API disponibiliza os seguintes endpoints:

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/cadastro` | Cadastra um usuário |
| `POST` | `/api/auth/login` | Autentica um usuário |

### Cadastro de usuário

**Requisição:**

```http
POST /api/auth/cadastro
Content-Type: application/json
```

**Corpo da requisição:**

```json
{
  "nome": "Maria",
  "sobrenome": "Silva",
  "email": "maria@example.com",
  "senha": "senha123"
}
```

**Resposta de sucesso — HTTP 201:**

```json
{
  "mensagem": "Usuário cadastrado com sucesso!",
  "usuarioId": 1
}
```

O endpoint valida os campos obrigatórios, exige uma senha de pelo menos seis caracteres, gera um hash da senha e tenta inserir o usuário no banco de dados.

### Login de usuário

**Requisição:**

```http
POST /api/auth/login
Content-Type: application/json
```

**Corpo da requisição:**

```json
{
  "email": "maria@example.com",
  "senha": "senha123"
}
```

**Exemplo de resposta de sucesso — HTTP 200:**

```json
{
  "mensagem": "Login realizado com sucesso!",
  "usuario": {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@example.com"
  }
}
```

A autenticação verifica se o usuário existe, se a conta está ativa e se a senha corresponde ao hash armazenado.

No frontend atual, os dados básicos do usuário autenticado são armazenados no `sessionStorage` do navegador.

## ⚠️ Códigos de resposta

Entre os códigos de resposta previstos na implementação atual estão:

| Código HTTP | Situação |
|---|---|
| `200` | Login realizado com sucesso |
| `201` | Usuário cadastrado com sucesso |
| `400` | Campos obrigatórios ausentes ou senha abaixo do tamanho mínimo |
| `401` | Credenciais inválidas |
| `403` | Conta desativada |
| `409` | E-mail já cadastrado |
| `500` | Erro interno durante o cadastro ou login |

## 🔒 Segurança

O projeto utiliza algumas medidas importantes para a proteção das credenciais e dos dados:

- **Hash de senhas:** as senhas são processadas com `bcryptjs` antes de serem armazenadas.
- **Consultas parametrizadas:** as operações SQL utilizam parâmetros para inserir e consultar dados.
- **Validação de entrada:** campos obrigatórios e comprimento mínimo da senha são verificados no backend.
- **Credenciais externas ao código:** os dados de conexão com o MySQL são carregados por variáveis de ambiente.
- **Tratamento de erros:** as rotas retornam respostas HTTP para situações de sucesso e falha.

### Limitações conhecidas

O projeto está em desenvolvimento e algumas funcionalidades de segurança podem ser aprimoradas.

- O login atual não emite tokens JWT.
- O armazenamento dos dados do usuário no `sessionStorage`, isoladamente, não protege rotas ou recursos no servidor.
- Não há limitação de tentativas de login implementada nas rotas analisadas.
- O CORS está habilitado sem restrição explícita de origens no código atual.
- O tamanho mínimo da senha é de seis caracteres; uma política de senhas mais robusta pode ser adotada.

Para utilização em produção, recomenda-se implementar autorização no backend, limitar tentativas de autenticação, configurar as origens permitidas no CORS e utilizar HTTPS.

## 🧪 Testes

Você pode testar os endpoints utilizando ferramentas como Postman ou Insomnia.

1. Inicie o servidor backend.
2. Confirme a conexão com o MySQL.
3. Envie uma requisição `POST` para `/api/auth/cadastro`.
4. Faça login com o e-mail e a senha cadastrados.
5. Teste os casos de erro, como campos ausentes, senha inválida e e-mail duplicado.

O script `test` presente no `package.json` ainda não executa testes automatizados do projeto.

## 🎯 Objetivo do projeto

O projeto tem como objetivo desenvolver e demonstrar um microsserviço de autenticação utilizando tecnologias do ecossistema Node.js, com persistência de dados em MySQL e uma interface web para interação com os endpoints.

A estrutura permite evoluir a solução com novas funcionalidades, como emissão de tokens JWT, autorização de rotas, recuperação de senha, testes automatizados e documentação interativa da API.

## 📄 Licença

MIT License

Copyright (c) 2026 Davi Leonardo.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

Desenvolvido por **Davi Leonardo**.