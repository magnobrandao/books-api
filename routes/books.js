const { Router } = require('express');
const { findAll, findById, searchByText } = require('../repositories/books');
const { NotFoundError } = require('../errors')

booksApi = Router();

booksApi.get("/", async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await findAll(page, limit);
        if (result.data.length == 0) {
            throw new NotFoundError()
        }
        return res.json(result).end();
    } catch (err) {
        return next(err);
    }
})

booksApi.get("/search", async (req, res, next) => {
    try {
        const { text, page, limit } = req.query;
        const result = await searchByText(text, page, limit);
        if (result.data.length == 0) {
            throw new NotFoundError()
        }
        return res.json(result).end();
    } catch (err) {
        return next(err);
    }
})

booksApi.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await findById(id);
        if (!result.data) {
            throw new NotFoundError()
        }
        return res
            .json(result)
            .end();
    } catch (err) {
        return next(err);
    }
})

module.exports = booksApi;