export type Role = 'customer' | 'admin'

export type User = {
  id: string
  name: string
  phone: string
  role: Role
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  created_at: string
}

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type Reservation = {
  id: string
  user_id: string
  status: ReservationStatus
  note: string | null
  created_at: string
  users?: Pick<User, 'name' | 'phone'>
  reservation_items?: ReservationItem[]
}

export type ReservationItem = {
  id: string
  reservation_id: string
  product_id: string
  quantity: number
  products?: Pick<Product, 'name' | 'price'>
}

export type SessionUser = {
  id: string
  name: string
  role: Role
}
