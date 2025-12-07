
/**
 * A mock service to handle Stripe payments.
 */
export class PaymentService {
    // Mock Stripe API Key (dummy)
    private apiKey = 'pk_test_1234567890abcdef';

    /**
     * Simulate creating a payment intent and confirming payment
     */
    async processPayment(amount: number): Promise<{ success: boolean; transactionId?: string; message?: string }> {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1; // 90% success rate mock
                if (isSuccess) {
                    resolve({
                        success: true,
                        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        message: 'Payment processed successfully'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Payment declined by bank'
                    });
                }
            }, 2000);
        });
    }

    /**
     * Simulate setting up auto-recharge
     */
    async configureAutoRecharge(amount: number, threshold: number): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }
}

export const paymentService = new PaymentService();
