import * as express from 'express';
import MatchesController from '../database/controllers/matches.controller';

const router = express.Router();
const matchesController = new MatchesController();

router.get('/', matchesController.getMatches.bind(matchesController));
router.patch('/:id/finish', matchesController.finishMatch.bind(matchesController));

export default router;
