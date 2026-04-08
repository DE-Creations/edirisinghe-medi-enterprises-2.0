Merged Laravel 12 + React frontend project

What was changed:
- React frontend moved into `resources/js`
- Laravel now uses Inertia with React pages
- React Router removed and replaced with Inertia navigation
- `@vitejs/plugin-react` used instead of SWC plugin
- Tailwind CSS v3 configuration preserved and adapted for Laravel paths
- Browser theme auto-detection is not used
- Theme toggle is manual and persisted in localStorage
- Mock auth is still used for the frontend demo and is persisted in localStorage

Important setup steps after extracting:
1. composer install
2. npm install
3. php artisan key:generate
4. php artisan serve
5. npm run dev

Additional package required by this merge:
- PHP: `inertiajs/inertia-laravel`
- JS: `@inertiajs/react`

Demo credentials:
- owner / 123456
- admin / 123456
- cashier / 123456
