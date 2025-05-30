import { DiscountStrategy } from './discountStrategy.js'

export class FreeShippingDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderTotal, coupon, shippingCost) {
    return shippingCost || 0
  }
}