import { useState } from 'react';
import { useListTeamMembers, useGrantRole, useRevokeRole, useIsCallerAdmin } from '../../../hooks/useQueries';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Plus, Shield, ShieldAlert, AlertCircle, Users, Trash2, Info } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../../../backend';

export function TeamAdminPanel() {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: teamMembers = [], isLoading, error } = useListTeamMembers();
  const grantRoleMutation = useGrantRole();
  const revokeRoleMutation = useRevokeRole();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    principal: '',
    role: 'user' as UserRole,
  });
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({
      principal: '',
      role: 'user' as UserRole,
    });
    setFormError('');
  };

  const handleGrantRole = async () => {
    if (!formData.principal.trim()) {
      setFormError('Principal ID is required');
      return;
    }

    try {
      const principal = Principal.fromText(formData.principal);
      await grantRoleMutation.mutateAsync({
        principal,
        role: formData.role,
      });

      setIsAddOpen(false);
      resetForm();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to grant role';
      if (errorMsg.includes('Unauthorized')) {
        setFormError('You do not have permission to grant roles');
      } else if (errorMsg.includes('Invalid principal')) {
        setFormError('Invalid principal ID format');
      } else {
        setFormError(errorMsg);
      }
    }
  };

  const handleRevokeRole = async (principal: Principal) => {
    if (!confirm('Are you sure you want to revoke this user\'s role? They will become a guest.')) return;

    try {
      await revokeRoleMutation.mutateAsync(principal);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to revoke role';
      if (errorMsg.includes('Unauthorized')) {
        alert('You do not have permission to revoke roles');
      } else {
        alert(errorMsg);
      }
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-primary" />;
      case 'user':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'user':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Show unauthorized message if not admin
  if (isAdmin === false) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          You do not have permission to manage team members. Only the creator can access this section.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load team members. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Roles are granted using Internet Identity Principal IDs, not email addresses. 
          When someone requests admin access (e.g., "give admin to email@example.com"), ask them to log in and share their Principal ID from the unauthorized screen.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage user roles and permissions by Principal ID
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Grant a role to a user using their Internet Identity Principal ID
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="principal">Principal ID *</Label>
                <Input
                  id="principal"
                  value={formData.principal}
                  onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                  placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  The user's Internet Identity Principal ID (not their email). Users can find this on the unauthorized admin screen after logging in.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full access to all content and settings</SelectItem>
                    <SelectItem value="user">User - Limited access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={grantRoleMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGrantRole}
                disabled={grantRoleMutation.isPending}
              >
                {grantRoleMutation.isPending ? 'Adding...' : 'Add Member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members List */}
      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No team members yet. Add members by their Principal ID to grant them access.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {teamMembers.map(([principal, role]) => (
            <Card key={principal.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      <CardTitle className="text-base">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(role)}`}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                      </CardTitle>
                    </div>
                    <CardDescription className="font-mono text-xs break-all">
                      {principal.toString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeRole(principal)}
                    disabled={revokeRoleMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
