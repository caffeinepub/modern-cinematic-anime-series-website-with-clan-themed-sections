import { useState } from 'react';
import { Users, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitCollaboration } from '../../hooks/useQueries';

export function CollaborationForm() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = useSubmitCollaboration();

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
      console.error('Failed to submit collaboration request:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <Alert className="bg-accent/10 border-accent/30">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <AlertDescription className="text-foreground">
            <span className="font-semibold">Thank you!</span> Your collaboration request has been sent successfully. 
            We'll review your submission and get back to you soon!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {submitMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to send your collaboration request. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="collab-name" className="text-foreground font-semibold">
            Your Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="collab-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="Your full name"
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
          <Label htmlFor="collab-email" className="text-foreground font-semibold">
            Email
          </Label>
          <Input
            id="collab-email"
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
          <Label htmlFor="collab-social" className="text-foreground font-semibold">
            Optional Social Media Links
          </Label>
          <Input
            id="collab-social"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Twitter, Instagram, Discord, etc."
            className="bg-background/50 border-border focus:border-primary transition-colors"
            disabled={submitMutation.isPending}
          />
          <p className="text-xs text-muted-foreground">
            Share your portfolio, social media, or relevant links
          </p>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="collab-message" className="text-foreground font-semibold">
            Your Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="collab-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors({ ...errors, message: undefined });
            }}
            placeholder="Tell us about your skills, experience, and how you'd like to contribute to the project..."
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
          className="w-full bg-accent hover:bg-accent/90 text-background font-semibold py-6 rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-300"
        >
          {submitMutation.isPending ? (
            <>
              <Users className="w-5 h-5 mr-2 animate-pulse" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Collaboration Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
