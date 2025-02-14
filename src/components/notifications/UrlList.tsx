
import { useState } from 'react';
import { Link } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface URL {
  id: string;
  name: string;
  url: string;
}

interface UrlListProps {
  urls: URL[];
  selectedUrls: string[];
  isLoading: boolean;
  onUrlToggle: (urlId: string) => void;
}

const UrlList = ({ urls, selectedUrls, isLoading, onUrlToggle }: UrlListProps) => {
  const [displayCount, setDisplayCount] = useState(4);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (urls.length === 0) {
    return <p className="text-center text-gray-500 py-4">No hay URLs disponibles en este momento.</p>;
  }

  const displayedUrls = urls.slice(0, displayCount);
  const hasMore = displayCount < urls.length;

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[250px] w-full rounded-md border p-4">
        {displayedUrls.map((url) => (
          <div key={url.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <Checkbox
              id={url.id}
              checked={selectedUrls.includes(url.id)}
              onCheckedChange={() => onUrlToggle(url.id)}
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
      </ScrollArea>
      
      {hasMore && (
        <button
          onClick={() => setDisplayCount(prev => prev + 4)}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Cargar más URLs
        </button>
      )}
    </div>
  );
};

export default UrlList;
