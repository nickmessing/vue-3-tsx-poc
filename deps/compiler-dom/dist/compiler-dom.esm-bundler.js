import { registerRuntimeHelpers, isBuiltInType, createSimpleExpression, createCompilerError, createObjectProperty, transformModel as transformModel$1, findProp, hasDynamicKeyVBind, transformOn as transformOn$1, createCallExpression, createObjectExpression, noopDirectiveTransform, baseCompile, baseParse } from '@vue/compiler-core';
export * from '@vue/compiler-core';

// Make a map and return a function for checking if a key
// is in that map.
//
// IMPORTANT: all calls of this function must be prefixed with /*#__PURE__*/
// So that rollup can tree-shake them if necessary.
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}

// These tag configs are shared between compiler-dom and runtime-dom, so they
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
    'header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,' +
    'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
    'data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,' +
    'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
    'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
    'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
    'option,output,progress,select,textarea,details,dialog,menu,menuitem,' +
    'summary,content,element,shadow,template,blockquote,iframe,tfoot';
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
    'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
    'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
    'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
    'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
    'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
    'foreignObject,g,hatch,hatchpath,image,line,lineGradient,marker,mask,' +
    'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
    'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
    'text,textPath,title,tspan,unknown,use,view';
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS);
const isSVGTag = /*#__PURE__*/ makeMap(SVG_TAGS);
const isVoidTag = /*#__PURE__*/ makeMap(VOID_TAGS);

const EMPTY_OBJ = (process.env.NODE_ENV !== 'production')
    ? Object.freeze({})
    : {};

const V_MODEL_RADIO = Symbol((process.env.NODE_ENV !== 'production') ? `vModelRadio` : ``);
const V_MODEL_CHECKBOX = Symbol((process.env.NODE_ENV !== 'production') ? `vModelCheckbox` : ``);
const V_MODEL_TEXT = Symbol((process.env.NODE_ENV !== 'production') ? `vModelText` : ``);
const V_MODEL_SELECT = Symbol((process.env.NODE_ENV !== 'production') ? `vModelSelect` : ``);
const V_MODEL_DYNAMIC = Symbol((process.env.NODE_ENV !== 'production') ? `vModelDynamic` : ``);
const V_ON_WITH_MODIFIERS = Symbol((process.env.NODE_ENV !== 'production') ? `vOnModifiersGuard` : ``);
const V_ON_WITH_KEYS = Symbol((process.env.NODE_ENV !== 'production') ? `vOnKeysGuard` : ``);
const V_SHOW = Symbol((process.env.NODE_ENV !== 'production') ? `vShow` : ``);
const TRANSITION = Symbol((process.env.NODE_ENV !== 'production') ? `Transition` : ``);
const TRANSITION_GROUP = Symbol((process.env.NODE_ENV !== 'production') ? `TransitionGroup` : ``);
registerRuntimeHelpers({
    [V_MODEL_RADIO]: `vModelRadio`,
    [V_MODEL_CHECKBOX]: `vModelCheckbox`,
    [V_MODEL_TEXT]: `vModelText`,
    [V_MODEL_SELECT]: `vModelSelect`,
    [V_MODEL_DYNAMIC]: `vModelDynamic`,
    [V_ON_WITH_MODIFIERS]: `withModifiers`,
    [V_ON_WITH_KEYS]: `withKeys`,
    [V_SHOW]: `vShow`,
    [TRANSITION]: `Transition`,
    [TRANSITION_GROUP]: `TransitionGroup`
});

const isRawTextContainer = /*#__PURE__*/ makeMap('style,iframe,script,noscript', true);
const parserOptionsMinimal = {
    isVoidTag,
    isNativeTag: tag => isHTMLTag(tag) || isSVGTag(tag),
    isPreTag: tag => tag === 'pre',
    isBuiltInComponent: (tag) => {
        if (isBuiltInType(tag, `Transition`)) {
            return TRANSITION;
        }
        else if (isBuiltInType(tag, `TransitionGroup`)) {
            return TRANSITION_GROUP;
        }
    },
    // https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
    getNamespace(tag, parent) {
        let ns = parent ? parent.ns : 0 /* HTML */;
        if (parent && ns === 2 /* MATH_ML */) {
            if (parent.tag === 'annotation-xml') {
                if (tag === 'svg') {
                    return 1 /* SVG */;
                }
                if (parent.props.some(a => a.type === 6 /* ATTRIBUTE */ &&
                    a.name === 'encoding' &&
                    a.value != null &&
                    (a.value.content === 'text/html' ||
                        a.value.content === 'application/xhtml+xml'))) {
                    ns = 0 /* HTML */;
                }
            }
            else if (/^m(?:[ions]|text)$/.test(parent.tag) &&
                tag !== 'mglyph' &&
                tag !== 'malignmark') {
                ns = 0 /* HTML */;
            }
        }
        else if (parent && ns === 1 /* SVG */) {
            if (parent.tag === 'foreignObject' ||
                parent.tag === 'desc' ||
                parent.tag === 'title') {
                ns = 0 /* HTML */;
            }
        }
        if (ns === 0 /* HTML */) {
            if (tag === 'svg') {
                return 1 /* SVG */;
            }
            if (tag === 'math') {
                return 2 /* MATH_ML */;
            }
        }
        return ns;
    },
    // https://html.spec.whatwg.org/multipage/parsing.html#parsing-html-fragments
    getTextMode(tag, ns) {
        if (ns === 0 /* HTML */) {
            if (tag === 'textarea' || tag === 'title') {
                return 1 /* RCDATA */;
            }
            if (isRawTextContainer(tag)) {
                return 2 /* RAWTEXT */;
            }
        }
        return 0 /* DATA */;
    }
};

// Parse inline CSS strings for static style attributes into an object.
// This is a NodeTransform since it works on the static `style` attribute and
// converts it into a dynamic equivalent:
// style="color: red" -> :style='{ "color": "red" }'
// It is then processed by `transformElement` and included in the generated
// props.
const transformStyle = (node, context) => {
    if (node.type === 1 /* ELEMENT */) {
        node.props.forEach((p, i) => {
            if (p.type === 6 /* ATTRIBUTE */ && p.name === 'style' && p.value) {
                // replace p with an expression node
                const exp = context.hoist(parseInlineCSS(p.value.content, p.loc));
                node.props[i] = {
                    type: 7 /* DIRECTIVE */,
                    name: `bind`,
                    arg: createSimpleExpression(`style`, true, p.loc),
                    exp,
                    modifiers: [],
                    loc: p.loc
                };
            }
        });
    }
};
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseInlineCSS(cssText, loc) {
    const res = {};
    cssText.split(listDelimiterRE).forEach(item => {
        if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return createSimpleExpression(JSON.stringify(res), false, loc);
}

function createDOMCompilerError(code, loc) {
    return createCompilerError(code, loc, (process.env.NODE_ENV !== 'production') || !true ? DOMErrorMessages : undefined);
}
const DOMErrorMessages = {
    [55 /* X_V_HTML_NO_EXPRESSION */]: `v-html is missing expression.`,
    [56 /* X_V_HTML_WITH_CHILDREN */]: `v-html will override element children.`,
    [57 /* X_V_TEXT_NO_EXPRESSION */]: `v-text is missing expression.`,
    [58 /* X_V_TEXT_WITH_CHILDREN */]: `v-text will override element children.`,
    [59 /* X_V_MODEL_ON_INVALID_ELEMENT */]: `v-model can only be used on <input>, <textarea> and <select> elements.`,
    [60 /* X_V_MODEL_ARG_ON_ELEMENT */]: `v-model argument is not supported on plain elements.`,
    [61 /* X_V_MODEL_ON_FILE_INPUT_ELEMENT */]: `v-model cannot used on file inputs since they are read-only. Use a v-on:change listener instead.`,
    [62 /* X_V_MODEL_UNNECESSARY_VALUE */]: `Unnecessary value binding used alongside v-model. It will interfere with v-model's behavior.`,
    [63 /* X_V_SHOW_NO_EXPRESSION */]: `v-show is missing expression.`,
    [64 /* X_TRANSITION_INVALID_CHILDREN */]: `<Transition> expects exactly one child element or component.`
};

const transformVHtml = (dir, node, context) => {
    const { exp, loc } = dir;
    if (!exp) {
        context.onError(createDOMCompilerError(55 /* X_V_HTML_NO_EXPRESSION */, loc));
    }
    if (node.children.length) {
        context.onError(createDOMCompilerError(56 /* X_V_HTML_WITH_CHILDREN */, loc));
        node.children.length = 0;
    }
    return {
        props: [
            createObjectProperty(createSimpleExpression(`innerHTML`, true, loc), exp || createSimpleExpression('', true))
        ]
    };
};

const transformVText = (dir, node, context) => {
    const { exp, loc } = dir;
    if (!exp) {
        context.onError(createDOMCompilerError(57 /* X_V_TEXT_NO_EXPRESSION */, loc));
    }
    if (node.children.length) {
        context.onError(createDOMCompilerError(58 /* X_V_TEXT_WITH_CHILDREN */, loc));
        node.children.length = 0;
    }
    return {
        props: [
            createObjectProperty(createSimpleExpression(`textContent`, true, loc), exp || createSimpleExpression('', true))
        ]
    };
};

const transformModel = (dir, node, context) => {
    const baseResult = transformModel$1(dir, node, context);
    // base transform has errors OR component v-model (only need props)
    if (!baseResult.props.length || node.tagType === 1 /* COMPONENT */) {
        return baseResult;
    }
    if (dir.arg) {
        context.onError(createDOMCompilerError(60 /* X_V_MODEL_ARG_ON_ELEMENT */, dir.arg.loc));
    }
    function checkDuplicatedValue() {
        const value = findProp(node, 'value');
        if (value) {
            context.onError(createDOMCompilerError(62 /* X_V_MODEL_UNNECESSARY_VALUE */, value.loc));
        }
    }
    const { tag } = node;
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        let directiveToUse = V_MODEL_TEXT;
        let isInvalidType = false;
        if (tag === 'input') {
            const type = findProp(node, `type`);
            if (type) {
                if (type.type === 7 /* DIRECTIVE */) {
                    // :type="foo"
                    directiveToUse = V_MODEL_DYNAMIC;
                }
                else if (type.value) {
                    switch (type.value.content) {
                        case 'radio':
                            directiveToUse = V_MODEL_RADIO;
                            break;
                        case 'checkbox':
                            directiveToUse = V_MODEL_CHECKBOX;
                            break;
                        case 'file':
                            isInvalidType = true;
                            context.onError(createDOMCompilerError(61 /* X_V_MODEL_ON_FILE_INPUT_ELEMENT */, dir.loc));
                            break;
                        default:
                            // text type
                            (process.env.NODE_ENV !== 'production') && checkDuplicatedValue();
                            break;
                    }
                }
            }
            else if (hasDynamicKeyVBind(node)) {
                // element has bindings with dynamic keys, which can possibly contain
                // "type".
                directiveToUse = V_MODEL_DYNAMIC;
            }
            else {
                // text type
                (process.env.NODE_ENV !== 'production') && checkDuplicatedValue();
            }
        }
        else if (tag === 'select') {
            directiveToUse = V_MODEL_SELECT;
        }
        else if (tag === 'textarea') {
            (process.env.NODE_ENV !== 'production') && checkDuplicatedValue();
        }
        // inject runtime directive
        // by returning the helper symbol via needRuntime
        // the import will replaced a resolveDirective call.
        if (!isInvalidType) {
            baseResult.needRuntime = context.helper(directiveToUse);
        }
    }
    else {
        context.onError(createDOMCompilerError(59 /* X_V_MODEL_ON_INVALID_ELEMENT */, dir.loc));
    }
    return baseResult;
};

const isEventOptionModifier = /*#__PURE__*/ makeMap(`passive,once,capture`);
const isNonKeyModifier = /*#__PURE__*/ makeMap(
// event propagation management
`stop,prevent,self,` +
    // system modifiers + exact
    `ctrl,shift,alt,meta,exact,` +
    // mouse
    `left,middle,right`);
const isKeyboardEvent = /*#__PURE__*/ makeMap(`onkeyup,onkeydown,onkeypress`, true);
const generateModifiers = (modifiers) => {
    const keyModifiers = [];
    const nonKeyModifiers = [];
    const eventOptionModifiers = [];
    for (let i = 0; i < modifiers.length; i++) {
        const modifier = modifiers[i];
        if (isEventOptionModifier(modifier)) {
            // eventOptionModifiers: modifiers for addEventListener() options, e.g. .passive & .capture
            eventOptionModifiers.push(modifier);
        }
        else {
            // runtimeModifiers: modifiers that needs runtime guards
            if (isNonKeyModifier(modifier)) {
                nonKeyModifiers.push(modifier);
            }
            else {
                keyModifiers.push(modifier);
            }
        }
    }
    return {
        keyModifiers,
        nonKeyModifiers,
        eventOptionModifiers
    };
};
const transformOn = (dir, node, context) => {
    return transformOn$1(dir, node, context, baseResult => {
        const { modifiers } = dir;
        if (!modifiers.length)
            return baseResult;
        let { key, value: handlerExp } = baseResult.props[0];
        const { keyModifiers, nonKeyModifiers, eventOptionModifiers } = generateModifiers(modifiers);
        if (nonKeyModifiers.length) {
            handlerExp = createCallExpression(context.helper(V_ON_WITH_MODIFIERS), [
                handlerExp,
                JSON.stringify(nonKeyModifiers)
            ]);
        }
        if (keyModifiers.length &&
            // if event name is dynamic, always wrap with keys guard
            (key.type === 8 /* COMPOUND_EXPRESSION */ ||
                !key.isStatic ||
                isKeyboardEvent(key.content))) {
            handlerExp = createCallExpression(context.helper(V_ON_WITH_KEYS), [
                handlerExp,
                JSON.stringify(keyModifiers)
            ]);
        }
        if (eventOptionModifiers.length) {
            handlerExp = createObjectExpression([
                createObjectProperty('handler', handlerExp),
                createObjectProperty('options', createObjectExpression(eventOptionModifiers.map(modifier => createObjectProperty(modifier, createSimpleExpression('true', false)))))
            ]);
        }
        return {
            props: [createObjectProperty(key, handlerExp)]
        };
    });
};

const transformShow = (dir, node, context) => {
    const { exp, loc } = dir;
    if (!exp) {
        context.onError(createDOMCompilerError(63 /* X_V_SHOW_NO_EXPRESSION */, loc));
    }
    return {
        props: [],
        needRuntime: context.helper(V_SHOW)
    };
};

const warnTransitionChildren = (node, context) => {
    if (node.type === 1 /* ELEMENT */ &&
        node.tagType === 1 /* COMPONENT */) {
        const component = context.isBuiltInComponent(node.tag);
        if (component === TRANSITION &&
            (node.children.length > 1 || node.children[0].type === 11 /* FOR */)) {
            context.onError(createDOMCompilerError(64 /* X_TRANSITION_INVALID_CHILDREN */, {
                start: node.children[0].loc.start,
                end: node.children[node.children.length - 1].loc.end,
                source: ''
            }));
        }
    }
};

const parserOptions =  parserOptionsMinimal
    ;
const DOMNodeTransforms = [
    transformStyle,
    ...((process.env.NODE_ENV !== 'production') ? [warnTransitionChildren] : [])
];
const DOMDirectiveTransforms = {
    cloak: noopDirectiveTransform,
    html: transformVHtml,
    text: transformVText,
    model: transformModel,
    on: transformOn,
    show: transformShow
};
function compile(template, options = {}) {
    return baseCompile(template, {
        ...parserOptions,
        ...options,
        nodeTransforms: [...DOMNodeTransforms, ...(options.nodeTransforms || [])],
        directiveTransforms: {
            ...DOMDirectiveTransforms,
            ...(options.directiveTransforms || {})
        },
        transformHoist:  null 
    });
}
function parse(template, options = {}) {
    return baseParse(template, {
        ...parserOptions,
        ...options
    });
}

export { DOMDirectiveTransforms, DOMNodeTransforms, TRANSITION, TRANSITION_GROUP, V_MODEL_CHECKBOX, V_MODEL_DYNAMIC, V_MODEL_RADIO, V_MODEL_SELECT, V_MODEL_TEXT, V_ON_WITH_KEYS, V_ON_WITH_MODIFIERS, V_SHOW, compile, createDOMCompilerError, parse, parserOptions, transformStyle };
