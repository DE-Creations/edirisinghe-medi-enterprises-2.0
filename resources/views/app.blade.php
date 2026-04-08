<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>PharmaPOS</title>
    {{-- Apply saved theme before first paint to avoid flash --}}
    <script>
      try {
        if (localStorage.getItem('pharmapos-theme') === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    </script>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
  </head>
  <body>
    @inertia
  </body>
</html>
