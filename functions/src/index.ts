import * as functions from 'firebase-functions'
import { initializeApp } from 'firebase-admin'

initializeApp()

export const scaffoldIngredients = functions.auth.user().onCreate((user) => {
  functions.logger.log('created user', user)

  // return snap.ref.set({uppercase}, {merge: true});
})
