import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../src/components/Card';

it('renders card snapshot', () => {
  const user = {
    login: { uuid: '1' },
    name: { first: 'John', last: 'Doe' },
    location: { city: 'NY', country: 'USA' },
    picture: { large: '' },
  };
  const { toJSON } = render(<Card user={user} isTop onSwipeLeft={()=>{}} onSwipeRight={()=>{}} />);
  expect(toJSON()).toMatchSnapshot();
});
