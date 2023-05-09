import bcrypt from 'bcryptjs'
import { IUser } from './user.types'
import { mongoInit } from '../../core/utils/mongo-http'

export const User = (context) => {
  const db = mongoInit(context)

  const userCollection = db?.collection('users')

  const checkUserExists = async (username: string) => {
    const user = await userCollection?.findOne({ filter: { username } })
    return !!user.document
  }

  const findOneUserByUsername = async (username: string) => {
    return await userCollection?.findOne({ filter: { username } })
  }

  const checkUserPassword = async (username: string, password: string) => {
    const user = await userCollection?.findOne({ filter: { username } })
    if (!user.document) return false

    const hashedPassword = user.document.password
    const result = await bcrypt.compare(password, hashedPassword)
    return result
  }

  const createUser = async (user: IUser) => {
    const { username, password } = user
    const userExists = await checkUserExists(username)
    if (userExists) return { error: 'User already exists' }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await userCollection?.insertOne({ ...user, password: hashedPassword })
    return result
  }

  const deleteUser = async (username: string) => {
    const result = await userCollection?.deleteOne({ filter: { username } })
    return result
  }

  return {
    createUser,
    findOneUserByUsername,
    checkUserPassword,
    checkUserExists,
    deleteUser,
    userCollection,
  }
}