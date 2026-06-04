<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\UnitTypeController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\VatController;
use App\Http\Controllers\GrnController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\PayableController;
use App\Http\Controllers\ReceivableController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpensesCategoryController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\VatInvoiceController;
use App\Http\Controllers\VatInvoiceApiController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| Root Redirect
|--------------------------------------------------------------------------
*/
Route::get('/', fn() => redirect('/invoice'));

/*
|--------------------------------------------------------------------------
| Auth Routes (Public)
|--------------------------------------------------------------------------
*/
Route::get('/login', fn() => Inertia::render('LoginPage'))->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // ── Dashboard ──────────────────────────────────────────────────────────
    Route::get('/dashboard', fn() => Inertia::render('DashboardPage'));
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // ── Invoice ────────────────────────────────────────────────────────────
    Route::get('/invoice', fn() => Inertia::render('InvoicePage'));
    Route::get('/invoice-history', fn() => Inertia::render('InvoiceHistoryPage'));
    Route::get('/invoice/print/{id}', [InvoiceController::class, 'printView']);
    Route::prefix('/invoice')->group(function () {
        Route::get('/next-number',    [InvoiceController::class, 'nextNumber']);
        Route::get('/form-data',      [InvoiceController::class, 'formData']);
        Route::get('/search-stock',   [InvoiceController::class, 'searchStock']);
        Route::get('/all',            [InvoiceController::class, 'all']);
        Route::get('/show/{id}',      [InvoiceController::class, 'show']);
        Route::post('/store',         [InvoiceController::class, 'store']);
        Route::delete('/delete/{id}', [InvoiceController::class, 'delete']);
    });

    // ── GRN ────────────────────────────────────────────────────────────────
    Route::get('/grn', fn() => Inertia::render('GRNPage'));
    Route::get('/grn-history', fn() => Inertia::render('GRNHistoryPage'));
    Route::get('/grn/print/{id}', [GrnController::class, 'printView']);
    Route::prefix('/grn')->group(function () {
        Route::get('/next-number',    [GrnController::class, 'nextNumber']);
        Route::get('/form-data',      [GrnController::class, 'formData']);
        Route::get('/all',            [GrnController::class, 'all']);
        Route::get('/show/{id}',      [GrnController::class, 'show']);
        Route::post('/store',         [GrnController::class, 'store']);
        Route::delete('/delete/{id}', [GrnController::class, 'delete']);
    });

    // ── Products ───────────────────────────────────────────────────────────
    Route::get('/products', fn() => Inertia::render('ProductsPage'));
    Route::prefix('/products')->group(function () {
        Route::get('/all',            [ProductController::class, 'all']);
        Route::post('/store',         [ProductController::class, 'store']);
        Route::post('/update/{id}',   [ProductController::class, 'update']);
        Route::delete('/delete/{id}', [ProductController::class, 'delete']);
    });

    // ── Stock ──────────────────────────────────────────────────────────────
    Route::get('/stock', fn() => Inertia::render('StockPage'));
    Route::prefix('/stock')->group(function () {
        Route::get('/all',                    [StockController::class, 'all']);
        Route::get('/adjustments/{batchId}',  [StockController::class, 'adjustments']);
        Route::post('/opening',               [StockController::class, 'openingStock']);
        Route::post('/adjust/{batchId}',      [StockController::class, 'adjust']);
        Route::delete('/delete/{id}',         [StockController::class, 'delete']);
    });

    // ── Customers ──────────────────────────────────────────────────────────
    Route::get('/customers', fn() => Inertia::render('CustomersPage'));
    Route::prefix('/customers')->group(function () {
        Route::get('/all',            [CustomerController::class, 'all']);
        Route::post('/store',         [CustomerController::class, 'store']);
        Route::post('/update/{id}',   [CustomerController::class, 'update']);
        Route::delete('/delete/{id}', [CustomerController::class, 'delete']);
    });

    // ── Suppliers ──────────────────────────────────────────────────────────
    Route::get('/suppliers', fn() => Inertia::render('SuppliersPage'));
    Route::prefix('/suppliers')->group(function () {
        Route::get('/all',            [SupplierController::class, 'all']);
        Route::post('/store',         [SupplierController::class, 'store']);
        Route::post('/update/{id}',   [SupplierController::class, 'update']);
        Route::delete('/delete/{id}', [SupplierController::class, 'delete']);
    });

    // ── Companies ──────────────────────────────────────────────────────────
    Route::prefix('/companies')->group(function () {
        Route::get('/all',            [CompanyController::class, 'all']);
        Route::post('/store',         [CompanyController::class, 'store']);
        Route::post('/update/{id}',   [CompanyController::class, 'update']);
        Route::delete('/delete/{id}', [CompanyController::class, 'delete']);
    });

    // ── Categories ─────────────────────────────────────────────────────────
    Route::prefix('/categories')->group(function () {
        Route::get('/all',            [CategoryController::class, 'all']);
        Route::post('/store',         [CategoryController::class, 'store']);
        Route::post('/update/{id}',   [CategoryController::class, 'update']);
        Route::delete('/delete/{id}', [CategoryController::class, 'delete']);
    });

    // ── Brands ─────────────────────────────────────────────────────────────
    Route::prefix('/brands')->group(function () {
        Route::get('/all',            [BrandController::class, 'all']);
        Route::post('/store',         [BrandController::class, 'store']);
        Route::post('/update/{id}',   [BrandController::class, 'update']);
        Route::delete('/delete/{id}', [BrandController::class, 'delete']);
    });

    // ── Unit Types ─────────────────────────────────────────────────────────
    Route::prefix('/unit-types')->group(function () {
        Route::get('/all',            [UnitTypeController::class, 'all']);
        Route::post('/store',         [UnitTypeController::class, 'store']);
        Route::post('/update/{id}',   [UnitTypeController::class, 'update']);
        Route::delete('/delete/{id}', [UnitTypeController::class, 'delete']);
    });

    // ── Expense Categories ─────────────────────────────────────────────────
    Route::prefix('/expenses-category')->group(function () {
        Route::get('/all',            [ExpensesCategoryController::class, 'all']);
        Route::post('/store',         [ExpensesCategoryController::class, 'store']);
        Route::post('/update/{id}',   [ExpensesCategoryController::class, 'update']);
        Route::delete('/delete/{id}', [ExpensesCategoryController::class, 'delete']);
    });

    // ── Payment Methods ────────────────────────────────────────────────────
    Route::get('/payment-methods/all', [PaymentMethodController::class, 'all']);

    // ── Company Profile ────────────────────────────────────────────────────
    Route::prefix('/company-profile')->group(function () {
        Route::get('/',        [CompanyProfileController::class, 'show']);
        Route::post('/update', [CompanyProfileController::class, 'update']);
    });

    // ── Settings ───────────────────────────────────────────────────────────
    Route::get('/settings', fn() => Inertia::render('SettingsPage'));
    Route::prefix('/settings')->group(function () {
        Route::get('/all',                    [SettingsController::class, 'all']);
        Route::post('/change_theme',          [SettingsController::class, 'change_theme']);
        Route::post('/update_company_profile',[SettingsController::class, 'update_company_profile']);
        Route::post('/update_vat_settings',   [SettingsController::class, 'update_vat_settings']);
    });

    // ── VAT ────────────────────────────────────────────────────────────────
    Route::prefix('/vat')->group(function () {
        Route::get('/current',  [VatController::class, 'current']);
        Route::get('/by-date',  [VatController::class, 'byDate']);
    });

    // ── Payables ───────────────────────────────────────────────────────────
    Route::get('/payables', fn() => Inertia::render('PayablesPage'));
    Route::prefix('/payables')->group(function () {
        Route::get('/grns',                   [PayableController::class, 'grns']);
        Route::get('/expenses',               [PayableController::class, 'expenses']);
        Route::get('/history/{type}/{id}',    [PayableController::class, 'paymentHistory']);
        Route::get('/expense/next-number',    [PayableController::class, 'nextExpenseNumber']);
        Route::post('/expense/store',         [PayableController::class, 'storeExpense']);
        Route::delete('/expense/{id}',        [PayableController::class, 'deleteExpense']);
        Route::post('/payment',               [PayableController::class, 'recordPayment']);
    });

    // ── Receivables ────────────────────────────────────────────────────────
    Route::get('/receivables', fn() => Inertia::render('ReceivablesPage'));
    Route::prefix('/receivables')->group(function () {
        Route::get('/invoices',        [ReceivableController::class, 'invoices']);
        Route::get('/history/{id}',    [ReceivableController::class, 'paymentHistory']);
        Route::post('/payment',        [ReceivableController::class, 'recordPayment']);
    });

    // ── VAT Invoices ──────────────────────────────────────────────────────
    Route::get('/vat-invoices',           fn() => Inertia::render('VATInvoicesPage'));
    Route::get('/vat-invoice/customers',  [VatInvoiceApiController::class, 'getCustomers']);
    Route::post('/vat-invoice/search',    [VatInvoiceApiController::class, 'getInvoices']);
    Route::get('/vat-invoice/data/{id}',  [VatInvoiceApiController::class, 'getInvoiceData']);
    Route::get('/vat-invoice/history',    [VatInvoiceApiController::class, 'history']);
    Route::post('/vat-invoice/generate',  [VatInvoiceController::class, 'generatePdf']);
    Route::post('/vat-invoice/reprint',   [VatInvoiceController::class, 'viewHistoryPdf']);

    // ── Notifications ──────────────────────────────────────────────────────
    Route::get('/notifications/overdue-invoices', [NotificationController::class, 'overdueInvoices']);

    // ── Other Pages ────────────────────────────────────────────────────────

    // ── Fallback ───────────────────────────────────────────────────────────
    Route::fallback(fn() => Inertia::render('NotFound'));
});