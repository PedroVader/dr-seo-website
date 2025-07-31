const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para enviar email
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validación básica
    if (!firstName || !lastName || !email || !phone || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Email para el equipo
    const msgToTeam = {
        to: process.env.TO_EMAIL,
        from: 'info@fasthorizons.com', 
        subject: 'New Contact Form Submission - Teleport Massive',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #8B5CF6;">New Contact Form Submission</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: white; padding: 15px; border-radius: 4px;">${message}</p>
                </div>
                <p style="color: #666; font-size: 14px;">Submitted on: ${new Date().toLocaleString()}</p>
            </div>
        `,
    };

    // Email de confirmación para el cliente
    const msgToClient = {
        to: email,
        from: 'noreply@teleportmassive.com',
        subject: 'Thank you for contacting Teleport Massive',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #8B5CF6;">Thank You, ${firstName}!</h2>
                <p>We've received your message and appreciate you reaching out to Teleport Massive.</p>
                <p>Our team will review your inquiry and get back to you within 24 hours.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333;">Your Message:</h3>
                    <p>${message}</p>
                </div>
                <p>If you need immediate assistance, please call us at <a href="tel:+12345678900">+1 (234) 567-8900</a></p>
                <hr style="border: 1px solid #eee; margin: 30px 0;">
                <p style="color: #666; font-size: 14px;">
                    Best regards,<br>
                    The Teleport Massive Team
                </p>
            </div>
        `,
    };

    try {
        // Enviar ambos emails
        await Promise.all([
            sgMail.send(msgToTeam),
            sgMail.send(msgToClient)
        ]);

        res.status(200).json({ success: true, message: 'Emails sent successfully' });
    } catch (error) {
        console.error('SendGrid Error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ========================================
// ACTUALIZACIÓN DEL FORMULARIO (Frontend)
// ========================================

// Reemplaza la parte del script en tu contact form con esto:

document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(error => error.classList.remove('show'));
    
    let isValid = true;
    
    // Email validation
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').classList.add('show');
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone').value;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
        document.getElementById('phoneError').classList.add('show');
        isValid = false;
    }
    
    // Terms validation
    const terms = document.getElementById('terms').checked;
    if (!terms) {
        document.getElementById('termsError').classList.add('show');
        isValid = false;
    }
    
    // If valid, send the form
    if (isValid) {
        // Deshabilitar el botón mientras se envía
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
        `;
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };
        
        try {
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Guardar datos para la página de agradecimiento (opcional)
                sessionStorage.setItem('formData', JSON.stringify(formData));
                // Redirigir a la página de agradecimiento
                window.location.href = '/thank-you/index.html';
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            // Mostrar mensaje de error
            alert('There was an error sending your message. Please try again or call us directly.');
            
            // Restaurar el botón
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }
});
