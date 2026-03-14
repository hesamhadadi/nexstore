import mongoose, { Schema, Document } from 'mongoose'

export interface IProductVariant {
  name: { fa: string; en: string; it: string }
  value: string
  price?: number
  stock: number
  sku?: string
}

export interface IProductColor {
  name: { fa: string; en: string; it: string }
  hex: string
  images?: string[]
  stock: number
}

export interface IProduct extends Document {
  name: { fa: string; en: string; it: string }
  slug: string
  storeId: mongoose.Types.ObjectId
  categoryId: mongoose.Types.ObjectId
  description: { fa: string; en: string; it: string }
  shortDescription?: { fa?: string; en?: string; it?: string }
  images: string[]
  price: number
  comparePrice?: number
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    startDate?: Date
    endDate?: Date
    isActive: boolean
  }
  colors?: IProductColor[]
  variants?: IProductVariant[]
  tags?: string[]
  sku?: string
  stock: number
  weight?: number
  dimensions?: { length: number; width: number; height: number }
  isActive: boolean
  isFeatured: boolean
  rating: { average: number; count: number }
  soldCount: number
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: {
    fa: { type: String, required: true },
    en: { type: String, required: true },
    it: { type: String, required: true },
  },
  slug: { type: String, required: true, lowercase: true, trim: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: {
    fa: { type: String, required: true },
    en: { type: String, required: true },
    it: { type: String, required: true },
  },
  shortDescription: { fa: String, en: String, it: String },
  images: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, min: 0 },
  discount: {
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: Number,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: false },
  },
  colors: [{
    name: { fa: String, en: String, it: String },
    hex: String,
    images: [String],
    stock: { type: Number, default: 0 },
  }],
  variants: [{
    name: { fa: String, en: String, it: String },
    value: String,
    price: Number,
    stock: { type: Number, default: 0 },
    sku: String,
  }],
  tags: [String],
  sku: String,
  stock: { type: Number, required: true, default: 0 },
  weight: Number,
  dimensions: { length: Number, width: Number, height: Number },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  soldCount: { type: Number, default: 0 },
}, { timestamps: true })

ProductSchema.index({ storeId: 1, slug: 1 }, { unique: true })
ProductSchema.index({ storeId: 1, categoryId: 1 })
ProductSchema.index({ storeId: 1, isFeatured: 1 })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
