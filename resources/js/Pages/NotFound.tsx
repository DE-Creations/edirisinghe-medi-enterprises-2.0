import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function NotFound() {
  const { url } = usePage();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', url);
  }, [url]);

  return (
    <>
      <Head title="Not Found" />
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <p className="mb-6 text-sm text-muted-foreground">{url}</p>
          <Link href="/invoice" className="text-primary underline hover:text-primary/90">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
}
