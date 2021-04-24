import 'firebase/analytics'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import { omit, uniqBy } from 'lodash-es'
import { onDestroy } from 'svelte'
import { derived, get, Writable, writable } from 'svelte/store'
import { pantry } from './pantry'
import type { PantryItem, Permission, Recipe, SharedPermission } from './types'

type DocumentSnapshot = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>

type QuerySnapshot = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>

const config = {
  apiKey: 'AIzaSyCGXpx3pS3hDfe6AFRCKIiiEpBQD_1p3G0',
  authDomain: 'meal-planner-309002.firebaseapp.com',
  projectId: 'meal-planner-309002',
  storageBucket: 'meal-planner-309002.appspot.com',
  messagingSenderId: '327298908343',
  appId: '1:327298908343:web:ca03b62e559297eed1cd32',
  measurementId: 'G-YFBSFHRCPJ',
}

!firebase.apps.length ? firebase.initializeApp(config) : firebase.app()

firebase.analytics()

// firebase.auth().useEmulator('http://localhost:9099')

// firebase.functions().useEmulator('localhost', 5001)

// firebase.firestore().useEmulator('localhost', 8080)

export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()
export const db = firebase.firestore()
export const loading = writable<{ [k: string]: boolean }>({})
export const checkedSignIn = writable<boolean>(false)
export const user = writable<firebase.User | null>(null)
export const activePermission = writable<SharedPermission | null>(
  loadActivePermission()
)
export const canEdit = derived(activePermission, (value) => {
  return value === null || value.write
})

activePermission.subscribe(saveActivePermission)

db.enablePersistence()

auth.onAuthStateChanged((u) => {
  user.set(u)
})

auth
  .getRedirectResult()
  .then((cred) => {
    if (cred.user && cred.additionalUserInfo?.isNewUser) {
      initFirstTimeUser(cred.user)
    }
  })
  .catch(console.error)
  .finally(() => {
    checkedSignIn.set(true)
  })

export function login() {
  auth.signInWithRedirect(provider)
}

export function logout() {
  auth.signOut()
}

/**
 * The first time a user has logged in, lets go scaffold out some pantry items
 * for them.
 */
function initFirstTimeUser(u: firebase.User) {
  initPermissions(u)
  initPantry(u)
}

function initPermissions(u: firebase.User) {
  db.collection('permissions')
    .doc(u.uid)
    .set({
      uid: u.uid,
      name: u.displayName,
      photo: u.photoURL,
      email: u.email,
      read: [],
      write: [],
    })
    .catch(console.error)
}

function initPantry(u: firebase.User) {
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

function loadActivePermission() {
  return JSON.parse(
    localStorage.getItem('activePermission') || JSON.stringify(null)
  )
}

function saveActivePermission(permission: SharedPermission | null) {
  localStorage.setItem('activePermission', JSON.stringify(permission))
}

export function setActivePermission(permission: SharedPermission) {
  activePermission.set(permission)
}

function uid() {
  const uid = get(activePermission)?.uid

  if (uid) {
    return uid
  } else {
    if (auth.currentUser) {
      return auth.currentUser.uid
    }
  }
}

function mapQueryData<T>(ref: QuerySnapshot) {
  return ref.docs.map((d) => ({ ...(d.data() as T), id: d.id }))
}

function mapDocData<T>(ref: DocumentSnapshot) {
  return { ...(ref.data() as T), id: ref.id }
}

export function getDocsFromCache<T>(collection: string): Writable<T[]> {
  const docs = writable<T[]>([])

  loading.update((state) => ({ ...state, [collection]: true }))

  if (uid()) {
    db.collection(collection)
      .where('uid', '==', uid())
      .get({ source: 'cache' })
      .then((ref) => mapQueryData<T>(ref))
      .then(docs.set)
  }

  return docs
}

export function getDocs<T>(
  collection: string,
  field: string = 'uid'
): Writable<T[]> {
  const docs = writable<T[]>([])

  loading.update((state) => ({ ...state, [collection]: true }))

  if (uid()) {
    const unsubscribe = db
      .collection(collection)
      .where(field, '==', uid())
      .onSnapshot((ref) => {
        docs.set(mapQueryData(ref))

        loading.update((state) => ({ ...state, [collection]: false }))
      })

    onDestroy(unsubscribe)
  }

  return docs
}

export function getDoc<T>(
  collection: string,
  id: string | null
): Writable<T | null> {
  const doc = writable<T | null>(null)

  if (uid()) {
    const unsubscribe = db
      .doc(`${collection}/${id}`)
      .onSnapshot((ref) => doc.set(mapDocData(ref)))

    onDestroy(unsubscribe)
  }

  return doc
}

export function addDoc<T extends { id: string | null }>(
  collection: string,
  data: T
) {
  if (uid() && data.id === null) {
    const d = omit(data, ['id'])

    return db.collection(collection).add({ ...d, uid: uid() })
  }
}

export function updateDoc<T extends { id: string | null }>(
  collection: string,
  data: T
) {
  if (auth.currentUser && data.id !== null) {
    return db.doc(`${collection}/${data.id}`).set(data)
  }
}

export function removeDoc(collection: string, id: string) {
  if (auth.currentUser) {
    return db.collection(collection).doc(id).delete().catch(console.error)
  }
}

function createSharedPermissions(read: Permission[], write: Permission[]) {
  return uniqBy(read.concat(write), 'email').map(({ uid, email }) => {
    return {
      uid,
      email,
      read: read.some((r) => r.email === email),
      write: write.some((w) => w.email === email),
    }
  }) as SharedPermission[]
}

export function getPermissions(): Writable<SharedPermission[]> {
  const store = writable<SharedPermission[]>([])

  if (auth?.currentUser?.email) {
    const unsubscribe = db
      .doc(`permissions/${auth.currentUser.uid}`)
      .onSnapshot((d) => {
        const { uid, read, write } = d.data() as Permission

        const permissions = createSharedPermissions(
          read.map((email) => ({ uid, email } as Permission)),
          write.map((email) => ({ uid, email } as Permission))
        )

        store.set(permissions)
      })

    onDestroy(unsubscribe)
  }

  return store
}

export function getSharedPermissions(): Writable<SharedPermission[]> {
  const doc = writable<SharedPermission[]>([])

  if (auth?.currentUser?.email) {
    // permission documents where read array contains user email
    const read = db
      .collection('permissions')
      .where('read', 'array-contains', auth.currentUser.email)
      .get()

    // permission records where read array contains user email
    const write = db
      .collection('permissions')
      .where('write', 'array-contains', auth.currentUser.email)
      .get()

    Promise.all([read, write]).then(([r, w]) => {
      const permissions = createSharedPermissions(
        r.docs.map((d) => d.data() as Permission),
        w.docs.map((d) => d.data() as Permission)
      )

      doc.set(permissions)
    })
  }

  return doc
}

export function savePermission({ email, read, write }: SharedPermission) {
  if (auth.currentUser) {
    const doc = db.doc(`permissions/${auth.currentUser.uid}`)

    doc
      .update({
        read: firebase.firestore.FieldValue.arrayRemove(email),
        write: firebase.firestore.FieldValue.arrayRemove(email),
      })
      .then(() => {
        const data: any = {}

        if (read) {
          data.read = firebase.firestore.FieldValue.arrayUnion(email)
        }

        if (write) {
          data.write = firebase.firestore.FieldValue.arrayUnion(email)
        }

        return doc.update(data)
      })
      .catch(console.error)
  }
}

export function removePermission({ uid, email }: SharedPermission) {
  db.doc(`permissions/${uid}`)
    .update({
      read: firebase.firestore.FieldValue.arrayRemove(email),
      write: firebase.firestore.FieldValue.arrayRemove(email),
    })
    .catch(console.error)
}

export function savePantryItem(item: PantryItem) {
  if (item.id === null) {
    return addDoc<PantryItem>('pantry', item)
  } else {
    return updateDoc<PantryItem>('pantry', item)
  }
}

export function removePantryItem(item: PantryItem) {
  if (item.id !== null) {
    removeDoc('pantry', item.id)
  }
}

export function saveRecipe(item: Recipe) {
  if (item.id === null) {
    return addDoc<Recipe>('recipes', item)
  } else {
    return updateDoc<Recipe>('recipes', item)
  }
}

export function removeRecipe(item: Recipe) {
  if (item.id !== null) {
    removeDoc('recipes', item.id)
  }
}
