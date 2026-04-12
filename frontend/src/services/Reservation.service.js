import api from './api';

// Função auxiliar temporária para simular latência de rede no frontend
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReservationService {
  constructor() {
    this.mockReservations = [
      { id: '101', dataSolicitacao: '09/04/2026', dataReserva: '15/04/2026', lab: 'Lab 102 - Redes', horario: '19:00 - 20:40', status: 'Aprovado', motivo: 'Aula de Redes II' },
      { id: '102', dataSolicitacao: '10/04/2026', dataReserva: '20/04/2026', lab: 'Lab 201 - Maker', horario: '21:00 - 22:30', status: 'Pendente', motivo: 'Projeto Integrador' },
      { id: '103', dataSolicitacao: '05/04/2026', dataReserva: '10/04/2026', lab: 'Lab 101 - Informática', horario: '07:30 - 09:10', status: 'Recusado', motivo: 'Manutenção elétrica' }
    ];
  }
  
  // ==========================================
  // DADOS MOCKADOS (TEMPORÁRIOS)
  // ==========================================
  
  async getInitialData() {
    await delay(600); // Simula o tempo de resposta do servidor
    return {
      labs: [
        { id: '1', nome: 'Lab 101 - Informática' },
        { id: '2', nome: 'Lab 102 - Redes' },
        { id: '3', nome: 'Lab 201 - Maker' },
        { id: '4', nome: 'Lab 202 - Hardware' }
      ],
      timeSlots: [
        { id: 'M1', name: 'M1', time: '07:30 às 08:20' },
        { id: 'M2', name: 'M2', time: '08:20 às 09:10' },
        { id: 'M3', name: 'M3', time: '09:10 às 10:00' },
        { id: 'M4', name: 'M4', time: '10:20 às 11:10' },
        { id: 'N1', name: 'N1', time: '19:00 às 19:50' },
        { id: 'N2', name: 'N2', time: '19:50 às 20:40' }
      ],
      activeCycle: {
        id: '2026-1',
        start_date: '2026-02-01',
        end_date: '2026-07-15'
      },
      holidays: ['2026-04-17', '2026-04-21', '2026-05-01'] 
    };
  }

  async checkConflict(params) {
    await delay(800);
    // Simulação: Lab 1 (Lab 101) sempre dá conflito no M1 e M2 para fins de teste de UX
    if (params.lab_id === '1' && (params.time_slots.includes('M1') || params.time_slots.includes('M2'))) {
      const conflitos = [];
      if (params.time_slots.includes('M1')) conflitos.push('M1');
      if (params.time_slots.includes('M2')) conflitos.push('M2');
      return { hasConflict: true, conflictingSlots: conflitos };
    }
    return { hasConflict: false, conflictingSlots: [] };
  }

  async create(data) {
    await delay(1000);
    // Simula a criação com sucesso retornando um ID fictício
    return { success: true, id: Math.floor(Math.random() * 1000) };
  }

  async getMyReservations() {
    await delay(600);
     return [...this.mockReservations]; // Retorna uma cópia para evitar mutações acidentais
  }

  async cancelReservation(id) {
    await delay(800);
    const index = this.mockReservations.findIndex(res => res.id === id);
    if (index === -1) throw new Error('Reserva não encontrada');
    this.mockReservations[index].status = 'Cancelado';
    return { success: true };
  }

  // ==========================================
  // CÓDIGO FINAL DE INTEGRAÇÃO (COMENTADO)
  // Descomente e apague os mocks acima quando o Back-end estiver pronto
  // ==========================================

  /*
  // Se você preferir buscar os dados iniciais individualmente nas services de cada entidade 
  // (LaboratoryService, TimeSlotService), pode apagar o getInitialData. 
  // Mas se o backend tiver uma rota agrupada de "dados de setup" para economizar requisições:
  async getInitialData() {
    const response = await api.get('/reservations/setup-data');
    return response.data;
  }

  async checkConflict({ lab_id, date, time_slots }) {
    // Transforma array de slots ['M1', 'M2'] na query string: time_slots=M1,M2
    const params = new URLSearchParams({
      lab_id,
      date,
      time_slots: time_slots.join(',')
    });
    const response = await api.get(`/reservations/check-conflict?${params}`);
    return response.data;
  }

  async create(data) {
    const response = await api.post('/reservations', data);
    return response.data;
  }

  async getMyReservations() {
    const response = await api.get('/reservations/my');
    return response.data;
  }
  */
}

// Exporta a instância pronta (Singleton) seguindo o padrão do projeto
export const reservationService = new ReservationService();