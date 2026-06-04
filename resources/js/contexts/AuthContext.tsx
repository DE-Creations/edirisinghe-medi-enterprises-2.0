// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// export type UserRole = 'owner' | 'admin' | 'cashier';

// export interface User {
//   id: string;
//   username: string;
//   name: string;
//   role: UserRole;
//   avatar?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (username: string, password: string) => boolean;
//   logout: () => void;
//   isAuthenticated: boolean;
//   bootstrapped: boolean;
// }

// const AUTH_STORAGE_KEY = 'pharmapos-auth-user';
// const AuthContext = createContext<AuthContextType | null>(null);

// const mockUsers: Record<string, { password: string; user: User }> = {
//   owner: {
//     password: '123456',
//     user: { id: '1', username: 'owner', name: 'Dr. Sarah Chen', role: 'owner' },
//   },
//   admin: {
//     password: '123456',
//     user: { id: '2', username: 'admin', name: 'James Wilson', role: 'admin' },
//   },
//   cashier: {
//     password: '123456',
//     user: { id: '3', username: 'cashier', name: 'Emily Davis', role: 'cashier' },
//   },
// };

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [bootstrapped, setBootstrapped] = useState(false);

//   useEffect(() => {
//     const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
//     if (saved) {
//       try {
//         setUser(JSON.parse(saved));
//       } catch {
//         window.localStorage.removeItem(AUTH_STORAGE_KEY);
//       }
//     }
//     setBootstrapped(true);
//   }, []);

//   const login = (username: string, password: string) => {
//     const entry = mockUsers[username];
//     if (entry && entry.password === password) {
//       setUser(entry.user);
//       window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(entry.user));
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     window.localStorage.removeItem(AUTH_STORAGE_KEY);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, bootstrapped }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }

// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import axios from 'axios';

// export type UserRole = 'owner' | 'admin' | 'cashier';

// export interface User {
//     id:          number;   // ✅ number not string
//     user_name:   string;
//     name:        string;
//     role:        UserRole;
//     designation: string | null;
//     status:      number;
// }

// interface AuthContextType {
//     user:            User | null;
//     login:           (username: string, password: string) => Promise<boolean>;
//     logout:          () => void;
//     isAuthenticated: boolean;
//     bootstrapped:    boolean;
// }

// const TOKEN_KEY = 'pharmapos-auth-token';
// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//     const [user,         setUser]         = useState<User | null>(null);
//     const [bootstrapped, setBootstrapped] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem(TOKEN_KEY);
//         if (token) {
//             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//             axios.get('/me')
//                 .then((res) => setUser(res.data))
//                 .catch(() => {
//                     localStorage.removeItem(TOKEN_KEY);
//                     delete axios.defaults.headers.common['Authorization'];
//                 })
//                 .finally(() => setBootstrapped(true));
//         } else {
//             setBootstrapped(true);
//         }
//     }, []);

//     // ✅ Real API login
//     const login = async (username: string, password: string): Promise<boolean> => {
//         try {
//             const res = await axios.post('/login', {
//                 user_name: username,
//                 password:  password,
//             });
//             const token = res.data.token;
//             localStorage.setItem(TOKEN_KEY, token);
//             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//             setUser(res.data.user);
//             return true;
//         } catch {
//             return false;
//         }
//     };

//     const logout = () => {
//         axios.post('/logout').finally(() => {
//             localStorage.removeItem(TOKEN_KEY);
//             delete axios.defaults.headers.common['Authorization'];
//             setUser(null);
//         });
//     };

//     return (
//         <AuthContext.Provider value={{
//             user,
//             login,
//             logout,
//             isAuthenticated: !!user,
//             bootstrapped,
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const ctx = useContext(AuthContext);
//     if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//     return ctx;
// }

// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import axios from 'axios';
// import { flushSync } from 'react-dom';

// export type UserRole = 'owner' | 'admin' | 'cashier';

// export interface User {
//     id:          number;
//     user_name:   string;
//     name:        string;
//     role:        UserRole;
//     designation: string | null;
//     status:      number;
// }

// interface AuthContextType {
//     user:            User | null;
//     login:           (username: string, password: string) => Promise<boolean>;
//     logout:          () => void;
//     isAuthenticated: boolean;
//     bootstrapped:    boolean;
// }

// const TOKEN_KEY = 'pharmapos-auth-token';
// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//     const [user,         setUser]         = useState<User | null>(null);
//     const [bootstrapped, setBootstrapped] = useState(false);

// //     useEffect(() => {
// //     const token = localStorage.getItem(TOKEN_KEY);
// //     console.log('AuthContext init - token exists:', !!token); // ← ADD

// //     if (token) {
// //         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// //         axios.get('/me')
// //             .then((res) => {
// //                 console.log('GET /me success:', res.data.name); // ← ADD
// //                 setUser(res.data);
// //             })
// //             .catch((err) => {
// //                 console.log('GET /me failed:', err.response?.status); // ← ADD
// //                 localStorage.removeItem(TOKEN_KEY);
// //                 delete axios.defaults.headers.common['Authorization'];
// //             })
// //             .finally(() => {
// //                 console.log('bootstrapped = true'); // ← ADD
// //                 setBootstrapped(true);
// //             });
// //     } else {
// //         console.log('No token - bootstrapped = true'); // ← ADD
// //         setBootstrapped(true);
// //     }
// // }, []);

//     // useEffect(() => {
//     //     const token = localStorage.getItem(TOKEN_KEY);
//     //     if (token) {
//     //         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//     //         axios.get('/me')
//     //             .then((res) => {
//     //                 setUser(res.data);
//     //             })
//     //             .catch(() => {
//     //                 localStorage.removeItem(TOKEN_KEY);
//     //                 delete axios.defaults.headers.common['Authorization'];
//     //             })
//     //             .finally(() => {
//     //                 setBootstrapped(true); 
//     //             });
//     //     } else {
//     //         setBootstrapped(true); 
//     //     }
//     // }, []);

//     useEffect(() => {
//     const token = localStorage.getItem(TOKEN_KEY);

//     if (token) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         axios.get('/me')
//             .then((res) => {
//                                // ✅ Set both together atomically
//                 flushSync(() => {
//                     setUser(res.data);
//                     setBootstrapped(true);
//                 });      // ✅ set user first
//             })
//             .catch(() => {
//                 localStorage.removeItem(TOKEN_KEY);
//                 delete axios.defaults.headers.common['Authorization'];
//                                flushSync(() => {
//                     setBootstrapped(true);
//                 });
//             });
//             // .finally(() => {
//             //     setBootstrapped(true);   // ✅ then bootstrapped
//             // });
//     } else {
//         setBootstrapped(true);
//     }
// }, []);

//     const login = async (username: string, password: string): Promise<boolean> => {
//         try {
//             const res = await axios.post('/login', {
//                 user_name: username,
//                 password:  password,
//             });

//             const token = res.data.token;
//             localStorage.setItem(TOKEN_KEY, token);
//             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//             setUser(res.data.user);
//             return true;
//         } catch {
//             return false;
//         }
//     };

//     const logout = () => {
//         axios.post('/logout').finally(() => {
//             localStorage.removeItem(TOKEN_KEY);
//             delete axios.defaults.headers.common['Authorization'];
//             setUser(null);
//         });
//     };

//     return (
//         <AuthContext.Provider value={{
//             user,
//             login,
//             logout,
//             isAuthenticated: !!user,
//             bootstrapped,
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const ctx = useContext(AuthContext);
//     if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//     return ctx;
// }

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export type UserRole = 'owner' | 'admin' | 'cashier';

export interface User {
    id: number;
    user_name: string;
    name: string;
    role: UserRole;
    designation: string | null;
    status: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    bootstrapped: boolean;
    logout: () => void;
    login: (username: string, password: string) => Promise<boolean>;
}

interface AuthProviderProps {
    auth?: {
        user?: User | null;
    };
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ auth, children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(auth?.user ?? null);

    useEffect(() => {
        // AuthProvider is outside the Inertia <App> tree, so it receives auth only
        // from the initial page (login page → user is null). Subscribe to Inertia
        // navigation events to sync user state after every page visit, including
        // the redirect that fires immediately after a successful login.
        const removeListener = router.on('navigate', (event) => {
            const pageAuth = (event.detail.page.props as any)?.auth;
            setUser(pageAuth?.user ?? null);
        });
        return removeListener;
    }, []);

    const login = async (_username: string, _password: string): Promise<boolean> => true;

    const logout = async () => {
        try {
            await axios.post('/logout');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            bootstrapped: true,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
