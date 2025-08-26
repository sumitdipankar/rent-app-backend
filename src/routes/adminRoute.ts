import express from 'express';
const adminRouter = express.Router();

import authMiddleware from "../middlewares/authMiddleware"

adminRouter.use(authMiddleware); //Protected Routes



export default adminRouter;