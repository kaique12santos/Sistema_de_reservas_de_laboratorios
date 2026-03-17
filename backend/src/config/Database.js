import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10, 
      queueLimit: 0,
    };
  }

  // Método para inicializar o Pool
  init() {
    if (!this.pool) {
      this.pool = mysql.createPool(this.config);
    }
    return this.pool;
  }

  // Método para testar a conexão (útil no startup do servidor)
  async checkConnection() {
    try {
      if (!this.pool) this.init(); // Garante que o pool existe
      
      // Faz uma query leve apenas para testar
      const connection = await this.pool.getConnection();
      await connection.query('SELECT 1'); 
      connection.release(); // Sempre liberar a conexão de volta pro pool!
      
      return true;
    } catch (error) {
      console.error('❌ Erro fatal ao conectar no MySQL:', error.message);
      throw error;
    }
  }

  
  get connection() {
    if (!this.pool) this.init();
    return this.pool;
  }
}

// instância ÚNICA (Singleton)
export default new Database();