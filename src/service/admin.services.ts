import UserModel, {User} from "../model/user.model";
import KeyModel, {Key} from "../model/keys.model";

export function getAllUsers() {
    return UserModel.find();
}

export function updateUser(user: User) {
    return UserModel.updateOne(user);
}

export function getAllKeys() {
    return KeyModel.find();
}

export function findUserKeys(id: string) {

}
