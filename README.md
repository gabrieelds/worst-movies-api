# Nome do Projeto

## Descrição

Este é um projeto baseado em Node.js utilizando o framework NestJS e banco de dados SQLite3. A API processa arquivos CSV contendo informações sobre os piores filmes de cada e apresenta os intervalos de premiações dos produtores.

## Requisitos

- Node.js 20.16.0
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. **Clone o repositório:**
   git clone https://github.com/gabrieelds/worst-movies-api.git

2. **Navegue para o diretório do projeto:**
  cd worst-movies-api

3. **Instale as dependências:**
  npm i

## Execução

1. **Inicie a API:**
  npm run start
  O servidor será iniciado por padrão na porta 3000.

## Endpoints da API

1. **Upload do arquivo CSV**
  Endpoint: /movies
  Método: POST
  Envia um arquivo CSV contendo uma lista de filmes para processamento.
  O arquivo deverá ter seu delimitador ";" contendo o cabeçalho:
    year: number
    title: string
    studios: string
    producers: string
    winner: yes / null

2. **Obter intervalos entre premiações**

  Endpoint: /movies/intervals
  Método: GET
  Retorna os maiores e menores intervalos de premiações dos produtores.

## Testes

  O projeto conta apenas com testes de integração. Para executá-los, rode o comando:
  npm run test:e2e