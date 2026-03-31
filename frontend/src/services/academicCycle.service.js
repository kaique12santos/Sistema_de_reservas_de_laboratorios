// Mock temporário — apaga quando o backend estiver pronto
let db = [
  { id: 1, name: '2025-2', startDate: '2025-07-01', endDate: '2025-12-20', coordEndDate: '2025-07-07', active: false },
  { id: 2, name: '2026-1', startDate: '2026-02-01', endDate: '2026-06-30', coordEndDate: '2026-02-07', active: true },
  { id: 3, name: '2026-2', startDate: '2026-07-01', endDate: '2026-12-20', coordEndDate: '2026-07-07', active: false },
];

export const academicCycleService = {
  async getAll() {
    return [...db];
  },
  async create(data) {
    const novo = { ...data, id: Date.now(), active: false };
    db.push(novo);
    return novo;
  },
  async update(id, data) {
    db = db.map(c => c.id === id ? { ...c, ...data } : c);
    return db.find(c => c.id === id);
  },
  async delete(id) {
    db = db.filter(c => c.id !== id);
    return { ok: true };
  },
  async activate(id) {
    db = db.map(c => ({ ...c, active: c.id === id }));
    return db.find(c => c.id === id);
  }
};