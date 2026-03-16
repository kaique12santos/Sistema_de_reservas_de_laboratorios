import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const routes = new Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.post('/verify-email', AuthController.verifyEmail);
routes.post('/reset-password', AuthController.resetPassword);

export default routes;