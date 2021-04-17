export interface PantryItem {
  uid?: string
  id?: string
  name: string
  category?: string
}

export interface Recipe {
  uid?: string
  id?: string
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

export interface MealPlan {
  uid?: string
  id?: string
  name: string
}

export interface ShoppingList {
  uid?: string
  id?: string
  name: string
}
