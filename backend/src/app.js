import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import departmentRoutes from './routes/department.routes.js';
import laboratoryRoutes from './routes/laboratory.routes.js';
import userRoutes from './routes/user.routes.js';
import timeSlotRoutes from './routes/timeSlot.routes.js';
import AcademicCycleRouter from './routes/academicCycle.routes.js';
import holidayRouter from './routes/holiday.routes.js';
import reservationRoutes from './routes/reservation.routes.js';

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

    this.server.use('/api/auth', authRoutes);
    this.server.use('/api', departmentRoutes);
    this.server.use('/api/laboratories', laboratoryRoutes);
    this.server.use('/api/users', userRoutes);
    this.server.use('/api/time-slots', timeSlotRoutes);
    this.server.use('/api/academic-cycles', AcademicCycleRouter);
    this.server.use('/api/holidays', holidayRouter);
    this.server.use('/api/reservations', reservationRoutes);

  }
}

export default new App().server;