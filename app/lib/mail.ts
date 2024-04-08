import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password!",
        html: `<p><a href="${resetLink}">Click the link here</a> to reset your password 🔏</p>`
    });
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "You are now official Jumper. Confirm your email.",
        html: `<p><a href="${confirmLink}">Click the link here</a> to go in to your jumpsuit 👨🏻‍🚀</p>`
    });
}


export const sendOrderVerificationEmail = async (email: string, token: string, id: string) => {
    const confirmLink = `${domain}/new-order-verification?token=${token}&orderid=${id}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "[Order Confirmation] Confirm your email to proceed for payment.",
        html: `<p><a href="${confirmLink}">Click the link here</a> to proceed with payment 🤟🏻</p>`
    });
}


export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA code: ${token}</p>`
    });
};
