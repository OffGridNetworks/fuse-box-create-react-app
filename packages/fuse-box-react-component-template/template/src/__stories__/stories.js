import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import './index.css';

import About from './About';
import { ComponentA } from '~/index';

storiesOf('About', module).add('Introduction', () => (
  <About showApp={linkTo('ComponentA', 'FirstStory')} />
));

storiesOf('ComponentA', module).add('FirstStory', () => (
  <div className="App">
    <ComponentA />
  </div>
));
