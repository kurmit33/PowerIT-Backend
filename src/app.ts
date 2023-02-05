require("dotenv").config();

const cors = require('cors');
import deserializeUser from "./middleware/deserializeUser";

import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import multer from "multer"

const app = express();
const upload = multer({dest: "game/"});
app.use(cors());
app.use(express.json());
app.use(deserializeUser);
app.use(router);

const port = config.get("port");

app.listen(port, () => {
    log.info(`App started at http://localhost:${port}`);
    connectToDb().then(r => log.info('Connected to DB'));
});

