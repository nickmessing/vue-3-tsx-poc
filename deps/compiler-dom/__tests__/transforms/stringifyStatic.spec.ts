import { compile, NodeTypes, CREATE_STATIC } from '../../src'
import {
  stringifyStatic,
  StringifyThresholds
} from '../../src/transforms/stringifyStatic'

describe('stringify static html', () => {
  function compileWithStringify(template: string) {
    return compile(template, {
      hoistStatic: true,
      prefixIdentifiers: true,
      transformHoist: stringifyStatic
    })
  }

  function repeat(code: string, n: number): string {
    return new Array(n)
      .fill(0)
      .map(() => code)
      .join('')
  }

  test('should bail on non-eligible static trees', () => {
    const { ast } = compileWithStringify(
      `<div><div><div>hello</div><div>hello</div></div></div>`
    )
    expect(ast.hoists.length).toBe(1)
    // should be a normal vnode call
    expect(ast.hoists[0].type).toBe(NodeTypes.VNODE_CALL)
  })

  test('should work on eligible content (elements with binding > 5)', () => {
    const { ast } = compileWithStringify(
      `<div><div>${repeat(
        `<span class="foo"/>`,
        StringifyThresholds.ELEMENT_WITH_BINDING_COUNT
      )}</div></div>`
    )
    expect(ast.hoists.length).toBe(1)
    // should be optimized now
    expect(ast.hoists[0]).toMatchObject({
      type: NodeTypes.JS_CALL_EXPRESSION,
      callee: CREATE_STATIC,
      arguments: [
        JSON.stringify(
          `<div>${repeat(
            `<span class="foo"></span>`,
            StringifyThresholds.ELEMENT_WITH_BINDING_COUNT
          )}</div>`
        )
      ]
    })
  })

  test('should work on eligible content (elements > 20)', () => {
    const { ast } = compileWithStringify(
      `<div><div>${repeat(
        `<span/>`,
        StringifyThresholds.NODE_COUNT
      )}</div></div>`
    )
    expect(ast.hoists.length).toBe(1)
    // should be optimized now
    expect(ast.hoists[0]).toMatchObject({
      type: NodeTypes.JS_CALL_EXPRESSION,
      callee: CREATE_STATIC,
      arguments: [
        JSON.stringify(
          `<div>${repeat(
            `<span></span>`,
            StringifyThresholds.NODE_COUNT
          )}</div>`
        )
      ]
    })
  })

  test('serliazing constant bindings', () => {
    const { ast } = compileWithStringify(
      `<div><div>${repeat(
        `<span :class="'foo' + 'bar'">{{ 1 }} + {{ false }}</span>`,
        StringifyThresholds.ELEMENT_WITH_BINDING_COUNT
      )}</div></div>`
    )
    expect(ast.hoists.length).toBe(1)
    // should be optimized now
    expect(ast.hoists[0]).toMatchObject({
      type: NodeTypes.JS_CALL_EXPRESSION,
      callee: CREATE_STATIC,
      arguments: [
        JSON.stringify(
          `<div>${repeat(
            `<span class="foobar">1 + false</span>`,
            StringifyThresholds.ELEMENT_WITH_BINDING_COUNT
          )}</div>`
        )
      ]
    })
  })

  test('escape', () => {
    const { ast } = compileWithStringify(
      `<div><div>${repeat(
        `<span :class="'foo' + '&gt;ar'">{{ 1 }} + {{ '<' }}</span>` +
          `<span>&amp;</span>`,
        StringifyThresholds.ELEMENT_WITH_BINDING_COUNT
      )}</div></div>`
    )
    expect(ast.hoists.length).toBe(1)
    // should be optimized now
    expect(ast.hoists[0]).toMatchObject({
      type: NodeTypes.JS_CALL_EXPRESSION,
      callee: CREATE_STATIC,
      arguments: [
        JSON.stringify(
          `<div>${repeat(
            `<span class="foo&gt;ar">1 + &lt;</span>` + `<span>&amp;</span>`,
            StringifyThresholds.ELEMENT_WITH_BINDING_COUNT
          )}</div>`
        )
      ]
    })
  })
})
