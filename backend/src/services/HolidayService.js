import HolidayRepository from '../repositories/HolidayRepository.js';
import AcademicCycleRepository from '../repositories/AcademicCycleRepository.js';

class HolidayService {
  /**
   * @param {number} cycleId - Opcional. Se não fornecido, usará o ciclo ativo. 
   * @returns {Promise<Array>} Lista de feriados para o ciclo especificado.
   */
  async listHolidays(cycleId) {
    const resolvedId = cycleId || (await AcademicCycleRepository.findActive())?.id;
    if (!resolvedId) throw new Error('Nenhum ciclo encontrado');
    return await HolidayRepository.findByCycle(resolvedId);
  }

  /**
   * @param {string} date - A data a ser verificada.
   * @param {number} cycleId - O ID do ciclo acadêmico.
   * @returns {Promise<boolean>} Indica se a data é um feriado.
   */
  async isHoliday(date, cycleId) {
    const holiday = await HolidayRepository.findByDateAndCycle(date, cycleId);
    return !!holiday;
  }

  /**
   * @param {number} cycleId - O ID do ciclo acadêmico para o qual sincronizar feriados.
   * @returns {Promise<Object>} Resultado da sincronização.
   */
  async syncHolidaysForCycle(cycleId) {
    const cycle = await AcademicCycleRepository.findById(cycleId);
    if (!cycle) throw new Error('Ciclo acadêmico não encontrado.');

    const startStr = cycle.start_date instanceof Date ? cycle.start_date.toISOString().split('T')[0] : cycle.start_date.toString().split('T')[0];
    const endStr = cycle.end_date instanceof Date ? cycle.end_date.toISOString().split('T')[0] : cycle.end_date.toString().split('T')[0];
    const startYear = startStr.substring(0, 4);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${startYear}`);
      
      if (!response.ok) throw new Error(`Falha na BrasilAPI: Status ${response.status}`);
      const nationalHolidays = await response.json();

      // 1. INJETOR DE FERIADOS LOCAIS E INSTITUCIONAIS
      const localHolidays = [
        { date: `${startYear}-01-25`, name: 'Aniversário de São Paulo (Feriado Municipal)' },
        { date: `${startYear}-07-09`, name: 'Revolução Constitucionalista (Feriado Estadual SP)' },
        { date: `${startYear}-10-15`, name: 'Dia do Professor (Recesso Institucional)' },
        { date: `${startYear}-10-28`, name: 'Dia do Servidor Público (Recesso Institucional)' }
      ];

      // 2. Mescla a API com as regras de negócio da Instituição
      const allHolidays = [...nationalHolidays, ...localHolidays];
      const validHolidays = allHolidays.filter(holiday => {
        return holiday.date >= startStr && holiday.date <= endStr;
      });

      const holidaysToInsert = validHolidays.map(holiday => ({
        cycle_id: cycleId,
        date: holiday.date,
        description: holiday.name
      }));

      await HolidayRepository.deleteByCycle(cycleId);
      
      if (holidaysToInsert.length > 0) {
        await HolidayRepository.bulkCreate(holidaysToInsert);
      }

      return {
        message: 'Feriados sincronizados com sucesso.',
        count: holidaysToInsert.length
      };

    } catch (error) {
      throw new Error(`Erro na sincronização de feriados: ${error.message}`);
    }
  }
}

export default new HolidayService();