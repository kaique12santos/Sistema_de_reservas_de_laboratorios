let db = [
  { id: 1, academic_cycle_id: 2, date: '2026-04-21', description: 'Tiradentes' },
  { id: 2, academic_cycle_id: 2, date: '2026-05-01', description: 'Dia do Trabalho' },
];

export const holidayService = {
  async getByCycle(cycleId) {
    return db.filter(h => h.academic_cycle_id === cycleId);
  },
  async create(data) {
    const novo = { ...data, id: Date.now() };
    db.push(novo);
    return novo;
  },
  async delete(id) {
    db = db.filter(h => h.id !== id);
    return { ok: true };
  }
};