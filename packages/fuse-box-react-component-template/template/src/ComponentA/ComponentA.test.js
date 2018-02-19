import React from 'react';
import ReactDOM from 'react-dom';
import ComponentA from './ComponentA';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ComponentA />, div);
});
