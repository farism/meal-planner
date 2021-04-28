import type { Dayjs } from 'dayjs'

export interface SharedPermission {
  uid: string
  email: string
  read: boolean
  write: boolean
}

export interface Settings {
  activePermission: SharedPermission | null
  mealView: number
  showBreakfast: boolean
  showLunch: boolean
  showDinner: boolean
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

export type DishType = 'Recipe' | 'PantryItem'

export type MealTime = 'Breakfast' | 'Lunch' | 'Dinner'

export interface Dish {
  id: string | null
  uid: string | null
  date: Dayjs | Date
  item?: PantryItem
  mealTime: MealTime
  recipe?: Recipe
  type: DishType
}

export interface ShoppingList {
  id: string | null
  uid: string | null
  name: string
}
