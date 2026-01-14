// Service Worker for PWA
const CACHE_NAME = 'invoice-app-v2';
const urlsToCache = [
  './',
  './metools.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

// الموارد الخارجية - سيتم تحميلها ديناميكياً عند أول زيارة
const externalResources = [
  {
    url: 'https://cdn.tailwindcss.com',
    strategy: 'network-first' // محاولة الشبكة أولاً
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js',
    strategy: 'cache-first' // التخزين المؤقت أولاً
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    strategy: 'cache-first'
  },
  {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    strategy: 'cache-first'
  }
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache - تحميل الملفات المحلية');
        // تحميل الملفات المحلية أولاً
        return cache.addAll(urlsToCache).then(() => {
          console.log('Local files cached - محاولة تحميل الموارد الخارجية');
          // محاولة تحميل الموارد الخارجية في الخلفية (لا نوقف التثبيت إذا فشلت)
          externalResources.forEach(resource => {
            fetch(resource.url)
              .then(response => {
                if (response.ok) {
                  return cache.put(resource.url, response.clone());
                }
              })
              .then(() => {
                console.log('Cached external resource:', resource.url);
              })
              .catch(() => {
                // تجاهل الأخطاء - سيتم تحميلها من الشبكة لاحقاً
                console.log('Will cache later:', resource.url);
              });
          });
        });
      })
  );
  // تفعيل Service Worker فوراً
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // تجاهل طلبات extensions
  if (event.request.url.includes('castbuddy') || 
      event.request.url.includes('chrome-extension') ||
      event.request.url.includes('moz-extension') ||
      event.request.url.includes('googlesyndication')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // محاولة التحميل من الشبكة
        return fetch(event.request).then(
          (response) => {
            // Check if valid response
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone the response للتخزين المؤقت
            const responseToCache = response.clone();
            
            // حفظ في التخزين المؤقت (للموارد الخارجية أيضاً)
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch(() => {
                // تجاهل أخطاء التخزين المؤقت
              });
            
            return response;
          }
        ).catch(() => {
          // في حالة عدم وجود إنترنت
          
          // إذا كان طلب HTML، أرجع الصفحة الرئيسية
          if (event.request.destination === 'document' || 
              (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
            return caches.match('./metools.html') || caches.match('./');
          }
          
          // للموارد الخارجية (CDN)، حاول إرجاع نسخة محفوظة
          const cached = caches.match(event.request);
          if (cached) {
            return cached;
          }
          
          // إذا لم توجد نسخة محفوظة، أرجع رسالة offline
          return new Response('Offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // تفعيل Service Worker فوراً لجميع الصفحات
      return self.clients.claim();
    })
  );
});
