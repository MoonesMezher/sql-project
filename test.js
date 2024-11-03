const addSectionIdColToProducts = async () => {
    const columnName = 'section_id';
    const tableName = 'products';

    // Check if the column already exists
    const columnExists = async (table, column) => {
        const query = `
            SELECT COUNT(*) AS count 
            FROM information_schema.COLUMNS 
            WHERE TABLE_NAME = ? AND COLUMN_NAME = ? AND TABLE_SCHEMA = ?
        `;
        const [rows] = await pool.query(query, [table, column, process.env.DB]);
        return rows[0].count > 0;
    };

    const exists = await columnExists(tableName, columnName);
    if (!exists) {
        // Step 1: Add the column
        const alterTableQuery = `
            ALTER TABLE ?? 
            ADD COLUMN ?? INT;
        `;
        await pool.query(alterTableQuery, [tableName, columnName]);
        console.log(`Column ${columnName} added to ${tableName} successfully.`);

        // Step 2: Add the foreign key constraint
        const addForeignKeyQuery = `
            ALTER TABLE ?? 
            ADD CONSTRAINT fk_section_id 
            FOREIGN KEY (??) REFERENCES sections(id) ON DELETE SET NULL;
        `;
        await pool.query(addForeignKeyQuery, [tableName, columnName]);
        console.log(`Foreign key constraint added for ${columnName} in ${tableName} successfully.`);
    } else {
        console.log(`Column ${columnName} already exists in ${tableName}, no modification needed.`);
    }
};

// Call the function to add the column and foreign key
// addSectionIdColToProducts();