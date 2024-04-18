import { getEmailUpdateVerificationTokenByToken, getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/app/lib/db";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import crypto from "crypto";

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return twoFactorToken;
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    };

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return passwordResetToken;

}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }
    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    })
    return verificationToken;
};


export const generateEmailUpdateVerificationToken = async (email: string, userId: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getEmailUpdateVerificationTokenByToken(email);
    if (existingToken) {
        await db.emailUpdateVerificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }
    const verificationToken = await db.emailUpdateVerificationToken.create({
        data: {
            email,
            token,
            expires,
            userId
        }
    })
    return verificationToken;
};

export const generateOrderVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000 * 24);

    const verificationToken = await db.orderVerificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    })
    return verificationToken;
};

