import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import FilterSelect from './FilterSelect';

test('renders filter select', () => {
  const options = ['Option 1', 'Option 2'];
  render(<FilterSelect options={options} selectedValue="" onValueChange={() => {}} />);
  const linkElement = screen.getByText(/Option 1/i);
  expect(linkElement).toBeInTheDocument();
});
