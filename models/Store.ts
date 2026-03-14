import mongoose, { Schema, Document } from 'mongoose'

export interface IStore extends Document {
  name: string
  slug: string
  ownerId: mongoose.Types.ObjectId
  token: string
  isActive: boolean
  logo?: string
  primaryColor: string
  secondaryColor: string
  language: 'fa' | 'en' | 'it'
  description?: string
  banners: {
    image: string
    title?: string
    subtitle?: string
    link?: string
    isActive: boolean
  }[]
  socialLinks?: {
    instagram?: string
    telegram?: string
    whatsapp?: string
    twitter?: string
    facebook?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
  tokenExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const StoreSchema = new Schema<IStore>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: false },
  logo: String,
  primaryColor: { type: String, default: '#111111' },
  secondaryColor: { type: String, default: '#ffffff' },
  language: { type: String, enum: ['fa', 'en', 'it'], default: 'fa' },
  description: String,
  banners: [{
    image: { type: String, required: true },
    title: String,
    subtitle: String,
    link: String,
    isActive: { type: Boolean, default: true },
  }],
  socialLinks: {
    instagram: String,
    telegram: String,
    whatsapp: String,
    twitter: String,
    facebook: String,
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
  },
  seo: {
    title: String,
    description: String,
    keywords: String,
  },
  tokenExpiresAt: Date,
}, { timestamps: true })

export default mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema)
