import db from '../config/Database.js';

class ReservationRepository {

  /**
   * 
   * @param {number} labId refere-se ao laboratório para o qual se deseja verificar os conflitos de reserva
   * @param {string} date  refere-se à data para a qual se deseja verificar os conflitos de reserva (formato 'YYYY-MM-DD')
   * @param {Array<number>} timeSlotIds refere-se à lista de IDs dos horários para os quais se deseja verificar os conflitos de reserva
   * @returns {Promise<Array>} retorna uma lista de itens de reserva que estão em conflito com os parâmetros fornecidos, ou seja, 
   * itens que estão ativos e pertencem a reservas que estão aprovadas ou pendentes para o mesmo laboratório, 
   * data e horários. Cada item de reserva retornado inclui informações sobre a reserva pai, como ID da reserva, ID do professor e status da reserva.
   */
 async findConflicting(labId, date, timeSlotIds, excludeReservationId = null) {
    const placeholders = timeSlotIds.map(() => '?').join(',');
    
    // 1. Crie o array de parâmetros ANTES
    const params = [labId, date, ...timeSlotIds];

    // 2. Use LET para poder alterar a string depois
    let query = `
      SELECT ri.*, r.id as reservation_id, r.user_id, r.status as reservation_status
      FROM reservation_items ri
      INNER JOIN reservations r ON r.id = ri.reservation_id
      WHERE ri.lab_id = ?
        AND ri.date = ?
        AND ri.time_slot_id IN (${placeholders})
        AND ri.status = 'ACTIVE'
        AND r.status IN ('APPROVED', 'PENDING')
    `;

    if (excludeReservationId) {
      query += ` AND r.id != ?`;
      params.push(excludeReservationId); // Agora o push funciona!
    }
    
    // 3. Passe o array de params que você montou
    const [rows] = await db.connection.query(query, params);

    return rows;
  }

  /**
   * Encontra reservas por professor e intervalo de datas
   * @param {number} professorId refere-se ao ID do professor para o qual se deseja buscar as reservas
   * @param {string} startDate refere-se à data de início do intervalo de busca (formato 'YYYY-MM-DD')
   * @param {string} endDate refere-se à data de término do intervalo de busca (formato 'YYYY-MM-DD')
   * @returns {Promise<Array>} retorna uma lista de reservas que correspondem aos critérios de busca
   */
  async findByProfessorAndDateRange(professorId, startDate, endDate) {
    const query = `
      SELECT r.*, ri.date, ri.time_slot_id, ri.lab_id, ri.status as item_status
      FROM reservations r
      INNER JOIN reservation_items ri ON ri.reservation_id = r.id
      WHERE r.user_id = ?
        AND ri.date BETWEEN ? AND ?
      ORDER BY ri.date ASC, ri.time_slot_id ASC
    `;

    const [rows] = await db.connection.query(query, [
      professorId,
      startDate,
      endDate
    ]);

    return rows;
  }

  /**
   * Cria uma nova reserva
   * @param {Object} reservationData dados da reserva a ser criada
   * @param {Object} connection conexão com o banco de dados
   * @returns {Promise<number>} ID da reserva criada
   */
  async create(reservationData, connection = null) {
    const conn = connection || db.connection;
    const query = `
      INSERT INTO reservations (user_id, lab_id, cycle_id, type, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const [result] = await conn.query(query, [
      reservationData.user_id,
      reservationData.lab_id,
      reservationData.cycle_id,
      reservationData.type || 'SINGLE',
      reservationData.status || 'PENDING'
    ]);
    return result.insertId;
  }

  /**
   * Cria um novo item de reserva
   * @param {Object} itemData dados do item de reserva a ser criado
   * @param {Object} connection conexão com o banco de dados
   * @returns {Promise<number>} ID do item de reserva criado
   */
  async createItem(itemData, connection = null) {
    const conn = connection || db.connection;
    const query = `
      INSERT INTO reservation_items (reservation_id, lab_id, date, time_slot_id, start_time, end_time, note, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', NOW())
    `;
    const [result] = await conn.query(query, [
      itemData.reservation_id,
      itemData.lab_id,
      itemData.date,
      itemData.time_slot_id,
      itemData.start_time,
      itemData.end_time,
      itemData.note || null
    ]);
    return result.insertId;
  }

  /**
   * Encontra conflitos de reserva em massa para um laboratório, conjunto de datas e horários
   * @param {number} labId - ID do laboratório
   * @param {Array<string>} dates - Datas no formato 'YYYY-MM-DD'
   * @param {Array<number>} timeSlotIds - IDs de horários
   * @param {number|null} excludeReservationId - ID de reserva a ser excluído da verificação (opcional)
   * @returns {Promise<Array>} - Itens conflitantes encontrados
   */
  async findConflictingBulk(labId, dates, timeSlotIds, excludeReservationId = null) {
    if (!dates || dates.length === 0 || !timeSlotIds || timeSlotIds.length === 0) {
      return [];
    }

    const datePlaceholders = dates.map(() => '?').join(',');
    const timeSlotPlaceholders = timeSlotIds.map(() => '?').join(',');
    const params = [labId, ...dates, ...timeSlotIds];

    let query = `
      SELECT ri.*, r.id as reservation_id, r.user_id, r.status as reservation_status
      FROM reservation_items ri
      INNER JOIN reservations r ON r.id = ri.reservation_id
      WHERE ri.lab_id = ?
        AND ri.date IN (${datePlaceholders})
        AND ri.time_slot_id IN (${timeSlotPlaceholders})
        AND ri.status = 'ACTIVE'
        AND r.status IN ('APPROVED', 'PENDING')
    `;

    if (excludeReservationId) {
      query += ` AND r.id != ?`;
      params.push(excludeReservationId);
    }

    const [rows] = await db.connection.query(query, params);
    return rows;
  }

  /**
   * Insere múltiplos itens de reserva em lote
   * @param {number} reservationId - ID da reserva pai
   * @param {Array<Object>} items - Array de itens de reserva a serem criados
   * @param {Object|null} connection - Conexão com o banco de dados (opcional, para usar transação já existente)
   * @returns {Promise<Object>} - Resultado do insert em lote
   */
  async createMany(reservationId, items, connection = null) {
    if (!items || items.length === 0) return { insertId: null, affectedRows: 0 };

    const conn = connection || db.connection;
    const placeholders = items.map(() => '(?,?,?,?,?,?,?,?,?)').join(',');
    const query = `
      INSERT INTO reservation_items (reservation_id, lab_id, date, time_slot_id, start_time, end_time, note, status, created_at)
      VALUES ${placeholders}
    `;

    const params = [];
    for (const item of items) {
      params.push(
        reservationId,
        item.lab_id,
        item.date,
        item.time_slot_id,
        item.start_time,
        item.end_time,
        item.note || null,
        'ACTIVE',
        new Date()
      );
    }

    const [result] = await conn.query(query, params);
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    };
  }

  /**
   *  Encontra itens de reserva por ID da reserva
   * @param {number} reservationId  refere-se ao ID da reserva para a qual se deseja buscar os itens de reserva associados
   * @param {Object|null} connection refere-se à conexão com o banco de dados (opcional, para usar transação já existente)
   * @returns {Promise<Array>} retorna uma lista de itens de reserva associados à reserva especificada
   */
  async findItemsByReservationId(reservationId, connection = null) {
    const dbConn = connection || db.connection;
    const [rows] = await dbConn.query('SELECT * FROM reservation_items WHERE reservation_id = ? AND status = "ACTIVE"', [reservationId]);
    return rows;
  }

  /**
   * Encontra uma reserva por ID
   * @param {number} id - ID da reserva a ser encontrada
   * @returns {Promise<Object|null>} - Retorna a reserva encontrada ou null se não existir
   */
  async findById(id) {
    const query = `
      SELECT r.*, u.name as professor_name, l.name as lab_name, ac.name as cycle_name
      FROM reservations r
      INNER JOIN users u ON u.id = r.user_id
      INNER JOIN laboratories l ON l.id = r.lab_id
      INNER JOIN academic_cycles ac ON ac.id = r.cycle_id
      WHERE r.id = ?
    `;
    const [rows] = await db.connection.query(query, [id]);
    return rows[0];
  }

  /**
   *  Cancela uma reserva e seus itens associados
   * @param {number} reservationId refere-se ao ID da reserva a ser cancelada
   * @param {Object|null} connection refere-se à conexão com o banco de dados (opcional, para usar transação já existente)
   * @returns {Promise<void>}
   * @description Método para cancelar uma reserva e seus itens associados. A função atualiza o status da reserva para 'CANCELED' e também atualiza o status de todos os itens de reserva associados para 'CANCELED'. 
   * Essa abordagem garante que a reserva e seus itens sejam marcados como cancelados no banco de dados, mantendo a integridade dos dados e permitindo rastrear o histórico de reservas canceladas.
   */
  async cancelItemsByReservationId(reservationId, connection = null) {
    const dbConn = connection || db.connection;
    await dbConn.query(
      'UPDATE reservation_items SET status = ? WHERE reservation_id = ?',
      ['CANCELED', reservationId]
    );
  }

  /**
   * Encontra reservas por ID do professor
   * @param {number} professorId - ID do professor
   * @returns {Promise<Array>} - Retorna uma lista de reservas encontradas
   */
  async findByProfessor(professorId) {
    const query = `
      SELECT r.*, ri.date, ri.time_slot_id, ri.lab_id, ri.status as item_status, ri.note,
       ts.name as time_slot_name, ts.start_time, ts.end_time,
       l.name as lab_name, ac.name as cycle_name
       FROM reservations r
      INNER JOIN reservation_items ri ON ri.reservation_id = r.id
      INNER JOIN time_slots ts ON ts.id = ri.time_slot_id
      INNER JOIN laboratories l ON l.id = r.lab_id
      INNER JOIN academic_cycles ac ON ac.id = r.cycle_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC, ri.date DESC, ts.start_time ASC
    `;
    const [rows] = await db.connection.query(query, [professorId]);
    return rows;
  }

  /**
   * Cria um novo registro de log de auditoria
   * @param {string} action refere-se à ação realizada (ex: 'CREATE', 'UPDATE', 'DELETE')
   * @param {string} tableName refere-se ao nome da tabela onde a ação ocorreu (ex: 'reservations', 'reservation_items')
   * @param {number} recordId refere-se ao ID do registro que foi afetado pela ação
   * @param {number} changedBy refere-se ao ID do usuário que realizou a ação
   * @param {Object|null} oldValues refere-se aos valores antigos do registro antes da ação (apenas para ações de UPDATE, pode ser null para CREATE e DELETE)
   * @param {Object|null} newValues refere-se aos valores novos do registro após a ação (apenas para ações de UPDATE, pode ser null para CREATE e DELETE)
   * @param {Object|null} connection refere-se à conexão com o banco de dados (opcional, para usar transação já existente)
   */
  async createAuditLog(action, tableName, recordId, changedBy, oldValues = null, newValues = null, connection = null) {
    const conn = connection || db.connection;
    const query = `
      INSERT INTO audit_logs (action, table_name, record_id, changed_by, old_values, new_values, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    await conn.query(query, [
      action,
      tableName,
      recordId,
      changedBy,
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null
    ]);
  }

  /**
   * Atualiza o status de uma reserva
   * @param {number} reservationId - ID da reserva a ser atualizada
   * @param {string} newStatus - Novo status da reserva
   * @param {object|null} connection - Conexão de banco de dados (opcional, para usar transação já existente)
   */
  async updateStatus(reservationId, newStatus, connection) {
    const dbConn = connection || db;
    await dbConn.query(
      'UPDATE reservations SET status = ? WHERE id = ?',
      [newStatus, reservationId]
    );
  }

  /**
   * Sobrescreve reservas conflitantes para liberar o laboratório, data e horários para uma nova reserva.
   * Essa função cancela a reserva pai (do professor que perdeu a vaga) e os itens de reserva conflitantes para liberar a restrição UNIQUE do banco.
   * @param {number} labId - ID do laboratório
   * @param {string} date - Data da reserva
   * @param {Array<number>} timeSlotIds - Lista de IDs dos horários
   * @param {object|null} connection - Conexão de banco de dados (opcional, para usar transação já existente)
   */
  async overrideConflictingItems(labId, date, timeSlotIds, connection) {
    const dbConn = connection || db;
    
    // 1. Cancela a reserva PAI (do professor que perdeu a vaga)
    const updateReservationsQuery = `
      UPDATE reservations r
      INNER JOIN reservation_items ri ON r.id = ri.reservation_id
      SET r.status = 'CANCELED'
      WHERE ri.lab_id = ? AND ri.date = ? AND ri.time_slot_id IN (?) AND ri.status = 'ACTIVE'
    `;
    await dbConn.query(updateReservationsQuery, [labId, date, timeSlotIds]);

    // 2. Cancela os ITENS da reserva antiga para liberar a restrição UNIQUE do banco
    const updateItemsQuery = `
      UPDATE reservation_items
      SET status = 'CANCELED'
      WHERE lab_id = ? AND date = ? AND time_slot_id IN (?) AND status = 'ACTIVE'
    `;
    await dbConn.query(updateItemsQuery, [labId, date, timeSlotIds]);
  }

  /**
   * Atualiza o status de uma reserva
   * @param {number} id - ID da reserva a ser atualizada
   * @param {string} status - Novo status da reserva
   * @param {object} extra - Valores extras a serem atualizados
   * @param {object|null} connection - Conexão de banco de dados (opcional, para usar transação já existente)
   */
  async updateStatus(id, status, extra = {}, connection = null){
    const dbConn = connection || db.connection;
    const fields = { status, ...extra, updated_at: new Date() };

    await dbConn.query(
      'UPDATE reservations SET ? WHERE id = ?',
      [fields, id]
    );
  }

  /**
   * Encontra todas as reservas pendentes
   * @param {object|null} connection - Conexão de banco de dados (opcional, para usar transação já existente)
   * @returns {Promise<Array>} - Retorna uma lista de reservas pendentes com informações do professor e laboratório, 
   * ordenada da mais antiga para a mais recente
   */
  async findPending (connection = null){
    const dbConn = connection || db.connection;
    const query = `
      SELECT r.*, u.name as professor_name, u.email as professor_email,
             l.name as lab_name
      FROM reservations r
      INNER JOIN users u ON u.id = r.user_id
      INNER JOIN reservation_items ri ON ri.reservation_id = r.id
      INNER JOIN laboratories l ON l.id = ri.lab_id
      WHERE r.status = 'PENDING'
      GROUP BY r.id, u.name, u.email, l.name
      ORDER BY r.created_at ASC
    `;
    const [rows] = await dbConn.query(query);
    return rows;
  }

  /**
   * 
   * @param {number} reservationId - ID da reserva que teve o laboratório alterado
   * @param {number} newLabId - Novo ID do laboratório para onde os itens devem ser redirecionados
   * @param {object|null} connection - Conexão de banco de dados (opcional, para usar transação já existente)
   * @returns {Promise<void>}
   * @description Método para atualizar o lab_id dos itens de uma reserva quando o laboratório da reserva é alterado.  
   */
  async redirectItems(reservationId, newLabId, connection =null){
    const dbConn = connection || db.connection;
    const query = `
      UPDATE reservation_items
      SET lab_id = ?
      WHERE reservation_id = ?
    `;
    await dbConn.query(query, [newLabId, reservationId]);
  }

}

export default new ReservationRepository();