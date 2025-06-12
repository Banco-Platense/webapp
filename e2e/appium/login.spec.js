describe('Login Page on Mobile', () => {
    beforeEach(async () => {
        await browser.url('/login');
        await browser.pause(1000); // Reduced wait time
    });

    it('should display login form elements', async () => {
        const usernameInput = await $('#username');
        const passwordInput = await $('#password');
        const submitButton = await $('button[type="submit"]');
        
        await expect(usernameInput).toBeDisplayed();
        await expect(passwordInput).toBeDisplayed();
        await expect(submitButton).toBeDisplayed();
    });

    it('should allow typing in input fields', async () => {
        await $('#username').setValue('testuser');
        await $('#password').setValue('testpass');
        
        expect(await $('#username').getValue()).toBe('testuser');
        expect(await $('#password').getValue()).toBe('testpass');
    });
}); 