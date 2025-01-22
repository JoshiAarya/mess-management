import express from 'express';
import dotenv from 'dotenv';
import pool from './db/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.locals.pool = pool; // Assign the pool to app.locals

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
