import {NextFunction, Request, Response} from "express";
import Role from "../utils/roles";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user || user.role !== Role.admin) {
        return res.sendStatus(403);
    }

    return next();
}

export default requireAdmin;
