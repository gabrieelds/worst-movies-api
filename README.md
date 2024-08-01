# worst-movies-api

Essa é uma API que processa arquivos CSV contendo informações sobre os piores filmes de cada ano e apresenta os intervalos de premiações dos produtores.

### 📋 Pré-requisitos

- Node.js 20.16.0
- npm

### 🔧 Instalação

1. **Clone o repositório:**
  ```
   git clone https://github.com/gabrieelds/worst-movies-api.git
  ```

2. **Navegue para o diretório do projeto:**
  ```
  cd worst-movies-api
  ```

3. **Instale as dependências:**
  ```
  npm i
  ```

## 🚀 Executando o projeto
  O servidor será iniciado por padrão na porta 3000.

1. **Inicie a API:**
  ```
  npm run start
  ```

## ✳️ Endpoints

1. **Upload do arquivo CSV**

  Endpoint: /movies

  Entrada: movielist - file

  Método: POST

  Envia um arquivo CSV  contendo uma lista de filmes para processamento.
  O arquivo deverá ter seu delimitador ";" contendo o cabeçalho:

    ```
    year: number

    title: string

    studios: string

    producers: string

    winner: yes / null
    ```


2. **Obter intervalos entre premiações**

  Endpoint: /movies/intervals
  
  Método: GET

  Retorna os maiores e menores intervalos de premiações dos produtores.


## ⚙️ Executando os testes

  O projeto conta apenas com testes de integração. Para executá-los, rode o comando:
  ```
  npm run test:e2e
  ```

## 🛠️ Construído com

* [Node.js](https://nodejs.org/) - Ambiente utilizado
* [NestJS](https://nestjs.com/) - Framework utilizado
* [npm](https://www.npmjs.com/) - Gerente de Dependência
* [SQLite3](https://www.sqlite.org/) - Banco de dados
