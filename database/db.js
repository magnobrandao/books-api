const pg = require('pg');

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: +process.env.DB_POOL || 20,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 10000
});

pool.once('connect', () => {
    console.log('Creating books table')
    return pool.query(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;

        CREATE OR REPLACE FUNCTION generate_searchable(_name TEXT, _authors TEXT[], _description TEXT)
            RETURNS TEXT AS $$
            BEGIN
            RETURN _name || ARRAY_TO_STRING(_authors, '|') || _description;
            END;
        $$ LANGUAGE plpgsql IMMUTABLE;

        CREATE TABLE IF NOT EXISTS books (
            id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
            name TEXT UNIQUE NOT NULL,
            authors TEXT ARRAY NOT NULL,
            description TEXT NOT NULL,
            imageLink TEXT,
            publishedAt DATE NOT NULL,
            createdAt DATE NOT NULL,
            searchable TEXT GENERATED ALWAYS AS (generate_searchable(name, authors, description)) STORED
        );

        CREATE INDEX IF NOT EXISTS idx_books_searchable ON public.books USING gist (searchable public.gist_trgm_ops (siglen='64'));

       
        INSERT INTO books (name, authors, description, imageLink, publishedAt, createdAt)
        SELECT 'To Kill a Mockingbird', ARRAY['Harper Lee'], 'A classic novel exploring racial injustice and moral growth in the American South during the 1930s.', 'https://m.media-amazon.com/images/I/71FxgtFKcQL._SL1500_.jpg', '1960-07-11'::date, '2024-01-11'::date
        WHERE NOT EXISTS (SELECT 1 FROM books)
        UNION
        SELECT '1984', ARRAY['George Orwell'], 'Dystopian novel depicting a totalitarian society and the consequences of government overreach.', 'https://m.media-amazon.com/images/I/615Z8aLlDXL._AC_SL1500_.jpg]', '1949-06-08'::date, '2024-01-11'::date
        WHERE NOT EXISTS (SELECT 1 FROM books)
        UNION
        SELECT 'The Great Gatsby', ARRAY['F. Scott Fitzgerald'], 'A tale of wealth, love, and the American Dream set in the Roaring Twenties.', 'https://m.media-amazon.com/images/I/819wCzUTZWL._SL1500_.jpg]', '1925-04-10'::date, '2024-01-11'::date
        WHERE NOT EXISTS (SELECT 1 FROM books)
        UNION
        SELECT 'One Hundred Years of Solitude', ARRAY['Gabriel Garcia Marquez'], 'Magical realist novel chronicling the Buendía families history in the fictional town of Macondo.', 'https://m.media-amazon.com/images/I/81MI6+TpYkL._SL1500_.jpg', '1967-05-30'::date, '2024-01-11'::date
        WHERE NOT EXISTS (SELECT 1 FROM books)
        UNION
        SELECT 'The Catcher in the Rye', ARRAY['J.D. Salinger'], 'A coming-of-age novel narrated by a disenchanted teenager, Holden Caulfield, in New York City.', 'https://m.media-amazon.com/images/I/91HPG31dTwL._SL1500_.jpg', '1951-07-16'::date, '2024-01-11'::date
        WHERE NOT EXISTS (SELECT 1 FROM books)
        UNION
        SELECT 'The Lord of the Rings', ARRAY['J.R.R. Tolkien'], 'Epic high-fantasy novel exploring the journey to destroy the One Ring and defeat the dark lord Sauron.', 'https://m.media-amazon.com/images/I/412JSB73D2L.jpg', '1954-07-29'::date, '2024-01-11'::date
        WHERE NOT EXISTS (SELECT 1 FROM books)
        UNION
        SELECT 'The Hitchhiker''s Guide to the Galaxy', ARRAY['Douglas Adams'], 'Comic science fiction series following the misadventures of an unwitting human, Arthur Dent, as he travels through space.', 'https://m.media-amazon.com/images/I/81A43ktJSjL._SL1207_.jpg', '1979-10-12'::date, '2024-01-11'::date
        WHERE NOT EXISTS (SELECT 1 FROM books)
        UNION
        SELECT 'Good Omens', ARRAY['Neil Gaiman', 'Terry Pratchett'], 'Humorous fantasy novel about an angel and demon working together to prevent the apocalypse.', 'https://m.media-amazon.com/images/I/91ZNU0CzphL._SL1500_.jpg', '1990-05-01'::date, '2024-01-11'::date
        WHERE NOT EXISTS (SELECT 1 FROM books);
    `)
});

(() => {
    pool.connect()
        .then(() => {
            console.log('DB connected')
        })
        .catch(() => {
            console.error('Error on connect to DB')
        })
})()

pool.on('error', pool.connect);

const query = async (query, params) => {
    const start = Date.now()
    const res = await pool.query(query, params)
    const duration = Date.now() - start
    console.log('executed query', { duration, rows: res.rowCount })
    return res;
}

module.exports = {
    query,
};