import React, { useState } from 'react';
import axios from 'axios';
import { Search, X, Loader2 } from 'lucide-react';
import { Show } from '../types/show';
import { toast } from 'sonner';

interface AddShowModalProps {
  onClose: () => void;
  onAddShow: (show: Show) => Promise<void>;
}

export function AddShowModal({ onClose, onAddShow }: AddShowModalProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const searchShows = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
      setResults(response.data.map((item: any) => item.show));
    } catch (error) {
      console.error('Error searching shows:', error);
      toast.error('Failed to search shows. Please try again.');
    }
    setLoading(false);
  };

  const handleAddShow = async (show: Show) => {
    if (adding) return;
    setAdding(true);
    try {
      await onAddShow(show);
      toast.success(`"${show.name}" has been added to your shows!`);
      onClose();
    } catch (error) {
      console.error('Error adding show:', error);
      toast.error('Failed to add show. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-800 shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-100">Add New Show</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchShows(search)}
              placeholder="Search for a TV show..."
              className="w-full px-4 py-3 pr-10 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500 transition-colors"
            />
            <button
              onClick={() => searchShows(search)}
              disabled={loading || !search}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2" />
              Searching...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((show) => (
                <div
                  key={show.id}
                  onClick={() => handleAddShow(show)}
                  className={`flex gap-4 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 transition-colors group ${
                    adding ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <img
                    src={show.image?.medium || 'https://via.placeholder.com/100x140'}
                    alt={show.name}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">
                      {show.name}
                    </h3>
                    <p 
                      className="text-sm text-gray-400 line-clamp-3 mt-1"
                      dangerouslySetInnerHTML={{ 
                        __html: show.summary || 'No description available.' 
                      }}
                    />
                  </div>
                </div>
              ))}
              {results.length === 0 && search && !loading && (
                <div className="col-span-2 text-center py-8 text-gray-400">
                  No shows found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}