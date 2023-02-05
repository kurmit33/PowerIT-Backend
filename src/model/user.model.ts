import {
    DocumentType,
    getModelForClass,
    index,
    modelOptions,
    pre,
    prop,
    Severity
} from "@typegoose/typegoose";
import {nanoid} from "nanoid";
import argo2 from "argon2";
import log from "../utils/logger";
import Role from "../utils/roles";

export const privateFieldsUser = [
    "password",
    "__v",
    "verificationCode",
    "resetPasswordCode",
    "verified",
];

export const privateFieldsAdmin = [
    "password",
    "__v",
    "verificationCode",
    "resetPasswordCode",
];


@pre<User>("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const hash = await argo2.hash(this.password);
    this.password = hash;
})
@index({email: 1})
@modelOptions({
    schemaOptions: {
        timestamps: true
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class User {
    @prop({lowercase: true, required: true, unique: true})
    email: string

    @prop({required: true})
    firstName: string;

    @prop({required: true})
    lastName: string;

    @prop({required: true})
    password: string;

    @prop({required: true, default: () => nanoid()})
    verificationCode: string;

    @prop()
    passwordResetCode: string;

    @prop({default: false})
    verified: boolean;

    @prop({default: Role.user})
    role: Role;

    @prop({default: false})
    ban: boolean;

    async validatePassword(this: DocumentType<User>, candidatePassword: string) {
        try {
            return await argo2.verify(this.password, candidatePassword);
        } catch (e) {
            log.error(e, "Could not validate password");
            return false;
        }
    }

}


const UserModel = getModelForClass(User);
export default UserModel;



