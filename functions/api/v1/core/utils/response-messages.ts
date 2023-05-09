export const successResponse = (data: any, status: number) => {
  return new Response(JSON.stringify({ ...data }), { status })
}

export const errorResponse = (error: string, status: number) => {
  return new Response(JSON.stringify({ error }), { status })
}