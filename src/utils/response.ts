import { FastifyReply } from 'fastify';

const parseBody = (message: any) => {
  if (message instanceof Object) {
    return message;
  }
  return {
    message,
  };
};

export const redirect = (res: FastifyReply, url: string) => {
  res.redirect(url);
};

export const badRequest = (res: FastifyReply, message: any) => {
  res
    .code(400)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(parseBody(message));
};

export const unauthorized = (res: FastifyReply, message: any) => {
  res
    .code(401)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(parseBody(message));
};

export const forbidden = (res: FastifyReply, message: any) => {
  res
    .code(403)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(parseBody(message));
};

export const notFound = (res: FastifyReply, message: any) => {
  res
    .code(404)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(parseBody(message));
};

export const internalServerError = (res: FastifyReply, message: any) => {
  res
    .code(500)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(parseBody(message));
};

export const success = (res: FastifyReply, message: any) => {
  res
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(parseBody(message));
};
