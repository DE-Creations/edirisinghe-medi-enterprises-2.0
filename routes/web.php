<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::fallback(fn () => Inertia::render('NotFound'));
