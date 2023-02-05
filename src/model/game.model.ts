import {getModelForClass, modelOptions, prop, Severity,} from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
    options: {
        allowMixed: Severity.ALLOW,
    }
})
export class Game {
    @prop({required: true})
    version: string;

    @prop({required: true})
    link: string;

}

const GameModel = getModelForClass(Game);
export default GameModel;
