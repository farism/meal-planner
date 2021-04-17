import 'firebase/analytics'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import { collectionData, docData } from 'rxfire/firestore'
import { writable } from 'svelte/store'
import { pantry } from './pantry'

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

// firebase.auth().useEmulator('http://localhost:9099')

// firebase.functions().useEmulator('localhost', 5001)

// firebase.firestore().useEmulator('localhost', 8080)

export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()
export const db = firebase.firestore()
export const user = writable<firebase.User | null>(null)
export const signedIn = writable<boolean | null>(null)

db.enablePersistence()

auth.onAuthStateChanged((u) => {
  user.set(u)
})

auth
  .getRedirectResult()
  .then((cred) => {
    if (cred.user && cred.additionalUserInfo?.isNewUser) {
      scaffoldIngredients(cred.user)
    }
  })
  .catch((e) => {})
  .finally(() => {
    signedIn.set(true)
  })

/**
 * The first time a user has logged in, lets go scaffold out some pantry items
 * for them.
 */
async function scaffoldIngredients(u: firebase.User) {
  const batch = db.batch()

  pantry.slice(0, 5).forEach((ingredient) => {
    const doc = db.collection('pantry').doc()

    batch.set(doc, {
      uid: u.uid,
      name: ingredient,
      created: firebase.firestore.Timestamp.now(),
      updated: firebase.firestore.Timestamp.now(),
    })
  })

  batch.commit()
}

export function getDocsFromCache<T>(collection: string) {
  const docs = writable<(T & UserDoc)[]>([])

  user.subscribe((u) => {
    if (u) {
      const query = db
        .collection(collection)
        .where('uid', '==', u.uid)
        .get({ source: 'cache' })
        .then((res) => res.docs.map((d) => ({ ...d.data(), id: d.id })))
        .then((data) => docs.set(data as any))
    } else {
      docs.set([])
    }
  })

  return docs
}
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

export function getDoc<T>(collection: string, id: string | null) {
  const doc = writable<(T & UserDoc) | null>(null)

  user.subscribe((u) => {
    if (u && id) {
      const query = db.doc(`${collection}/${id}`)

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

export function update<T extends { id?: string }>(collection: string, data: T) {
  if (auth.currentUser && data.id) {
    return db.doc(`${collection}/${data.id}`).set(data)
  }
}

export function remove(collection: string, id: string) {
  if (auth.currentUser) {
    return db.collection(collection).doc(id).delete()
  }
}
