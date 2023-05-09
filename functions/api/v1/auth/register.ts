import type { RegisterType } from './auth.schemas'
import { registerSafeParse } from './auth.schemas'
import { User } from './models/user'
import jwt from '../core/utils/jwt'
import { successResponse, errorResponse } from '../core/utils/response-messages';

export async function onRequestPost(context) {
  const { env, request } = context;
  const tenant = request.headers.get('x-tenant');

  const body = await new Response(request.body).json() as RegisterType;

  const registerParse = registerSafeParse(body)
  if (!registerParse.success) return errorResponse(registerParse.error.message, 400)

  const result = await User(context).createUser({
    username: body.username,
    password: body.password,
    name: body.name,
    email: body.email,
  })

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}
