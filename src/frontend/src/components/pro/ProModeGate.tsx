import { ReactNode, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';

interface ProModeGateProps {
  children: ReactNode;
}

export function ProModeGate({ children }: ProModeGateProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoading = isInitializing || isAdminLoading;

  useEffect(() => {
    // Only redirect after we've finished loading and have a definitive answer
    if (isFetched && !isLoading) {
      if (!isAuthenticated || !isAdmin) {
        window.location.hash = '';
      }
    }
  }, [isFetched, isLoading, isAuthenticated, isAdmin]);

  // Show nothing while checking authorization
  if (isLoading || !isFetched) {
    return null;
  }

  // Only render children if authenticated and admin
  if (isAuthenticated && isAdmin) {
    return <>{children}</>;
  }

  return null;
}
