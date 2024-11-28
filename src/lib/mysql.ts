import mysql from 'mysql2/promise';

export async function connectDb() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'telinveste',
      port: 3306
    });

    // Test the connection
    await connection.ping();
    
    return connection;
  } catch (error) {
    console.error('MySQL Connection Error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

export async function closeDb(connection: mysql.Connection) {
  try {
    await connection.end();
  } catch (error) {
    console.error('MySQL Close Connection Error:', error);
    throw error;
  }
}
