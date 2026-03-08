import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function connect() {
    if (global.connection) {
        return global.connection.connect();
    }

    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING,
    });

    const client = await pool.connect();
    console.log("Pool created!");
    
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);

    global.connection = pool;
    return pool.connect();
}

export default connect; 