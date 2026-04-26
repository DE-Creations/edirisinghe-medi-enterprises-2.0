<?php

// use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;
// use App\Http\Controllers\VatInvoiceController;

// Route::get('/', fn () => redirect('/invoice'));
// Route::get('/login', fn () => Inertia::render('LoginPage'))->name('login');

// $pages = [
//     '/dashboard' => 'DashboardPage',
//     '/invoice' => 'InvoicePage',
//     '/invoice-history' => 'InvoiceHistoryPage',
//     '/grn' => 'GRNPage',
//     '/grn-history' => 'GRNHistoryPage',
//     '/products' => 'ProductsPage',
//     '/stock' => 'StockPage',
//     '/employees' => 'EmployeesPage',
//     '/customers' => 'CustomersPage',
//     '/suppliers' => 'SuppliersPage',
//     '/vat-invoices' => 'VATInvoicesPage',
//     '/receivables' => 'ReceivablesPage',
//     '/payables' => 'PayablesPage',
//     '/reports' => 'ReportsPage',
//     '/settings' => 'SettingsPage',
// ];

// foreach ($pages as $uri => $page) {
//     Route::get($uri, fn () => Inertia::render($page));
// }

// // VAT Invoice PDF (CSRF exempt — pure view render, no state mutation)
// Route::post('/vat-invoices/pdf', [VatInvoiceController::class, 'generatePdf']);
// Route::post('/vat-invoices/pdf/history', [VatInvoiceController::class, 'viewHistoryPdf']);

// Route::fallback(fn () => Inertia::render('NotFound'));



use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerController;

/*
|--------------------------------------------------------------------------
| Root Redirect
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => redirect('/invoice'));

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::get('/login', fn () => Inertia::render('LoginPage'))->name('login');

/*
|--------------------------------------------------------------------------
| App Pages
|--------------------------------------------------------------------------
*/
Route::prefix('/')->group(function () {

    // Dashboard
    Route::get('dashboard', fn () => Inertia::render('DashboardPage'));

    // Invoice
    Route::prefix('invoice')->group(function () {
        Route::get('/', fn () => Inertia::render('InvoicePage'));
        Route::get('history', fn () => Inertia::render('InvoiceHistoryPage'));
    });

    // GRN
    Route::prefix('grn')->group(function () {
        Route::get('/', fn () => Inertia::render('GRNPage'));
        Route::get('history', fn () => Inertia::render('GRNHistoryPage'));
    });

    // Inventory
    Route::prefix('/')->group(function () {
        Route::get('products', fn () => Inertia::render('ProductsPage'));
        Route::get('stock',    fn () => Inertia::render('StockPage'));
    });

    // People
    Route::prefix('/')->group(function () {
        Route::get('employees',  fn () => Inertia::render('EmployeesPage'));
       
        Route::get('suppliers',  fn () => Inertia::render('SuppliersPage'));
    });

        // People
    Route::prefix('/')->group(function () {
       Route::get('customers',  fn () => Inertia::render('CustomersPage'));
       Route::post('customers/store', [CustomerController::class, 'store']);
    });

    // Finance
    Route::prefix('/')->group(function () {
        Route::get('vat-invoices',  fn () => Inertia::render('VATInvoicesPage'));
        Route::get('receivables',   fn () => Inertia::render('ReceivablesPage'));
        Route::get('payables',      fn () => Inertia::render('PayablesPage'));
    });

    // Misc
    Route::prefix('/')->group(function () {
        Route::get('reports',  fn () => Inertia::render('ReportsPage'));
        Route::get('settings', fn () => Inertia::render('SettingsPage'));
    });
});

/*
|--------------------------------------------------------------------------
| VAT Invoice PDF Routes (CSRF Exempt — pure view render, no state mutation)
|--------------------------------------------------------------------------
*/
Route::prefix('vat-invoices/pdf')->group(function () {
    Route::post('/',        [VatInvoiceController::class, 'generatePdf']);
    Route::post('history',  [VatInvoiceController::class, 'viewHistoryPdf']);
});

/*
|--------------------------------------------------------------------------
| Fallback
|--------------------------------------------------------------------------
*/
Route::fallback(fn () => Inertia::render('NotFound'));

