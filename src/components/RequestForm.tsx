
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RequestFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const RequestForm = ({ onSubmit, onCancel }: RequestFormProps) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('requests')
        .insert([
          {
            name: name.trim(),
            content: content.trim(),
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Error submitting request:', error);
        toast({
          title: "Error",
          description: "Failed to submit request. Please try again.",
          variant: "destructive",
        });
      } else {
        onSubmit();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Submit New Request</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name or username"
              disabled={loading}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Request Details</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Please describe your logo/PFP request in detail. Include style preferences, colors, themes, or any specific requirements..."
              disabled={loading}
              className="mt-1 min-h-[120px]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
