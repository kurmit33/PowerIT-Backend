import {Request, Response} from "express";
import {CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerificationUserInput} from "../schema/user.schema";
import {createUser, findUserByEmail, findUserById} from "../service/user.service";
import sendEmail from "../utils/mailer";
import {mongoose} from "@typegoose/typegoose";
import log from "../utils/logger";
import {nanoid} from "nanoid";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput>,
    res: Response) {
    const body = req.body;
    try {
        const user = await createUser(body);
        await sendEmail({
            from: "test@example.com",
            to: "fpawel19@gmail.com",
            subject: "Please verify your account",
            text: `Verification code ${user.verificationCode} ID: ${user.id} or click link below <a href="localhost:3000/api/users/verify/${user.id}/${user.verificationCode}>"Link"</a>`,
        });
        return res.send("User successfully created");
    } catch (e: any) {
        if (e.code === 11000) {
            return res.status(409).send("Account already exists");
        }

        return res.status(500).send(e);
    }
}

export async function verifyUserHandler(
    req: Request<VerificationUserInput>,
    res: Response) {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;
    if (!mongoose.isValidObjectId(id)) {
        return res.send("Could not verify user");
    } else {
        const user = await findUserById(id);
        if (!user) {
            return res.send("Could not verify user");
        } else if (user.verified) {
            return res.send("User is already verified");
        } else if (user.verificationCode === verificationCode) {
            user.verified = true;
            await user.save();
            return res.send("User successfully verified");
        }
        return res.send("Could not verify user");
    }
}

export async function forgotPasswordHandler(
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response) {

    const message = "If a user with that email is registered you will receive a password reset email";
    const {email} = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
        log.debug(`User with email ${email} does not exists`);
        return res.send(message);
    }

    if (!user.verified) {
        return res.send("User is not verified");
    }

    const passwordResetCode = nanoid();
    user.passwordResetCode = passwordResetCode;
    await user.save();

    await sendEmail({
        to: user.email,
        from: "test@example.com",
        subject: "Reset Your password",
        text: `Password reset code: ${passwordResetCode}. Id: ${user.id}`,
    });

    log.debug(`Password reset email sent to ${user.email}`);
    return res.send(message);

}

export async function resetPasswordHandler(
    req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
    res: Response) {
    const {id, passwordResetCode} = req.params;
    const {password} = req.body;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send("Could not reset user password");
    } else {
        const user = await findUserById(id);
        if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
            return res.status(400).send("Could not reset user password");
        } else {
            user.password = password;
            // @ts-ignore
            user.passwordResetCode = null;
            await user.save();
            return res.send("Successfully update password");
        }
    }
}


export async function getCurrentUserHandler(req: Request, res: Response) {
    return res.send(res.locals.user);
}
