import UserModel, {User} from "../model/user.model";
import GameModel from "../model/game.model";

export function createUser(input: Partial<User>) {
    return UserModel.create(input)
}

export function findUserById(id: string) {
    return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
    return UserModel.findOne({email});
}

export function getGameVersion() {
    return GameModel.findOne({}, {}, {sort: {'createdAt': -1}});
}

