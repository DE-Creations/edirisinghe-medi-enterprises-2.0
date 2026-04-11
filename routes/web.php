<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VatInvoiceController;

Route::get('/', fn () => redirect('/invoice'));
Route::get('/login', fn () => Inertia::render('LoginPage'))->name('login');

$pages = [
    '/dashboard' => 'DashboardPage',
    '/invoice' => 'InvoicePage',
    '/invoice-history' => 'InvoiceHistoryPage',
    '/grn' => 'GRNPage',
    '/grn-history' => 'GRNHistoryPage',
    '/products' => 'ProductsPage',
    '/stock' => 'StockPage',
    '/employees' => 'EmployeesPage',
    '/customers' => 'CustomersPage',
    '/suppliers' => 'SuppliersPage',
    '/vat-invoices' => 'VATInvoicesPage',
    '/receivables' => 'ReceivablesPage',
    '/payables' => 'PayablesPage',
    '/reports' => 'ReportsPage',
    '/settings' => 'SettingsPage',
];

foreach ($pages as $uri => $page) {
    Route::get($uri, fn () => Inertia::render($page));
}

// VAT Invoice PDF (CSRF exempt — pure view render, no state mutation)
Route::post('/vat-invoices/pdf', [VatInvoiceController::class, 'generatePdf']);
Route::post('/vat-invoices/pdf/history', [VatInvoiceController::class, 'viewHistoryPdf']);

Route::fallback(fn () => Inertia::render('NotFound'));

