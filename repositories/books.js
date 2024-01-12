const db = require('../database/db');

const BOOKS_TABLE = 'books';
const BOOK_FIELDS = `
    *
`;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const DEFAULT_SEARCH_LIMIT = 20;

const findAll = async (page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) => {
    const selectQuery = `
        SELECT
            ${BOOK_FIELDS}
        FROM
            ${BOOKS_TABLE}
        OFFSET
            $1
        LIMIT
            $2
    `
    const countQuery = `
    SELECT
        count(*)
    FROM
        ${BOOKS_TABLE}
    `
    const offset = (page - 1) * limit;
    const [result, countTotal] = await Promise.all([
        db.query(selectQuery, [offset, limit]),
        db.query(countQuery)
    ]);
    const hasMore = (result.rowCount + offset) < countTotal.rows[0].count
    return {
        data: result.rows,
        hasMore,
        page,
        limit
    };
}

const searchByText = async (text) => {
    const selectQuery = `
        SELECT
            ${BOOK_FIELDS}
        FROM
            ${BOOKS_TABLE}
        WHERE
            searchable ILIKE $1
        LIMIT
            ${DEFAULT_SEARCH_LIMIT}
    `

    const result = await db.query(selectQuery, [`%${text}%`])
    return {
        data: result.rows
    }
}


const findById = async (id) => {
    const selectQuery = `
        SELECT
            ${BOOK_FIELDS}
        FROM
            ${BOOKS_TABLE}
        WHERE
            id = $1
    `;
    const result = await db.query(selectQuery, [id]);
    return { data: result.rows[0] };
}

module.exports = {
    findAll,
    searchByText,
    findById
}