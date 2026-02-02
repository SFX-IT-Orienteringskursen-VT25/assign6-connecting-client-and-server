const sql = require('mssql');

const dbConfig = {
    server: 'localhost',
    database: 'master',
    user: 'sa',
    password: 'YourPassword123!',
    port: 1433,
    options: {
        enableArithAbort: true,
        trustServerCertificate: true,
        encrypt: false
    }
};

let pool;

const getPool = async () => {
    if (!pool) {
        pool = new sql.ConnectionPool(dbConfig);
        await pool.connect();
        console.log('Connected to SQL Server');
        await initializeDatabase();
    }
    return pool;
};

const initializeDatabase = async () => {
    try {
        const request = pool.request();
        
        // Create database if it doesn't exist
        await request.query(`
            IF NOT EXISTS(SELECT name FROM master.dbo.sysdatabases WHERE name = 'NumberDB')
            CREATE DATABASE NumberDB
        `);
        
        // Switch to NumberDB
        await request.query('USE NumberDB');
        
        // Create table if it doesn't exist
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Numbers' and xtype='U')
            CREATE TABLE Numbers (
                id INT IDENTITY(1,1) PRIMARY KEY,
                value FLOAT NOT NULL,
                created_at DATETIME2 DEFAULT GETDATE()
            )
        `);
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

module.exports = { getPool, sql };