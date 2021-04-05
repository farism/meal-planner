import 'firebase/analytics'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { authState } from 'rxfire/auth'
import { collectionData, docData } from 'rxfire/firestore'
import { writable } from 'svelte/store'

// import type { UserDoc } from './types'

interface UserDoc {
  id: string
  uid: string
}

const firebaseConfig = {
  apiKey: 'AIzaSyCGXpx3pS3hDfe6AFRCKIiiEpBQD_1p3G0',
  authDomain: 'meal-planner-309002.firebaseapp.com',
  projectId: 'meal-planner-309002',
  storageBucket: 'meal-planner-309002.appspot.com',
  messagingSenderId: '327298908343',
  appId: '1:327298908343:web:ca03b62e559297eed1cd32',
  measurementId: 'G-YFBSFHRCPJ',
}

firebase.initializeApp(firebaseConfig)

firebase.analytics()

export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()
export const db = firebase.firestore()
export const user = authState(auth)
export const isCheckingLoggedIn = writable(true)

auth.onAuthStateChanged((u) => {
  isCheckingLoggedIn.set(false)
})

export function getDocs<T>(collection: string) {
  const docs = writable<(T & UserDoc)[]>([])

  user.subscribe((u) => {
    if (u) {
      const query = db.collection(collection).where('uid', '==', u.uid)

      collectionData<T & UserDoc>(query, 'id').subscribe(docs.set)
    } else {
      docs.set([])
    }
  })

  return docs
}

export function getDoc<T>(path: string) {
  const doc = writable<(T & UserDoc) | null>(null)

  user.subscribe((u) => {
    if (u) {
      const query = db.doc(path)

      docData<T & UserDoc>(query, 'id').subscribe(doc.set)
    } else {
      doc.set(null)
    }
  })

  return doc
}

export function add<T>(collection: string, data: T) {
  if (auth.currentUser) {
    return db.collection(collection).add({ ...data, uid: auth.currentUser.uid })
  }
}

export function remove(collection: string, id: string) {
  if (auth.currentUser) {
    return db.collection(collection).doc(id).delete()
  }
}
