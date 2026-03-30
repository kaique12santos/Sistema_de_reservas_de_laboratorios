import db from '../config/Database.js';

class timeSlotRepository {
    async findAll(includeInactive = false) {
        const query = includeInactive 
          ? 'SELECT * FROM time_slots ORDER BY start_time ASC' 
          : 'SELECT * FROM time_slots WHERE is_active = true ORDER BY start_time ASC';
        const [rows] = await db.connection.query(query);
        return rows;
    }

    async findById(id) {
        const [rows] = await db.connection.query('SELECT * FROM time_slots WHERE id = ?', [id]);
        return rows[0]; // Retorna undefined se não achar
    }

    async findByName(name) {
        const [rows] = await db.connection.query('SELECT * FROM time_slots WHERE name = ?', [name]);
        return rows[0]; // Retorna undefined se não achar
    }

    async create(data){
        const query = `
        INSERT INTO time_slots (name, start_time, end_time)
        VALUES (?, ?, ?)
        `;

        const [result] = await db.connection.query(query, [data.name, data.start_time, data.end_time]);

        return { id: result.insertId, ...data, is_active: true };
    }

    async update(id, data){
        const query = `
        UPDATE time_slots
        SET name = ?,
        start_time = ?,
        end_time = ?
        WHERE id = ?
        `;

        const [result] = await db.connection.query(query, [data.name, data.start_time, data.end_time, id]);

        return {id, ...data};
    }

    async softDelete(id){
        const query = `
        UPDATE time_slots
        SET is_active = false
        WHERE id = ?
        `;

        const [result] = await db.connection.query(query, [id]);
        
        return { id, is_active: false
        };
    }

    async hasActiveReservations(id) {
        const [rows] = await db.connection.query(`
        SELECT COUNT(*) as count FROM reservation_items
        WHERE time_slot_id = ?
        AND date >= CURDATE()
        AND status = 'ACTIVE'
        `, [id]);
        return rows[0].count > 0;
    }
}

export default new timeSlotRepository();