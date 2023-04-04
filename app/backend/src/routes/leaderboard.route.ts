import * as express from 'express';
import HLeaderboardController from '../database/controllers/hleaderboard.controller';
import ALeaderboardController from '../database/controllers/aleaderboard.controller';
import LeaderboardController from '../database/controllers/leaderboard.controller';

const router = express.Router();
const hleaderboardController = new HLeaderboardController();
const aleaderboardController = new ALeaderboardController();
const leaderboardController = new LeaderboardController();

router.get('/', leaderboardController.orderedLiderboard.bind(leaderboardController));
router.get('/home', hleaderboardController.orderedLiderboard.bind(hleaderboardController));
router.get('/away', aleaderboardController.orderedLiderboard.bind(aleaderboardController));
export default router;
