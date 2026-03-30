self.addEventListener('install', (e) => {
    console.log('Service Worker is installed');
})
self.addEventListener('activate', (e) => {
    console.log('Service Worker is activated');
})