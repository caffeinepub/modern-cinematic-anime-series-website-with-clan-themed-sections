import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { AdminDashboardView } from './AdminDashboardView';
import { LoginButton } from '../auth/LoginButton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ShieldAlert, LogIn } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function AdminAccessGate() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  // Show loading state while initializing
  if (isInitializing || (identity && isCheckingAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <LogIn className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Please sign in to access the admin dashboard
            </p>
          </div>
          <div className="flex justify-center">
            <LoginButton />
          </div>
          <button
            onClick={() => window.location.hash = ''}
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to main site
          </button>
        </div>
      </div>
    );
  }

  // Authenticated but not admin - show unauthorized message
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Alert variant="destructive">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle>Unauthorized</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin dashboard. Only administrators can manage content.
            </AlertDescription>
          </Alert>
          <button
            onClick={() => window.location.hash = ''}
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to main site
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and admin - show dashboard
  return <AdminDashboardView />;
}
