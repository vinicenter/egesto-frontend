import jwt from './core/utils/jwt'
import { errorResponse } from './core/utils/response-messages'

async function tenantVerify(context) {
  if (!context.request.headers.get('x-tenant')) {
    return errorResponse('No tenant provided', 401)
  }
  
  return await context.next();
}

async function authentication(context) {
  const publicRoutes = ['/api/v1/auth/login', '/api/v1/auth/register'];

  const { request, env, next } = context;
  const url = new URL(request.url);
  const tenant = request.headers.get('x-tenant');

  if (publicRoutes.includes(url.pathname)) return await next();

  const authorization = request.headers.get('Authorization');
  if (!authorization) return errorResponse('No token provided', 401)

  const tokenPrefix = authorization.split(' ')[0];

  if (tokenPrefix !== 'Bearer') return errorResponse('Invalid token', 401)

  const token = authorization.split(' ')[1];
  const isTokenValid = await jwt.verify(token, env.JWT_SECRET);
  if (!isTokenValid) return errorResponse('Invalid token', 401)

  const tokenData = await jwt.decode(token);

  if (tokenData.payload.tenant === tenant) {
    return await next()
  } else {
    return errorResponse('Invalid token', 401)
  }
}

export const onRequest = [tenantVerify, authentication];
