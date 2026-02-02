const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db/connection');

// GET all numbers
router.get('/numbers', async (req, res) => {
    try {
        const pool = await getPool();
        const request = pool.request();
        
        const result = await request.query(`
            SELECT id, value, created_at 
            FROM NumberDB.dbo.Numbers 
            ORDER BY created_at DESC
        `);
        
        const total = result.recordset.reduce((sum, num) => sum + num.value, 0);
        
        return res.status(200).json({
            numbers: result.recordset,
            count: result.recordset.length,
            total: total,
            message: 'Numbers retrieved successfully'
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve numbers'
        });
    }
});

// POST new number
router.post('/numbers', async (req, res) => {
    const { number } = req.body;
    
    if (number === undefined || isNaN(number)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Valid number is required'
        });
    }
    
    try {
        const pool = await getPool();
        const request = pool.request();
        
        await request
            .input('number', sql.Float, parseFloat(number))
            .query(`
                INSERT INTO NumberDB.dbo.Numbers (value) 
                VALUES (@number)
            `);
        
        // Get updated data
        const allResult = await request.query(`
            SELECT id, value, created_at 
            FROM NumberDB.dbo.Numbers 
            ORDER BY created_at DESC
        `);
        
        const total = allResult.recordset.reduce((sum, num) => sum + num.value, 0);
        
        return res.status(201).json({
            number: parseFloat(number),
            numbers: allResult.recordset,
            total: total,
            count: allResult.recordset.length,
            message: 'Number added successfully'
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to add number'
        });
    }
});

// DELETE all numbers (bonus feature)
router.delete('/numbers', async (req, res) => {
    try {
        const pool = await getPool();
        const request = pool.request();
        
        await request.query('DELETE FROM NumberDB.dbo.Numbers');
        
        return res.status(200).json({
            message: 'All numbers cleared successfully',
            numbers: [],
            total: 0,
            count: 0
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to clear numbers'
        });
    }
});

module.exports = router;