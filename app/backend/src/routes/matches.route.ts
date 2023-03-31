import * as express from 'express';
import MatchesController from '../database/controllers/matches.controller';

const router = express.Router();
const matchesController = new MatchesController();

router.get('/', matchesController.getAll.bind(matchesController));

export default router;
