// ~/strategies/discountContext.js
import { PercentDiscountStrategy } from './percentDiscountStrategy';
import { AmountDiscountStrategy } from './amountDiscountStrategy';
import { FreeShippingDiscountStrategy } from './freeShippingDiscountStrategy';

export class DiscountContext {
    constructor() {
        this.strategies = {
            PERCENT: new PercentDiscountStrategy(),
            AMOUNT: new AmountDiscountStrategy(),
            FREESHIPPING: new FreeShippingDiscountStrategy(),
        };
    }

    setStrategy(type) {
        this.strategy = this.strategies[type];
        if (!this.strategy) {
            throw new Error(`Invalid discount type: ${type}`);
        }
    }

    calculateDiscount(orderTotal, coupon, shippingCost = 0) {
        return this.strategy.calculateDiscount(orderTotal, coupon, shippingCost);
    }
}