import express from 'express';
import * as userController from '../../controllers/userController/userController';
const route = express.Router();
export default (app) => {
    app.use('/', route);
    route.get('/',  userController.home);
};
