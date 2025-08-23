import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ProcessedNote, Product } from './types';
import { getProducts } from './services/productService';
import { getAndProcessReleaseNotes } from './services/rssService';
import Spinner from './components/Spinner';
import ErrorDisplay from './components/ErrorDisplay';
import ProductTile from './components/ProductTile';
import { GoogleCloudIcon, SunIcon, MoonIcon } from './components/icons';

const FAVORITES_KEY = 'gcpReleaseNotesFavorites';
const THEME_KEY = 'gcpReleaseNotesTheme';

type Theme = 'light' | 'dark';
type SortOption = 'latest' | 'alpha-az' | 'alpha-za';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const [selectedChangeType, setSelectedChangeType] = useState<string>('all');
  const [selectedReleaseStage, setSelectedReleaseStage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    return (storedTheme as Theme) || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

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

  const fetchProductsAndNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching products and notes...");
      const [productsData, notes] = await Promise.all([
        getProducts(),
        getAndProcessReleaseNotes(),
      ]);
      console.log("Fetched products data:", productsData);
      console.log("Fetched notes:", notes);

      const productsMap: Map<string, Product> = new Map(
        productsData.map(p => [p.productName, { ...p, notes: [], lastUpdated: new Date(0), isRecent: false }])
      );

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      notes.forEach(note => {
        if (note.productName === 'Unknown Product') return;

        let product = productsMap.get(note.productName);

        // If a product from release notes doesn't exist in our scraped list, add it.
        // This could happen for new or very specific products not on the main page.
        if (!product) {
          product = {
            productName: note.productName,
            notes: [],
            lastUpdated: new Date(0),
            isRecent: false,
            category: 'Uncategorized', // Default category
            iconUrl: '', // No icon available
          };
          productsMap.set(note.productName, product);
        }
        
        product.notes!.push(note);

        if (note.updated > product.lastUpdated!) {
            product.lastUpdated = note.updated;
        }
      });

      // Sort notes within each product and set recent flag
      productsMap.forEach(product => {
        if (product.notes) {
            product.notes.sort((a, b) => b.updated.getTime() - a.updated.getTime());
        }
        product.isRecent = product.lastUpdated! > oneWeekAgo;
      });

      setProducts(Array.from(productsMap.values()));

    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to load product data. ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsAndNotes();
  }, [fetchProductsAndNotes]);

  const { categories, changeTypes, releaseStages } = useMemo(() => {
    const cats = new Set<string>();
    const types = new Set<string>();
    const stages = new Set<string>();
    products.forEach(p => {
        cats.add(p.category);
        p.notes?.forEach(n => {
            types.add(n.changeType);
            if(n.releaseStage !== 'N/A') stages.add(n.releaseStage);
        })
    });
    return {
        categories: Array.from(cats).sort(),
        changeTypes: Array.from(types).sort(),
        releaseStages: Array.from(stages).sort()
    };
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    
    let processedProducts = products
      .filter(product => {
        if (viewMode === 'favorites' && !favorites.has(product.productName)) {
            return false;
        }
        if (searchTerm && !product.productName.toLowerCase().includes(lowercasedFilter)) {
            return false;
        }
        if (selectedChangeType !== 'all' && !product.notes.some(note => note.changeType === selectedChangeType)) {
            return false;
        }
        if (selectedReleaseStage !== 'all' && !product.notes?.some(note => note.releaseStage === selectedReleaseStage)) {
            return false;
        }
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
            return false;
        }
        return true;
      });
      
      // Primary sort: Favorites first
      processedProducts.sort((a, b) => {
        const aIsFav = favorites.has(a.productName);
        const bIsFav = favorites.has(b.productName);
        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;
        return 0;
      });

      // Secondary sort based on user selection
      const favoritesBoundary = processedProducts.findIndex(p => !favorites.has(p.productName));
      const favs = favoritesBoundary === -1 ? [...processedProducts] : processedProducts.slice(0, favoritesBoundary);
      const nonFavs = favoritesBoundary === -1 ? [] : processedProducts.slice(favoritesBoundary);
      
      const sortFn = (a: Product, b: Product) => {
        switch (sortOption) {
          case 'alpha-az':
            return a.productName.localeCompare(b.productName);
          case 'alpha-za':
            return b.productName.localeCompare(a.productName);
          case 'latest':
          default:
            return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        }
      };

      return [...favs.sort(sortFn), ...nonFavs.sort(sortFn)];
  }, [products, searchTerm, favorites, viewMode, selectedChangeType, selectedReleaseStage, sortOption]);


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
    allLabel?: string;
    children?: React.ReactNode;
  }> = ({ label, value, onChange, options, allLabel = "All", children }) => (
    <div className="flex-1 min-w-[150px]">
        <label htmlFor={label} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
        <select
            id={label}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
        >
          {children ? (
            children
          ) : (
            <>
              <option value="all">{allLabel}</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </>
          )}
        </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <header className="py-8 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4">
                  <GoogleCloudIcon className="w-12 h-auto" />
                  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600">
                    Google Cloud Pulse
                  </h1>
              </div>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                AI-powered insights into the latest Google Cloud updates.
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-4">
             <input
                type="text"
                placeholder="Search for a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-lg px-4 py-2 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"
             />
             <div className="flex flex-wrap items-end gap-4">
                <div>
                    <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">View</span>
                    <div className="relative flex w-fit p-1 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md">
                        <button onClick={() => setViewMode('all')} className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'all' ? 'bg-cyan-500 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>All</button>
                        <button onClick={() => setViewMode('favorites')} className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'favorites' ? 'bg-cyan-500 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>Favorites</button>
                    </div>
                </div>
                
                <FilterSelect label="Sort By" value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)} options={[]}>
                    <option value="latest">Latest Changes First</option>
                    <option value="alpha-az">Alphabetical (A-Z)</option>
                    <option value="alpha-za">Alphabetical (Z-A)</option>
                </FilterSelect>

                <FilterSelect label="Category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} options={categories} />
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
                <p className="text-2xl font-semibold text-slate-500 dark:text-slate-400 mb-2">No Products Found</p>
                <p className="text-slate-600 dark:text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-600">
        Powered by Google Gemini. Data from GCP Release Notes RSS.
      </footer>
    </div>
  );
};

export default App;