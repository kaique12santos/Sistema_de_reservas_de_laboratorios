import { Router } from "express";
import DepartmentController from "../controllers/DepartmentController.js";

const routes = new Router();
routes.get('/departments', DepartmentController.getAllDepartments);

export default routes;