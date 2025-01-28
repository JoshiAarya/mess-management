import {Router} from "express"
import { registerUser , getUsers } from "../controllers/userController.js";

const userRouter = Router();


userRouter.route("/register").post(registerUser);

userRouter.route("/users").get(getUsers);

export default userRouter