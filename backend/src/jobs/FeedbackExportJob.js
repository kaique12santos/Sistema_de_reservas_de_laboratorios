import cron from 'node-cron';
import ExcelJS from 'exceljs';
import db from '../config/Database.js';
import EmailService from '../services/EmailService.js';


// Agendamento: Roda à meia-noite (00:00) do dia 1º dos meses de Janeiro, Abril, Julho e Outubro
// Expressão Cron: '0 0 1 */3 *'
cron.schedule('0 0 1 */3 *', async () => {
  console.log('[CRON] Iniciando exportação trimestral de feedbacks...');
  
  try {
    // 1. Busca os dados dos últimos 3 meses
    const query = `
      SELECT f.id, f.feature, f.rating, f.comment, f.created_at, u.name as user_name, u.email as user_email
      FROM logs_feedback f
      INNER JOIN users u ON f.user_id = u.id
      WHERE f.created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
      ORDER BY f.created_at DESC
    `;
    const [feedbacks] = await db.connection.query(query);

    if (feedbacks.length === 0) {
      console.log('[CRON] Nenhum feedback coletado no último trimestre. Operação encerrada.');
      return;
    }

    // 2. Inicializa o Workbook do Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Feedbacks SisLab');

    // 3. Define as Colunas e Cabeçalhos
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Usuário', key: 'user_name', width: 25 },
      { header: 'E-mail', key: 'user_email', width: 30 },
      { header: 'Funcionalidade', key: 'feature', width: 30 },
      { header: 'Avaliação (Estrelas)', key: 'rating', width: 20 },
      { header: 'Comentário', key: 'comment', width: 45 },
      { header: 'Data do Envio', key: 'created_at', width: 20 },
    ];

    // 4. Estiliza a Linha de Cabeçalho (Design Profissional - Azul Escuro)
    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1B365D' }, // Azul Marinho Corporativo
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // 5. Alimenta as linhas e aplica Zebra Striping (Linhas alternadas cinza claro)
    feedbacks.forEach((fb, index) => {
      const row = worksheet.addRow({
        id: fb.id,
        user_name: fb.user_name,
        user_email: fb.user_email,
        feature: fb.feature,
        rating: `⭐ ${fb.rating}/5`,
        comment: fb.comment || 'Sem comentários adicionais',
        created_at: new Date(fb.created_at).toLocaleString('pt-BR'),
      });

      // Alinhamento das células de dados
      row.getCell('id').alignment = { horizontal: 'center' };
      row.getCell('rating').alignment = { horizontal: 'center' };
      row.getCell('created_at').alignment = { horizontal: 'center' };

      // Zebra striping
      if (index % 2 === 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F9FAFB' },
        };
      }

      // Aplica bordas finas para legibilidade
      row.eachCell((cell) => {
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
          top: { style: 'thin', color: { argb: 'E5E7EB' } },
        };
      });
    });

    // 6. Gera o buffer do arquivo Excel em memória (sem precisar salvar no disco rígido)
    const buffer = await workbook.xlsx.writeBuffer();

    // 7. Dispara o E-mail de Suporte com o anexo
    await EmailService.sendFeedbackReport(buffer, feedbacks.length);

    console.log('[CRON] Relatório trimestral enviado com sucesso para o e-mail de suporte!');

  } catch (error) {
    console.error('[CRON] Erro crítico ao executar o Job de Feedback:', error);
  }
});