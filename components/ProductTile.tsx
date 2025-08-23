
import React from 'react';
import type { Product } from '../types';
import { SparkleIcon, HeartIcon, CalendarIcon } from './icons';

interface ProductTileProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productName: string) => void;
}

const getBadgeColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('feature')) return 'bg-sky-500 text-sky-100';
  if (lowerType.includes('security')) return 'bg-red-500 text-red-100';
  if (lowerType.includes('bug')) return 'bg-amber-500 text-amber-100';
  if (lowerType.includes('deprecation')) return 'bg-rose-500 text-rose-100';
  return 'bg-slate-600 text-slate-200';
};


const ProductTile: React.FC<ProductTileProps> = ({ product, isFavorite, onToggleFavorite }) => {
  if (product.notes.length === 0) return null;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(product.productName);
  };

  const recentNotes = product.notes.slice(0, 3);

  return (
    <div className="flex flex-col h-full p-6 transition-all duration-300 transform bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1">
      {/* Tile Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-100 truncate pr-4">{product.productName}</h2>
          <button
            onClick={handleFavoriteClick}
            className={`flex-shrink-0 p-1 rounded-full transition-colors duration-200 ${
              isFavorite ? 'text-red-400' : 'text-slate-500 hover:text-red-400'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon className="w-6 h-6" isFavorite={isFavorite} />
          </button>
        </div>
        
        {product.isRecent && (
          <div className="flex items-center gap-1 mb-4 text-xs font-semibold text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full w-fit">
            <SparkleIcon className="w-4 h-4" />
            <span>Recent Updates</span>
          </div>
        )}
      </div>
      
      {/* Changes List */}
      <div className="flex-grow min-h-0 mt-2 space-y-4 border-t border-slate-700/50 pt-4">
        {recentNotes.map((note) => (
          <div key={note.id}>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1.5">
              <span className={`px-2 py-0.5 font-bold rounded-md text-xs whitespace-nowrap ${getBadgeColor(note.changeType)}`}>
                {note.changeType}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {note.updated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-snug">
              {note.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTile;
