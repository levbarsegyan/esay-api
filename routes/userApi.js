import express from 'express';
import * as authController from '../controllers/userController/authController.js';
import * as githubSigninController from '../controllers/userController/githubAuthController.js';
import * as googleAuthController from '../controllers/userController/googleAuthController.js';
import * as passwordController from '../controllers/userController/passwordController.js';
const userRouter = express.Router();
userRouter.post('/register', authController.register);
userRouter.post('/login', authController.login);
userRouter.get('/oauth/redirect/github', githubSigninController.githubAuthRedirect);
userRouter.post('/oauth/signin/github', githubSigninController.githubAuth);
userRouter.get('/oauth/redirect/google',  googleAuthController.googleRedirect);
userRouter.post('/oauth/signin/google',  googleAuthController.googleAuth);
userRouter.post('/forgot_password', passwordController.forgotPassword);
userRouter.post('/reset_password', passwordController.resetPassword);
export default userRouter;