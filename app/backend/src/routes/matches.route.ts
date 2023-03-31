import * as express from 'express';
import MatchesController from '../database/controllers/matches.controller';
import UsersModel from '../database/models/UsersModel';
import { ValidateJWT } from '../database/validations/validateJWT';

const router = express.Router();
const matchesController = new MatchesController();
const validateJWT = new ValidateJWT(UsersModel);

router.get('/', matchesController.getMatches.bind(matchesController));
router.patch(
  '/:id',
  validateJWT.validateToken.bind(validateJWT),
  matchesController.updateMatch.bind(matchesController),
);
router.patch(
  '/:id/finish',
  validateJWT.validateToken.bind(validateJWT),
  matchesController.finishMatch.bind(matchesController),
);
export default router;
