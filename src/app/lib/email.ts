
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: process.env.EMAIL_SERVER_PORT === '465',
});

export async function sendReservationEmail(data: {
    to: string;
    clientName: string;
    date: string;
    offerTitle: string;
    totalPrice: string;
}) {
    const { to, clientName, date, offerTitle, totalPrice } = data;

    const mailOptions = {
        from: `"Szymon Baranowski" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: 'Potwierdzenie Twojej rezerwacji - Szymon Baranowski',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #E63946;">Dziękujemy za rezerwację!</h2>
                <p>Cześć <strong>${clientName}</strong>,</p>
                <p>Twoja rezerwacja na usługę <strong>${offerTitle}</strong> została przyjęta do systemu.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Termin:</strong> ${date}</p>
                    <p style="margin: 5px 0 0;"><strong>Kwota:</strong> ${totalPrice}</p>
                </div>

                <p>Obecnie rezerwacja ma status <strong>Oczekująca</strong>. Wyślemy Ci kolejne powiadomienie, gdy tylko potwierdzimy termin.</p>
                
                <p>W razie pytań, prosimy o kontakt:<br/>
                Email: ${process.env.EMAIL_FROM}<br/>
                Telefon: ${process.env.SITE_PHONE || '+48 000 000 000'}</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">Ta wiadomość została wysłana automatycznie przez system rezerwacji szymonbaranowski.pl</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);

        // Notify admin as well
        await transporter.sendMail({
            ...mailOptions,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM,
            subject: 'NOWA REZERWACJA - szymonbaranowski.pl',
            html: `<h3>Nowa rezerwacja od: ${clientName}</h3><p>Usługa: ${offerTitle}</p><p>Data: ${date}</p><p>Link do panelu: https://szymonbaranowski.pl/admin/reservations</p>`
        });

        return { success: true };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
}
