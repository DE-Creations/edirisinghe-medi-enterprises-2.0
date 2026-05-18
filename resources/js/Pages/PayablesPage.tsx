// import { Head } from '@inertiajs/react';
// import AppShell from '@/AppShell';
// import React, { useState } from 'react';
// import {
//   initialGRNs,
//   initialExpenses,
//   initialPayablePayments,
//   initialSuppliers,
//   expenseCategories,
//   nextExpenseNumber,
//   type GRN,
//   type Expense,
//   type PayablePayment,
// } from '@/data/mockData';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { DatePicker } from '@/components/ui/date-picker';
// import SearchBar from '@/components/shared/SearchBar';
// import Modal from '@/components/shared/Modal';
// import { Combobox } from '@/components/ui/combobox';
// import { format } from 'date-fns';
// import { Plus, Banknote, CheckCircle2, Clock, Eye, Trash2 } from 'lucide-react';
// import { cn } from '@/lib/utils';

// type Tab = 'grn' | 'expenses';

// function computeGRNOutstanding(grn: GRN, payments: PayablePayment[]): number {
//   const paid = payments
//     .filter((p) => p.referenceId === grn.id && p.referenceType === 'grn')
//     .reduce((s, p) => s + p.amount, 0);
//   return Math.max(0, grn.total - paid);
// }

// function computeExpenseOutstanding(expense: Expense, payments: PayablePayment[]): number {
//   const paid = payments
//     .filter((p) => p.referenceId === expense.id && p.referenceType === 'expense')
//     .reduce((s, p) => s + p.amount, 0);
//   return Math.max(0, expense.amount - paid);
// }

// function PayablesPage() {
//   const [tab, setTab] = useState<Tab>('grn');
//   const [grns] = useState<GRN[]>(initialGRNs);
//   const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
//   const [payments, setPayments] = useState<PayablePayment[]>(initialPayablePayments);

//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'outstanding' | 'paid'>('all');

//   // ── Add Payment modal ─────────────────────────────────────────────────────
//   const [payOpen, setPayOpen] = useState(false);
//   const [payTarget, setPayTarget] = useState<{ id: string; number: string; type: 'grn' | 'expense'; payeeName: string; outstanding: number } | null>(null);
//   const [payDate, setPayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [payAmount, setPayAmount] = useState('');
//   const [payNotes, setPayNotes] = useState('');

//   // ── History modal ─────────────────────────────────────────────────────────
//   const [historyTarget, setHistoryTarget] = useState<{ label: string; id: string; type: 'grn' | 'expense'; total: number } | null>(null);

//   // ── Add Expense modal ─────────────────────────────────────────────────────
//   const [expOpen, setExpOpen] = useState(false);
//   const [expDate, setExpDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [expDesc, setExpDesc] = useState('');
//   const [expCategory, setExpCategory] = useState('');
//   const [expAmount, setExpAmount] = useState('');
//   const [expPaid, setExpPaid] = useState('');
//   const [expNotes, setExpNotes] = useState('');

//   // Summary
//   const totalGRNPayable = grns.reduce((s, g) => s + g.total, 0);
//   const totalGRNOutstanding = grns.reduce((s, g) => s + computeGRNOutstanding(g, payments), 0);
//   const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
//   const totalExpenseOutstanding = expenses.reduce((s, e) => s + computeExpenseOutstanding(e, payments), 0);
//   const totalOutstanding = totalGRNOutstanding + totalExpenseOutstanding;

//   // Filtered GRNs
//   const filteredGRNs = grns.filter((g) => {
//     const outstanding = computeGRNOutstanding(g, payments);
//     const matchSearch =
//       g.number.toLowerCase().includes(search.toLowerCase()) ||
//       g.supplierName.toLowerCase().includes(search.toLowerCase());
//     const matchStatus =
//       statusFilter === 'all' ||
//       (statusFilter === 'outstanding' && outstanding > 0) ||
//       (statusFilter === 'paid' && outstanding === 0);
//     return matchSearch && matchStatus;
//   });

//   // Filtered Expenses
//   const filteredExpenses = expenses.filter((e) => {
//     const outstanding = computeExpenseOutstanding(e, payments);
//     const matchSearch =
//       e.number.toLowerCase().includes(search.toLowerCase()) ||
//       e.description.toLowerCase().includes(search.toLowerCase()) ||
//       e.category.toLowerCase().includes(search.toLowerCase());
//     const matchStatus =
//       statusFilter === 'all' ||
//       (statusFilter === 'outstanding' && outstanding > 0) ||
//       (statusFilter === 'paid' && outstanding === 0);
//     return matchSearch && matchStatus;
//   });

//   const openPayGRN = (g: GRN) => {
//     setPayTarget({
//       id: g.id,
//       number: g.number,
//       type: 'grn',
//       payeeName: g.supplierName,
//       outstanding: computeGRNOutstanding(g, payments),
//     });
//     setPayAmount(String(computeGRNOutstanding(g, payments)));
//     setPayDate(format(new Date(), 'yyyy-MM-dd'));
//     setPayNotes('');
//     setPayOpen(true);
//   };

//   const openPayExpense = (e: Expense) => {
//     setPayTarget({
//       id: e.id,
//       number: e.number,
//       type: 'expense',
//       payeeName: e.description,
//       outstanding: computeExpenseOutstanding(e, payments),
//     });
//     setPayAmount(String(computeExpenseOutstanding(e, payments)));
//     setPayDate(format(new Date(), 'yyyy-MM-dd'));
//     setPayNotes('');
//     setPayOpen(true);
//   };

//   const handleAddPayment = () => {
//     if (!payTarget || !payDate || !payAmount) return;
//     const amount = Number(payAmount);
//     if (amount <= 0) return;
//     const newPayment: PayablePayment = {
//       id: String(Date.now()),
//       referenceId: payTarget.id,
//       referenceNumber: payTarget.number,
//       referenceType: payTarget.type,
//       payeeName: payTarget.payeeName,
//       date: payDate,
//       amount,
//       notes: payNotes || undefined,
//     };
//     setPayments((prev) => [...prev, newPayment]);
//     setPayOpen(false);
//   };

//   const handleAddExpense = () => {
//     if (!expDate || !expDesc || !expCategory || !expAmount) return;
//     const amount = Number(expAmount);
//     const paidAmount = Number(expPaid || 0);
//     const newExpense: Expense = {
//       id: String(Date.now()),
//       number: nextExpenseNumber(),
//       date: expDate,
//       description: expDesc,
//       category: expCategory,
//       amount,
//       paidAmount,
//       balance: Math.max(0, amount - paidAmount),
//       notes: expNotes || undefined,
//     };
//     setExpenses((prev) => [...prev, newExpense]);
//     if (paidAmount > 0) {
//       setPayments((prev) => [
//         ...prev,
//         {
//           id: String(Date.now() + 1),
//           referenceId: newExpense.id,
//           referenceNumber: newExpense.number,
//           referenceType: 'expense',
//           payeeName: newExpense.description,
//           date: expDate,
//           amount: paidAmount,
//         },
//       ]);
//     }
//     setExpOpen(false);
//     setExpDate(format(new Date(), 'yyyy-MM-dd'));
//     setExpDesc('');
//     setExpCategory('');
//     setExpAmount('');
//     setExpPaid('');
//     setExpNotes('');
//   };

//   const handleDeleteExpense = (id: string) => {
//     setExpenses((prev) => prev.filter((e) => e.id !== id));
//     setPayments((prev) => prev.filter((p) => !(p.referenceId === id && p.referenceType === 'expense')));
//   };

//   const referencePayments = (id: string, type: 'grn' | 'expense') =>
//     payments.filter((p) => p.referenceId === id && p.referenceType === type);

//   const categoryOptions = expenseCategories.map((c) => ({ value: c, label: c }));

//   return (
//     <div className="space-y-5 animate-fade-in">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         <div className="bg-card rounded-xl border border-border p-4">
//           <p className="text-xs text-muted-foreground mb-1">Total GRN Payable</p>
//           <p className="text-xl font-bold text-primary">Rs. {totalGRNPayable.toLocaleString()}</p>
//         </div>
//         <div className="bg-card rounded-xl border border-border p-4">
//           <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
//           <p className="text-xl font-bold text-primary">Rs. {totalExpense.toLocaleString()}</p>
//         </div>
//         <div className="bg-card rounded-xl border border-border p-4">
//           <p className="text-xs text-muted-foreground mb-1">GRN Outstanding</p>
//           <p className="text-xl font-bold text-destructive">Rs. {totalGRNOutstanding.toLocaleString()}</p>
//         </div>
//         <div className="bg-card rounded-xl border border-border p-4">
//           <p className="text-xs text-muted-foreground mb-1">Total Outstanding</p>
//           <p className="text-xl font-bold text-destructive">Rs. {totalOutstanding.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Tabs + Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//         <div className="flex gap-1 bg-muted rounded-lg p-1">
//           <button
//             onClick={() => { setTab('grn'); setSearch(''); setStatusFilter('all'); }}
//             className={cn(
//               'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
//               tab === 'grn' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
//             )}
//           >
//             GRN Payables
//           </button>
//           <button
//             onClick={() => { setTab('expenses'); setSearch(''); setStatusFilter('all'); }}
//             className={cn(
//               'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
//               tab === 'expenses' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
//             )}
//           >
//             Expenses
//           </button>
//         </div>

//         <div className="flex flex-1 gap-3 items-center">
//           <div className="w-full sm:w-64">
//             <SearchBar
//               value={search}
//               onChange={setSearch}
//               placeholder={tab === 'grn' ? 'Search GRN # or supplier...' : 'Search expenses...'}
//             />
//           </div>
//           <div className="flex gap-2">
//             {(['all', 'outstanding', 'paid'] as const).map((s) => (
//               <button
//                 key={s}
//                 onClick={() => setStatusFilter(s)}
//                 className={cn(
//                   'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
//                   statusFilter === s
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-muted text-muted-foreground hover:text-foreground'
//                 )}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//           {tab === 'expenses' && (
//             <Button onClick={() => setExpOpen(true)} className="gap-2 ml-auto shrink-0">
//               <Plus className="h-4 w-4" /> Add Expense
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* GRN Payables Table */}
//       {tab === 'grn' && (
//         <div className="bg-card rounded-xl border border-border overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-border bg-muted/50">
//                   <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">GRN #</th>
//                   <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
//                   <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Supplier</th>
//                   <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">GRN Total</th>
//                   <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Paid</th>
//                   <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Outstanding</th>
//                   <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
//                   <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredGRNs.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
//                       No GRNs found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredGRNs.map((g) => {
//                     const paid = referencePayments(g.id, 'grn').reduce((s, p) => s + p.amount, 0);
//                     const outstanding = Math.max(0, g.total - paid);
//                     const isPaid = outstanding === 0;
//                     return (
//                       <tr key={g.id} className="border-b border-border last:border-0 hover:bg-muted/30">
//                         <td className="px-4 py-3 text-sm font-medium text-primary">{g.number}</td>
//                         <td className="px-4 py-3 text-sm">{g.date}</td>
//                         <td className="px-4 py-3 text-sm">{g.supplierName}</td>
//                         <td className="px-4 py-3 text-sm font-semibold text-right">
//                           Rs. {g.total.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-right text-green-600">
//                           Rs. {paid.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-right font-semibold text-destructive">
//                           {outstanding > 0 ? `Rs. ${outstanding.toLocaleString()}` : '—'}
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           {isPaid ? (
//                             <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                               <CheckCircle2 className="h-3 w-3" /> Paid
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
//                               <Clock className="h-3 w-3" /> Outstanding
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex items-center justify-end gap-1">
//                             <button
//                               onClick={() => setHistoryTarget({ label: g.number, id: g.id, type: 'grn', total: g.total })}
//                               className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
//                               title="Payment history"
//                             >
//                               <Eye className="h-3.5 w-3.5" />
//                             </button>
//                             {!isPaid && (
//                               <button
//                                 onClick={() => openPayGRN(g)}
//                                 className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
//                                 title="Record payment"
//                               >
//                                 <Plus className="h-3.5 w-3.5" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Expenses Table */}
//       {tab === 'expenses' && (
//         <div className="bg-card rounded-xl border border-border overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-border bg-muted/50">
//                   <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Exp #</th>
//                   <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
//                   <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Description</th>
//                   <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Category</th>
//                   <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Amount</th>
//                   <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Paid</th>
//                   <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Outstanding</th>
//                   <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
//                   <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredExpenses.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-10 text-sm text-muted-foreground">
//                       No expenses found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredExpenses.map((e) => {
//                     const paid = referencePayments(e.id, 'expense').reduce((s, p) => s + p.amount, 0);
//                     const outstanding = Math.max(0, e.amount - paid);
//                     const isPaid = outstanding === 0;
//                     return (
//                       <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
//                         <td className="px-4 py-3 text-sm font-medium text-primary">{e.number}</td>
//                         <td className="px-4 py-3 text-sm">{e.date}</td>
//                         <td className="px-4 py-3 text-sm">{e.description}</td>
//                         <td className="px-4 py-3">
//                           <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
//                             {e.category}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-sm font-semibold text-right">
//                           Rs. {e.amount.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-right text-green-600">
//                           Rs. {paid.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-right font-semibold text-destructive">
//                           {outstanding > 0 ? `Rs. ${outstanding.toLocaleString()}` : '—'}
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           {isPaid ? (
//                             <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                               <CheckCircle2 className="h-3 w-3" /> Paid
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
//                               <Clock className="h-3 w-3" /> Outstanding
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex items-center justify-end gap-1">
//                             <button
//                               onClick={() => setHistoryTarget({ label: e.number, id: e.id, type: 'expense', total: e.amount })}
//                               className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
//                               title="Payment history"
//                             >
//                               <Eye className="h-3.5 w-3.5" />
//                             </button>
//                             {!isPaid && (
//                               <button
//                                 onClick={() => openPayExpense(e)}
//                                 className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
//                                 title="Record payment"
//                               >
//                                 <Plus className="h-3.5 w-3.5" />
//                               </button>
//                             )}
//                             <button
//                               onClick={() => handleDeleteExpense(e.id)}
//                               className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
//                               title="Delete"
//                             >
//                               <Trash2 className="h-3.5 w-3.5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Record Payment Modal */}
//       <Modal open={payOpen} onClose={() => setPayOpen(false)} title="Record Payment Made">
//         {payTarget && (
//           <div className="space-y-4">
//             <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
//               <p>
//                 <span className="text-muted-foreground">Reference:</span>{' '}
//                 <span className="font-medium">{payTarget.number}</span>
//                 <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-accent text-accent-foreground uppercase">
//                   {payTarget.type}
//                 </span>
//               </p>
//               <p>
//                 <span className="text-muted-foreground">Payee:</span> {payTarget.payeeName}
//               </p>
//               <p>
//                 <span className="text-muted-foreground">Outstanding:</span>{' '}
//                 <span className="font-semibold text-destructive">
//                   Rs. {payTarget.outstanding.toLocaleString()}
//                 </span>
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-medium text-muted-foreground mb-1 block">
//                   Payment Date
//                 </label>
//                 <DatePicker value={payDate} onChange={setPayDate} className="w-full" />
//               </div>
//               <div>
//                 <label className="text-xs font-medium text-muted-foreground mb-1 block">
//                   Amount (Rs.)
//                 </label>
//                 <Input
//                   type="number"
//                   value={payAmount}
//                   onChange={(e) => setPayAmount(e.target.value)}
//                   placeholder="0.00"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="text-xs font-medium text-muted-foreground mb-1 block">
//                 Notes (optional)
//               </label>
//               <Input
//                 value={payNotes}
//                 onChange={(e) => setPayNotes(e.target.value)}
//                 placeholder="e.g. Bank transfer, cheque no..."
//               />
//             </div>

//             <div className="flex justify-end gap-2 pt-2">
//               <Button variant="outline" onClick={() => setPayOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddPayment} className="gap-2">
//                 <Banknote className="h-4 w-4" /> Record Payment
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Add Expense Modal */}
//       <Modal open={expOpen} onClose={() => setExpOpen(false)} title="Add Expense">
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
//               <DatePicker value={expDate} onChange={setExpDate} className="w-full" />
//             </div>
//             <div>
//               <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
//               <Combobox
//                 options={categoryOptions}
//                 value={expCategory}
//                 onValueChange={setExpCategory}
//                 placeholder="Select category"
//                 searchPlaceholder="Search..."
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
//             <Input
//               value={expDesc}
//               onChange={(e) => setExpDesc(e.target.value)}
//               placeholder="e.g. Monthly Rent, Electricity Bill..."
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount (Rs.)</label>
//               <Input
//                 type="number"
//                 value={expAmount}
//                 onChange={(e) => setExpAmount(e.target.value)}
//                 placeholder="0.00"
//               />
//             </div>
//             <div>
//               <label className="text-xs font-medium text-muted-foreground mb-1 block">
//                 Paid Amount (Rs.)
//               </label>
//               <Input
//                 type="number"
//                 value={expPaid}
//                 onChange={(e) => setExpPaid(e.target.value)}
//                 placeholder="0.00"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-medium text-muted-foreground mb-1 block">
//               Notes (optional)
//             </label>
//             <Input
//               value={expNotes}
//               onChange={(e) => setExpNotes(e.target.value)}
//               placeholder="Additional notes..."
//             />
//           </div>

//           <div className="flex justify-end gap-2 pt-2">
//             <Button variant="outline" onClick={() => setExpOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddExpense} className="gap-2">
//               <Plus className="h-4 w-4" /> Add Expense
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Payment History Modal */}
//       <Modal
//         open={!!historyTarget}
//         onClose={() => setHistoryTarget(null)}
//         title={`Payment History — ${historyTarget?.label}`}
//         size="lg"
//       >
//         {historyTarget && (
//           <div className="space-y-3">
//             <div className="border rounded-lg overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b bg-muted/50">
//                     <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Date</th>
//                     <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Amount</th>
//                     <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Notes</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {referencePayments(historyTarget.id, historyTarget.type).length === 0 ? (
//                     <tr>
//                       <td colSpan={3} className="text-center py-6 text-muted-foreground">
//                         No payments recorded yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     referencePayments(historyTarget.id, historyTarget.type).map((p) => (
//                       <tr key={p.id} className="border-b last:border-0">
//                         <td className="px-4 py-2">{p.date}</td>
//                         <td className="px-4 py-2 text-right font-medium text-green-600">
//                           Rs. {p.amount.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-2 text-muted-foreground">{p.notes ?? '—'}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex justify-between pt-2 border-t text-sm">
//               <span className="text-muted-foreground">Outstanding</span>
//               <span className="font-bold text-destructive">
//                 Rs.{' '}
//                 {Math.max(
//                   0,
//                   historyTarget.total -
//                     referencePayments(historyTarget.id, historyTarget.type).reduce(
//                       (s, p) => s + p.amount,
//                       0
//                     )
//                 ).toLocaleString()}
//               </span>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default function WrappedPayablesPage() {
//   return (
//     <>
//       <Head title="Payables" />
//       <PayablesPage />
//     </>
//   );
// }

// (WrappedPayablesPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import SearchBar from '@/components/shared/SearchBar';
import Modal from '@/components/shared/Modal';
import { Combobox } from '@/components/ui/combobox';
import { format } from 'date-fns';
import { Plus, Banknote, CheckCircle2, Clock, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

type Tab = 'grn' | 'expenses';

interface GrnPayable {
    id:            number;
    grn_number:    string;
    received_date: string;
    supplier:      string;
    total_amount:  number;
    paid:          number;
    outstanding:   number;
    status:        string;
}

interface ExpenseItem {
    id:             number;
    expense_number: string;
    date:           string;
    description:    string;
    category:       string;
    amount:         number;
    paid:           number;
    outstanding:    number;
    notes:          string | null;
    status:         string;
}

interface PaymentRecord {
    id:     number;
    amount: number;
    date:   string;
    notes:  string | null;
    user?:  { name: string };
}

const expenseCategoryOptions = [
    { value: 'Rent',        label: 'Rent' },
    { value: 'Electricity', label: 'Electricity' },
    { value: 'Water',       label: 'Water' },
    { value: 'Salary',      label: 'Salary' },
    { value: 'Transport',   label: 'Transport' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Stationery',  label: 'Stationery' },
    { value: 'Other',       label: 'Other' },
];

function PayablesPage() {
    const { user } = useAuth();
    const [tab,          setTab]          = useState<Tab>('grn');
    const [grns,         setGrns]         = useState<GrnPayable[]>([]);
    const [expenses,     setExpenses]     = useState<ExpenseItem[]>([]);
    const [search,       setSearch]       = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'outstanding' | 'paid'>('all');
    const [loading,      setLoading]      = useState(false);

    // Payment modal
    const [payOpen,   setPayOpen]   = useState(false);
    const [payTarget, setPayTarget] = useState<{ id: number; number: string; type: 'grn' | 'expense'; outstanding: number } | null>(null);
    const [payDate,   setPayDate]   = useState(format(new Date(), 'yyyy-MM-dd'));
    const [payAmount, setPayAmount] = useState('');
    const [payNotes,  setPayNotes]  = useState('');

    // History modal
    const [historyOpen,    setHistoryOpen]    = useState(false);
    const [historyLabel,   setHistoryLabel]   = useState('');
    const [historyRecords, setHistoryRecords] = useState<PaymentRecord[]>([]);
    const [historyTotal,   setHistoryTotal]   = useState(0);

    // Add expense modal
    const [expOpen,     setExpOpen]     = useState(false);
    const [expDate,     setExpDate]     = useState(format(new Date(), 'yyyy-MM-dd'));
    const [expDesc,     setExpDesc]     = useState('');
    const [expCategory, setExpCategory] = useState('');
    const [expAmount,   setExpAmount]   = useState('');
    const [expPaid,     setExpPaid]     = useState('');
    const [expNotes,    setExpNotes]    = useState('');
    const [deleteExpId, setDeleteExpId] = useState<number | null>(null);

    useEffect(() => {
        fetchGrns();
        fetchExpenses();
    }, []);

    const fetchGrns = async () => {
        try {
            const res = await axios.get('/payables/grns');
            setGrns(res.data);
        } catch (e) { console.log(e); }
    };

    const fetchExpenses = async () => {
        try {
            const res = await axios.get('/payables/expenses');
            setExpenses(res.data);
        } catch (e) { console.log(e); }
    };

    // Summary
    const totalGRNPayable     = grns.reduce((s, g) => s + Number(g.total_amount), 0);
    const totalGRNOutstanding = grns.reduce((s, g) => s + Number(g.outstanding), 0);
    const totalExpense        = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const totalOutstanding    = totalGRNOutstanding + expenses.reduce((s, e) => s + Number(e.outstanding), 0);

    // Filtered
    const filteredGRNs = grns.filter((g) => {
        const matchSearch = g.grn_number.toLowerCase().includes(search.toLowerCase()) ||
            g.supplier.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' ||
            (statusFilter === 'outstanding' && g.outstanding > 0) ||
            (statusFilter === 'paid' && g.outstanding <= 0);
        return matchSearch && matchStatus;
    });

    const filteredExpenses = expenses.filter((e) => {
        const matchSearch = e.expense_number.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase()) ||
            e.category.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' ||
            (statusFilter === 'outstanding' && e.outstanding > 0) ||
            (statusFilter === 'paid' && e.outstanding <= 0);
        return matchSearch && matchStatus;
    });

    // Open payment modal
    const openPay = (id: number, number: string, type: 'grn' | 'expense', outstanding: number) => {
        setPayTarget({ id, number, type, outstanding });
        setPayAmount(String(outstanding));
        setPayDate(format(new Date(), 'yyyy-MM-dd'));
        setPayNotes('');
        setPayOpen(true);
    };

    // Record payment
    const handleRecordPayment = async () => {
        if (!payTarget || !payAmount) return;
        setLoading(true);
        try {
            await axios.post('/payables/payment', {
                reference_type: payTarget.type,
                reference_id:   payTarget.id,
                amount:         Number(payAmount),
                date:           payDate,
                notes:          payNotes || null,
                user_id:        user?.id,
            });
            toast.success('Payment recorded!');
            setPayOpen(false);
            fetchGrns();
            fetchExpenses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to record payment.');
        } finally {
            setLoading(false);
        }
    };

    // View payment history
    const openHistory = async (type: 'grn' | 'expense', id: number, label: string, total: number) => {
        try {
            const res = await axios.get(`/payables/history/${type}/${id}`);
            setHistoryRecords(res.data);
            setHistoryLabel(label);
            setHistoryTotal(total);
            setHistoryOpen(true);
        } catch (e) { console.log(e); }
    };

    // Add expense
    const handleAddExpense = async () => {
        if (!expDate || !expDesc || !expCategory || !expAmount) {
            toast.error('Please fill all required fields.');
            return;
        }
        setLoading(true);
        try {
            await axios.post('/payables/expense/store', {
                date:        expDate,
                description: expDesc,
                category:    expCategory,
                amount:      Number(expAmount),
                paid_amount: Number(expPaid || 0),
                notes:       expNotes || null,
                user_id:     user?.id,
            });
            toast.success('Expense added!');
            setExpOpen(false);
            setExpDate(format(new Date(), 'yyyy-MM-dd'));
            setExpDesc('');
            setExpCategory('');
            setExpAmount('');
            setExpPaid('');
            setExpNotes('');
            fetchExpenses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add expense.');
        } finally {
            setLoading(false);
        }
    };

    // Delete expense
    const handleDeleteExpense = async () => {
        try {
            await axios.delete(`/payables/expense/${deleteExpId}`);
            toast.success('Expense deleted.');
            setDeleteExpId(null);
            fetchExpenses();
        } catch (e) {
            toast.error('Failed to delete expense.');
        }
    };

    const statusBadge = (status: string) => {
        if (status === 'paid') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (status === 'partial') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    };

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total GRN Payable</p>
                    <p className="text-xl font-bold text-primary">Rs. {totalGRNPayable.toLocaleString()}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
                    <p className="text-xl font-bold text-primary">Rs. {totalExpense.toLocaleString()}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">GRN Outstanding</p>
                    <p className="text-xl font-bold text-destructive">Rs. {totalGRNOutstanding.toLocaleString()}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Outstanding</p>
                    <p className="text-xl font-bold text-destructive">Rs. {totalOutstanding.toLocaleString()}</p>
                </div>
            </div>

            {/* Tabs + Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                    {(['grn', 'expenses'] as Tab[]).map((t) => (
                        <button key={t} onClick={() => { setTab(t); setSearch(''); setStatusFilter('all'); }}
                            className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                                tab === t ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                            {t === 'grn' ? 'GRN Payables' : 'Expenses'}
                        </button>
                    ))}
                </div>
                <div className="flex flex-1 gap-3 items-center flex-wrap">
                    <div className="w-full sm:w-64">
                        <SearchBar value={search} onChange={setSearch}
                            placeholder={tab === 'grn' ? 'Search GRN # or supplier...' : 'Search expenses...'} />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'outstanding', 'paid'] as const).map((s) => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                                    statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                                {s}
                            </button>
                        ))}
                    </div>
                    {tab === 'expenses' && (
                        <Button onClick={() => setExpOpen(true)} className="gap-2 ml-auto shrink-0">
                            <Plus className="h-4 w-4" /> Add Expense
                        </Button>
                    )}
                </div>
            </div>

            {/* GRN Payables Table */}
            {tab === 'grn' && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">GRN #</th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Supplier</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Paid</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Outstanding</th>
                                    <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGRNs.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-10 text-sm text-muted-foreground">No GRNs found.</td></tr>
                                ) : filteredGRNs.map((g) => (
                                    <tr key={g.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                        <td className="px-4 py-3 text-sm font-medium text-primary font-mono">{g.grn_number}</td>
                                        <td className="px-4 py-3 text-sm">{g.received_date?.split('T')[0]}</td>
                                        <td className="px-4 py-3 text-sm">{g.supplier}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {Number(g.total_amount).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-right text-green-600">Rs. {Number(g.paid).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-right font-semibold text-destructive">
                                            {g.outstanding > 0 ? `Rs. ${Number(g.outstanding).toLocaleString()}` : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusBadge(g.status)}`}>
                                                {g.status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                {g.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openHistory('grn', g.id, g.grn_number, g.total_amount)}
                                                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="History">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                                {g.outstanding > 0 && (
                                                    <button onClick={() => openPay(g.id, g.grn_number, 'grn', g.outstanding)}
                                                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary" title="Record payment">
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Expenses Table */}
            {tab === 'expenses' && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Exp #</th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Description</th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Category</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Amount</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Paid</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Outstanding</th>
                                    <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.length === 0 ? (
                                    <tr><td colSpan={9} className="text-center py-10 text-sm text-muted-foreground">No expenses found.</td></tr>
                                ) : filteredExpenses.map((e) => (
                                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                        <td className="px-4 py-3 text-sm font-medium text-primary font-mono">{e.expense_number}</td>
                                        <td className="px-4 py-3 text-sm">{e.date}</td>
                                        <td className="px-4 py-3 text-sm">{e.description}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{e.category}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-right">Rs. {Number(e.amount).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-right text-green-600">Rs. {Number(e.paid).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-right font-semibold text-destructive">
                                            {e.outstanding > 0 ? `Rs. ${Number(e.outstanding).toLocaleString()}` : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusBadge(e.status)}`}>
                                                {e.status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                {e.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openHistory('expense', e.id, e.expense_number, e.amount)}
                                                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="History">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                                {e.outstanding > 0 && (
                                                    <button onClick={() => openPay(e.id, e.expense_number, 'expense', e.outstanding)}
                                                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary" title="Record payment">
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                                <button onClick={() => setDeleteExpId(e.id)}
                                                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Delete">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Record Payment Modal */}
            <Modal open={payOpen} onClose={() => setPayOpen(false)} title="Record Payment Made">
                {payTarget && (
                    <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                            <p><span className="text-muted-foreground">Reference:</span> <span className="font-medium">{payTarget.number}</span></p>
                            <p><span className="text-muted-foreground">Outstanding:</span> <span className="font-semibold text-destructive">Rs. {Number(payTarget.outstanding).toLocaleString()}</span></p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Payment Date</label>
                                <DatePicker value={payDate} onChange={setPayDate} className="w-full" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount (Rs.)</label>
                                <Input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes (optional)</label>
                            <Input value={payNotes} onChange={(e) => setPayNotes(e.target.value)} placeholder="e.g. Bank transfer, cheque no..." />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
                            <Button onClick={handleRecordPayment} disabled={loading} className="gap-2">
                                <Banknote className="h-4 w-4" /> Record Payment
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Expense Modal */}
            <Modal open={expOpen} onClose={() => setExpOpen(false)} title="Add Expense">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                            <DatePicker value={expDate} onChange={setExpDate} className="w-full" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                            <Combobox options={expenseCategoryOptions} value={expCategory}
                                onValueChange={setExpCategory} placeholder="Select category" searchPlaceholder="Search..." />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                        <Input value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="e.g. Monthly Rent, Electricity Bill..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount (Rs.)</label>
                            <Input type="number" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Paid Amount (Rs.)</label>
                            <Input type="number" value={expPaid} onChange={(e) => setExpPaid(e.target.value)} placeholder="0.00" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes (optional)</label>
                        <Input value={expNotes} onChange={(e) => setExpNotes(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setExpOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddExpense} disabled={loading} className="gap-2">
                            <Plus className="h-4 w-4" /> Add Expense
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Payment History Modal */}
            <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} title={`Payment History — ${historyLabel}`} size="lg">
                <div className="space-y-3">
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Date</th>
                                    <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Amount</th>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">By</th>
                                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyRecords.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No payments recorded yet.</td></tr>
                                ) : historyRecords.map((p) => (
                                    <tr key={p.id} className="border-b last:border-0">
                                        <td className="px-4 py-2">{p.date}</td>
                                        <td className="px-4 py-2 text-right font-medium text-green-600">Rs. {Number(p.amount).toLocaleString()}</td>
                                        <td className="px-4 py-2 text-muted-foreground">{p.user?.name || '—'}</td>
                                        <td className="px-4 py-2 text-muted-foreground">{p.notes ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between pt-2 border-t text-sm">
                        <span className="text-muted-foreground">Total Paid</span>
                        <span className="font-bold text-green-600">
                            Rs. {historyRecords.reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </Modal>

            <ConfirmDialog open={!!deleteExpId} onClose={() => setDeleteExpId(null)} onConfirm={handleDeleteExpense} />
        </div>
    );
}

export default function WrappedPayablesPage() {
    return (
        <>
            <Head title="Payables" />
            <PayablesPage />
        </>
    );
}

(WrappedPayablesPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;