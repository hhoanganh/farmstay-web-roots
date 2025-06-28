
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to backend endpoint
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-[hsl(var(--background-primary))] p-8 rounded-lg border border-[hsl(var(--stone))] border-opacity-20 shadow-sm">
      <h2 
        className="text-3xl mb-6 text-[hsl(var(--text-accent))]"
        style={{ fontFamily: 'Caveat, cursive' }}
      >
        Send us a Message
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label 
            htmlFor="name" 
            className="text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Your Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 min-h-[44px] focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2"
            placeholder="How should we address you?"
          />
        </div>

        <div>
          <Label 
            htmlFor="email" 
            className="text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 min-h-[44px] focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label 
            htmlFor="message" 
            className="text-[hsl(var(--text-primary))]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Your Message
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="mt-2 focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2"
            placeholder="Tell us what's on your mind..."
          />
        </div>

        <Button 
          type="submit"
          className="w-full min-h-[44px] bg-[hsl(var(--brown))] hover:bg-[hsl(var(--brown))]/90 text-[hsl(var(--paper))] focus:ring-2 focus:ring-[hsl(var(--focus))] focus:ring-offset-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
