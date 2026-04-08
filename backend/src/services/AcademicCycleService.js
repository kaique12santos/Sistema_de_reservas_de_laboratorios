import AcademicCycleRepository from '../repositories/AcademicCycleRepository.js';
import HolidayService from './HolidayService.js';

class AcademicCycleService {
  async listAll() {
    return await AcademicCycleRepository.findAll();
  }

  async getActive() {
    return await AcademicCycleRepository.findActive();
  }

  async activateCycle(id) {
    await AcademicCycleRepository.activate(id);
    return { message: 'Ciclo ativado com sucesso. Todas as reservas agora seguirão este calendário.' };
  }

  /**
   * @returns {Promise<Object>} Detalhes do ciclo gerado e resultado da sincronização de feriados. 
   */
  async generateNextCycle() {
    const latestCycle = await AcademicCycleRepository.findLatest();
    let nextName = '';
    let start_date, end_date, admin_exclusive_end_date;

    if (!latestCycle) {
      const currentYear = new Date().getFullYear();
      nextName = `${currentYear}-1`;
    } else {
      const [yearStr, semStr] = latestCycle.name.split('-');
      let year = parseInt(yearStr);
      let sem = parseInt(semStr);

      if (sem === 1) {
        nextName = `${year}-2`;
      } else {
        nextName = `${year + 1}-1`;
      }
    }
    const [nextYear, nextSem] = nextName.split('-');
    
    if (nextSem === '1') {
      start_date = `${nextYear}-02-01`;
      end_date = `${nextYear}-06-30`;
      admin_exclusive_end_date = `${nextYear}-01-25`; 
    } else {
      start_date = `${nextYear}-08-01`;
      end_date = `${nextYear}-12-15`;
      admin_exclusive_end_date = `${nextYear}-07-25`;
    }

    const newCycle = await AcademicCycleRepository.create({
      name: nextName,
      start_date,
      end_date,
      admin_exclusive_end_date
    });

    let holidaysResult;
    try {
      holidaysResult = await HolidayService.syncHolidaysForCycle(newCycle.id);
    } catch (error) {
      console.error('Aviso: Ciclo gerado, mas falha ao buscar feriados:', error.message);
      holidaysResult = { message: 'Falha ao sincronizar BrasilAPI', count: 0 };
    }

    return {
      message: `Ciclo ${nextName} gerado com sucesso!`,
      cycle: newCycle,
      holidays_synced: holidaysResult.count
    };
  }
}

export default new AcademicCycleService();