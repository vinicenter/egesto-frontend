import type { PersonType } from '../models/people.schemas'
import { personSafeParse } from '../models/people.schemas'
import { People } from '../models/person'
import { successResponse, errorResponse } from '../../core/utils/response-messages';

export async function onRequestPost(context) {
  const { request } = context;

  const body = await new Response(request.body).json() as PersonType;

  const registerParse = personSafeParse(body)
  if (!registerParse.success) return errorResponse(registerParse.error.message, 400)

  const result = await People(context).createPerson(registerParse.data)

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  const perPage = Number(url.searchParams.get('perPage')) || 10;
  const page = Number(url.searchParams.get('page')) || 1;
  const search = url.searchParams.get('search') || undefined;

  const result = await People(context).getPeople(perPage, page, search)

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}
