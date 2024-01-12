# Books API

This project is a bookshelf app that allows you to select and search books by any text field.
 
## Quick start

1. Make sure dockerd is running in your local
2. Start container: `docker compose up`

The application will start at `http://localhost:3000`

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
