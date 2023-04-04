import * as express from 'express';
import HLeaderboardController from '../database/controllers/hleaderboard.controller';
import ALeaderboardController from '../database/controllers/aleaderboard.controller';

const router = express.Router();
const hleaderboardController = new HLeaderboardController();
const aleaderboardController = new ALeaderboardController();

router.get('/home', hleaderboardController.orderedLiderboard.bind(hleaderboardController));
router.get('/away', aleaderboardController.orderedLiderboard.bind(aleaderboardController));
export default router;
