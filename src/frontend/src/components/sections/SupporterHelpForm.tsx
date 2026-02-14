import { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitSupporterHelp } from '../../hooks/useQueries';

export function SupporterHelpForm() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = useSubmitSupporterHelp();

  const validateForm = () => {
    const newErrors: { name?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      await submitMutation.mutateAsync({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        subject: 'Supporter Help Request',
        product: 'Donation Reward',
        serial: '',
        message: message.trim(),
      });

      // Reset form and show success
      setName('');
      setCompany('');
      setEmail('');
      setMessage('');
      setErrors({});
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit supporter help request:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <Alert className="bg-accent/10 border-accent/30">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <AlertDescription className="text-foreground">
            <span className="font-semibold">Thank you!</span> Your support request has been sent successfully. 
            We'll work to resolve your issue as quickly as possible!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {submitMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to send your support request. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="support-name" className="text-foreground font-semibold">
            Your Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="support-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="Your full name or Cash App username"
            className={`bg-background/50 border-border focus:border-primary transition-colors ${
              errors.name ? 'border-destructive' : ''
            }`}
            disabled={submitMutation.isPending}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="support-email" className="text-foreground font-semibold">
            Email
          </Label>
          <Input
            id="support-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="bg-background/50 border-border focus:border-primary transition-colors"
            disabled={submitMutation.isPending}
          />
        </div>

        {/* Optional Social Media Links */}
        <div className="space-y-2">
          <Label htmlFor="support-social" className="text-foreground font-semibold">
            Optional Social Media Links
          </Label>
          <Input
            id="support-social"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Twitter, Instagram, Discord, etc."
            className="bg-background/50 border-border focus:border-primary transition-colors"
            disabled={submitMutation.isPending}
          />
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="support-message" className="text-foreground font-semibold">
            Your Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="support-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors({ ...errors, message: undefined });
            }}
            placeholder="Please describe your issue: donation amount, tier, and what reward you're missing..."
            rows={6}
            className={`bg-background/50 border-border focus:border-primary transition-colors resize-none ${
              errors.message ? 'border-destructive' : ''
            }`}
            disabled={submitMutation.isPending}
          />
          {errors.message && (
            <p className="text-sm text-destructive">{errors.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Minimum 10 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={submitMutation.isPending}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold py-6 rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-300"
        >
          {submitMutation.isPending ? (
            <>
              <AlertTriangle className="w-5 h-5 mr-2 animate-pulse" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Support Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
