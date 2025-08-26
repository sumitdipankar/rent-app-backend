import express, { Application, Request, Response } from "express"
import "dotenv/config"
import authRouter from "./controller/admin/auth/AuthRoute";
import adminRouter from "./routes/adminRoute";

const app: Application = express();
const PORT = process.env.PORT || 7000

app.use(express.json());

app.use('/api', authRouter);
app.use("/api", adminRouter);

app.get("/", (request: Request, response: Response) => {
    response.send(`Server statrted on Port ${PORT}.....WOW👍💕`)
})


app.listen(PORT, () => {
    console.log(`Server statrted on Port ${PORT}.....`)
})