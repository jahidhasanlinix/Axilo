
import { PaymentPlan, PricingTier } from '../types';

export const PAYMENT_PLANS: PaymentPlan[] = [
    {
        id: 'pay_as_you_go',
        name: 'Pay as you go',
        description: 'Perfect for small businesses.'
    },
    {
        id: 'fixed_pricing',
        name: 'Fixed pricing',
        description: 'Suitable for businesses with growing volumes.',
        recommended: true
    }
];

export const PRICING_TIERS: PricingTier[] = [
    { id: 'tier_10', amount: 10, credits: 1000 },
    { id: 'tier_50', amount: 50, credits: 5000 },
    { id: 'tier_75', amount: 75, credits: 7500 },
    { id: 'tier_125', amount: 125, credits: 12500 },
    { id: 'tier_250', amount: 250, credits: 25000 },
    { id: 'tier_600', amount: 600, credits: 63000, bonusText: '5% extra' },
    { id: 'tier_1000', amount: 1000, credits: 110000, bonusText: '10% extra' },
    { id: 'tier_2000', amount: 2000, credits: 230000, bonusText: '15% extra' },
    { id: 'tier_5000', amount: 5000, credits: 600000, bonusText: '20% extra' },
];
