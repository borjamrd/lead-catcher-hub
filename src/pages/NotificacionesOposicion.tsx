
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface URL {
  id: string;
  name: string;
  url: string;
}

interface FormData {
  email: string;
}

const NotificacionesOposicion = () => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const { data, error } = await supabase
        .from('urls')
        .select('*');

      if (error) throw error;
      setUrls(data || []);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load URLs. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleUrlToggle = (urlId: string) => {
    setSelectedUrls(prev => {
      if (prev.includes(urlId)) {
        return prev.filter(id => id !== urlId);
      }
      return [...prev, urlId];
    });
  };

  const onSubmit = async (data: FormData) => {
    if (selectedUrls.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            email: data.email,
            selected_urls: selectedUrls,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Thank you for your submission.',
      });
      
      // Reset form
      setSelectedUrls([]);
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Resources</h1>
          <p className="mt-2 text-gray-600">Select the URLs you're interested in and enter your email to receive them.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md">
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
            {urls.map((url) => (
              <div key={url.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <Checkbox
                  id={url.id}
                  checked={selectedUrls.includes(url.id)}
                  onCheckedChange={() => handleUrlToggle(url.id)}
                />
                <label htmlFor={url.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                  <Link className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{url.name}</p>
                    <p className="text-sm text-gray-500">{url.url}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || selectedUrls.length === 0}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificacionesOposicion;
