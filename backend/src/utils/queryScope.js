/**
 * Adiciona o filtro de departamento em queries SQL de forma dinâmica e segura.
 * * @param {string} baseQuery - A query SQL base (ex: 'SELECT * FROM users')
 * @param {Array} baseParams - O array de valores atuais (ex: ['PENDING'])
 * @param {number|string} departmentId - O ID do departamento para filtrar
 * @param {string} [tableAlias=''] - Alias da tabela (ex: 'u' para 'u.department_id')
 * @returns {Object} { query: string, params: Array }
 */
export const withDepartmentScope = (baseQuery, baseParams = [], departmentId, tableAlias = '') => {
  if (!departmentId) {
    throw new Error('Filtro de escopo falhou: departmentId do ADMIN é obrigatório.');
  }

  const prefix = tableAlias ? `${tableAlias}.` : '';
  const operator = baseQuery.toUpperCase().includes('WHERE') ? 'AND' : 'WHERE';
  
  const scopedQuery = `${baseQuery} ${operator} ${prefix}department_id = ?`;
  const scopedParams = [...baseParams, departmentId];

  return { query: scopedQuery, params: scopedParams };
};