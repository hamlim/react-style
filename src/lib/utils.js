export const canUseDom = () =>
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  document.head

export const insert = (id, css) => {
  if (!document.head.querySelector('#' + id)) {
    const node = document.createElement('style')
    node.textContent = clean(css)
    node.type = 'text/css'
    node.id = id

    document.head.appendChild(node)
  }
}

export const clean = string => string.replace(/\r?\n|\r| /g, '')

export const ID_NAMESPACE = '__react_style__'

let classHash = {}

export const createClassname = primer => {
  let id = Object.keys(classHash).length
  const maybeClassname = Object.values(classHash).find(
    cls => cls.primer === clean(primer),
  )
  let generated
  if (!maybeClassname) {
    generated = `${ID_NAMESPACE}-${id}`
    classHash[`${ID_NAMESPACE}_${id}`] = { primer, generated }
  } else {
    generated = maybeClassname.generated
  }
  return generated
}
