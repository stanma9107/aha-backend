import { RequestMethod, Route } from '../types/routes';
import authController from '../controllers/auth';

const routes: Route[] = [
  {
    path: 'login',
    method: RequestMethod.GET,
    handler: authController.login,
  },
];

export default routes;
