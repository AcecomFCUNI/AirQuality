import admin from 'firebase-admin'
import type { Debugger } from 'debug'

import { deleteFile, writeJson } from 'utils'

declare global {
  // eslint-disable-next-line no-var
  var __firebase__: admin.app.App
}

const firebaseConfig: FirebaseConfig = {
  auth_provider_x509_cert_url: process.env
    .FIREBASE_AUTH_PROVIDER_X509_CERT_URL as string,
  auth_uri: process.env.FIREBASE_AUTH_URI as string,
  client_email: process.env.FIREBASE_CLIENT_EMAIL as string,
  client_id: process.env.FIREBASE_CLIENT_ID as string,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL as string,
  private_key: process.env.FIREBASE_PRIVATE_KEY as string,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID as string,
  project_id: process.env.FIREBASE_PROJECT_ID as string,
  token_uri: process.env.FIREBASE_TOKEN_URI as string,
  type: process.env.FIREBASE_TYPE as string
}

const firebaseConnection = async (
  d: Debugger,
  fn: () => Promise<void>
): Promise<void> => {
  await writeJson(
    process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
    JSON.stringify(firebaseConfig).replace(/\\\\/g, '\\'),
    'utf8'
  )

  global.__firebase__ = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_URL
  })

  await deleteFile(process.env.GOOGLE_APPLICATION_CREDENTIALS as string)
  d('Firebase connection established.')
  await fn()
}

export { firebaseConnection }
