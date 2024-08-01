import axios from '~utils/axios'

export async function uploadFiles(files: File[]) {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('file', file)
  })

  const data = await axios.post<{ files: string[] }>('/upload', formData)

  return data
}

export async function deleteFiles(files: string[]) {
  const data = await axios.delete<{ message: string }>('/upload', { data: { files } })

  return data
}
