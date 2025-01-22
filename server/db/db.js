import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.connect((err) => {
    if(err){
        console.error("Error connecting to db", err);
    }
    else{
        console.log("Connected to postgres db");
    }
});

export default pool;
