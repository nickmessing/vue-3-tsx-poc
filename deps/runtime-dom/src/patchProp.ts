import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchAttr } from './modules/attrs'
import { patchDOMProp } from './modules/props'
import { patchEvent } from './modules/events'
import { isOn } from '@vue/shared'
import { RendererOptions } from '@vue/runtime-core'

export const patchProp: RendererOptions<Node, Element>['patchProp'] = (
  el,
  key,
  nextValue,
  prevValue,
  isSVG = false,
  prevChildren,
  parentComponent,
  parentSuspense,
  unmountChildren
) => {
  switch (key) {
    // special
    case 'class':
      patchClass(el, nextValue, isSVG)
      break
    case 'style':
      patchStyle(el, prevValue, nextValue)
      break
    case 'modelValue':
    case 'onUpdate:modelValue':
      // Do nothing. This is handled by v-model directives.
      break
    default:
      if (isOn(key)) {
        if (key === 'on') {
          const events = new Set([
            ...Object.keys(prevValue || {}),
            ...Object.keys(nextValue || {})
          ])
          ;[...events].forEach(eventName => {
            patchEvent(
              el,
              eventName,
              prevValue ? prevValue[eventName] : null,
              nextValue ? nextValue[eventName] : null,
              parentComponent
            )
          })
        } else {
          patchEvent(
            el,
            key.slice(2).toLowerCase(),
            prevValue,
            nextValue,
            parentComponent
          )
        }
      } else if (!isSVG && key in el) {
        patchDOMProp(
          el,
          key,
          nextValue,
          prevChildren,
          parentComponent,
          parentSuspense,
          unmountChildren
        )
      } else {
        // special case for <input v-model type="checkbox"> with
        // :true-value & :false-value
        // store value as dom properties since non-string values will be
        // stringified.
        if (key === 'true-value') {
          ;(el as any)._trueValue = nextValue
        } else if (key === 'false-value') {
          ;(el as any)._falseValue = nextValue
        }
        patchAttr(el, key, nextValue, isSVG)
      }
      break
  }
}
