import React from "react";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import '../i18n/i18n'

import { CssBaseline } from '@cfxjs/react-ui'


import { Select } from '@cfxjs/react-ui'
import Media from 'react-media';

import Main from './Main'


import classNamesBind from "classnames/bind";
import styles from './Layout.module.css'
const cx = classNamesBind.bind(styles)



export default function App({ children }) {

  return (
    <>
      <CssBaseline />
      <Router>
        <Media queries={{
          small: "(max-width: 375px)",
          large: "(min-width: 374px)"
        }}>
          {
            matches => {
              if (matches.small) {
                return <div className={cx('container', 'small')}>
                  <header>
                    <Link to='/'>ShuttleFlow</Link>
                    <span>Address</span>
                    <span>===</span>
                  </header>
                  <Main size={'sm'} />
                </div>
              } else if (matches.large) {
                return <div>
                  <header>
                    <Link to='/'>ShuttleFlow</Link>
                    <span>Address</span>
                    <Link to='/history'>History</Link>
                    <Link to='/market'>Market</Link>
                    <Link to='/caption'>Be caption</Link>
                    <Select value='zh'>
                      <Select.Option value='en'>English</Select.Option>
                      <Select.Option value='zh'>中文</Select.Option>
                    </Select>
                  </header>
                  <div className={cx('container', 'large')}>
                    <Main size='lg' />
                  </div>
                </div>
              }
            }
          }

        </Media>
      </Router>

    </>
  );
}


