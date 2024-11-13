import React, { useState } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import { Show } from '../types/show';

interface AddShowModalProps {
  onClose: () => void;
  onAddShow: (show: Show) => void;
}

export function AddShowModal({ onClose, onAddShow }: AddShowModalProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);

  const searchShows = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
      setResults(response.data.map((item: any) => item.show));
    } catch (error) {
      console.error('Error searching shows:', error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Show</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
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
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => searchShows(search)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4">
          {loading ? (
            <div className="text-center py-8">Searching...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {results.map((show) => (
                <div
                  key={show.id}
                  onClick={() => onAddShow(show)}
                  className="flex gap-4 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={show.image?.medium || 'https://via.placeholder.com/100x140'}
                    alt={show.name}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{show.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3"
                       dangerouslySetInnerHTML={{ __html: show.summary || 'No description available.' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}