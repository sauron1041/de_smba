import { IRoute } from "@core/interfaces";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import errorMiddleware from "@core/middleware/error.middleware";
import Logger from "@core/utils/logger";
import path from "path";
const multer = require('multer');
import database from "@core/config/database";

class App {
    public app: express.Application
    public port: number | string
    public production: boolean = process.env.NODE_ENV === 'production' ? true : false

    constructor(routes: IRoute[]) {
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.connectMySql();
        this.initialMiddlewares()
        this.initialRoutes(routes)
        this.initialErrorMidlleware()
    }
    private async initialRoutes(routes: IRoute[]) {
        routes.forEach(route => {
            this.app.use(process.env.API_VERSION!, route.router)
        })
    }
    public listen() {
        if (this.production) {
        } else {
            this.app.listen(this.port, () => {
                Logger.info(`Server is running on port ${this.port}`)
            })
        }
    }
    private initialMiddlewares() {
        if (this.production) {
            this.app.use(morgan('combined'))
            this.app.use(cors({ origin: 'localhost:5173', credentials: true }))
            this.app.use(helmet())
            this.app.use(hpp())
        } else {
            this.app.use(morgan('dev'))
            this.app.use(cors({ origin: true, credentials: true }))
        }
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use('/uploads', express.static(path.resolve('uploads/')));
    }
    private initialErrorMidlleware() {
        this.app.use(errorMiddleware);
        this.app.use(multer().single('file'));
    }
    private connectMySql() {
        database.connectDB();
    }
}

export default App;
