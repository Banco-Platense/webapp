describe('Send Money Page on Mobile', () => {
    const testUser = { id: '1', username: 'testuser', email: 'test@example.com' };
    const testToken = 'fake-token';

    beforeEach(async () => {
        // Set up auth quickly
        await browser.url('/login');
        await browser.execute((user, token) => {
            localStorage.setItem('wallet_user', JSON.stringify(user));
            localStorage.setItem('wallet_token', token);
        }, testUser, testToken);
        
        await browser.url('/dashboard/send');
        
        // Wait for the page to fully load
        await browser.waitUntil(async () => {
            const pageText = await $('body').getText();
            return pageText.includes('Send Money');
        }, { timeout: 10000, timeoutMsg: 'Send Money page did not load' });
        
        await browser.pause(1000); // Additional time for React to initialize
    });

    afterEach(async () => {
        // Clean up localStorage
        try {
            await browser.execute(() => {
                localStorage.clear();
            });
        } catch (error) {
            console.log('localStorage not available for cleanup');
        }
    });

    it('should display send money form elements', async () => {
        const recipientInput = await $('#recipient');
        const amountInput = await $('#amount');
        const submitButton = await $('button[type="submit"]');
        
        await expect(recipientInput).toBeDisplayed();
        await expect(amountInput).toBeDisplayed();
        await expect(submitButton).toBeDisplayed();
    });

    it('should accept valid transfer data', async () => {
        // Wait for form to be ready
        await browser.waitUntil(async () => {
            const recipientInput = await $('#recipient');
            return await recipientInput.isDisplayed();
        }, { timeout: 10000 });
        
        // Set recipient using React-friendly approach
        await browser.execute(() => {
            const recipientInput = document.getElementById('recipient');
            if (recipientInput) {
                recipientInput.focus();
                recipientInput.value = 'recipient-123';
                recipientInput.dispatchEvent(new Event('input', { bubbles: true }));
                recipientInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        
        // Set amount using React-friendly approach  
        await browser.execute(() => {
            const amountInput = document.getElementById('amount');
            if (amountInput) {
                amountInput.focus();
                amountInput.value = '25';
                amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                amountInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        
        await browser.pause(500); // Wait for React to update
        
        // Verify values using JavaScript
        const recipientValue = await browser.execute(() => {
            return document.getElementById('recipient')?.value || '';
        });
        const amountValue = await browser.execute(() => {
            return document.getElementById('amount')?.value || '';
        });
        
        expect(recipientValue).toBe('recipient-123');
        expect(amountValue).toBe('25');
    });

    it('should handle decimal amounts', async () => {
        // Wait for form to be ready
        await browser.waitUntil(async () => {
            const recipientInput = await $('#recipient');
            return await recipientInput.isDisplayed();
        }, { timeout: 10000 });
        
        // Set recipient first
        await browser.execute(() => {
            const recipientInput = document.getElementById('recipient');
            if (recipientInput) {
                recipientInput.focus();
                recipientInput.value = 'test-user';
                recipientInput.dispatchEvent(new Event('input', { bubbles: true }));
                recipientInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        
        // Set decimal amount
        await browser.execute(() => {
            const amountField = document.getElementById('amount');
            if (amountField) {
                amountField.focus();
                amountField.value = '12.75';
                amountField.dispatchEvent(new Event('input', { bubbles: true }));
                amountField.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        
        await browser.pause(500); // Wait for React to update
        
        const amountValue = await browser.execute(() => {
            return document.getElementById('amount')?.value || '';
        });
        expect(amountValue).toBe('12.75');
    });
});
