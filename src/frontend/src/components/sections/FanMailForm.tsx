import { useState } from 'react';
import { Mail, Heart, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitFanMail } from '../../hooks/useQueries';

export function FanMailForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = useSubmitFanMail();

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
        email: email.trim(),
        message: message.trim(),
      });

      // Reset form and show success
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit fan mail:', error);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10 shadow-glow hover:shadow-glow-lg transition-all duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Fan Mail</h3>
      </div>

      {/* Introduction */}
      <div className="mb-8 space-y-4">
        <p className="text-lg text-foreground leading-relaxed">
          Share your love for <span className="font-semibold text-primary">Whispers Of The White Moon</span>! 
          We'd love to hear your thoughts, ideas, and appreciation.
        </p>
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <p className="text-sm text-foreground/90">
            <span className="font-semibold text-primary">✨ Note:</span> Respectful and positive messages 
            may be highlighted and shared with the team. Let's build a supportive community together!
          </p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Alert className="mb-6 bg-accent/10 border-accent/30">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <AlertDescription className="text-foreground">
            <span className="font-semibold">Thank you!</span> Your message has been sent successfully. 
            We appreciate your support!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {submitMutation.isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Failed to send your message. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fan-name" className="text-foreground font-semibold">
            Username or Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fan-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="Your name or username"
            className={`bg-background/50 border-border focus:border-primary transition-colors ${
              errors.name ? 'border-destructive' : ''
            }`}
            disabled={submitMutation.isPending}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email/Social Field */}
        <div className="space-y-2">
          <Label htmlFor="fan-contact" className="text-foreground font-semibold">
            Optional Email or Social Media
          </Label>
          <Input
            id="fan-contact"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com or @username"
            className="bg-background/50 border-border focus:border-primary transition-colors"
            disabled={submitMutation.isPending}
          />
          <p className="text-xs text-muted-foreground">
            Optional: Share your email or social handle if you'd like us to reach out
          </p>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="fan-message" className="text-foreground font-semibold">
            Your Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="fan-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors({ ...errors, message: undefined });
            }}
            placeholder="Share your thoughts, ideas, or appreciation for the project..."
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
              <Mail className="w-5 h-5 mr-2 animate-pulse" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Fan Mail
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
