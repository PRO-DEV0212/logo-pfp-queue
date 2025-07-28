
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Clock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RequestForm } from '@/components/RequestForm';

interface Request {
  id: string;
  name: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: "Error",
          description: "Failed to load requests",
          variant: "destructive",
        });
      } else {
        setRequests((data || []) as Request[]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    if (password === 'youtube0212') {
      setShowPasswordModal(false);
      setShowForm(true);
      setPassword('');
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  const handleRequestSubmitted = () => {
    setShowForm(false);
    fetchRequests();
    toast({
      title: "Success",
      description: "Your request has been submitted successfully!",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1">
          {getStatusIcon(status)}
          Pending
        </Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="flex items-center gap-1 text-orange-600 border-orange-600">
          {getStatusIcon(status)}
          In Progress
        </Badge>;
      case 'completed':
        return <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600">
          {getStatusIcon(status)}
          Completed
        </Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-l-gray-400';
      case 'in_progress':
        return 'border-l-orange-400';
      case 'completed':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Logo/PFP Request Queue
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Submit your logo or profile picture requests and track their progress. 
            Our team will work on them in the order they were received.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={handleSubmitRequest}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Submit New Request
          </Button>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Enter Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      placeholder="Enter password to submit request"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePasswordSubmit} className="flex-1">
                    Submit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Request Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <RequestForm
                onSubmit={handleRequestSubmitted}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Request List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Clock className="w-12 h-12 mx-auto mb-2" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests yet</h3>
                <p className="text-muted-foreground">Be the first to submit a request!</p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request, index) => (
              <Card key={request.id} className={`border-l-4 ${getStatusColor(request.status)} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardTitle className="text-lg">{request.name}</CardTitle>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>Submitted</div>
                      <div>{new Date(request.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-muted-foreground">
            Requests are processed in the order they were received
          </p>
          <p className="text-sm text-muted-foreground">
            Produced by{' '}
            <a 
              href="https://www.youtube.com/@LiFTE_mc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              LiFTE
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
