import {object, string, any} from "zod";

export const updateGameSchema = object({
    body: object({
        version: string({required_error: "Version is required"}),
        gameFile: any(),
    })
});
