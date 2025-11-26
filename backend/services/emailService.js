import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Información del médico para emails
const doctorInfo = {
  name: "Dra. María Pérez",
  contact: {
    phone: "+54 11 4567-8900",
    email: "info@dcperez.com",
    address: "Corrientes 1010"
  }
};

class EmailService {
  // Verificar conexión del servicio de email

  // Enviar email de confirmación de nueva cita
  async sendAppointmentConfirmation(appointment) {
    const { patientName, patientLastName, email, date, time, insuranceProvider, notes } = appointment;
    
    const formattedDate = new Date(date).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    try {
      const { data, error } = await resend.emails.send({
        from: `${doctorInfo.name} <onboarding@resend.dev>`,
        to: [email],
        subject: '✅ Cita Médica Solicitada - Confirmación de Recepción',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Cita</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
              .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2; }
              .detail-row { margin: 10px 0; }
              .label { font-weight: bold; color: #1976d2; }
              .status { background: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              .important { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏥 Consultorio Médico</h1>
              <h2>Confirmación de Cita Solicitada</h2>
            </div>
            
            <div class="content">
              <p>Estimado/a <strong>${patientName} ${patientLastName}</strong>,</p>
              
              <p>Hemos recibido su solicitud de cita médica. A continuación, los detalles de su solicitud:</p>
              
              <div class="appointment-details">
                <div class="detail-row">
                  <span class="label">📅 Fecha:</span> ${formattedDate}
                </div>
                <div class="detail-row">
                  <span class="label">🕐 Horario:</span> ${time}
                </div>
                <div class="detail-row">
                  <span class="label">🏥 Obra Social:</span> ${insuranceProvider}
                </div>
                ${notes ? `
                <div class="detail-row">
                  <span class="label">📝 Motivo de consulta:</span> ${notes}
                </div>
                ` : ''}
              </div>
              
              <div class="status">
                <strong>Estado actual: PENDIENTE DE CONFIRMACIÓN</strong>
              </div>
              
              <div class="important">
                <h3>📋 Información Importante:</h3>
                <ul>
                  <li>Su cita está <strong>pendiente de confirmación</strong> por parte del consultorio.</li>
                  <li>Recibirá un nuevo email cuando su cita sea confirmada.</li>
                  <li>Por favor, traiga su DNI y carnet de la obra social el día de la consulta.</li>
                  <li>Si necesita cancelar o modificar su cita, contáctenos con anticipación.</li>
                </ul>
              </div>
              
              <p>Gracias por elegir nuestros servicios médicos.</p>
              
              <div class="footer">
                <p><strong>${doctorInfo.name}</strong></p>
                <p>📞 ${doctorInfo.contact.phone}</p>
                <p>📧 ${doctorInfo.contact.email}</p>
                <p>📍 ${doctorInfo.contact.address}</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error(`❌ Error enviando email a ${email}:`, error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Email de confirmación enviado a ${email}`);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error(`❌ Error enviando email a ${email}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // Enviar email cuando la cita es confirmada
  async sendAppointmentConfirmed(appointment) {
    const { patientName, patientLastName, email, date, time, insuranceProvider, notes } = appointment;
    
    const formattedDate = new Date(date).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    try {
      const { data, error } = await resend.emails.send({
        from: `${doctorInfo.name} <onboarding@resend.dev>`,
        to: [email],
        subject: `✅ Cita Médica CONFIRMADA - ${formattedDate}`,
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cita Confirmada</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
              .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e7d32; }
              .detail-row { margin: 10px 0; }
              .label { font-weight: bold; color: #2e7d32; }
              .status { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; font-size: 18px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              .important { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .reminder { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏥 Consultorio Médico</h1>
              <h2>¡Su Cita Ha Sido Confirmada!</h2>
            </div>
            
            <div class="content">
              <p>Estimado/a <strong>${patientName} ${patientLastName}</strong>,</p>
              
              <p>¡Excelentes noticias! Su cita médica ha sido <strong>confirmada</strong> exitosamente.</p>
              
              <div class="appointment-details">
                <div class="detail-row">
                  <span class="label">📅 Fecha:</span> ${formattedDate}
                </div>
                <div class="detail-row">
                  <span class="label">🕐 Horario:</span> ${time}
                </div>
                <div class="detail-row">
                  <span class="label">🏥 Obra Social:</span> ${insuranceProvider}
                </div>
                ${notes ? `
                <div class="detail-row">
                  <span class="label">📝 Motivo de consulta:</span> ${notes}
                </div>
                ` : ''}
              </div>
              
              <div class="status">
                <strong>✅ ESTADO: CONFIRMADA</strong>
              </div>
              
              <div class="reminder">
                <h3>📋 Recordatorios Importantes:</h3>
                <ul>
                  <li><strong>Llegue 15 minutos antes</strong> de su horario de cita.</li>
                  <li>Traiga su <strong>DNI</strong> y <strong>carnet de la obra social</strong>.</li>
                  <li>Si no puede asistir, contáctenos con al menos 24 horas de anticipación.</li>
                  <li>En caso de emergencia, llame al consultorio.</li>
                </ul>
              </div>
              
              <div class="important">
                <h3>⚠️ Importante:</h3>
                <p>Si necesita cancelar o reprogramar su cita, por favor contáctenos lo antes posible para que podamos ofrecer el horario a otro paciente.</p>
              </div>
              
              <p>Esperamos verlo/a pronto. ¡Que tenga un excelente día!</p>
              
              <div class="footer">
                <p><strong>${doctorInfo.name}</strong></p>
                <p>📞 ${doctorInfo.contact.phone}</p>
                <p>📧 ${doctorInfo.contact.email}</p>
                <p>📍 ${doctorInfo.contact.address}</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error(`❌ Error enviando email de confirmación a ${email}:`, error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Email de confirmación de cita enviado a ${email}`);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error(`❌ Error enviando email de confirmación a ${email}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // Enviar email de cancelación de cita
  async sendAppointmentCancelled(appointment) {
    const { patientName, patientLastName, email, date, time } = appointment;
    
    const formattedDate = new Date(date).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    try {
      const { data, error } = await resend.emails.send({
        from: `${doctorInfo.name} <onboarding@resend.dev>`,
        to: [email],
        subject: `❌ Cita Médica Cancelada - ${formattedDate}`,
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cita Cancelada</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
              .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f; }
              .detail-row { margin: 10px 0; }
              .label { font-weight: bold; color: #d32f2f; }
              .status { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; font-size: 18px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              .info { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏥 Consultorio Médico</h1>
              <h2>Cita Médica Cancelada</h2>
            </div>
            
            <div class="content">
              <p>Estimado/a <strong>${patientName} ${patientLastName}</strong>,</p>
              
              <p>Le informamos que su cita médica ha sido cancelada.</p>
              
              <div class="appointment-details">
                <div class="detail-row">
                  <span class="label">📅 Fecha:</span> ${formattedDate}
                </div>
                <div class="detail-row">
                  <span class="label">🕐 Horario:</span> ${time}
                </div>
              </div>
              
              <div class="status">
                <strong>❌ ESTADO: CANCELADA</strong>
              </div>
              
              <div class="info">
                <h3>📋 Información:</h3>
                <p>Si necesita reagendar su cita o tiene alguna consulta, no dude en contactarnos. Estaremos encantados de ayudarle a encontrar un nuevo horario que se ajuste a sus necesidades.</p>
              </div>
              
              <p>Gracias por su comprensión.</p>
              
              <div class="footer">
                <p><strong>${doctorInfo.name}</strong></p>
                <p>📞 ${doctorInfo.contact.phone}</p>
                <p>📧 ${doctorInfo.contact.email}</p>
                <p>📍 ${doctorInfo.contact.address}</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error(`❌ Error enviando email de cancelación a ${email}:`, error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Email de cancelación enviado a ${email}`);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error(`❌ Error enviando email de cancelación a ${email}:`, error.message);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();