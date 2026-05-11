import AuditRepository from '../repositories/AuditRepository.js';

class AuditService {
  /**
   * Registra uma ação de auditoria de forma segura.
   * Actions: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'OVERWRITE' | 'REDIRECT'
   */
  static async log(action, tableName, recordId, changedBy, oldValues = {}, newValues = {}, connection = null) {
    try {
      await AuditRepository.create({
        action,
        table_name: tableName,
        record_id: recordId,
        changed_by: changedBy,
        old_values: oldValues,
        new_values: newValues
      }, connection);
    } catch (err) {
      // Regra Crítica: Falha no log não interrompe a aplicação
      console.error(`[AuditService] Erro ao registrar log (${action} em ${tableName}):`, err.message);
    }
  }
}

export default AuditService;