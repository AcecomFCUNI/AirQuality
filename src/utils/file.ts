import fs, { WriteFileOptions } from 'fs'

const writeJson = (
  path: string,
  json: string,
  encrypt: WriteFileOptions
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, json, encrypt, error => {
      if (error) return reject(error)

      return resolve('Success')
    })
  })
}

const deleteFile = (path: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, error => {
      if (error) reject(error)
      else resolve('Success')
    })
  })
}

export { deleteFile, writeJson }
