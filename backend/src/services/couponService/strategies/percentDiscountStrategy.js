// ~/strategies/percentDiscountStrategy.js
import { DiscountStrategy } from './discountStrategy.js';

export class PercentDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderTotal, coupon) {
        const discount = (orderTotal * coupon.value) / 100;
        return coupon.max_value ? Math.min(discount, coupon.max_value) : discount;
    }
}



