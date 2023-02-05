import {getModelForClass, modelOptions, prop, Severity,} from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
    options: {
        allowMixed: Severity.ALLOW,
    }
})
export class Key {
    @prop({required: true})
    userId: string;

    @prop({required: true, unique: true})
    key: string;

    @prop({defualt: false})
    ban: boolean;
}

const KeyModel = getModelForClass(Key);
export default KeyModel;
