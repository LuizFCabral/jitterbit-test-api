import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
});

pool.query('SELECT NOW()')
    .then(res => console.log('Conectado ao banco em:', res.rows[0].now))
    .catch(err => console.error('Erro ao conectar ao banco:', err));


export default pool; 