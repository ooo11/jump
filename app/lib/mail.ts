import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;
const domainShop = process.env.NEXT_PUBLIC_APP_URL_SHOP;

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/new-password?token=${token}`;

    await resend.emails.send({
        from: "jumpsay@jumpsay.com",
        to: email,
        subject: "Reset your password!",
        html: `<p><a href="${resetLink}">Click the link here</a> to reset your password.</p>
        <p>If you do not request for this, contact us at 011-16145510</p>
        <p>Please do not reply to this email. Emails sent to this address will not be answered.</p>
        `
    });
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/new-verification?token=${token}`;

    await resend.emails.send({
        from: "jumpsay@jumpsay.com",
        to: email,
        subject: "You are now official Jumper. Click to confirm your email.",
        html: `<p><a href="${confirmLink}">Click the link here</a> to go in to your jumpsuit 👨🏻‍🚀</p>
        <p>Please do not reply to this email. Emails sent to this address will not be answered.</p>`
    });
}


export const sendOrderVerificationEmail = async (email: string, token: string, id: string) => {
    const confirmLink = `${domainShop}/new-order-verification?token=${token}&orderid=${id}`;
    const statusLink = `${domainShop}/status?orderid=${id}`;

    await resend.emails.send({
        from: "jumpsay@jumpsay.com",
        to: email,
        subject: `[Order Email Confirmation ${id}] Proceed to confirm your email to submit order`,
        html: `
        <h2>Your Order Id: ${id}</h2>
        <p>Please confirm your email to complete your order submission. The link will expire in 1 hour. If it expires, you will need to place a new order.</p>
        <p>Step 1: <a href="${confirmLink}">Click here to confirm your order email.</a></p>
        <p>Step 2: <a href="${statusLink}">See your order status here.</a></p>
        <p>Please do not reply to this email. Emails sent to this address will not be answered.</p>`
    });
}


export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "jumpsay@jumpsay.com",
        to: email,
        subject: "Two Factor Code PIN",
        html: `<p>Your PIN: ${token}</p>
        <p>Please do not reply to this email. Emails sent to this address will not be answered.</p>`
    });
};


export const sendOrderAcceptanceEmail = async (email: string, id: string, status: "ACCEPTED" | "REJECTED") => {
    const paymentLink = `${domainShop}/checkout?orderid=${id}`;
    const statusLink = `${domainShop}/status?orderid=${id}`;

    let emailSubject = `[ACCEPTED] YOUR ORDER HAS BEEN ACCEPTED `;
    let emailHtml = `
                    <h2>Your Order Id: ${id}</h2>
                    <p>Your order has been accepted! </p>
                    <p><a href="${paymentLink}">Proceed with payment</a></p>
                    <p><a href="${statusLink}">See your order status here</a></p>
                    <p>Feel free to contact us if you require any assistance.</p>
                    <p>Please do not reply to this email. Emails sent to this address will not be answered.</p>`;

    if (status === "REJECTED") {
        emailSubject = `[DECLINED] YOUR ORDER HAS BEEN DECLINED`;
        emailHtml = `
        <h2>Your Order Id: ${id}</h2>
        <p>We regret to inform you that we are unable to fulfill your order. Please contact us if you require any assistance.</p>
        <p><a href="${statusLink}">Click here for more details</a></p>
        <p>Please do not reply to this email. Emails sent to this address will not be answered.</p>`;
    }

    await resend.emails.send({
        from: "jumpsay@jumpsay.com",
        to: email,
        subject: emailSubject,
        html: emailHtml
    });
}


export const sendEmailUpdateVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/email-update-verification?token=${token}`;

    await resend.emails.send({
        from: "jumpsay@jumpsay.com",
        to: email,
        subject: "[Update Email Address] Confirm your updated email.",
        html: `<p><a href="${confirmLink}">Click the link here</a> to confirm your email address.</p>
        <p>Please do not reply to this email. Emails sent to this address will not be answered.</p>`
    });
}