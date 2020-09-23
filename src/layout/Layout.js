import React from "react";
import {
  BrowserRouter as Router, Route
} from "react-router-dom";
import '../i18n/i18n'

import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'
import useIsSamll from "../component/useSmallScreen";


export default function App() {
  const isSmall = useIsSamll()
  return (
    <Router>
      <Route path='/' component={isSmall ? LayoutSmall : LayoutLarge} ></Route>
    </Router>
  );
}
