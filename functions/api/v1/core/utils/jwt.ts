import jwt from '@tsndr/cloudflare-worker-jwt'
import type { JwtAlgorithm, JwtVerifyOptions, JwtPayload } from '@tsndr/cloudflare-worker-jwt'

const config = {
  exp: Math.floor(Date.now() / 1000 + (1 * (30 * 30)))
}

const sign = async (payload: JwtPayload, secret: string | JsonWebKey) => {
  const token = await jwt.sign({ ...payload, ...config }, secret)
  console.log('sign', token)
  return token
}

const verify = async (token: string, secret: string | JsonWebKey, options?: JwtVerifyOptions | JwtAlgorithm) => {
  const payload = await jwt.verify(token, secret, options)
  console.log('verify', payload)
  return payload
}

const decode = async (token: string) => {
  const payload = jwt.decode(token)
  console.log('decode', payload)
  return payload
}

export default {
  sign,
  verify,
  decode
}
