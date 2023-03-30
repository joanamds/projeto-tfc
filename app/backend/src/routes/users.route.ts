import * as express from 'express';
import UsersController from '../database/controllers/users.controller';

const router = express.Router();
const usersController = new UsersController();

router.post('/', usersController.login.bind(usersController));

export default router;
