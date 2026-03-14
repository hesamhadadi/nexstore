import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  storeId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  rating: number
  comment: string
  isApproved: boolean
  createdAt: Date
}

const ReviewSchema = new Schema<IReview>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true })

ReviewSchema.index({ productId: 1, isApproved: 1 })
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)
