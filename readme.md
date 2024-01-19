# Books API

This project is a bookshelf app that allows you to select and search books by any text field.
 

## 🔗 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: docker e node.js. Você também vai precisar de um editor de código, recomendo o VS Code. 

## Rodando o Projeto

```bash

# Clone este repositório (ou download )

 git clone git@github.com:magnobrandao/books-api.git

# Acesse a pasta do projeto no terminal/cmd

  $ cd books-api

# Rode o docker compose

  $ docker compose up

```
Sua aplicação estará rodando em `http://localhost:3000`

## Backend Server

To simplify your development process, we've provided a backend server for you to develop against. The provided API contains the following methods:

* [`GET /books?page=1&limit=5`](#findall)
* [`GET /books/:id`](#findbyid)
* [`GET /books?text=ring&?page=1&limit=5`](#search)

### `getAll`

Response:

```json
{
    "data": [ /* books */ ],
    "hasMore": true,
    "page": 1,
    "limit": 5
}
```

* Returns the response containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `findbyid`

Response:

```json
{
    "data": { /* book */}
}
```

* book: `<Object>` containing book information

### `search`

Response:

```json
    {
        "data": [ /* books */ ]
    }
```

* query: `<String>`
* Returns a JSON-like object containing a collection of a maximum of 20 book objects.
