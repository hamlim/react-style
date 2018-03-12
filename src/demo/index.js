import React, { Component } from 'react'
import { render } from 'react-dom'
import { ClientStyle, getClassname } from '../lib/index.js'
const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
}

const btn = getClassname('btn')
const title = getClassname('title')

const App = () => (
  <div style={styles}>
    <ClientStyle
      css={`
        .${btn} {
          color: red;
        }
        .${title} {
          color: mediumseagreen;
          font-size: 3rem;
        }
      `}
    />
    <button className={btn}>Button</button>
    <h3 className={title}>Title</h3>
    <h2>Start editing to see some magic happen {'\u2728'}</h2>
  </div>
)

render(<App />, document.getElementById('root'))
