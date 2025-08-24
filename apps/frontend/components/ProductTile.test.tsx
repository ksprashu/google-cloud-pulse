import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import ProductTile from './ProductTile';
import { Product } from '../../../shared-types/src';

test('renders product tile', () => {
  const product: Product = {
    id: '1',
    productName: 'Test Product',
    releaseNotesUrl: '',
    isRecent: false,
    notes: [
      {
        id: '1',
        changeType: 'feature',
        updated: new Date(),
        summary: 'Test summary',
      },
    ],
  };
  render(
    <ProductTile
      product={product}
      isFavorite={false}
      onToggleFavorite={() => {}}
    />,
  );
  const linkElement = screen.getByText(/Test Product/i);
  expect(linkElement).toBeInTheDocument();
});
