import bcrypt from 'bcryptjs'
import { IUser } from './user.types'
import { mongoInit } from '../../core/utils/mongo-http'
import { getPaginateMeta } from '../../core/utils/meta-paginate'

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

  const findOneUserById = async (id: string) => {
    return await userCollection?.findOne({
      filter: { _id: { $oid: id } },
      projection: { password: 0 }
    })
  }

  const checkUserPassword = async (username: string, password: string) => {
    const user = await userCollection?.findOne({ filter: { username } })
    if (!user.document) return false

    const hashedPassword = user.document.password
    const result = await bcrypt.compare(password, hashedPassword)
    return result
  }

  const updateUser = async (id: string, user: IUser) => {
    const updatedModel = {
      ...user,
      password: user.password ? await bcrypt.hash(user.password, 10) : undefined
    }

    if(!updatedModel.password) delete updatedModel.password

    const result = await userCollection?.updateOne({
      filter: { _id: { $oid: id } },
      update: {
        $set: updatedModel
      }
    })

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

  const deleteUser = async (id: string) => {
    const result = await userCollection?.deleteOne({ filter: { _id: { $oid: id }  } })
    return result
  }

  const getUsers = async(
    perPage: number,
    page: number,
    search?: string
  ) => {
    const result = await userCollection?.find({
      limit: perPage,
      skip: perPage * (page - 1),
      sort: { username: 1 },
      filter: search ? { username: { $regex: search, $options: 'i' } } : {},
      projection: { password: 0 },
    })

    const total = await userCollection?.aggregate({
      pipeline: [
        { $match: search ? { username: { $regex: search, $options: 'i' } } : {} },
        { $count: 'total' },
      ]
    })

    return {
      ...result,
      meta: getPaginateMeta(total.documents[0].total, perPage, page)
    }
  }

  return {
    createUser,
    findOneUserById,
    findOneUserByUsername,
    checkUserPassword,
    checkUserExists,
    deleteUser,
    updateUser,
    getUsers,
    userCollection,
  }
}