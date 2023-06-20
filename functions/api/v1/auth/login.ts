import type { LoginType } from './user.schemas'
import { loginSafeParse } from './user.schemas'
import { User } from "./models/user";
import jwt from '../core/utils/jwt';
import { successResponse, errorResponse } from '../core/utils/response-messages';

export async function onRequestPost(context) {
  const { env, request } = context;
  const { checkUserPassword, findOneUserByUsername } = User(context)
  const tenant = request.headers.get('x-tenant')

  const body = await new Response(request.body).json() as LoginType;

  const loginParse = loginSafeParse(body)
  if (!loginParse.success) return errorResponse(loginParse.error.message, 401)

  const isUserOrPasswordValid = await checkUserPassword(body.username, body.password)
  if (!isUserOrPasswordValid) return errorResponse('Invalid password or username', 401)

  const token = await jwt.sign({ username: body.username, tenant }, env.JWT_SECRET)
  const user = await findOneUserByUsername(body.username)

  return successResponse({ token, ...user }, 200)
}
