import bcrypt from 'bcryptjs'
import { D1Orm, DataTypes, Model } from "d1-orm";
import type { Infer } from "d1-orm";

export const User = ({ env }) => {
  const users = new Model(
    {
      D1Orm: new D1Orm(env.DB),
      tableName: "users",
      primaryKeys: "id",
      autoIncrement: "id",
      uniqueKeys: [["username"]],
    },
    {
      id: {
        type: DataTypes.INTEGER,
        
      },
      name: {
        type: DataTypes.STRING,
        notNull: true,
      },
      username: {
        type: DataTypes.STRING,
        notNull: true,
      },
      password: {
        type: DataTypes.STRING,
        notNull: true,
      },
      email: {
        type: DataTypes.STRING,
      }
    }
  )

  type IUser = Infer<typeof users>

  const findOneUserByUsername = async (username: string) => {
    return await users.First({ where: { username } })
  }

  const checkUserExists = async (username: string) => {
    const user = await findOneUserByUsername(username)
    return !!user
  }

  const checkUserPassword = async (username: string, password: string) => {
    const user = await findOneUserByUsername(username)
    if (!user) return false

    const hashedPassword = user.password
    const result = await bcrypt.compare(password, hashedPassword)
    return result
  }

  const createUser = async (user: Omit<IUser, "id">) => {
    const { password } = user

    const hashedPassword = await bcrypt.hash(password, 10) as string

    const result = await users.InsertOne({
      ...user,
      password: hashedPassword,
    })

    return result
  }

  return {
    createUser,
    findOneUserByUsername,
    checkUserPassword,
    checkUserExists,
  }
}