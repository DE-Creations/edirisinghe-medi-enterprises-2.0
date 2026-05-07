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
use App\Http\Controllers\CompanyController;   
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UnitTypeController;
use App\Http\Controllers\GrnController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Root Redirect
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => redirect('/invoice'));

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::get('/login', fn() => Inertia::render('LoginPage'))->name('login');

/*
|--------------------------------------------------------------------------
| App Pages
|--------------------------------------------------------------------------
*/
Route::prefix('/')->group(function () {

    // Dashboard
    Route::get('dashboard', fn() => Inertia::render('DashboardPage'));

    // Invoice
    Route::prefix('invoice')->group(function () {
        Route::get('/', fn() => Inertia::render('InvoicePage'));
        Route::get('history', fn() => Inertia::render('InvoiceHistoryPage'));
    });

    // GRN
    Route::prefix('/grn')->group(function () {
        Route::get('/', fn() => Inertia::render('GRNPage'));
        Route::get('/next-number', [GrnController::class, 'nextNumber']);
        Route::get('/all', [GrnController::class, 'all']);
        Route::post('/store', [GrnController::class, 'store']);
        Route::delete('/delete/{id}', [GrnController::class, 'delete']);
    });

    // Inventory
    Route::prefix('/')->group(function () {
        Route::get('products', fn() => Inertia::render('ProductsPage'));
        Route::get('stock',    fn() => Inertia::render('StockPage'));
    });

    // Employees
    Route::prefix('/employees')->group(function () {
        Route::get('/', fn() => Inertia::render('EmployeesPage'));
        Route::get('/next-number', [UserController::class, 'nextNumber']);
        Route::get('/all', [UserController::class, 'all'])->name('employees/all');
        // Route::get('/roles', [UserController::class, 'roles'])->name('employees/roles');
        Route::post('/store', [UserController::class, 'store'])->name('employees/store');
        Route::post('/update/{id}', [UserController::class, 'update'])->name('employees/update');
        Route::delete('/delete/{id}', [UserController::class, 'delete'])->name('employees/delete');
    });

    // customers
    Route::prefix('/customers')->group(function () {
        Route::get('/',  fn() => Inertia::render('CustomersPage'));
        Route::get('/all', [CustomerController::class, 'all'])->name('customers/all');
        Route::post('/store', [CustomerController::class, 'store'])->name('customers/store');
        Route::post('/update/{id}', [CustomerController::class, 'update'])->name('customers/update');
        Route::delete('/delete/{id}', [CustomerController::class, 'delete'])->name('customers/delete');
    });

    // companies
    Route::prefix('/companies')->group(function () {
        Route::get('/all', [CompanyController::class, 'all'])->name('companies/all');
        Route::post('/store', [CompanyController::class, 'store'])->name('companies/store');
        Route::post('/update/{id}', [CompanyController::class, 'update'])->name('companies/update');
        Route::delete('/delete/{id}', [CompanyController::class, 'delete'])->name('companies/delete');
    });

    // suppliers
    Route::prefix('/suppliers')->group(function () {
        Route::get('/', fn() => Inertia::render('SuppliersPage'));
        Route::get('/all', [SupplierController::class, 'all'])->name('suppliers/all');
        Route::post('/store', [SupplierController::class, 'store'])->name('suppliers/store');
        Route::post('/update/{id}', [SupplierController::class, 'update'])->name('suppliers/update');
        Route::delete('/delete/{id}', [SupplierController::class, 'delete'])->name('suppliers/delete');
    });

    // Products
    Route::prefix('/products')->group(function(){
        Route::get('/', fn() => Inertia::render('ProductsPage'));
        Route::get('/all', [ProductController::class, 'all'])->name('products/all');
        Route::post('/store', [ProductController::class, 'store'])->name('products/store');
        Route::post('/update/{id}', [ProductController::class, 'update'])->name('products/update');
        Route::delete('/delete/{id}', [ProductController::class, 'delete'])->name('products/delete');
    });

    // Categories
    Route::prefix('/categories')->group(function () {
        Route::get('/all', [CategoryController::class, 'all'])->name('categories/all');
        Route::post('/store', [CategoryController::class, 'store'])->name('categories/store');
    });

    // Brands
    Route::prefix('/brands')->group(function () {
        Route::get('/all', [BrandController::class, 'all'])->name('brands/all');
        Route::post('/store', [BrandController::class, 'store'])->name('brands/store');
    });

    // Unit Types
    Route::prefix('/unit-types')->group(function () {
        Route::get('/all', [UnitTypeController::class, 'all'])->name('unit-types/all');
        Route::post('/store', [UnitTypeController::class, 'store'])->name('unit-types/store');
    });

    // Grn
    Route::prefix('/grn')->group(function () {
        Route::get('/', fn() => Inertia::render('GRNPage'));
        Route::get('/next-number', [GrnController::class, 'nextNumber']);
        Route::get('/all', [GrnController::class, 'all']);
        Route::post('/store', [GrnController::class, 'store']);
        Route::delete('/delete/{id}', [GrnController::class, 'delete']);
    });

    // Finance
    Route::prefix('/')->group(function () {
        Route::get('vat-invoices',  fn() => Inertia::render('VATInvoicesPage'));
        Route::get('receivables',   fn() => Inertia::render('ReceivablesPage'));
        Route::get('payables',      fn() => Inertia::render('PayablesPage'));
    });

    // Misc
    Route::prefix('/')->group(function () {
        Route::get('reports',  fn() => Inertia::render('ReportsPage'));
    });

    // Settings
    Route::prefix('/settings')->group(function () {
        Route::get('/', fn() => Inertia::render('SettingsPage'));
        Route::get('/all', [SettingsController::class, 'all'])->name('settings/all');
        Route::post('/change_theme', [SettingsController::class, 'change_theme'])->name('settings/change_theme');
        Route::post('/update_company_profile', [SettingsController::class, 'update_company_profile'])->name('settings/update_company_profile');
        Route::post('/update_vat_settings', [SettingsController::class, 'update_vat_settings'])->name('settings/update_vat_settings');
    });
});

/*
|--------------------------------------------------------------------------
| VAT Invoice PDF Routes (CSRF Exempt — pure view render, no state mutation)
|--------------------------------------------------------------------------
*/
// Route::prefix('vat-invoices/pdf')->group(function () {
//     Route::post('/',        [VatInvoiceController::class, 'generatePdf']);
//     Route::post('history',  [VatInvoiceController::class, 'viewHistoryPdf']);
// });

/*
|--------------------------------------------------------------------------
| Fallback
|--------------------------------------------------------------------------
*/
Route::fallback(fn() => Inertia::render('NotFound'));
