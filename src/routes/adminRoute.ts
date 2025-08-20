import express from 'express';
const adminRouter = express.Router();

import authRouter from '../controller/admin/auth/AuthRoute';

adminRouter.use('/admin', authRouter);


export default adminRouter;