import React from "react";
import {
  BrowserRouter as Router
} from "react-router-dom";
import '../i18n/i18n'


import Media from 'react-media';

import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'


export default function App() {
  return (
    <Router>
      <Media queries={{
        small: "(max-width: 900px)",
      }}>
        {
          matches => {
            if (matches.small) {
              return <LayoutSmall />

            } else {
              return <LayoutLarge />
            }
          }
        }

      </Media>
    </Router>
  );
}
