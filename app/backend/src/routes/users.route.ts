import * as express from 'express';
import UsersController from '../database/controllers/users.controller';
import { ValidateJWT } from '../database/validations/validateJWT';
import UsersModel from '../database/models/UsersModel';

const router = express.Router();
const usersController = new UsersController();
const validateJWT = new ValidateJWT(UsersModel);

router.post('/', usersController.login.bind(usersController));
router.get('/role', validateJWT.validateToken.bind(validateJWT), (req, res) => {
  const { user } = res.locals;
  return res.status(200).json({ role: user.role });
});

export default router;
