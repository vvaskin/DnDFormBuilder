import mysql from 'mysql2';
import 'dotenv/config';

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();

export async function getForms() {
    const [rows] = await pool.query('SELECT * FROM forms');
    return rows;
}

export async function createForm(title, components) {
    const componentsString = JSON.stringify(components);
    const [result] = await pool.query('INSERT INTO forms (title, components) VALUES (?, ?)', [title, componentsString]);
    return result.insertId;
}

export async function createResponse(formId, responseData) {
    const responseString = JSON.stringify(responseData);
    const [result] = await pool.query('INSERT INTO responses (form_id, response) VALUES (?, ?)', [formId, responseString]);
    return result.insertId;
}

export async function getFormById(id) {
    const [rows] = await pool.query('SELECT * FROM forms WHERE id = ?', [id]);
    return rows[0];
}

export async function updateForm(id, title, components) {
    const componentsString = JSON.stringify(components);
    console.log('Components string: ', componentsString);
    const [result] = await pool.query('UPDATE forms SET title = ?, components = ? WHERE id = ?', [title, componentsString, id]);
    return result.affectedRows;
}

export async function deleteForm(id) {
    const [result] = await pool.query('DELETE FROM forms WHERE id = ?', [id]);
    return result
}


export default pool;