import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, // smtp.gmail.com
            port: Number(process.env.EMAIL_PORT), // 465
            secure: true, // OBRIGATÓRIO ser true para a porta 465
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            },
            // Isso força o uso de IPv4 e costuma resolver o problema do ECONNREFUSED com endereços IPv6
            family: 4
        });
    }

    async sendVerificationCode(toEmail, validationLink) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Reservas Fatec ZL" <${process.env.EMAIL_FROM}>`,
                to: toEmail,
                subject: "Confirme seu Cadastro - Sistema de Reservas",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                        <h2 style="color: #B30000; text-align: center;">Sistema de Reservas Fatec ZL</h2>
                        <p style="color: #333; font-size: 16px;">Olá,</p>
                        <p style="color: #333; font-size: 16px;">Recebemos a sua solicitação de cadastro. Para que o administrador possa aprovar seu acesso, por favor, confirme seu e-mail clicando no botão abaixo:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${validationLink}" style="background-color: #B30000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">Confirmar Meu E-mail</a>
                        </div>
                        
                        <p style="color: #777; font-size: 14px; text-align: center;">Se o botão não funcionar, copie e cole este link no seu navegador:<br> <a href="${validationLink}" style="color: #B30000; word-break: break-all;">${validationLink}</a></p>
                        
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">Se você não solicitou este cadastro, pode ignorar este e-mail em segurança.</p>
                    </div>
                `,
            });
            console.log(`📧 E-mail de verificação enviado para ${toEmail}: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar e-mail de verificação:', error);
            return false;
        }
    }

    async sendPasswordReset(toEmail, resetLink) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Reservas Fatec ZL" <${process.env.EMAIL_FROM}>`,
                to: toEmail,
                subject: "Recuperação de Senha - Sistema de Reservas",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                        <h2 style="color: #B30000; text-align: center;">Sistema de Reservas Fatec ZL</h2>
                        <p style="color: #333; font-size: 16px;">Esqueceu sua senha?</p>
                        <p style="color: #333; font-size: 16px;">Sem problemas. Clique no botão abaixo para criar uma nova senha. Este link <strong>expira em 1 hora</strong>.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" style="background-color: #B30000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">Redefinir Minha Senha</a>
                        </div>
                        
                        <p style="color: #777; font-size: 14px; text-align: center;">Se o botão não funcionar, copie e cole este link no seu navegador:<br> <a href="${resetLink}" style="color: #B30000; word-break: break-all;">${resetLink}</a></p>
                        
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">Se você não solicitou a alteração, ignore este e-mail e sua senha atual permanecerá a mesma.</p>
                    </div>
                `,
            });
            console.log(`📧 E-mail de Reset enviado para ${toEmail}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar e-mail de reset:', error);
            return false;
        }
    }

    async sendApprovalNotification(toEmail, userName) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Reservas Fatec ZL" <${process.env.EMAIL_FROM}>`,
                to: toEmail,
                subject: "✅ Conta Aprovada - Sistema de Reservas",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                        <h2 style="color: #2e7d32; text-align: center;">Bem-vindo ao Sistema de Reservas</h2>
                        <p style="color: #333; font-size: 16px;">Olá, <strong>${userName}</strong>!</p>
                        <p style="color: #333; font-size: 16px;">Excelente notícia: o seu cadastro no Sistema de Reservas da Fatec ZL foi <strong>aprovado</strong> pela coordenação.</p>
                        <p style="color: #333; font-size: 16px;">Você já pode acessar o sistema para consultar a disponibilidade dos laboratórios e solicitar as suas reservas.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/login" style="background-color: #B30000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">Acessar o Sistema</a>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">Este é um e-mail automático. Por favor, não responda.</p>
                    </div>
                `,
            });
            console.log(`📧 E-mail de Aprovação enviado para ${toEmail}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar e-mail de aprovação:', error);
            return false;
        }
    }

    async sendRejectionNotification(toEmail, userName, reason) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Reservas Fatec ZL" <${process.env.EMAIL_FROM}>`,
                to: toEmail,
                subject: "❌ Atualização de Cadastro - Sistema de Reservas",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                        <h2 style="color: #d32f2f; text-align: center;">Aviso sobre seu Cadastro</h2>
                        <p style="color: #333; font-size: 16px;">Olá, <strong>${userName}</strong>.</p>
                        <p style="color: #333; font-size: 16px;">A coordenação avaliou a sua solicitação de acesso ao Sistema de Reservas da Fatec ZL. Infelizmente, no momento, o seu cadastro <strong>não pôde ser aprovado</strong>.</p>
                        
                        <div style="background-color: #f5f5f5; border-left: 4px solid #B30000; padding: 15px; margin: 20px 0;">
                            <p style="color: #333; font-size: 14px; margin: 0;"><strong>Motivo informado pela coordenação:</strong></p>
                            <p style="color: #555; font-size: 14px; font-style: italic; margin-top: 5px;">"${reason}"</p>
                        </div>

                        <p style="color: #333; font-size: 14px;">Se você acredita que houve um engano ou se precisar corrigir alguma informação, entre em contato diretamente com a coordenação do seu departamento.</p>
                        
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">Este é um e-mail automático. Por favor, não responda.</p>
                    </div>
                `,
            });
            console.log(`📧 E-mail de Rejeição enviado para ${toEmail}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar e-mail de rejeição:', error);
            return false;
        }
    }
}

export default new EmailService();