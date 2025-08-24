import React from 'react';
import type { Product } from '../types';
import { SparkleIcon, HeartIcon, CalendarIcon, ProductIcon } from './icons';

interface ProductTileProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productName: string) => void;
}

const getBadgeColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('feature'))
    return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
  if (lowerType.includes('announcement'))
    return 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300';
  if (lowerType.includes('security'))
    return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
  if (lowerType.includes('bug'))
    return 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300';
  if (lowerType.includes('improvement'))
    return 'bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300';
  if (lowerType.includes('deprecation'))
    return 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300';
  return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
};

const ProductTile: React.FC<ProductTileProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
}) => {
  if (product.notes.length === 0) return null;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    onToggleFavorite(product.productName);
  };

  const recentNotes = product.notes.slice(0, 3);

  return (
    <a
      href={product.releaseNotesUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col h-full p-6 transition-all duration-300 transform bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 group"
    >
      {/* Tile Header */}
      <div className="mb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <ProductIcon className="w-6 h-6 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-1" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
              {product.productName}
            </h2>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`flex-shrink-0 p-1 rounded-full transition-colors duration-200 z-10 ${
              isFavorite
                ? 'text-red-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-red-400'
            }`}
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <HeartIcon className="w-6 h-6" isFavorite={isFavorite} />
          </button>
        </div>

        {product.isRecent && (
          <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-cyan-600 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/50 px-2 py-1 rounded-full w-fit">
            <SparkleIcon className="w-4 h-4" />
            <span>Recent Updates</span>
          </div>
        )}
      </div>

      {/* Changes List */}
      <div className="flex-grow min-h-0 mt-2 space-y-4 border-t border-slate-200 dark:border-slate-700/50 pt-4">
        {recentNotes.map((note) => (
          <div key={note.id}>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1.5">
              <span
                className={`px-2 py-0.5 font-semibold rounded-md text-xs whitespace-nowrap ${getBadgeColor(note.changeType)}`}
              >
                {note.changeType.toUpperCase()}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>
                  {note.updated.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
              {note.summary}
            </p>
          </div>
        ))}
      </div>
    </a>
  );
};

export default ProductTile;
