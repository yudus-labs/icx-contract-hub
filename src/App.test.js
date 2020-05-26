import React from 'react';
import { render } from '@testing-library/react';
import IcxExplorer from './IcxExplorer';

test('renders learn react link', () => {
  const { getByText } = render(<IcxExplorer />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
