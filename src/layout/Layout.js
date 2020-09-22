import React from "react";
import {
  BrowserRouter as Router
} from "react-router-dom";
import '../i18n/i18n'

import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'
import useIsSamll from "../component/useSmallScreen";


export default function App() {
  const isSmall = useIsSamll()
  return (
    <Router>
      {
        isSmall ? <LayoutSmall /> : <LayoutLarge />
      }
    </Router>
  );
}
