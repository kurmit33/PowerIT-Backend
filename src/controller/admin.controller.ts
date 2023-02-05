import {Request, Response} from "express";
import {getAllUsers, updateUser} from "../service/admin.services";
import {omit} from "lodash";
import {privateFieldsAdmin, User} from "../model/user.model";
import {DocumentType, mongoose} from "@typegoose/typegoose";
import {findUserById} from "../service/user.service";
import {UpdateUserInput} from "../schema/user.schema";
import {switchRole} from "../utils/roles";


export async function getAllUsersHandler(req: Request, res: Response) {

    const users = await getAllUsers();


    if (!users) {

        return res.send("Fail to get users");
    }
    users.forEach((user: DocumentType<User>, index) => {
        // @ts-ignore
        users[index] = omit(user.toJSON(), privateFieldsAdmin);
    })

    return res.send(users);
}

export async function updateUserHandler(
    req: Request<{}, {}, UpdateUserInput>,
    res: Response) {

    const role = switchRole(req.body.role);
    if (!mongoose.isValidObjectId(req.body.id)) {
        return res.status(400).send("Could not update user");
    }
    const user = await findUserById(req.body.id);
    if (!user) {
        return res.status(400).send("Could not update user");
    }
    if (user.role !== role) {
        user.role = role;
    }
    if (user.verified !== req.body.verified) {
        user.verified = req.body.verified;
    }
    if (user.ban !== req.body.ban) {
        user.ban = req.body.ban;
    }
    try {
        await updateUser(user);
        return res.send("User successfully update");
    } catch (e: any) {
        return res.status(500).send(e);
    }

}
