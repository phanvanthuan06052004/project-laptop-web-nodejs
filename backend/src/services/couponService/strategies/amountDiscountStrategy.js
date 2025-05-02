import { DiscountStrategy } from './discountStrategy.js';

export class AmountDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderTotal, coupon) {
        return coupon.value;
    }
}