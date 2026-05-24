// import React, { useEffect } from "react";
// import { router, usePage } from "@inertiajs/react";
// import AppLayout from "@/components/layout/AppLayout";
// import { useAuth } from "@/contexts/AuthContext";

// export default function AppShell({ children, guestOnly = false }: { children: React.ReactNode; guestOnly?: boolean }) {
//   const { isAuthenticated, bootstrapped } = useAuth();
//   const page = usePage();

//   useEffect(() => {
//     if (!bootstrapped) return;

//     if (guestOnly && isAuthenticated && page.url === "/login") {
//       router.visit("/invoice");
//       return;
//     }

//     if (!guestOnly && !isAuthenticated && page.url !== "/login") {
//       router.visit("/login");
//     }
//   }, [bootstrapped, guestOnly, isAuthenticated, page.url]);

//   if (!bootstrapped) return null;
//   if (guestOnly) return <>{children}</>;
//   if (!isAuthenticated) return null;

//   return <AppLayout>{children}</AppLayout>;
// }

// import React, { useEffect , useRef} from "react";
// import { router, usePage } from "@inertiajs/react";
// import AppLayout from "@/components/layout/AppLayout";
// import { useAuth } from "@/contexts/AuthContext";

// export default function AppShell({
//     children,
//     guestOnly = false
// }: {
//     children: React.ReactNode;
//     guestOnly?: boolean
// }) {
//     const { isAuthenticated, bootstrapped } = useAuth();
//     const page = usePage();
//     const redirected = useRef(false); 

//     //     useEffect(() => {
          
//     //     if (!bootstrapped) return;

//     //     if (guestOnly && isAuthenticated) {
//     //         router.visit('/invoice');
//     //         return;
//     //     }

//     //     if (!guestOnly && !isAuthenticated) {
//     //         const currentPath = page.url;
//     //         if (currentPath !== '/login') {
//     //             sessionStorage.setItem('redirect_after_login', currentPath);
//     //         }
//     //         router.visit('/login');
//     //     }
//     // }, [bootstrapped, isAuthenticated]); 

//     useEffect(() => {
//     //console.log('AppShell effect - bootstrapped:', bootstrapped, 'isAuthenticated:', isAuthenticated, 'url:', page.url); // ← ADD

//     if (!bootstrapped) return;

// if (redirected.current) return;

//         console.log('AppShell effect - bootstrapped:', bootstrapped,
//             'isAuthenticated:', isAuthenticated, 'url:', page.url);

//     if (guestOnly && isAuthenticated) {
//       redirected.current = true;
//         router.visit('/invoice');
//         return;
//     }

//     if (!guestOnly && !isAuthenticated) {
//       redirected.current = true;
//         const currentPath = page.url;
//         if (currentPath !== '/login') {
//             sessionStorage.setItem('redirect_after_login', currentPath);
//             console.log('Saved redirect path:', currentPath);
//         }
//         router.visit('/login');
//     }
// }, [bootstrapped, isAuthenticated]);

//     if (!bootstrapped) return null; 
//     if (guestOnly) return <>{children}</>;
//     if (!isAuthenticated) return null;

//     return <AppLayout>{children}</AppLayout>;
// }

// import React, { useEffect, useRef } from "react";
// import { router, usePage } from "@inertiajs/react";
// import AppLayout from "@/components/layout/AppLayout";
// import { useAuth } from "@/contexts/AuthContext";

// export default function AppShell({
//     children,
//     guestOnly = false
// }: {
//     children: React.ReactNode;
//     guestOnly?: boolean
// }) {
//     const { isAuthenticated, bootstrapped } = useAuth();
//     const page = usePage();
//     const hasRedirected = useRef(false);

//     useEffect(() => {
//         // ✅ CRITICAL: do nothing until auth check is complete
//         if (!bootstrapped) return;

//         // ✅ prevent StrictMode double-run
//         if (hasRedirected.current) return;

//         if (guestOnly && isAuthenticated) {
//             // On login page but already logged in
//             const savedPath = sessionStorage.getItem('redirect_after_login') || '/invoice';
//             sessionStorage.removeItem('redirect_after_login');
//             hasRedirected.current = true;
//             router.visit(savedPath);
//             return;
//         }

//         if (!guestOnly && !isAuthenticated) {
//             // On protected page but not logged in
//             // Save current page to return after login
//             if (page.url !== '/login') {
//                 sessionStorage.setItem('redirect_after_login', page.url);
//             }
//             hasRedirected.current = true;
//             router.visit('/login');
//         }

//     }, [bootstrapped, isAuthenticated]);

//     // ✅ Show nothing while checking auth - NO redirect here
//     if (!bootstrapped) return null;

//     // ✅ Guest page (login) - just show content
//     if (guestOnly) return <>{children}</>;

//     // ✅ Protected page but not authenticated - show nothing (redirect handled above)
//     if (!isAuthenticated) return null;

//     return <AppLayout>{children}</AppLayout>;
// }

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function AppShell({
    children,
    guestOnly = false
}: {
    children: React.ReactNode;
    guestOnly?: boolean
}) {
    const { isAuthenticated } = useAuth();

    // ✅ Laravel already redirected unauthenticated users
    // This component just handles layout

    if (guestOnly) return <>{children}</>;

    return <AppLayout>{children}</AppLayout>;
}
