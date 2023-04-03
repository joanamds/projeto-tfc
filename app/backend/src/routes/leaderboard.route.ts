import * as express from 'express';
import LeaderboardController from '../database/controllers/leaderboard.controller';

const router = express.Router();
const leaderboardController = new LeaderboardController();

router.get('/home', leaderboardController.orderedLiderboard.bind(leaderboardController));

export default router;
