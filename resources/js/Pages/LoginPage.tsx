// import React, { useEffect, useState } from 'react';
// import { Head, router } from '@inertiajs/react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Pill, Eye, EyeOff } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// export default function LoginPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPw, setShowPw] = useState(false);
//   const [remember, setRemember] = useState(false);
//   const [error, setError] = useState('');
//   const { login, isAuthenticated } = useAuth();

//   useEffect(() => {
//     if (isAuthenticated) {
//       router.visit('/invoice');
//     }
//   }, [isAuthenticated]);

//   // const handleLogin = (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setError('');

//   //   if (login(username, password)) {
//   //     router.visit('/invoice');
//   //   } else {
//   //     setError('Invalid username or password');
//   //   }
//   // };

//   // const handleLogin = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setError('');

//   //   const success = await login(username, password); 
//   //   if (success) {
//   //     router.visit('/invoice');
//   //   } else {
//   //     setError('Invalid username or password');
//   //   }
//   // };

//   const handleLogin = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setError('');

//       const success = await login(username, password);
//       if (success) {
//           const redirectTo = sessionStorage.getItem('redirect_after_login') || '/invoice';
//           sessionStorage.removeItem('redirect_after_login');
//           router.visit(redirectTo);
//       } else {
//           setError('Invalid username or password');
//       }
//   };

//   return (
//     <>
//       <Head title="Login" />
//       <div className="min-h-screen flex items-center justify-center bg-background p-4">
//         <div className="w-full max-w-md">
//           <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
//             <div className="flex flex-col items-center mb-8">
//               <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
//                 <Pill className="h-7 w-7 text-primary-foreground" />
//               </div>
//               <h1 className="text-xl font-bold">PharmaPOS</h1>
//               <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
//             </div>

//             {error && (
//               <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleLogin} className="space-y-4">
//               <div>
//                 <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Username</label>
//                 <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
//               </div>
//               <div>
//                 <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
//                 <div className="relative">
//                   <Input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
//                   <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
//                     {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="rounded border-border" />
//                   <span className="text-muted-foreground text-xs">Remember me</span>
//                 </label>
//                 <button type="button" className="text-xs text-primary hover:underline">Forgot Password?</button>
//               </div>

//               <Button type="submit" className="w-full">Sign In</Button>
//             </form>

//             <div className="mt-6 pt-4 border-t border-border">
//               <p className="text-[11px] text-muted-foreground text-center">
//                 Demo credentials: <span className="font-medium">owner</span>, <span className="font-medium">admin</span>, or <span className="font-medium">cashier</span> / password: <span className="font-medium">123456</span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Pill, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
    const [showPw, setShowPw] = useState(false);

    // ✅ Inertia useForm - handles CSRF, redirects, errors automatically
    const { data, setData, post, processing, errors } = useForm({
        user_name: '',
        password:  '',
        remember:  false,
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md">
                    <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
                                <Pill className="h-7 w-7 text-primary-foreground" />
                            </div>
                            <h1 className="text-xl font-bold">{(usePage().props as any).appName}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Sign in to your account
                            </p>
                        </div>

                        {/* ✅ Show Laravel validation errors */}
                        {errors.user_name && (
                            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                                {errors.user_name}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                    Username
                                </label>
                                <Input
                                    value={data.user_name}
                                    onChange={(e) => setData('user_name', e.target.value)}
                                    placeholder="Enter username"
                                    autoComplete="username" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPw ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter password"
                                        autoComplete="current-password" />
                                    <button type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-border" />
                                <span className="text-xs text-muted-foreground">Remember me</span>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}