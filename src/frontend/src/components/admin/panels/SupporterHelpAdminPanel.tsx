import { useState } from 'react';
import { AlertTriangle, Clock, User, Mail, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { useGetAllSupportRequests } from '../../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { ScrollArea } from '../../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { SupportRequest } from '../../../backend';

export function SupporterHelpAdminPanel() {
  const { data: supportRequests, isLoading, error } = useGetAllSupportRequests();
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  const handleOpenRequest = (request: SupportRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseDialog = () => {
    setSelectedRequest(null);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMessagePreview = (message: string) => {
    return message.length > 100 ? message.substring(0, 100) + '...' : message;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load supporter help requests. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const sortedRequests = [...(supportRequests || [])].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Supporter Help Requests</h3>
          <p className="text-sm text-muted-foreground">
            {sortedRequests.length} {sortedRequests.length === 1 ? 'request' : 'requests'} received
          </p>
        </div>
      </div>

      {sortedRequests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No supporter help requests yet. Requests from supporters will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {sortedRequests.map((request) => (
              <Card
                key={Number(request.id)}
                className="cursor-pointer hover:shadow-glow-sm transition-all duration-300 border-border bg-card/50"
                onClick={() => handleOpenRequest(request)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="w-4 h-4 text-destructive flex-shrink-0" />
                        <span className="truncate">{request.name}</span>
                      </CardTitle>
                      {request.email && (
                        <CardDescription className="text-xs mt-1 truncate">
                          {request.email}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatDate(request.timestamp)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-foreground/80 line-clamp-2">
                    {getMessagePreview(request.message)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Supporter Help Request from {selectedRequest?.name}
            </DialogTitle>
            <DialogDescription>
              Received on {selectedRequest && formatDate(selectedRequest.timestamp)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Sender Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">Name:</span>
                <span>{selectedRequest?.name}</span>
              </div>
              {selectedRequest?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Email:</span>
                  <span>{selectedRequest.email}</span>
                </div>
              )}
              {selectedRequest?.company && (
                <div className="flex items-center gap-2 text-sm">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Social Media / Links:</span>
                  <span>{selectedRequest.company}</span>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message:
              </h4>
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {selectedRequest?.message}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleCloseDialog}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
