import React, { Component } from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import './index.css';

import About from './About';
import { ComponentA } from '~/index';

storiesOf('About', module)
  .add('Introduction', () => (
    <About showApp={linkTo('ComponentA', 'Default')} />
  ));

storiesOf('ComponentA', module)
  .add('Default', () => (
    <div className="App">
      <ComponentA />
    </div>
  ));