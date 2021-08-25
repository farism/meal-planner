self.addEventListener('install', function (e) {
  // @ts-ignore
  e.waitUntil(
    caches.open('mealplanner').then(function (cache) {
      return cache.addAll(['/', '/index.html'])
    })
  )
})

self.addEventListener('fetch', function (event) {
  // it can be empty if you just want to get rid of that error
})
