import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { AdminDashboardView } from './AdminDashboardView';
import { LoginButton } from '../auth/LoginButton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { ShieldAlert, LogIn, Copy, Check } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useState } from 'react';

export function AdminAccessGate() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();
  const [copied, setCopied] = useState(false);

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

  // Authenticated but not admin - show unauthorized message with Principal ID
  if (!isAdmin) {
    const principalId = identity.getPrincipal().toString();

    const handleCopyPrincipal = async () => {
      try {
        await navigator.clipboard.writeText(principalId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-6">
          <Alert variant="destructive">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle>Unauthorized Access</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin dashboard. Only administrators can manage content.
            </AlertDescription>
          </Alert>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Request Admin Access</h3>
              <p className="text-sm text-muted-foreground">
                Admin access is granted using your Internet Identity Principal ID. To request access, share your Principal ID below with the site creator or administrator.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Principal ID</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted rounded-md p-3 border border-border">
                  <code className="text-xs font-mono break-all select-all">
                    {principalId}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPrincipal}
                  className="shrink-0"
                  title="Copy Principal ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-500">
                  Principal ID copied to clipboard!
                </p>
              )}
            </div>

            <div className="bg-muted/50 rounded-md p-4 space-y-2">
              <p className="text-sm font-medium">How to get admin access:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Copy your Principal ID using the button above</li>
                <li>Send it to the site creator or administrator</li>
                <li>They will grant you admin access from the Team Members panel</li>
                <li>Refresh this page after access is granted</li>
              </ol>
            </div>
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

  // Authenticated and admin - show dashboard
  return <AdminDashboardView />;
}
