
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ProcessedNote, Product } from './types';
import { getAndProcessReleaseNotes } from './services/rssService';
import Spinner from './components/Spinner';
import ErrorDisplay from './components/ErrorDisplay';
import ProductTile from './components/ProductTile';

const FAVORITES_KEY = 'gcpReleaseNotesFavorites';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const [selectedChangeType, setSelectedChangeType] = useState<string>('all');
  const [selectedReleaseStage, setSelectedReleaseStage] = useState<string>('all');

  
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
    } catch (e) {
      console.error('Could not parse favorites from localStorage', e);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
    } catch(e) {
      console.error('Could not save favorites to localStorage', e);
    }
  }, [favorites]);

  const handleToggleFavorite = useCallback((productName: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(productName)) {
        newFavorites.delete(productName);
      } else {
        newFavorites.add(productName);
      }
      return newFavorites;
    });
  }, []);

  const fetchAndGroupNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const notes = await getAndProcessReleaseNotes();
      
      const productsMap: Map<string, Product> = new Map();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      notes.forEach(note => {
        if (note.productName === 'Unknown Product') return;

        if (!productsMap.has(note.productName)) {
          productsMap.set(note.productName, {
            productName: note.productName,
            notes: [],
            lastUpdated: new Date(0),
            isRecent: false,
          });
        }
        
        const product = productsMap.get(note.productName)!;
        product.notes.push(note);

        if (note.updated > product.lastUpdated) {
            product.lastUpdated = note.updated;
        }
      });

      // Sort notes within each product and set recent flag
      productsMap.forEach(product => {
        product.notes.sort((a, b) => b.updated.getTime() - a.updated.getTime());
        product.isRecent = product.lastUpdated > oneWeekAgo;
      });

      setProducts(Array.from(productsMap.values()));

    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to load release notes. ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndGroupNotes();
  }, [fetchAndGroupNotes]);

  const { changeTypes, releaseStages } = useMemo(() => {
    const types = new Set<string>();
    const stages = new Set<string>();
    products.forEach(p => {
        p.notes.forEach(n => {
            types.add(n.changeType);
            if(n.releaseStage !== 'N/A') stages.add(n.releaseStage);
        })
    });
    return {
        changeTypes: Array.from(types).sort(),
        releaseStages: Array.from(stages).sort()
    };
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    
    return products
      .filter(product => {
        // View Mode Filter
        if (viewMode === 'favorites' && !favorites.has(product.productName)) {
            return false;
        }

        // Search Term Filter
        if (!product.productName.toLowerCase().includes(lowercasedFilter)) {
            return false;
        }

        // Change Type Filter
        if (selectedChangeType !== 'all' && !product.notes.some(note => note.changeType === selectedChangeType)) {
            return false;
        }

        // Release Stage Filter
        if (selectedReleaseStage !== 'all' && !product.notes.some(note => note.releaseStage === selectedReleaseStage)) {
            return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        const aIsFav = favorites.has(a.productName);
        const bIsFav = favorites.has(b.productName);

        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;

        return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      });
  }, [products, searchTerm, favorites, viewMode, selectedChangeType, selectedReleaseStage]);


  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const FilterSelect: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
  }> = ({ label, value, onChange, options }) => (
    <div className="flex-1 min-w-[150px]">
        <label htmlFor={label} className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
        <select
            id={label}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 text-slate-200 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
        >
            <option value="all">All</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
            GCP Release Notes Explorer
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            AI-powered insights into the latest Google Cloud updates.
          </p>
          <div className="mt-6 flex flex-col gap-4">
             <input
                type="text"
                placeholder="Search for a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-lg px-4 py-2 text-slate-200 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"
             />
             <div className="flex flex-wrap items-end gap-4">
                {/* All/Favorites Toggle */}
                <div>
                    <span className="block text-xs font-medium text-slate-400 mb-1">View</span>
                    <div className="relative flex w-fit p-1 bg-slate-800 border border-slate-700 rounded-md">
                        <button onClick={() => setViewMode('all')} className={`px-3 py-1 text-sm rounded ${viewMode === 'all' ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>All</button>
                        <button onClick={() => setViewMode('favorites')} className={`px-3 py-1 text-sm rounded ${viewMode === 'favorites' ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Favorites</button>
                    </div>
                </div>

                <FilterSelect label="Change Type" value={selectedChangeType} onChange={e => setSelectedChangeType(e.target.value)} options={changeTypes} />
                <FilterSelect label="Release Stage" value={selectedReleaseStage} onChange={e => setSelectedReleaseStage(e.target.value)} options={releaseStages} />
             </div>
          </div>
        </div>
      </header>
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductTile 
                  key={product.productName} 
                  product={product} 
                  isFavorite={favorites.has(product.productName)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
                <p className="text-2xl font-semibold text-slate-400 mb-2">No Products Found</p>
                <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-600">
        Powered by Google Gemini. Data from GCP Release Notes RSS.
      </footer>
    </div>
  );
};

export default App;