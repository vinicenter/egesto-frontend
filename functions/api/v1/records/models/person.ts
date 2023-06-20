import { PersonType } from '../models/people.schemas'
import { mongoInit, getPaginateMeta } from '../../core/utils/mongo-http'

export const People = (context) => {
  const db = mongoInit(context)

  const peopleCollection = db?.collection('people')

  const checkDocumentExists = async (document: string) => {
    const user = await peopleCollection?.findOne({ filter: { document } })
    return !!user.document
  }

  const updatePerson = async (id: string, people: PersonType) => {
    const result = await peopleCollection?.updateOne({
      filter: { _id: { $oid: id } },
      update: {
        $set: people
      }
    })

    return result
  }

  const createPerson = async (person: PersonType) => {
    const result = await peopleCollection?.insertOne({ ...person })
    return result
  }

  const deletePerson = async (id: string) => {
    const result = await peopleCollection?.deleteOne({ filter: { _id: { $oid: id }  } })
    return result
  }

  const getPeopleById = async (id: string) => {
    const result = await peopleCollection?.findOne({ filter: { _id: { $oid: id } } })
    return result
  }

  const getPeople = async(
    perPage: number,
    page: number,
    search?: string
  ) => {
    const result = await peopleCollection?.find({
      limit: perPage,
      skip: perPage * (page - 1),
      sort: { corporateName: 1 },
      filter: search ? {
        corporateName: { $regex: search, $options: 'i' },
        document: { $regex: search, $options: 'i' }
      } : {},
    })

    const total = await peopleCollection?.aggregate({
      pipeline: [
        { $match: search ? {
          corporateName: { $regex: search, $options: 'i' },
          document: { $regex: search, $options: 'i' }
        } : {} },
        { $count: 'total' },
      ]
    })

    return {
      ...result,
      meta: getPaginateMeta(total.documents?.[0]?.total, perPage, page)
    }
  }

  return {
    getPeopleById,
    createPerson,
    checkDocumentExists,
    deletePerson,
    updatePerson,
    getPeople,
    peopleCollection,
  }
}