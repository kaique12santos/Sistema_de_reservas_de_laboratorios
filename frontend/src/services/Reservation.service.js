import api from './api';

class ReservationService {
  
  // ==========================================
  // INTEGRAÇÃO REAL COM A API
  // ==========================================

  /**
   * Verifica conflito de horários antes da reserva
   * @param {Object} params - { lab_id: number, date: string 'YYYY-MM-DD', time_slots: number[] }
   */
  async checkConflict({ lab_id, date, time_slots }) {
    // O backend espera time_slots=1,2,3 na URL
    const params = new URLSearchParams({
      lab_id,
      date,
      time_slots: time_slots.join(',') 
    });
    
    // Rota: GET /api/reservations/check-conflict
    const response = await api.get(`/reservations/check-conflict?${params}`);
    return response.data;
  }

  /**
   * Cria uma nova reserva simples
   * @param {Object} data - { lab_id: number, date: string 'YYYY-MM-DD', time_slot_ids: number[], note: string }
   */
  async create(data) {
    // ATENÇÃO: A rota configurada no backend é /simple e não apenas /reservations
    const response = await api.post('/reservations/simple', data);
    return response.data;
  }

  /**
   * Lista as reservas do professor logado
   */
  async getMyReservations() {
    const response = await api.get('/reservations/my');
    const rawData = response.data.reservations;

    // Agrupando reservas repetidas por ID para evitar o erro de 'key' duplicada
    const grouped = rawData.reduce((acc, curr) => {
      const existing = acc.find(item => item.id === curr.id);
      if (existing) {
        existing.horariosList.push(curr.time_slot_name);
        return acc;
      }
      
      acc.push({
        ...curr,
        // Tradução de campos para o Front-end não quebrar
        dataSolicitacao: curr.created_at ? new Date(curr.created_at).toLocaleDateString('pt-BR') : 'N/A',
        dataReserva: new Date(curr.date).toLocaleDateString('pt-BR'),
        lab: curr.lab_name,
        horario: curr.time_slot_name, // Para a tabela simplificada
        horariosList: [curr.time_slot_name], // Para os detalhes
        status: curr.status,
        motivo: curr.note || 'Sem observações'
      });
      return acc;
    }, []);

    return grouped;
  }

 // ==========================================
  // DADOS REAIS DO BANCO (SETUP DA TELA)
  // ==========================================
  async getInitialData() {
    try {
      const [labsRes, timeSlotsRes, cycleRes, holidaysRes] = await Promise.all([
        api.get('/laboratories'),
        api.get('/time-slots'),
        api.get('/academic-cycles/active'),
        api.get('/holidays')
      ]);

      return {
        // 1. ADAPTER DOS LABORATÓRIOS: Renomeia description_lab para description
        labs: labsRes.data
          .filter(lab => lab.is_active === 1 || lab.is_active === true)
          .map(lab => ({
            ...lab,
            nome: lab.name,
            name: lab.name,
            description: lab.description_lab 
          })),
        
        // 2. ADAPTER DOS HORÁRIOS: Formata os botões
        timeSlots: timeSlotsRes.data.map(slot => {
          const start = slot.start_time ? slot.start_time.substring(0, 5) : '';
          const end = slot.end_time ? slot.end_time.substring(0, 5) : '';
          return {
            id: slot.id,           
            name: slot.name,       // Ex: "Manhã"
            time: `${start} às ${end}` // Ex: "07:30 às 08:20"
          };
        }),
        
        // 3. CICLO ATIVO
        activeCycle: cycleRes.data,
        
        // 4. ADAPTER DE FERIADOS: Extrai só a data YYYY-MM-DD da string ISO gigante do banco
        holidays: holidaysRes.data.map(holiday => holiday.date.split('T')[0]) 
      };
    } catch (error) {
      console.error("Erro ao buscar os dados iniciais:", error);
      throw error;
    }
  }
  async cancelReservation(id) {
    const response = await api.patch(`/reservations/${id}/cancel`);
    return response.data;
  }

  /**
   * Lista reservas pendentes para aprovação (Admin/Coordenador)
   */
  async getPending() {
    const response = await api.get('/reservations/pending');
    return response.data;
  }

  /**
   * Aprova uma reserva pendente
   * @param {number} id - ID da reserva
   */
  async approve(id) {
    const response = await api.patch(`/reservations/${id}/approve`);
    return response.data;
  }

  /**
   * Rejeita uma reserva pendente
   * @param {number} id - ID da reserva
   * @param {string} reason - Motivo da rejeição
   */
  async reject(id, reason) {
    const response = await api.patch(`/reservations/${id}/reject`, { reason });
    return response.data;
  }

/**
   * Redireciona uma reserva para outro laboratório
   * @param {number} id - ID da reserva
   * @param {number} newLabId - ID do novo laboratório
   * @param {string} justification - Justificativa
   */
  async redirect(id, newLabId, justification) {
    // 🐛 CORREÇÃO: O backend espera a chave 'reason', não 'justification'
    const response = await api.patch(`/reservations/${id}/redirect`, { 
      new_lab_id: newLabId, 
      reason: justification 
    });
    return response.data;
  }
}

export const reservationService = new ReservationService();