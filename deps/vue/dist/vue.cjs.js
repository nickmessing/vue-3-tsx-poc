'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compilerDom = require('@vue/compiler-dom');
var runtimeDom = require('@vue/runtime-dom');

const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
    const lines = source.split(/\r?\n/);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
        count += lines[i].length + 1;
        if (count >= start) {
            for (let j = i - range; j <= i + range || end > count; j++) {
                if (j < 0 || j >= lines.length)
                    continue;
                const line = j + 1;
                res.push(`${line}${' '.repeat(3 - String(line).length)}|  ${lines[j]}`);
                const lineLength = lines[j].length;
                if (j === i) {
                    // push underline
                    const pad = start - (count - lineLength) + 1;
                    const length = Math.max(1, end > count ? lineLength - pad : end - start);
                    res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
                }
                else if (j > i) {
                    if (end > count) {
                        const length = Math.max(Math.min(end - count, lineLength), 1);
                        res.push(`   |  ` + '^'.repeat(length));
                    }
                    count += lineLength + 1;
                }
            }
            break;
        }
    }
    return res.join('\n');
}

const EMPTY_OBJ =  Object.freeze({})
    ;
const NOOP = () => { };
const isString = (val) => typeof val === 'string';

// This entry is the "full-build" that includes both the runtime
const compileCache = Object.create(null);
function compileToFunction(template, options) {
    if (!isString(template)) {
        if (template.nodeType) {
            template = template.innerHTML;
        }
        else {
             runtimeDom.warn(`invalid template option: `, template);
            return NOOP;
        }
    }
    const key = template;
    const cached = compileCache[key];
    if (cached) {
        return cached;
    }
    if (template[0] === '#') {
        const el = document.querySelector(template);
        if ( !el) {
            runtimeDom.warn(`Template element not found or is empty: ${template}`);
        }
        // __UNSAFE__
        // Reason: potential execution of JS expressions in in-DOM template.
        // The user must make sure the in-DOM template is trusted. If it's rendered
        // by the server, the template should not contain any user data.
        template = el ? el.innerHTML : ``;
    }
    const { code } = compilerDom.compile(template, {
        hoistStatic: true,
        onError(err) {
            {
                const message = `Template compilation error: ${err.message}`;
                const codeFrame = err.loc &&
                    generateCodeFrame(template, err.loc.start.offset, err.loc.end.offset);
                runtimeDom.warn(codeFrame ? `${message}\n${codeFrame}` : message);
            }
        },
        ...options
    });
    const render = new Function('Vue', code)(runtimeDom);
    return (compileCache[key] = render);
}
runtimeDom.registerRuntimeCompiler(compileToFunction);

Object.keys(runtimeDom).forEach(function (k) {
  if (k !== 'default') exports[k] = runtimeDom[k];
});
exports.compile = compileToFunction;
