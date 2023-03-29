import * as express from 'express';
import TeamsController from '../database/controllers/teams.controller';

const router = express.Router();
const teamsController = new TeamsController();

router.get('/', teamsController.getAll.bind(teamsController));
router.get('/:id', teamsController.getById.bind(teamsController));
export default router;
