import type { RegisterType } from '../auth.schemas'
import { registerSafeParse } from '../auth.schemas'
import { User } from '../models/user'
import { successResponse, errorResponse } from '../../core/utils/response-messages';

export async function onRequestPost(context) {
  const { request } = context;

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

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  const perPage = Number(url.searchParams.get('perPage')) || 10;
  const page = Number(url.searchParams.get('page')) || 1;
  const search = url.searchParams.get('search') || undefined;

  const result = await User(context).getUsers(perPage, page, search)

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}
