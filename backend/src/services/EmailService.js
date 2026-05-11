import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import templates from '../emails/templates.js';
import UserRepository from '../repositories/UserRepository.js'; // Importante para buscar os admins

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: true,
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: { rejectUnauthorized: false },
            family: 4
        });
    }

    async #sendMail({ to, subject, html, logMessage }) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Reservas Fatec ZL" <${process.env.EMAIL_FROM}>`,
                to,
                subject,
                html
            });
            console.log(`📧 ${logMessage}: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error(`❌ Erro em ${logMessage}:`, error);
            return false;
        }
    }

    // --- Métodos de Autenticação ---
    async sendVerificationCode(toEmail, validationLink) {
        return this.#sendMail({
            to: toEmail,
            subject: "Confirme seu Cadastro - Sistema de Reservas",
            html: templates.verificationCode(validationLink),
            logMessage: `Verificação enviada para ${toEmail}`
        });
    }

    async sendPasswordReset(toEmail, resetLink) {
        return this.#sendMail({
            to: toEmail,
            subject: "Recuperação de Senha - Sistema de Reservas",
            html: templates.passwordReset(resetLink),
            logMessage: `Reset de senha enviado para ${toEmail}`
        });
    }

    async sendAccountApproval(toEmail, userName) {
        return this.#sendMail({
            to: toEmail,
            subject: "✅ Conta Aprovada - Sistema de Reservas",
            html: templates.accountApproved(userName, process.env.FRONTEND_URL),
            logMessage: `Aprovação de conta enviada para ${toEmail}`
        });
    }

    // --- Métodos de Reserva (EventBus Listeners) ---

    async notifyAdminsNewRequest(reservation, professor) {
        const admins = await UserRepository.findByRole('ADMIN');
        const adminEmails = admins.map(admin => admin.email).join(', ');

        if (!adminEmails) return;

        return this.#sendMail({
            to: adminEmails,
            subject: `[SisLab] Nova solicitação pendente - ${professor.name}`,
            html: templates.reservationNewRequest({ reservation, professor }),
            logMessage: `Notificação de nova reserva enviada para os ADMINs`
        });
    }

    async notifyProfessorApproved(reservation, professor) {
        return this.#sendMail({
            to: professor.email,
            subject: "✅ Sua reserva foi aprovada!",
            html: templates.reservationApproved({ professor }),
            logMessage: `Confirmação de aprovação enviada para ${professor.email}`
        });
    }

    async notifyProfessorRejected(reservation, professor, reason) {
        return this.#sendMail({
            to: professor.email,
            subject: "❌ Atualização sobre sua reserva",
            html: templates.reservationRejected({ professor, reason }),
            logMessage: `Aviso de rejeição enviado para ${professor.email}`
        });
    }

    async notifyProfessorOverwritten(affectedProfessor, newReservation, cancelledItems) {
        return this.#sendMail({
            to: affectedProfessor.email,
            subject: "⚠️ Alerta: Sua reserva foi sobrescrita",
            html: templates.reservationOverwritten({ affectedProfessor, cancelledItems }),
            logMessage: `Aviso de sobrescrita enviado para ${affectedProfessor.email}`
        });
    }

    async notifyProfessorRedirected(professor, oldLabName, newLabName) {
        return this.#sendMail({
            to: professor.email,
            subject: "🔄 Alteração de Laboratório - Sua reserva foi aprovada",
            html: templates.reservationRedirected({ professor, oldLabName, newLabName }),
            logMessage: `Aviso de redirecionamento enviado para ${professor.email}`
        });
    }
}

export default new EmailService();