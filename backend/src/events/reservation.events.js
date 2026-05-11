import EventBus from './EventBus.js';
import EmailService from '../services/EmailService.js';

// RF16 — Nova solicitação de reserva recorrente → notificar ADMINs
EventBus.on('reservation:created:pending', async ({ reservation, professor }) => {
    try {
        await EmailService.notifyAdminsNewRequest(reservation, professor);
    } catch (err) {
        console.error('[Event reservation:created:pending] Falha no email:', err.message);
    }
});

// RF17 — Reserva sobrescrita → notificar professor afetado
EventBus.on('reservation:overwritten', async ({ affectedProfessor, newReservation, cancelledItems }) => {
    try {
        await EmailService.notifyProfessorOverwritten(affectedProfessor, newReservation, cancelledItems);
    } catch (err) {
        console.error('[Event reservation:overwritten] Falha no email:', err.message);
    }
});

// Reserva aprovada → notificar professor
EventBus.on('reservation:approved', async ({ reservation, professor }) => {
    try {
        await EmailService.notifyProfessorApproved(reservation, professor);
    } catch (err) {
        console.error('[Event reservation:approved] Falha no email:', err.message);
    }
});

// Reserva rejeitada → notificar professor
EventBus.on('reservation:rejected', async ({ reservation, professor, reason }) => {
    try {
        await EmailService.notifyProfessorRejected(reservation, professor, reason);
    } catch (err) {
        console.error('[Event reservation:rejected] Falha no email:', err.message);
    }
});

// Reserva redirecionada → notificar professor da mudança de sala
EventBus.on('reservation:redirected', async ({ professor, oldLabName, newLabName }) => {
    try {
        await EmailService.notifyProfessorRedirected(professor, oldLabName, newLabName);
    } catch (err) {
        console.error('[Event reservation:redirected] Falha no email:', err.message);
    }
});

console.log('[EventBus] Listeners de reserva registrados');