import {
  NodeTypes,
  ElementNode,
  TransformContext,
  TemplateChildNode,
  SimpleExpressionNode,
  createCallExpression,
  HoistTransform,
  CREATE_STATIC,
  ExpressionNode
} from '@vue/compiler-core'
import {
  isVoidTag,
  isString,
  isSymbol,
  escapeHtml,
  toDisplayString
} from '@vue/shared'

// Turn eligible hoisted static trees into stringied static nodes, e.g.
//   const _hoisted_1 = createStaticVNode(`<div class="foo">bar</div>`)
// This is only performed in non-in-browser compilations.
export const stringifyStatic: HoistTransform = (node, context) => {
  if (shouldOptimize(node)) {
    return createCallExpression(context.helper(CREATE_STATIC), [
      JSON.stringify(stringifyElement(node, context))
    ])
  } else {
    return node.codegenNode!
  }
}

export const enum StringifyThresholds {
  ELEMENT_WITH_BINDING_COUNT = 5,
  NODE_COUNT = 20
}

// Opt-in heuristics based on:
// 1. number of elements with attributes > 5.
// 2. OR: number of total nodes > 20
// For some simple trees, the performance can actually be worse.
// it is only worth it when the tree is complex enough
// (e.g. big piece of static content)
function shouldOptimize(node: ElementNode): boolean {
  let bindingThreshold = StringifyThresholds.ELEMENT_WITH_BINDING_COUNT
  let nodeThreshold = StringifyThresholds.NODE_COUNT

  // TODO: check for cases where using innerHTML will result in different
  // output compared to imperative node insertions.
  // probably only need to check for most common case
  // i.e. non-phrasing-content tags inside `<p>`
  function walk(node: ElementNode) {
    for (let i = 0; i < node.children.length; i++) {
      if (--nodeThreshold === 0) {
        return true
      }
      const child = node.children[i]
      if (child.type === NodeTypes.ELEMENT) {
        if (child.props.length > 0 && --bindingThreshold === 0) {
          return true
        }
        if (walk(child)) {
          return true
        }
      }
    }
    return false
  }

  return walk(node)
}

function stringifyElement(
  node: ElementNode,
  context: TransformContext
): string {
  let res = `<${node.tag}`
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i]
    if (p.type === NodeTypes.ATTRIBUTE) {
      res += ` ${p.name}`
      if (p.value) {
        res += `="${escapeHtml(p.value.content)}"`
      }
    } else if (p.type === NodeTypes.DIRECTIVE && p.name === 'bind') {
      // constant v-bind, e.g. :foo="1"
      res += ` ${(p.arg as SimpleExpressionNode).content}="${escapeHtml(
        evaluateConstant(p.exp as ExpressionNode)
      )}"`
    }
  }
  if (context.scopeId) {
    res += ` ${context.scopeId}`
  }
  res += `>`
  for (let i = 0; i < node.children.length; i++) {
    res += stringifyNode(node.children[i], context)
  }
  if (!isVoidTag(node.tag)) {
    res += `</${node.tag}>`
  }
  return res
}

function stringifyNode(
  node: string | TemplateChildNode,
  context: TransformContext
): string {
  if (isString(node)) {
    return node
  }
  if (isSymbol(node)) {
    return ``
  }
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return stringifyElement(node, context)
    case NodeTypes.TEXT:
      return escapeHtml(node.content)
    case NodeTypes.COMMENT:
      return `<!--${escapeHtml(node.content)}-->`
    case NodeTypes.INTERPOLATION:
      return escapeHtml(toDisplayString(evaluateConstant(node.content)))
    case NodeTypes.COMPOUND_EXPRESSION:
      return escapeHtml(evaluateConstant(node))
    case NodeTypes.TEXT_CALL:
      return stringifyNode(node.content, context)
    default:
      // static trees will not contain if/for nodes
      return ''
  }
}

// __UNSAFE__
// Reason: eval.
// It's technically safe to eval because only constant expressions are possible
// here, e.g. `{{ 1 }}` or `{{ 'foo' }}`
// in addition, constant exps bail on presence of parens so you can't even
// run JSFuck in here. But we mark it unsafe for security review purposes.
// (see compiler-core/src/transformExpressions)
function evaluateConstant(exp: ExpressionNode): string {
  if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
    return new Function(`return ${exp.content}`)()
  } else {
    // compound
    let res = ``
    exp.children.forEach(c => {
      if (isString(c) || isSymbol(c)) {
        return
      }
      if (c.type === NodeTypes.TEXT) {
        res += c.content
      } else if (c.type === NodeTypes.INTERPOLATION) {
        res += evaluateConstant(c.content)
      } else {
        res += evaluateConstant(c)
      }
    })
    return res
  }
}
