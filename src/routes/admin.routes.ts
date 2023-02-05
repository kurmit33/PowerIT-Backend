import express from "express";
import requireAdmin from "../middleware/requireAdmin";
import {getAllUsersHandler, updateUserHandler} from "../controller/admin.controller";
import validateResource from "../middleware/validateResource";
import {updateUserSchema} from "../schema/user.schema";

const router = express.Router();

router.get(
    "/api/admin/users",
    requireAdmin, getAllUsersHandler);

router.post(
    "/api/admin/updateuser",
    requireAdmin, validateResource(updateUserSchema), updateUserHandler);


router.post(
    "/api/admin/uploadgame",
    requireAdmin, validateResource
);


router.get(
    "/api/admin/getkeys",
    requireAdmin,
);

export default router;


