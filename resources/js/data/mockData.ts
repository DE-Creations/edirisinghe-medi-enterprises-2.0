export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  mobile: string;
  address: string;
  nic: string;
  email: string;
  username: string;
  role: 'owner' | 'admin' | 'cashier';
  designation?: string;
  hireDate?: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  costPrice: number;
  stock: number;
  reorderLevel: number;
  mfgDate: string;
  expDate: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  isVat: boolean;
  vatNumber?: string;
  companyName?: string;
  nickName?: string;
  companyAddress?: string;
  contactNumber?: string;
}

export interface Supplier {
  id: string;
  name: string;
  mobile: string;
  company: string;
}

export interface SupplierCompany {
  id: string;
  name: string;
  mobile: string;
  address: string;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  brand: string;
  category: string;
  qty: number;
  price: number;
  mfgDate: string;
  expDate: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  customerId?: string;
  customerName?: string;
  items: InvoiceItem[];
  total: number;
  paymentMethod: 'cash' | 'card';
  paidAmount: number;
  balance: number;
}

export interface GRN {
  id: string;
  number: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: { productId: string; name: string; qty: number; costPrice: number }[];
  total: number;
  paidAmount: number;
  balance: number;
}

export const brands = ['3M Medical', 'Medline', 'Cardinal Health', 'Kimberly-Clark', 'DJO Global', 'Invacare', 'Drive Medical', 'Sunrise Medical', 'Omron', 'Welch Allyn'];
export const categories = ['Protective Equipment', 'Mobility Aids', 'Wound Care', 'Surgical Supplies', 'Monitoring Devices', 'Diagnostic Equipment', 'Rehabilitation', 'Consumables'];

export const initialEmployees: Employee[] = [
  { id: '1', employeeNumber: 'EMP-0001', name: 'Dr. Sarah Chen', mobile: '+94 77 123 4567', address: '123 Main St, Colombo', nic: '901234567V', email: 'sarah@pharma.com', username: 'owner', role: 'owner', designation: 'Owner / Pharmacist', hireDate: '2020-01-01', status: 'active' },
  { id: '2', employeeNumber: 'EMP-0002', name: 'James Wilson', mobile: '+94 77 234 5678', address: '45 Oak Ave, Kandy', nic: '891234567V', email: 'james@pharma.com', username: 'admin', role: 'admin', designation: 'Store Manager', hireDate: '2021-03-15', status: 'active' },
  { id: '3', employeeNumber: 'EMP-0003', name: 'Emily Davis', mobile: '+94 77 345 6789', address: '78 Elm Rd, Galle', nic: '951234567V', email: 'emily@pharma.com', username: 'cashier', role: 'cashier', designation: 'Cashier', hireDate: '2022-06-01', status: 'active' },
];

let empCounter = 3;
export const nextEmployeeNumber = (): string => {
  empCounter += 1;
  return `EMP-${String(empCounter).padStart(4, '0')}`;
};

export const initialProducts: Product[] = [
  { id: '1', name: 'Surgical Face Mask (50 pcs)', barcode: '8901234001', brand: '3M Medical', category: 'Protective Equipment', description: 'Disposable 3-ply surgical face masks, box of 50.', price: 0, costPrice: 0, stock: 200, reorderLevel: 50, mfgDate: '2025-01-01', expDate: '2028-01-01' },
  { id: '2', name: 'Latex Examination Gloves (100 pcs)', barcode: '8901234002', brand: 'Kimberly-Clark', category: 'Protective Equipment', description: 'Powder-free latex gloves, medium size, box of 100.', price: 0, costPrice: 0, stock: 150, reorderLevel: 30, mfgDate: '2025-03-01', expDate: '2028-03-01' },
  { id: '3', name: 'Manual Wheelchair Standard', barcode: '8901234003', brand: 'Invacare', category: 'Mobility Aids', description: 'Foldable standard manual wheelchair with aluminium frame.', price: 0, costPrice: 0, stock: 10, reorderLevel: 3, mfgDate: '2025-02-01', expDate: '2030-02-01' },
  { id: '4', name: 'Digital Blood Pressure Monitor', barcode: '8901234004', brand: 'Omron', category: 'Monitoring Devices', description: 'Upper arm automatic digital blood pressure monitor.', price: 0, costPrice: 0, stock: 40, reorderLevel: 10, mfgDate: '2025-04-01', expDate: '2030-04-01' },
  { id: '5', name: 'Sterile Gauze Bandage Roll', barcode: '8901234005', brand: 'Cardinal Health', category: 'Wound Care', description: 'Sterile gauze bandage roll 10cm x 4m, individually wrapped.', price: 0, costPrice: 0, stock: 300, reorderLevel: 60, mfgDate: '2025-01-20', expDate: '2028-06-20' },
  { id: '6', name: 'Stainless Steel Forceps 15cm', barcode: '8901234006', brand: 'Medline', category: 'Surgical Supplies', description: 'Reusable stainless steel dressing forceps, 15cm length.', price: 0, costPrice: 0, stock: 60, reorderLevel: 15, mfgDate: '2025-05-01', expDate: '2035-05-01' },
];

export const initialCustomers: Customer[] = [
  { id: '1', name: 'John Smith', mobile: '+94 77 111 2222', address: '10 Park Lane, Colombo', isVat: false },
  { id: '2', name: 'ABC Pharmaceuticals', mobile: '+94 77 333 4444', address: '5 Commerce St, Colombo', isVat: true, vatNumber: 'VAT-2024-001', companyName: 'ABC Pharmaceuticals Ltd', companyAddress: '5 Commerce St, Colombo 03' },
  { id: '3', name: 'Mary Johnson', mobile: '+94 77 555 6666', address: '22 Lake Rd, Kandy', isVat: false },
];

export const initialSupplierCompanies: SupplierCompany[] = [
  { id: '1', name: 'Global Pharma Distributors', mobile: '+94 11 234 5678', address: '100 Industrial Zone, Colombo' },
  { id: '2', name: 'MediSupply Lanka', mobile: '+94 11 345 6789', address: '50 Trade Center, Kelaniya' },
];

export const initialSuppliers: Supplier[] = [
  { id: '1', name: 'Robert Brown', mobile: '+94 77 777 8888', company: 'Global Pharma Distributors' },
  { id: '2', name: 'Lisa Wang', mobile: '+94 77 888 9999', company: 'MediSupply Lanka' },
];

export const initialInvoices: Invoice[] = [
  {
    id: '1', number: 'INV-0001', date: '2026-04-01', customerId: '1', customerName: 'John Smith',
    items: [
      { productId: '1', name: 'Paracetamol 500mg', brand: 'PharmaCorp', category: 'Tablets', qty: 2, price: 150, mfgDate: '2025-01-15', expDate: '2027-01-15' },
      { productId: '4', name: 'Vitamin C 1000mg', brand: 'VitaMax', category: 'Supplements', qty: 1, price: 280, mfgDate: '2025-04-01', expDate: '2027-04-01' },
    ],
    total: 580, paymentMethod: 'cash', paidAmount: 600, balance: 20,
  },
  {
    id: '2', number: 'INV-0002', date: '2026-04-03', customerName: 'Walk-in',
    items: [
      { productId: '3', name: 'Cough Syrup 100ml', brand: 'HealthPlus', category: 'Syrups', qty: 1, price: 450, mfgDate: '2025-02-10', expDate: '2026-08-10' },
    ],
    total: 450, paymentMethod: 'card', paidAmount: 450, balance: 0,
  },
  {
    id: '3', number: 'INV-0003', date: '2026-04-05', customerId: '2', customerName: 'ABC Pharmaceuticals',
    items: [
      { productId: '2', name: 'Amoxicillin 250mg', brand: 'MediLife', category: 'Capsules', qty: 5, price: 320, mfgDate: '2025-03-01', expDate: '2027-03-01' },
      { productId: '4', name: 'Vitamin C 1000mg', brand: 'VitaMax', category: 'Supplements', qty: 10, price: 280, mfgDate: '2025-04-01', expDate: '2027-04-01' },
    ],
    total: 4400, paymentMethod: 'cash', paidAmount: 2000, balance: 2400,
  },
];

export const initialGRNs: GRN[] = [
  {
    id: '1', number: 'GRN-0001', date: '2026-03-28', supplierId: '1', supplierName: 'Robert Brown',
    items: [
      { productId: '1', name: 'Paracetamol 500mg', qty: 200, costPrice: 100 },
      { productId: '2', name: 'Amoxicillin 250mg', qty: 100, costPrice: 220 },
    ],
    total: 42000, paidAmount: 42000, balance: 0,
  },
  {
    id: '2', number: 'GRN-0002', date: '2026-04-02', supplierId: '2', supplierName: 'Lisa Wang',
    items: [
      { productId: '3', name: 'Cough Syrup 100ml', qty: 50, costPrice: 300 },
      { productId: '6', name: 'Eye Drops 10ml', qty: 80, costPrice: 250 },
    ],
    total: 35000, paidAmount: 15000, balance: 20000,
  },
];

export interface ReceivablePayment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  amount: number;
  notes?: string;
}

export interface Expense {
  id: string;
  number: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  paidAmount: number;
  balance: number;
  notes?: string;
}

export interface PayablePayment {
  id: string;
  referenceId: string;
  referenceNumber: string;
  referenceType: 'grn' | 'expense';
  payeeName: string;
  date: string;
  amount: number;
  notes?: string;
}

export const expenseCategories = ['Rent', 'Utilities', 'Salaries', 'Transport', 'Maintenance', 'Other'];

export const initialReceivablePayments: ReceivablePayment[] = [
  { id: '1', invoiceId: '1', invoiceNumber: 'INV-0001', customerName: 'John Smith', date: '2026-04-02', amount: 580 },
];

export const initialExpenses: Expense[] = [
  { id: '1', number: 'EXP-0001', date: '2026-04-01', description: 'Monthly Rent', category: 'Rent', amount: 50000, paidAmount: 50000, balance: 0 },
  { id: '2', number: 'EXP-0002', date: '2026-04-05', description: 'Electricity Bill', category: 'Utilities', amount: 8500, paidAmount: 0, balance: 8500 },
];

export const initialPayablePayments: PayablePayment[] = [
  { id: '1', referenceId: '1', referenceNumber: 'GRN-0001', referenceType: 'grn', payeeName: 'Robert Brown', date: '2026-03-28', amount: 42000 },
];

let invoiceCounter = 2;
export const nextInvoiceNumber = () => `INV-${String(++invoiceCounter).padStart(4, '0')}`;

let grnCounter = 1;
export const nextGRNNumber = () => `GRN-${String(++grnCounter).padStart(4, '0')}`;

let expenseCounter = 2;
export const nextExpenseNumber = () => `EXP-${String(++expenseCounter).padStart(4, '0')}`;

// ── Stock Entries ─────────────────────────────────────────────────────────────

export interface StockEntry {
  id: string;
  stockNumber: string;
  productId: string;
  grnNumber?: string;
  costPrice: number;
  sellingPrice: number;
  qty: number;
  mfgDate?: string;
  expDate?: string;
  receivedDate: string;
  notes?: string;
}

export interface StockAdjustment {
  id: string;
  number: string;
  date: string;
  stockEntryId: string;
  stockNumber: string;
  productName: string;
  qty: number;
  type: 'sample' | 'gift' | 'damage' | 'expiry' | 'correction' | 'other';
  notes: string;
}

export const initialStockEntries: StockEntry[] = [
  { id: 's1', stockNumber: 'STK-0001', productId: '1', grnNumber: 'GRN-0001', costPrice: 120, sellingPrice: 180, qty: 120, mfgDate: '2025-01-01', expDate: '2028-01-01', receivedDate: '2026-03-28' },
  { id: 's2', stockNumber: 'STK-0002', productId: '1', grnNumber: 'GRN-0002', costPrice: 130, sellingPrice: 195, qty: 80, mfgDate: '2025-06-01', expDate: '2028-06-01', receivedDate: '2026-04-02' },
  { id: 's3', stockNumber: 'STK-0003', productId: '2', grnNumber: 'GRN-0001', costPrice: 850, sellingPrice: 1200, qty: 150, mfgDate: '2025-03-01', expDate: '2028-03-01', receivedDate: '2026-03-28' },
  { id: 's4', stockNumber: 'STK-0004', productId: '3', grnNumber: 'GRN-0002', costPrice: 28000, sellingPrice: 38000, qty: 10, mfgDate: '2025-02-01', expDate: '2030-02-01', receivedDate: '2026-04-02' },
  { id: 's5', stockNumber: 'STK-0005', productId: '4', grnNumber: 'GRN-0001', costPrice: 6500, sellingPrice: 9500, qty: 40, mfgDate: '2025-04-01', expDate: '2030-04-01', receivedDate: '2026-03-28' },
  { id: 's6', stockNumber: 'STK-0006', productId: '5', grnNumber: 'GRN-0001', costPrice: 45, sellingPrice: 75, qty: 300, mfgDate: '2025-01-20', expDate: '2028-06-20', receivedDate: '2026-03-28' },
  { id: 's7', stockNumber: 'STK-0007', productId: '6', grnNumber: 'GRN-0001', costPrice: 180, sellingPrice: 280, qty: 60, mfgDate: '2025-05-01', expDate: '2035-05-01', receivedDate: '2026-03-28' },
];

export const initialStockAdjustments: StockAdjustment[] = [
  { id: '1', number: 'ADJ-0001', date: '2026-04-05', stockEntryId: 's1', stockNumber: 'STK-0001', productName: 'Surgical Face Mask (50 pcs)', qty: -5, type: 'sample', notes: 'Free sample provided to Dr. Perera' },
];

let stockCounter = 7;
export const nextStockNumber = () => `STK-${String(++stockCounter).padStart(4, '0')}`;

let adjCounter = 1;
export const nextAdjNumber = () => `ADJ-${String(++adjCounter).padStart(4, '0')}`;

// ── VAT Invoices ──────────────────────────────────────────────────────────────

export interface VatInvoiceRecord {
  refNo: string;
  invoiceItem: string;
  quantity: number;
  unitPrice: number;
  amountExclVat: number;
}

export interface VatInvoice {
  id: string;
  vatInvoiceNumber: string;
  customerId: string;
  customerName: string;
  companyNickName: string;
  invoiceId: string;
  invoiceNumber: string;
  date: string;
  records: VatInvoiceRecord[];
  subtotal: number;
  vatPercentage: number;
  vatAmount: number;
  grandTotal: number;
  paymentMode: string;
}

export const initialVatInvoices: VatInvoice[] = [];

let vatInvoiceCounter = 0;
export const nextVatInvoiceNumber = (nickName: string): string => {
  vatInvoiceCounter += 1;
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[now.getMonth()];
  return `${year}${month}_${nickName.toUpperCase()}_${String(vatInvoiceCounter).padStart(5, '0')}`;
};
