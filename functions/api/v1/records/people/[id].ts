import type { PersonType } from '../models/people.schemas'
import { personSafeParse } from '../models/people.schemas'
import { People } from '../models/person'
import { successResponse, errorResponse } from '../../core/utils/response-messages';

export async function onRequestPatch(context) {
  const { request, params } = context;

  const body = await new Response(request.body).json() as PersonType;

  const registerParse = personSafeParse(body)
  if (!registerParse.success) return errorResponse(registerParse.error.message, 400)

  const result = await People(context).updatePerson(params.id, registerParse.data)

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}

export async function onRequestGet(context) {
  const { params } = context;

  const result = await People(context).getPeopleById(params.id)

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}

export async function onRequestDelete(context) {
  const { params } = context;

  const result = await People(context).deletePerson(params.id)

  if (result.error) return errorResponse(result, 500)
  return successResponse({ result }, 200)
}
