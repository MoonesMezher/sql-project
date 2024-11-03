// MySQL Connection
const mysql = require('mysql2/promise'); // Using the promise version

const dbConfig = {
    host: process.env.HOST,
    user: process.env.USER, // replace with your MySQL username -NOTE: dont use this process.env.USERNAME 
    password: process.env.PASSWORD, // replace with your MySQL password
    database: process.env.DB, // replace with your database name
};

const pool = mysql.createPool(dbConfig);

const setupeSchema = async () => {
    const tables = [
        {
            table: 'sections',
            schema: `
                CREATE TABLE IF NOT EXISTS ?? (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    subtitle VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `
        },
        {
            table: 'products',
            schema: `
                CREATE TABLE IF NOT EXISTS ?? (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    subtitle VARCHAR(255) NOT NULL,
                    price INT NOT NULL,
                    section_id INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
                )
            `
        },
        {
            table: 'images',
            schema: `
                CREATE TABLE IF NOT EXISTS ?? (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    url VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `
        },
    ]

    await Promise.all(tables.map(async ({ table, schema }) => {
        await createTable(table, schema)
    }))

    console.log('setup tables successfully')
}

const createTable = async (table, schema) => {
    await pool.query(schema, [table]);
}

const db = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`Mysql database is connecting successfully`);
        setupeSchema();
        connection.release()
    } catch (error) {
        console.log(error.message);        
    }
}

const find = async (table) => {
    const [rows] = await pool.query('SELECT * FROM ??', [table]);

    return rows;
}

const findBy = async (table, condition) => {
    const [rows] = await pool.query(`SELECT * FROM ?? WHERE ?`, [table, condition]);

    return rows;
}

const create = async (table, data) => {
    const [result] = await pool.query('INSERT INTO ?? SET ?', [table, data]);

    const output = findBy(table, { id: result.insertId })

    return output; // Return the ID of the newly created record
}

// Update a record in a table
const update = async (table, data, condition) => {
    const [result] = await pool.query('UPDATE ?? SET ? WHERE ?', [table, data, condition]);

    const output = findBy(table, { id: condition.id })

    return output; // Return the number of affected rows
}

// Delete a record from a table
const del = async (table, condition) => {
    const [result] = await pool.query('DELETE FROM ?? WHERE ?', [table, condition]);

    const output = findBy(table, { id: condition.id })

    return output; // Return the number of affected rows
}

module.exports = {
    db,
    find,
    findBy,
    create,
    update,
    del,
};