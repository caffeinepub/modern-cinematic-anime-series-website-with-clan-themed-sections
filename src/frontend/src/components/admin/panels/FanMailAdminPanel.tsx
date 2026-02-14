import { useState } from 'react';
import { Mail, MessageSquare, Clock, User, Send, CheckCircle2 } from 'lucide-react';
import { useGetAllFanMail, useReplyToFanMail } from '../../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Alert, AlertDescription } from '../../ui/alert';
import { Skeleton } from '../../ui/skeleton';
import { ScrollArea } from '../../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { FanMailMessage } from '../../../backend';

export function FanMailAdminPanel() {
  const { data: fanMails, isLoading, error } = useGetAllFanMail();
  const replyMutation = useReplyToFanMail();

  const [selectedMessage, setSelectedMessage] = useState<FanMailMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpenMessage = (message: FanMailMessage) => {
    setSelectedMessage(message);
    setReplyText(message.adminReply || '');
    setShowSuccess(false);
  };

  const handleCloseDialog = () => {
    setSelectedMessage(null);
    setReplyText('');
    setShowSuccess(false);
  };

  const handleSubmitReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      await replyMutation.mutateAsync({
        id: selectedMessage.id,
        reply: replyText.trim(),
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
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
          Failed to load fan mail messages. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const sortedMails = [...(fanMails || [])].sort((a, b) => Number(b.submittedAt - a.submittedAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Fan Mail Messages</h3>
          <p className="text-sm text-muted-foreground">
            {sortedMails.length} {sortedMails.length === 1 ? 'message' : 'messages'} received
          </p>
        </div>
      </div>

      {sortedMails.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No fan mail messages yet. Messages from fans will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {sortedMails.map((mail) => (
              <Card
                key={Number(mail.id)}
                className="cursor-pointer hover:shadow-glow-sm transition-all duration-300 border-border bg-card/50"
                onClick={() => handleOpenMessage(mail)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="truncate">{mail.senderName}</span>
                      </CardTitle>
                      {mail.senderEmail && (
                        <CardDescription className="text-xs mt-1 truncate">
                          {mail.senderEmail}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatDate(mail.submittedAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                    {getMessagePreview(mail.message)}
                  </p>
                  <div className="flex items-center gap-2">
                    {mail.adminReply ? (
                      <div className="flex items-center gap-1.5 text-xs text-accent">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-medium">Replied</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>No reply yet</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Fan Mail from {selectedMessage?.senderName}
            </DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && formatDate(selectedMessage.submittedAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Sender Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">Name:</span>
                <span>{selectedMessage?.senderName}</span>
              </div>
              {selectedMessage?.senderEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Contact:</span>
                  <span>{selectedMessage.senderEmail}</span>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Message:</h4>
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {selectedMessage?.message}
                </p>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <Alert className="bg-accent/10 border-accent/30">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <AlertDescription className="text-foreground">
                  Reply saved successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {replyMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to save reply. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Reply Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Admin Reply:</h4>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply to this fan mail message..."
                rows={6}
                className="resize-none bg-background/50 border-border focus:border-primary"
                disabled={replyMutation.isPending}
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={replyMutation.isPending}
                >
                  Close
                </Button>
                <Button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || replyMutation.isPending}
                  className="bg-accent hover:bg-accent/90"
                >
                  {replyMutation.isPending ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-pulse" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {selectedMessage?.adminReply ? 'Update Reply' : 'Send Reply'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
