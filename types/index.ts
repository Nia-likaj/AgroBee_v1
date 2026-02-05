export type Role = 'user' | 'farmer' | 'agronomist' | 'specialist' | 'admin'

export interface User {
  uid: string
  displayName?: string
  role: Role
  createdAt?: string
  preferences?: Record<string, any>
}

export interface Farm {
  id?: string
  name: string
  slug: string
  location?: { qarku?: string; qyteti?: string }
  category?: string
  isFeatured?: boolean
  rating?: number
  images?: string[]
  createdAt?: string
}

export interface Post {
  id?: string
  title: string
  slug: string
  content: string
  authorId: string
  authorRole?: Role
  status: 'draft' | 'pending' | 'published'
  topic?: string
  coverImage?: string
  createdAt?: string
  publishedAt?: string
}

export interface Favorite {
  id?: string
  userId: string
  farmId: string
  createdAt?: string
}
