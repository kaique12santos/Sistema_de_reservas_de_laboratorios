import express from 'express';
import cors from 'cors';
// Futuras importações de rotas
// import userRoutes from './routes/user.routes.js';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Habilita CORS para o frontend (React) poder acessar
    this.server.use(cors());
    
    // Habilita leitura de JSON no corpo das requisições
    this.server.use(express.json());
  }

  routes() {
    // Rota de Health Check (Essencial para Cloud/Deploy)
    this.server.get('/', (req, res) => {
      return res.status(200).json({ 
        status: 'online', 
        message: 'Sistema de Reservas Fatec ZL - API Running',
        version: '1.0.0'
      });
    });

    // Aqui você vai instanciar as rotas quando criarmos os arquivos
    // this.server.use('/users', userRoutes);
  }
}

// Exportamos apenas a instância do server (o express configurado)
export default new App().server;