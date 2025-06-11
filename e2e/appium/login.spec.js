describe('Login Page on mobile', () => {
    it('should display Banco Platense title', async () => {
        await browser.url('/login');
        const titleEl = await $('h1');
        expect(await titleEl.getText()).toBe('Banco Platense');
    });
}); 