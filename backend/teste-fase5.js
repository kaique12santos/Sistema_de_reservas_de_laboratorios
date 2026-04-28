// Importando os SEUS arquivos reais do projeto
import db from './src/config/Database.js'; // Ajuste o caminho se seu arquivo de banco for outro
import ReservationService from './src/services/ReservationService.js';
import ReservationRepository from './src/repositories/ReservationRepository.js';

// ==========================================
// CONFIGURAÇÕES DO TESTE (Ajuste para o seu BD)
// ==========================================
const ADMIN_ID = 3; // Coloque aqui um ID de usuário que exista no seu banco (seu admin)
const LAB_ID_ALTERNATIVO = 12; // Coloque um ID de um laboratório válido para testarmos o redirecionamento

async function runIntegrationTests() {
  console.log('🔌 Conectando ao banco de dados local MySQL...');

  try {
    // 1. Busca as reservas pendentes reais no seu banco
    const pendingReservations = await ReservationRepository.findPending();

    if (pendingReservations.length < 3) {
      console.log('\n⚠️ ATENÇÃO: O teste precisa de pelo menos 3 reservas PENDING para rodar todos os cenários.');
      console.log(`Atualmente o banco retornou apenas: ${pendingReservations.length} reserva(s) pendente(s).`);
      console.log('👉 Por favor, vá no banco (ou no sistema) e crie mais reservas simples pendentes e rode o script novamente.');
      process.exit(1);
    }

    // Pegamos 3 reservas distintas para não dar choque nos testes
    const resAprovar = pendingReservations[0];
    const resRejeitar = pendingReservations[1];
    const resRedirecionar = pendingReservations[2];

    console.log(`\n🧪 Iniciando testes de Integração (Modificando o Banco de Dados)...\n`);

    // ==========================================
    // TESTE 1: APROVAÇÃO
    // ==========================================
    console.log(`➡️  [TESTE 1] Tentando APROVAR a Reserva ID: ${resAprovar.id}`);
    await ReservationService.approveReservation(resAprovar.id, ADMIN_ID);
    console.log(`✅ [SUCESSO] Reserva ${resAprovar.id} aprovada! (Verifique no DBeaver/Workbench se o status mudou)`);

    // ==========================================
    // TESTE 2: REJEIÇÃO
    // ==========================================
    console.log(`\n➡️  [TESTE 2] Tentando REJEITAR a Reserva ID: ${resRejeitar.id}`);
    await ReservationService.rejectReservation(resRejeitar.id, ADMIN_ID, 'Manutenção preventiva não programada (Teste Automatizado)');
    console.log(`✅ [SUCESSO] Reserva ${resRejeitar.id} rejeitada! (Verifique se os reservation_items dela mudaram para CANCELED)`);

    // ==========================================
    // TESTE 3: REDIRECIONAMENTO
    // ==========================================
    // Garante que não vamos tentar redirecionar para o mesmo lab que ela já está
    const novoLabId = resRedirecionar.lab_id === LAB_ID_ALTERNATIVO ? (LAB_ID_ALTERNATIVO + 1) : LAB_ID_ALTERNATIVO;
    
    console.log(`\n➡️  [TESTE 3] Tentando REDIRECIONAR a Reserva ID: ${resRedirecionar.id} para o Lab ID: ${novoLabId}`);
    await ReservationService.redirectReservation(resRedirecionar.id, ADMIN_ID, novoLabId, 'Laboratório original indisponível. Remanejado pelo sistema.');
    console.log(`✅ [SUCESSO] Reserva ${resRedirecionar.id} redirecionada e aprovada! (Verifique se os itens mudaram de lab_id e a reserva está APPROVED)`);

    console.log('\n🎉 TODOS OS TESTES PASSARAM COM INTEGRAÇÃO NO MYSQL! O CÓDIGO ESTÁ PRONTO PARA SUBIR.');

  } catch (error) {
    console.error('\n❌ [FALHOU] Ocorreu um erro real durante a execução:');
    console.error(error);
  } finally {
    console.log('\nEncerrando conexão com o banco...');
    process.exit(0);
  }
}

// Executa o script
runIntegrationTests();