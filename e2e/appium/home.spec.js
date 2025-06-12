describe('Homepage redirection on mobile', () => {
    it('should redirect / to /login', async () => {
        await browser.url('/');
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/login'),
            { timeout: 10000, timeoutMsg: 'Expected to be on /login within 10s' }
        );
        const currentUrl = await browser.getUrl();
        expect(currentUrl).toContain('/login');
    });
}); 