import { Router } from 'express';
import CreateUserDTO from '../dtos/CreateUserDTO.js';
import validateRequest from '../middlewares/validateRequest.js';
import AuthController from '../controllers/AuthController.js';

const routes = new Router();

routes.post('/register', validateRequest(CreateUserDTO.schema), AuthController.register);
routes.post('/login', AuthController.login);
routes.post('/verify-email', AuthController.verifyEmail);
routes.post('/reset-password', AuthController.resetPassword);
routes.post('/forgot-password', AuthController.forgotPassword);

export default routes;