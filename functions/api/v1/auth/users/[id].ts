import type { RegisterType } from '../auth.schemas'
import { registerSafeParse } from '../auth.schemas'
import { User } from '../models/user'
import { successResponse, errorResponse } from '../../core/utils/response-messages';

export async function onRequestPatch(context) {
  const { request, params } = context;

  const body = await new Response(request.body).json() as RegisterType;

  const registerParse = registerSafeParse(body)
  if (!registerParse.success) return errorResponse(registerParse.error.message, 400)

  const result = await User(context).updateUser(params.id, {
    username: body.username,
    password: body.password,
    name: body.name,
    email: body.email,
  })

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}

export async function onRequestGet(context) {
  const { params } = context;

  const result = await User(context).findOneUserById(params.id)

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}
