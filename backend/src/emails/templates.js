const BASE_STYLE = `
  font-family: Arial, sans-serif; 
  max-width: 600px; 
  margin: 0 auto; 
  padding: 20px; 
  border: 1px solid #eaeaea; 
  border-radius: 8px;
`;

const HEADER_RED = `<h2 style="color: #B30000; text-align: center;">Sistema de Reservas Fatec ZL</h2>`;
const FOOTER_DIVIDER = `<hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">`;
const FOOTER_TEXT = `<p style="color: #999; font-size: 12px; text-align: center;">Este é um e-mail automático. Por favor, não responda.</p>`;

const templates = {
  // --- Autenticação e Conta ---
  verificationCode: (validationLink) => `
    <div style="${BASE_STYLE}">
        ${HEADER_RED}
        <p>Olá, confirme seu e-mail para prosseguir com o cadastro:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${validationLink}" style="background-color: #B30000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Confirmar Meu E-mail</a>
        </div>
        ${FOOTER_DIVIDER}
        ${FOOTER_TEXT}
    </div>
  `,

  passwordReset: (resetLink) => `
    <div style="${BASE_STYLE}">
        ${HEADER_RED}
        <p>Recebemos uma solicitação de redefinição de senha.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #B30000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
        </div>
        ${FOOTER_DIVIDER}
        ${FOOTER_TEXT}
    </div>
  `,

  accountApproved: (userName, frontendUrl) => `
    <div style="${BASE_STYLE}">
        <h2 style="color: #2e7d32; text-align: center;">Bem-vindo ao Sistema</h2>
        <p>Olá, <strong>${userName}</strong>!</p>
        <p>Seu cadastro foi <strong>aprovado</strong> pela coordenação.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/login" style="background-color: #B30000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Acessar o Sistema</a>
        </div>
        ${FOOTER_DIVIDER}
        ${FOOTER_TEXT}
    </div>
  `,

  // --- Reservas (Novos) ---
  reservationNewRequest: ({ reservation, professor }) => `
    <div style="${BASE_STYLE}">
        ${HEADER_RED}
        <h3 style="color: #333;">Nova Solicitação de Reserva Pendente</h3>
        <p>O professor <strong>${professor.name}</strong> enviou uma nova solicitação.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Laboratório:</strong> ${reservation.lab_name || reservation.lab_id}</p>
            <p style="margin: 5px 0;"><strong>Período:</strong> ${reservation.recurrence_start} até ${reservation.recurrence_end}</p>
            <p style="margin: 5px 0;"><strong>Ocorrências:</strong> ${reservation.total_occurrences || 'Ver no sistema'}</p>
        </div>
        <p>Acesse o painel administrativo para aprovar ou rejeitar.</p>
        ${FOOTER_DIVIDER}
        ${FOOTER_TEXT}
    </div>
  `,

  reservationApproved: ({ professor }) => `
    <div style="${BASE_STYLE}">
        <h2 style="color: #2e7d32; text-align: center;">✅ Reserva Aprovada!</h2>
        <p>Olá, <strong>${professor.name}</strong>.</p>
        <p>Sua solicitação de reserva foi analisada e <strong>aprovada</strong>.</p>
        <p>Os horários já constam como ocupados no calendário oficial.</p>
        ${FOOTER_DIVIDER}
        ${FOOTER_TEXT}
    </div>
  `,

  reservationRejected: ({ professor, reason }) => `
    <div style="${BASE_STYLE}">
        <h2 style="color: #d32f2f; text-align: center;">❌ Reserva Rejeitada</h2>
        <p>Olá, <strong>${professor.name}</strong>.</p>
        <p>Sua solicitação de reserva <strong>não pôde ser aprovada</strong> no momento.</p>
        <div style="background-color: #fff5f5; border-left: 4px solid #d32f2f; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Motivo:</strong> ${reason}</p>
        </div>
        ${FOOTER_DIVIDER}
        ${FOOTER_TEXT}
    </div>
  `,

  reservationOverwritten: ({ affectedProfessor, cancelledItems }) => `
    <div style="${BASE_STYLE}">
        <h2 style="color: #d32f2f; text-align: center;">⚠️ Reserva Cancelada (Sobrescrita)</h2>
        <p>Olá, <strong>${affectedProfessor.name}</strong>.</p>
        <p>Informamos que um administrador precisou utilizar o laboratório e sua reserva foi <strong>cancelada/sobrescrita</strong> para as seguintes datas:</p>
        <ul style="color: #333;">
            ${cancelledItems.map(item => `<li>Data: ${item.date} | Horário: ${item.start_time} - ${item.end_time}</li>`).join('')}
        </ul>
        <p>Por favor, verifique a disponibilidade de outros laboratórios no sistema.</p>
        ${FOOTER_DIVIDER}
        ${FOOTER_TEXT}
    </div>
  `,
  reservationRedirected: ({ professor, oldLabName, newLabName }) => `
    <div style="${BASE_STYLE}">
        <h2 style="color: #f39c12; text-align: center;">🔄 Reserva Redirecionada</h2>
        <p>Olá, <strong>${professor.name}</strong>.</p>
        <p>Sua solicitação de reserva foi <strong>aprovada</strong>, mas houve uma alteração no laboratório designado pela coordenação.</p>
        <div style="background-color: #fff9e6; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Laboratório Original:</strong> <del>${oldLabName}</del></p>
            <p style="margin: 5px 0;"><strong>Novo Laboratório:</strong> <strong>${newLabName}</strong></p>
        </div>
        <p>Os horários que você solicitou foram mantidos e já constam como ocupados no calendário oficial.</p>
        ${FOOTER_DIVIDER}
        ${FOOTER_TEXT}
    </div>
  `,
};

export default templates;