
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
    reservationCode: string;
    password: string;
}) {
    const { to, clientName, date, offerTitle, totalPrice, reservationCode, password } = data;
    const managementLink = `${process.env.NEXTAUTH_URL}/rezerwacja/${reservationCode}`;

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
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${managementLink}" style="background-color: #333; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Zarządzaj swoją rezerwacją</a>
                    <p style="font-size: 14px; color: #333; margin-top: 15px;">Twoje hasło do strony: <strong style="font-size: 18px; color: #E63946;">${password}</strong></p>
                    <p style="font-size: 12px; color: #666; margin-top: 5px;">Hasło będzie potrzebne do zalogowania się na stronie zarządzania.</p>
                </div>

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

export async function sendStatusUpdateEmail(data: {
    to: string;
    clientName: string;
    date: string;
    offerTitle: string;
    status: string;
}) {
    const { to, clientName, date, offerTitle, status } = data;

    let statusText = '';
    let statusColor = '#333';
    let extraMessage = '';

    if (status === 'confirmed') {
        statusText = 'POTWIERDZONA';
        statusColor = '#10B981'; // Green
        extraMessage = 'Cieszymy się, że będziemy mogli współpracować! Twój termin został oficjalnie zarezerwowany.';
    } else if (status === 'cancelled') {
        statusText = 'ANULOWANA';
        statusColor = '#EF4444'; // Red
        extraMessage = 'Z przykrością informujemy, że Twoja rezerwacja została anulowana. Jeśli masz pytania, skontaktuj się z nami.';
    } else if (status === 'date_change') {
        statusText = 'ZMIANA TERMINU';
        statusColor = '#3B82F6'; // Blue
        extraMessage = `Twój termin sesji został zaktualizowany. Nowy termin to: <strong>${date}</strong>.`;
    } else {
        statusText = 'ZMIENIONA';
        statusColor = '#F59E0B'; // Amber
        extraMessage = 'Status Twojej rezerwacji uległ zmianie.';
    }

    const mailOptions = {
        from: `"Szymon Baranowski" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: `Aktualizacja statusu rezerwacji: ${statusText}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: ${statusColor};">Aktualizacja Twojej rezerwacji</h2>
                <p>Cześć <strong>${clientName}</strong>,</p>
                <p>Informujemy, że status Twojej rezerwacji na usługę <strong>${offerTitle}</strong> (termin: ${date}) został zmieniony na:</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid ${statusColor};">
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${statusColor};"><strong>STATUS: ${statusText}</strong></p>
                </div>

                <p>${extraMessage}</p>
                
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
        return { success: true };
    } catch (error) {
        console.error('Status email sending failed:', error);
        return { success: false, error };
    }
}

export async function sendAdminPasswordChangedEmail(to: string, newPassword?: string) {
    const passwordSection = newPassword ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; border: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Nowe hasło:</p>
            <p style="margin: 5px 0 0; color: #333; font-size: 24px; font-weight: bold; font-family: monospace;">${newPassword}</p>
        </div>
    ` : '';

    const mailOptions = {
        from: `"Szymon Baranowski System" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: 'Ważne: Zmiana hasła do panelu administratora',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #333;">Zmiana hasła zakończona sukcesem</h2>
                <p>Cześć,</p>
                <p>Informujemy, że hasło do Twojego konta administratora w serwisie <strong>szymonbaranowski.pl</strong> zostało pomyślnie zmienione.</p>
                
                ${passwordSection}

                <div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #16a34a;">
                    <p style="margin: 0; color: #166534;"><strong>Twoje konto jest bezpieczne.</strong></p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #166534;">Jeśli to nie Ty dokonałeś tej zmiany, skontaktuj się natychmiast z administratorem technicznym.</p>
                </div>

                <p style="margin-top: 30px;">Możesz teraz zalogować się używając nowego hasła.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/admin/login" style="background-color: #333; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Zaloguj się</a>
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">Wiadomość wygenerowana automatycznie.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Password change email failed:', error);
        return { success: false, error };
    }
}
