export interface SharedPermission {
  uid: string
  email: string
  read: boolean
  write: boolean
}

export type Permission = {
  id: string | null
  uid: string | null
  displayName: string | null
  email: string | null
  read: string[]
  write: string[]
}

export interface User {
  id: string | null
  displayName: string
  photoURL: string
}

export interface PantryItem {
  id: string | null
  uid: string | null
  name: string
  category: string
}

export interface Recipe {
  id: string | null
  uid: string | null
  name: string
  cuisine?: string
  cookingTime?: number
  items: {
    item: PantryItem
    quantity?: string
    unit?: string
  }[]
  steps: string[]
}

export type MealTime = 'Breakfast' | 'Lunch' | 'Dinner'

export interface Dish {
  id: string | null
  mealTime: MealTime
  name: string
}

export interface Meal {
  id: string | null
  uid: string | null
  dishes: Dish[]
}

export interface ShoppingList {
  id: string | null
  uid: string | null
  name: string
}
