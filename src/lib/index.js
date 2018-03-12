import { Component, createElement, createContext } from 'react'
import { insert, canUseDom, ID_NAMESPACE, createClassname } from './utils'

let cache = {}

export class ClientStyle extends Component {
  constructor(props) {
    super(props)
    if (!cache[props.css]) {
      // generating a unique style id to prevent duplicate nodes
      // within client-sides document.head
      const uniqueId = Object.keys(cache).length
      cache[props.css] = ID_NAMESPACE + uniqueId
    }
    if (canUseDom()) {
      insert(cache[props.css], props.css)
      this.isReady = true
    }
  }
  componentDidMount() {
    if (!this.isReady && canUseDom()) {
      insert(cache[this.props.css], this.props.css)
    }
  }
  render() {
    return null
  }
}

const { Provider, Consumer } = createContext({})

const idCache = {}

class SSRStyle extends Component {
  constructor(props) {
    super(props)

    if (!idCache[props.css]) {
      // generating a unique style id to prevent duplicate nodes
      // within client-sides document.head
      const uniqueId = Object.keys(idCache).length
      idCache[props.css] = ID_NAMESPACE + uniqueId
    }

    if (props.ctx[ID_NAMESPACE]) {
      // add the rendered css to the cache to only render once during SSR
      if (!props.ctx[ID_NAMESPACE][props.css]) {
        props.ctx[ID_NAMESPACE][props.css] = true
        this.isFirstOccurence = true
      }
    } else {
      // if no cache is provided, render multiple times
      this.isFirstOccurence = true
    }
  }

  render() {
    if (this.isFirstOccurence && !this.hasPrimed) {
      this.hasPrimed = true
      const css = this.props.css
      const id = idCache[css]

      // inject the style into the head if it unmounts
      // to ensure its existence for other instances
      // using the same CSS rendered
      insert(id, css)
    }
    // only actually render the style node
    // if its the first occurence
    if (this.isFirstOccurence) {
      return createElement('style', {
        dangerouslySetInnerHTML: { __html: this.props.css },
      })
    }

    return null
  }
}

export const UniversalStyle = props => (
  <Consumer>{ctx => <SSRStyle {...props} ctx={ctx} />}</Consumer>
)

export const StyleCacheProvider = props => (
  <Provider value={idCache} {...props} />
)

export const getClassname = createClassname
