// Mock temporário — apaga quando o backend estiver pronto
const mockData = [
  { id: 1, name: 'M1', startTime: '07:30', endTime: '08:20', active: true },
  { id: 2, name: 'M2', startTime: '08:20', endTime: '09:10', active: true },
  { id: 3, name: 'T1', startTime: '13:00', endTime: '13:50', active: true },
  { id: 4, name: 'N1', startTime: '19:00', endTime: '19:50', active: false },
];

let db = [...mockData];

export const timeSlotService = {
  async getAll() {
    return [...db];
  },
  async create(data) {
    const novo = { ...data, id: Date.now(), active: true };
    db.push(novo);
    return novo;
  },
  async update(id, data) {
    db = db.map(s => s.id === id ? { ...s, ...data } : s);
    return db.find(s => s.id === id);
  },
  async delete(id) {
    db = db.map(s => s.id === id ? { ...s, active: false } : s);
    return { ok: true };
  }
};