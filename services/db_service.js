// Import the PostgreSQL library and create a connection pool
const { Pool } = require('pg');
const pool = new Pool();

// READ
// 1. Read single row by id
async function readById(tableName, id) {
  try {
    const query = `SELECT * FROM ${tableName} WHERE id = $1`;
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows.length ? rows[0] : null;
  } catch (error) {
    throw error;
  }
}

// 2. Read single row by where clause
async function readByWhere(tableName, whereClause) {
  try {
    const query = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
    const { rows } = await pool.query(query);
    return rows.length ? rows[0] : null;
  } catch (error) {
    throw error;
  }
}

// 3. Read multiple rows by where clause
async function readMultipleByWhere(tableName, whereClause) {
  try {
    const query = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

// 4. Read multiple rows by filter
async function readMultipleByFilter(tableName, filter) {
  try {
    const query = `SELECT * FROM ${tableName} WHERE ${filter}`;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

// 5. Read all rows from the table
async function readAll(tableName) {
  try {
    const query = `SELECT * FROM ${tableName}`;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

// WRITE
// 1. Write a single record
async function writeSingleRecord(tableName, record) {
  try {
    const columns = Object.keys(record).join(', ');
    const values = Object.values(record);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// 2. Write a batch transaction
async function writeBatchTransaction(tableName, records) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const record of records) {
      const columns = Object.keys(record).join(', ');
      const values = Object.values(record);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      await client.query(query, values);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// UPDATE
// 1. Update a single row by id
async function updateById(tableName, id, updateFields) {
  try {
    const columns = Object.keys(updateFields);
    const values = Object.values(updateFields);
    const placeholders = columns.map((col, index) => `${col} = $${index + 2}`).join(', ');
    const query = `UPDATE ${tableName} SET ${placeholders} WHERE id = $1 RETURNING *`;
    const allValues = [id, ...values];
    const { rows } = await pool.query(query, allValues);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// 2. Update multiple rows by where clause
async function updateMultipleByWhere(tableName, whereClause, updateFields) {
  try {
    const columns = Object.keys(updateFields);
    const values = Object.values(updateFields);
    const placeholders = columns.map((col, index) => `${col} = $${index + 3}`).join(', ');
    const query = `UPDATE ${tableName} SET ${placeholders} WHERE ${whereClause} RETURNING *`;
    const allValues = [...values, ...whereValues];
    const { rows } = await pool.query(query, allValues);
    return rows;
  } catch (error) {
    throw error;
  }
}

// DELETE
// 1. Delete a single row by id
async function deleteById(tableName, id) {
  try {
    const query = `DELETE FROM ${tableName} WHERE id = $1`;
    const values = [id];
    await pool.query(query, values);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  readById,
  readByWhere,
  readMultipleByWhere,
  readMultipleByFilter,
  readAll,
  writeSingleRecord,
  writeBatchTransaction,
  updateById,
  updateMultipleByWhere,
  deleteById,
};
