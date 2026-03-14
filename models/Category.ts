import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: { fa: string; en: string; it: string }
  slug: string
  storeId: mongoose.Types.ObjectId
  parentId?: mongoose.Types.ObjectId
  image?: string
  description?: { fa?: string; en?: string; it?: string }
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>({
  name: {
    fa: { type: String, required: true },
    en: { type: String, required: true },
    it: { type: String, required: true },
  },
  slug: { type: String, required: true, lowercase: true, trim: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  image: String,
  description: {
    fa: String,
    en: String,
    it: String,
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

CategorySchema.index({ storeId: 1, slug: 1 }, { unique: true })

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
