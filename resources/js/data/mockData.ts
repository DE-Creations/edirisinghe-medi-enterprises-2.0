export interface Employee {
  id: string;
  name: string;
  mobile: string;
  address: string;
  nic: string;
  email: string;
  username: string;
  role: 'owner' | 'admin' | 'cashier';
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
  companyAddress?: string;
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

export const brands = ['PharmaCorp', 'MediLife', 'HealthPlus', 'BioGen', 'CureAll', 'VitaMax'];
export const categories = ['Tablets', 'Capsules', 'Syrups', 'Injections', 'Ointments', 'Drops', 'Supplements'];

export const initialEmployees: Employee[] = [
  { id: '1', name: 'Dr. Sarah Chen', mobile: '+94 77 123 4567', address: '123 Main St, Colombo', nic: '901234567V', email: 'sarah@pharma.com', username: 'owner', role: 'owner' },
  { id: '2', name: 'James Wilson', mobile: '+94 77 234 5678', address: '45 Oak Ave, Kandy', nic: '891234567V', email: 'james@pharma.com', username: 'admin', role: 'admin' },
  { id: '3', name: 'Emily Davis', mobile: '+94 77 345 6789', address: '78 Elm Rd, Galle', nic: '951234567V', email: 'emily@pharma.com', username: 'cashier', role: 'cashier' },
];

export const initialProducts: Product[] = [
  { id: '1', name: 'Paracetamol 500mg', barcode: '8901234001', brand: 'PharmaCorp', category: 'Tablets', description: 'Pain relief tablets', price: 150, costPrice: 100, stock: 500, reorderLevel: 50, mfgDate: '2025-01-15', expDate: '2027-01-15' },
  { id: '2', name: 'Amoxicillin 250mg', barcode: '8901234002', brand: 'MediLife', category: 'Capsules', description: 'Antibiotic capsules', price: 320, costPrice: 220, stock: 200, reorderLevel: 30, mfgDate: '2025-03-01', expDate: '2027-03-01' },
  { id: '3', name: 'Cough Syrup 100ml', barcode: '8901234003', brand: 'HealthPlus', category: 'Syrups', description: 'Cough suppressant syrup', price: 450, costPrice: 300, stock: 150, reorderLevel: 20, mfgDate: '2025-02-10', expDate: '2026-08-10' },
  { id: '4', name: 'Vitamin C 1000mg', barcode: '8901234004', brand: 'VitaMax', category: 'Supplements', description: 'Vitamin C supplement', price: 280, costPrice: 180, stock: 350, reorderLevel: 40, mfgDate: '2025-04-01', expDate: '2027-04-01' },
  { id: '5', name: 'Ibuprofen 400mg', barcode: '8901234005', brand: 'CureAll', category: 'Tablets', description: 'Anti-inflammatory', price: 200, costPrice: 130, stock: 400, reorderLevel: 50, mfgDate: '2025-01-20', expDate: '2027-06-20' },
  { id: '6', name: 'Eye Drops 10ml', barcode: '8901234006', brand: 'BioGen', category: 'Drops', description: 'Lubricating eye drops', price: 380, costPrice: 250, stock: 100, reorderLevel: 15, mfgDate: '2025-05-01', expDate: '2026-05-01' },
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
];

let invoiceCounter = 2;
export const nextInvoiceNumber = () => `INV-${String(++invoiceCounter).padStart(4, '0')}`;

let grnCounter = 1;
export const nextGRNNumber = () => `GRN-${String(++grnCounter).padStart(4, '0')}`;
