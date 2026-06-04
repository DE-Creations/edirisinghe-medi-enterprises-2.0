import React, { useState, useEffect } from 'react';
import { Bell, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface OverdueInvoice {
    id:             number;
    invoice_number: string;
    invoice_date:   string;
    customer:       string;
    outstanding:    number;
    days_overdue:   number;
    status:         string;
}

interface NotifResponse {
    data:         OverdueInvoice[];
    total:        number;
    current_page: number;
    last_page:    number;
}

export default function NotificationBell() {
    const [open,    setOpen]    = useState(false);
    const [page,    setPage]    = useState(1);
    const [data,    setData]    = useState<NotifResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetch = async (p: number) => {
        setLoading(true);
        try {
            const res = await axios.get('/notifications/overdue-invoices', { params: { page: p } });
            setData(res.data);
            setPage(p);
        } catch { /* silent */ } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch(1);
        const id = setInterval(() => fetch(1), 5 * 60 * 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => { if (open) fetch(1); }, [open]);

    const count = data?.total ?? 0;
    const badge = count > 99 ? '99+' : count > 0 ? String(count) : null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="relative p-1.5 rounded-lg hover:bg-accent transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {badge && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center leading-none">
                            {badge}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-semibold">Overdue Invoices</span>
                        {count > 0 && (
                            <span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full font-medium">
                                {count}
                            </span>
                        )}
                    </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : !data || data.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                            <Bell className="h-8 w-8 opacity-30" />
                            <p className="text-sm">No overdue invoices</p>
                        </div>
                    ) : (
                        data.data.map((inv) => (
                            <div key={inv.id} className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold font-mono text-primary truncate">{inv.invoice_number}</p>
                                        <p className="text-xs text-muted-foreground truncate">{inv.customer}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{inv.invoice_date}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs font-bold text-destructive">Rs. {Number(inv.outstanding).toLocaleString()}</p>
                                        <p className="text-[10px] text-destructive/70">{inv.days_overdue}d overdue</p>
                                        <span className={`text-[10px] capitalize px-1.5 py-0.5 rounded-full ${inv.status === 'partial' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {data && data.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
                            disabled={page <= 1 || loading}
                            onClick={() => fetch(page - 1)}>
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            Page {data.current_page} of {data.last_page}
                        </span>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
                            disabled={page >= data.last_page || loading}
                            onClick={() => fetch(page + 1)}>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
