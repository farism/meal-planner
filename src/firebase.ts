import dayjs from 'dayjs'
import 'firebase/analytics'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import { omit, uniqBy } from 'lodash-es'
import { onDestroy } from 'svelte'
import type { Writable } from 'svelte/store'
import { derived, get, writable } from 'svelte/store'
import { pantry } from './pantry'
import type {
  Dish,
  PantryItem,
  Permission,
  Recipe,
  Settings,
  SharedPermission,
  ShoppingList,
} from './types'

type DocumentSnapshot =
  firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>

type QuerySnapshot =
  firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>

const config = {
  apiKey: 'AIzaSyCGXpx3pS3hDfe6AFRCKIiiEpBQD_1p3G0',
  authDomain: 'meal-planner-309002.firebaseapp.com',
  projectId: 'meal-planner-309002',
  storageBucket: 'meal-planner-309002.appspot.com',
  messagingSenderId: '327298908343',
  appId: '1:327298908343:web:ca03b62e559297eed1cd32',
  measurementId: 'G-YFBSFHRCPJ',
}

const defaultSettings: Settings = {
  mealView: 0,
  darkMode: false,
  showBreakfast: true,
  showLunch: true,
  showDinner: true,
  activePermission: null,
  hideCompleted: false,
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
export const authError = writable('')
export const settings = writable<Settings>(loadSettings())
export const canEdit = derived(settings, (value) => {
  return value?.activePermission === null || value?.activePermission?.write
})

settings.subscribe(saveSettings)

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
  .catch((e) => {
    authError.set(e.message)
  })
  .finally(() => {
    checkedSignIn.set(true)
  })

export function login() {
  // auth.signInWithRedirect(provider) // does not work on mobile safari

  auth.signInWithPopup(provider).then((u) => {
    user.set(u.user)
  })
}

export function loginAnonymous() {
  auth.signInAnonymously().then((u) => user.set(u.user))
}

export function logout() {
  auth.signOut()
}

export function linkAccount() {
  auth.currentUser?.linkWithRedirect(provider)
}

export function now() {
  return firebase.firestore.Timestamp.fromDate(new Date())
}

export function newDate(day: dayjs.Dayjs) {
  return firebase.firestore.Timestamp.fromDate(day.toDate())
}

export function fromTimestamp(value: any): dayjs.Dayjs {
  return dayjs(value.toDate())
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

function loadSettings(): Settings {
  return (
    JSON.parse(localStorage.getItem('settings') || JSON.stringify(null)) ||
    defaultSettings
  )
}

function saveSettings(settings: Settings) {
  localStorage.setItem('settings', JSON.stringify(settings))
}

function uid() {
  const uid = get(settings)?.activePermission?.uid

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

export function getDocs<T>(
  collection: string,
  field: string = 'uid',
  where: [string, firebase.firestore.WhereFilterOp, any][] = []
): Writable<T[]> {
  const docs = writable<T[]>([])

  loading.update((state) => ({ ...state, [collection]: true }))

  if (uid()) {
    const ref = db.collection(collection)

    let query = ref.where(field, '==', uid())

    where.forEach((w) => {
      query = query.where(...w)
    })

    const unsubscribe = query.onSnapshot((ref) => {
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

export function saveRecipe(recipe: Recipe) {
  if (recipe.id === null) {
    return addDoc<Recipe>('recipes', recipe)
  } else {
    return updateDoc<Recipe>('recipes', recipe)
  }
}

export function removeRecipe(recipe: Recipe) {
  if (recipe.id !== null) {
    removeDoc('recipes', recipe.id)
  }
}

export function getCalendarDishes(dateStr: string) {
  return getDocs<Dish>('dishes', 'uid', [
    ['date', '>=', dayjs(dateStr).startOf('month').toDate()],
    ['date', '<=', dayjs(dateStr).endOf('month').toDate()],
  ])
}

export function getUpcomingDishes() {
  return getDocs<Dish>('dishes', 'uid', [
    ['date', '>=', dayjs().startOf('day').toDate()],
    ['date', '<=', dayjs().add(7, 'days').toDate()],
  ])
}

export function saveDish(dish: Dish) {
  if (dish.id === null) {
    return addDoc<Dish>('dishes', dish)
  } else {
    return updateDoc<Dish>('dishes', dish)
  }
}

export function removeDish(dish: Dish) {
  if (dish.id !== null) {
    removeDoc('dishes', dish.id)
  }
}

export function saveShoppingList(item: ShoppingList) {
  if (item.id === null) {
    return addDoc<ShoppingList>('shopping_lists', item)
  } else {
    return updateDoc<ShoppingList>('shopping_lists', item)
  }
}

export function removeShoppingList(item: ShoppingList) {
  if (item.id !== null) {
    removeDoc('shopping_lists', item.id)
  }
}
