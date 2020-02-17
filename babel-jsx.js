'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var syntaxJsx = _interopDefault(require('@babel/plugin-syntax-jsx'));
var types = require('@babel/types');
var htmlTags = _interopDefault(require('html-tags'));
var svgTags = _interopDefault(require('svg-tags'));
var helperModuleImports = require('@babel/helper-module-imports');

function notEmpty(value) {
    return value !== null && value !== undefined;
}
const getTag = (path) => {
    const namePath = path.get('openingElement').get('name');
    if (namePath.isJSXIdentifier()) {
        const name = namePath.node.name;
        if (path.scope.hasBinding(name) && !htmlTags.includes(name) && !svgTags.includes(name)) {
            return types.identifier(name);
        }
        else {
            return types.stringLiteral(name);
        }
    }
    if (namePath.isJSXMemberExpression()) {
        return transformJSXMemberExpression(namePath);
    }
    /* istanbul ignore next */
    throw new Error(`getTag: ${namePath.type} is not supported`);
};
const getChildren = (path, h, vueTransformOnInjected) => path
    .get('children')
    .map(path => {
    if (path.isJSXText()) {
        return transformJSXText(path);
    }
    if (path.isJSXExpressionContainer()) {
        return transformJSXExpressionContainer(path);
    }
    if (path.isJSXSpreadChild()) {
        return transformJSXSpreadChild(path);
    }
    if (path.isJSXElement()) {
        return transformJSXElement(path, h, vueTransformOnInjected);
    }
    if (path.isCallExpression()) {
        return path.node;
    }
    throw new Error(`getChildren: ${path.type} is not supported`);
})
    .filter(notEmpty);
const getAttributes = (path, h, vueTransformOnInjected) => {
    const attributes = path.get('openingElement').get('attributes');
    if (attributes.length === 0) {
        return types.nullLiteral();
    }
    else {
        return types.objectExpression(attributes.map(el => transformAttribute(el, h, vueTransformOnInjected)));
    }
};
const getJSXAttributeName = (path) => {
    const nameNode = path.node.name;
    if (types.isJSXIdentifier(nameNode)) {
        return nameNode.name;
    }
    else {
        return `${nameNode.namespace.name}:${nameNode.name.name}`;
    }
};
const getJSXAttributeValue = (path, h, vueTransformOnInjected) => {
    const valuePath = path.get('value');
    if (valuePath.isJSXElement()) {
        return transformJSXElement(valuePath, h, vueTransformOnInjected);
    }
    else if (valuePath.isStringLiteral()) {
        return valuePath.node;
    }
    else if (valuePath.isJSXExpressionContainer()) {
        return transformJSXExpressionContainer(valuePath);
    }
    else {
        return null;
    }
};
const hCallArguments = (path, h, vueTransformOnInjected) => {
    return [getTag(path), getAttributes(path, h, vueTransformOnInjected), types.arrayExpression(getChildren(path, h, vueTransformOnInjected))];
};

const transformJSXAttribute = (path, h, vueTransformOnInjected) => {
    const name = getJSXAttributeName(path);
    if (name === 'on') {
        return types.spreadElement(types.callExpression(vueTransformOnInjected, [getJSXAttributeValue(path, h, vueTransformOnInjected) || types.booleanLiteral(true)]));
    }
    return types.objectProperty(types.stringLiteral(getJSXAttributeName(path)), getJSXAttributeValue(path, h, vueTransformOnInjected) || types.booleanLiteral(true));
};
const transformJSXSpreadAttribute = (path) => types.spreadElement(path.get('argument').node);
const transformAttribute = (path, h, vueTransformOnInjected) => path.isJSXAttribute()
    ? transformJSXAttribute(path, h, vueTransformOnInjected)
    : transformJSXSpreadAttribute(path);
const transformJSXText = (path) => {
    const node = path.node;
    const lines = node.value.split(/\r\n|\n|\r/);
    let lastNonEmptyLine = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/[^ \t]/)) {
            lastNonEmptyLine = i;
        }
    }
    let str = '';
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isFirstLine = i === 0;
        const isLastLine = i === lines.length - 1;
        const isLastNonEmptyLine = i === lastNonEmptyLine;
        // replace rendered whitespace tabs with spaces
        let trimmedLine = line.replace(/\t/g, ' ');
        // trim whitespace touching a newline
        if (!isFirstLine) {
            trimmedLine = trimmedLine.replace(/^[ ]+/, '');
        }
        // trim whitespace touching an endline
        if (!isLastLine) {
            trimmedLine = trimmedLine.replace(/[ ]+$/, '');
        }
        if (trimmedLine) {
            if (!isLastNonEmptyLine) {
                trimmedLine += ' ';
            }
            str += trimmedLine;
        }
    }
    return str !== '' ? types.stringLiteral(str) : null;
};
const transformJSXMemberExpression = (path) => {
    const objectPath = path.get('object');
    const propertyPath = path.get('property');
    const transformedObject = objectPath.isJSXMemberExpression()
        ? transformJSXMemberExpression(objectPath)
        : objectPath.isJSXIdentifier()
            ? types.identifier(objectPath.node.name)
            : types.nullLiteral();
    const transformedProperty = types.identifier(propertyPath.node.name);
    return types.memberExpression(transformedObject, transformedProperty);
};
const transformJSXExpressionContainer = (path) => {
    const expression = path.node.expression;
    return types.isJSXEmptyExpression(expression) ? null : expression;
};
const transformJSXSpreadChild = (path) => types.spreadElement(path.node.expression);
const transformJSXElement = (path, h, vueTransformOnInjected) => {
    return types.callExpression(h, hCallArguments(path, h, vueTransformOnInjected));
};

const plugin = () => ({
    name: 'babel-plugin-transform-vue-js',
    inherits: syntaxJsx,
    visitor: {
        JSXElement: {
            exit(path, state) {
                if (!state.vueCreateElementInjected) {
                    state.vueCreateElementInjected = helperModuleImports.addNamed(path, 'h', 'vue');
                }
                if (!state.vueTransformOnInjected) {
                    state.vueTransformOnInjected = helperModuleImports.addNamed(path, 'transformOn', '@vue/babel-helper-vue-transform-on');
                }
                path.replaceWith(transformJSXElement(path, state.vueCreateElementInjected, state.vueTransformOnInjected));
            }
        }
    }
});

module.exports = plugin;
//# sourceMappingURL=index.build.js.map
