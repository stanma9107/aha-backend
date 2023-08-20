export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

export type Route = {
  path: string;
  method: RequestMethod;
  handler: any;
};

export type RoutePackage = {
  prefix: string;
  routes: Route[];
};
