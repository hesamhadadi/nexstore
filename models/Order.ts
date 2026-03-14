import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: { fa: string; en: string; it: string }
  image: string
  price: number
  quantity: number
  color?: string
  variant?: string
}

export interface IOrder extends Document {
  storeId: mongoose.Types.ObjectId
  customerId: mongoose.Types.ObjectId
  orderNumber: string
  items: IOrderItem[]
  subtotal: number
  discountAmount: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  shippingAddress: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  notes?: string
  trackingCode?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { fa: String, en: String, it: String },
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    color: String,
    variant: String,
  }],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    country: { type: String, required: true },
    zipCode: String,
  },
  notes: String,
  trackingCode: String,
}, { timestamps: true })

OrderSchema.index({ storeId: 1, status: 1 })
OrderSchema.index({ customerId: 1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
