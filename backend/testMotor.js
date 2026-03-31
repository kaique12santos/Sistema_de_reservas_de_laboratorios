import AcademicCycleService from './src/services/AcademicCycleService.js';
// Importamos a conexão do banco só para podermos fechar ela no final e o terminal não ficar travado
import db from './src/config/database.js'; 

async function runTest() {
  console.log('🚀 Dando a partida no Motor de Geração de Ciclos...');
  console.log('⏳ Calculando datas e buscando feriados na BrasilAPI...\n');

  try {
    // Aqui nós simulamos o exato momento em que o Admin clica no botão "Gerar Próximo Semestre"
    const result = await AcademicCycleService.generateNextCycle();
    
    console.log('✅ SUCESSO ABSOLUTO!');
    console.log('--------------------------------------------------');
    console.log(`📘 Ciclo Gerado: ${result.cycle.name}`);
    console.log(`📅 Início Letivo: ${result.cycle.start_date}`);
    console.log(`🛑 Fim Letivo: ${result.cycle.end_date}`);
    console.log(`👑 Limite Exclusivo Coordenação: ${result.cycle.admin_exclusive_end_date}`);
    console.log(`🏖️ Feriados/Recessos Injetados: ${result.holidays_synced}`);
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ O Motor engasgou:', error.message);
  } finally {
    // Encerra a conexão com o banco de dados para o script finalizar e liberar o terminal
    if (db.connection) {
       await db.connection.end();
    }
    process.exit(0);
  }
}

runTest();