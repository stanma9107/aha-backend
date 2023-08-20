import { RoutePackage } from '../types/routes';

import authRoutes from './auth';

const packages: RoutePackage[] = [
  {
    prefix: '/auth',
    routes: authRoutes,
  },
];

export default packages;
