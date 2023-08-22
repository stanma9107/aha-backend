import { RequestMethod, Route } from '../types/routes';
import authController from '../controllers/auth';

const routes: Route[] = [
  {
    path: 'login',
    method: RequestMethod.GET,
    handler: authController.login,
  },
  {
    path: 'check',
    method: RequestMethod.GET,
    handler: authController.check,
  },
  {
    path: 'callback',
    method: RequestMethod.GET,
    handler: authController.callback,
  },
  {
    path: 'logout',
    method: RequestMethod.GET,
    handler: authController.logout,
  },
];

export default routes;
