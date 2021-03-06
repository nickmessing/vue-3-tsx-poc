import { parse } from 'acorn';
import { RawSourceMap } from 'source-map';
import { SourceMapGenerator } from 'source-map';
import { walk } from 'estree-walker';

export declare function advancePositionWithClone(pos: Position, source: string, numberOfCharacters?: number): Position;

export declare function advancePositionWithMutation(pos: Position, source: string, numberOfCharacters?: number): Position;

export declare interface ArrayExpression extends Node {
    type: NodeTypes.JS_ARRAY_EXPRESSION;
    elements: Array<string | JSChildNode>;
}

export declare function assert(condition: boolean, msg?: string): void;

export declare interface AssignmentExpression extends Node {
    type: NodeTypes.JS_ASSIGNMENT_EXPRESSION;
    left: SimpleExpressionNode;
    right: JSChildNode;
}

export declare interface AttributeNode extends Node {
    type: NodeTypes.ATTRIBUTE;
    name: string;
    value: TextNode | undefined;
}

export declare const BASE_TRANSITION: unique symbol;

export declare function baseCompile(template: string | RootNode, options?: CompilerOptions): CodegenResult;

export declare interface BaseElementNode extends Node {
    type: NodeTypes.ELEMENT;
    ns: Namespace;
    tag: string;
    tagType: ElementTypes;
    isSelfClosing: boolean;
    props: Array<AttributeNode | DirectiveNode>;
    children: TemplateChildNode[];
}

export declare function baseParse(content: string, options?: ParserOptions): RootNode;

export declare type BlockCodegenNode = VNodeCall | RenderSlotCall;

export declare interface BlockStatement extends Node {
    type: NodeTypes.JS_BLOCK_STATEMENT;
    body: (JSChildNode | IfStatement)[];
}

export declare function buildProps(node: ElementNode, context: TransformContext, props?: ElementNode['props'], ssr?: boolean): {
    props: PropsExpression | undefined;
    directives: DirectiveNode[];
    patchFlag: number;
    dynamicPropNames: string[];
};

export declare function buildSlots(node: ElementNode, context: TransformContext, buildSlotFn?: SlotFnBuilder): {
    slots: SlotsExpression;
    hasDynamicSlots: boolean;
};

export declare interface CacheExpression extends Node {
    type: NodeTypes.JS_CACHE_EXPRESSION;
    index: number;
    value: JSChildNode;
    isVNode: boolean;
}

export declare interface CallExpression extends Node {
    type: NodeTypes.JS_CALL_EXPRESSION;
    callee: string | symbol;
    arguments: (string | symbol | JSChildNode | SSRCodegenNode | TemplateChildNode | TemplateChildNode[])[];
}

export declare const CAMELIZE: unique symbol;

export declare interface CodegenContext extends Required<CodegenOptions> {
    source: string;
    code: string;
    line: number;
    column: number;
    offset: number;
    indentLevel: number;
    map?: SourceMapGenerator;
    helper(key: symbol): string;
    push(code: string, node?: CodegenNode): void;
    indent(): void;
    deindent(withoutNewLine?: boolean): void;
    newline(): void;
}

declare type CodegenNode = TemplateChildNode | JSChildNode | SSRCodegenNode;

export declare interface CodegenOptions {
    mode?: 'module' | 'function';
    sourceMap?: boolean;
    filename?: string;
    scopeId?: string | null;
    prefixIdentifiers?: boolean;
    optimizeBindings?: boolean;
    runtimeModuleName?: string;
    runtimeGlobalName?: string;
    ssr?: boolean;
}

export declare interface CodegenResult {
    code: string;
    ast: RootNode;
    map?: RawSourceMap;
}

export declare interface CommentNode extends Node {
    type: NodeTypes.COMMENT;
    content: string;
}

export declare interface CompilerError extends SyntaxError {
    code: number;
    loc?: SourceLocation;
}

export declare type CompilerOptions = ParserOptions & TransformOptions & CodegenOptions;

export declare interface ComponentNode extends BaseElementNode {
    tagType: ElementTypes.COMPONENT;
    codegenNode: VNodeCall | CacheExpression | undefined;
    ssrCodegenNode?: CallExpression;
}

export declare interface CompoundExpressionNode extends Node {
    type: NodeTypes.COMPOUND_EXPRESSION;
    children: (SimpleExpressionNode | CompoundExpressionNode | InterpolationNode | TextNode | string | symbol)[];
    identifiers?: string[];
}

export declare interface ConditionalDynamicSlotNode extends ConditionalExpression {
    consequent: DynamicSlotNode;
    alternate: DynamicSlotNode | SimpleExpressionNode;
}

export declare interface ConditionalExpression extends Node {
    type: NodeTypes.JS_CONDITIONAL_EXPRESSION;
    test: JSChildNode;
    consequent: JSChildNode;
    alternate: JSChildNode;
    newline: boolean;
}

export declare interface CoreCompilerError extends CompilerError {
    code: ErrorCodes;
}

export declare const CREATE_BLOCK: unique symbol;

export declare const CREATE_COMMENT: unique symbol;

export declare const CREATE_SLOTS: unique symbol;

export declare const CREATE_STATIC: unique symbol;

export declare const CREATE_TEXT: unique symbol;

export declare const CREATE_VNODE: unique symbol;

export declare function createArrayExpression(elements: ArrayExpression['elements'], loc?: SourceLocation): ArrayExpression;

export declare function createAssignmentExpression(left: AssignmentExpression['left'], right: AssignmentExpression['right']): AssignmentExpression;

export declare function createBlockStatement(body: BlockStatement['body']): BlockStatement;

export declare function createCacheExpression(index: number, value: JSChildNode, isVNode?: boolean): CacheExpression;

export declare function createCallExpression<T extends CallExpression['callee']>(callee: T, args?: CallExpression['arguments'], loc?: SourceLocation): InferCodegenNodeType<T>;

export declare function createCompilerError<T extends number>(code: T, loc?: SourceLocation, messages?: {
    [code: number]: string;
}): T extends ErrorCodes ? CoreCompilerError : CompilerError;

export declare function createCompoundExpression(children: CompoundExpressionNode['children'], loc?: SourceLocation): CompoundExpressionNode;

export declare function createConditionalExpression(test: ConditionalExpression['test'], consequent: ConditionalExpression['consequent'], alternate: ConditionalExpression['alternate'], newline?: boolean): ConditionalExpression;

export declare function createForLoopParams({ value, key, index }: ForParseResult): ExpressionNode[];

export declare function createFunctionExpression(params: FunctionExpression['params'], returns?: FunctionExpression['returns'], newline?: boolean, isSlot?: boolean, loc?: SourceLocation): FunctionExpression;

export declare function createIfStatement(test: IfStatement['test'], consequent: IfStatement['consequent'], alternate?: IfStatement['alternate']): IfStatement;

export declare function createInterpolation(content: InterpolationNode['content'] | string, loc: SourceLocation): InterpolationNode;

export declare function createObjectExpression(properties: ObjectExpression['properties'], loc?: SourceLocation): ObjectExpression;

export declare function createObjectProperty(key: Property['key'] | string, value: Property['value']): Property;

export declare function createReturnStatement(returns: ReturnStatement['returns']): ReturnStatement;

export declare function createRoot(children: TemplateChildNode[], loc?: SourceLocation): RootNode;

export declare function createSimpleExpression(content: SimpleExpressionNode['content'], isStatic: SimpleExpressionNode['isStatic'], loc?: SourceLocation, isConstant?: boolean): SimpleExpressionNode;

export declare function createStructuralDirectiveTransform(name: string | RegExp, fn: StructuralDirectiveTransform): NodeTransform;

export declare function createTemplateLiteral(elements: TemplateLiteral['elements']): TemplateLiteral;

export declare function createTransformContext(root: RootNode, { prefixIdentifiers, hoistStatic, cacheHandlers, nodeTransforms, directiveTransforms, transformHoist, isBuiltInComponent, scopeId, ssr, onError }: TransformOptions): TransformContext;

export declare function createVNodeCall(context: TransformContext | null, tag: VNodeCall['tag'], props?: VNodeCall['props'], children?: VNodeCall['children'], patchFlag?: VNodeCall['patchFlag'], dynamicProps?: VNodeCall['dynamicProps'], directives?: VNodeCall['directives'], isBlock?: VNodeCall['isBlock'], isForBlock?: VNodeCall['isForBlock'], loc?: SourceLocation): VNodeCall;

export declare interface DirectiveArgumentNode extends ArrayExpression {
    elements: [string] | [string, ExpressionNode] | [string, ExpressionNode, ExpressionNode] | [string, ExpressionNode, ExpressionNode, ObjectExpression];
}

export declare interface DirectiveArguments extends ArrayExpression {
    elements: DirectiveArgumentNode[];
}

export declare interface DirectiveNode extends Node {
    type: NodeTypes.DIRECTIVE;
    name: string;
    exp: ExpressionNode | undefined;
    arg: ExpressionNode | undefined;
    modifiers: string[];
    parseResult?: ForParseResult;
}

export declare type DirectiveTransform = (dir: DirectiveNode, node: ElementNode, context: TransformContext, augmentor?: (ret: DirectiveTransformResult) => DirectiveTransformResult) => DirectiveTransformResult;

declare interface DirectiveTransformResult {
    props: Property[];
    needRuntime?: boolean | symbol;
    ssrTagParts?: TemplateLiteral['elements'];
}

export declare interface DynamicSlotEntries extends ArrayExpression {
    elements: (ConditionalDynamicSlotNode | ListDynamicSlotNode)[];
}

export declare interface DynamicSlotFnProperty extends Property {
    value: SlotFunctionExpression;
}

export declare interface DynamicSlotNode extends ObjectExpression {
    properties: [Property, DynamicSlotFnProperty];
}

export declare interface DynamicSlotsExpression extends CallExpression {
    callee: typeof CREATE_SLOTS;
    arguments: [SlotsObjectExpression, DynamicSlotEntries];
}

export declare type ElementNode = PlainElementNode | ComponentNode | SlotOutletNode | TemplateNode;

export declare const enum ElementTypes {
    ELEMENT = 0,
    COMPONENT = 1,
    SLOT = 2,
    TEMPLATE = 3
}

export declare const enum ErrorCodes {
    ABRUPT_CLOSING_OF_EMPTY_COMMENT = 0,
    ABSENCE_OF_DIGITS_IN_NUMERIC_CHARACTER_REFERENCE = 1,
    CDATA_IN_HTML_CONTENT = 2,
    CHARACTER_REFERENCE_OUTSIDE_UNICODE_RANGE = 3,
    CONTROL_CHARACTER_REFERENCE = 4,
    DUPLICATE_ATTRIBUTE = 5,
    END_TAG_WITH_ATTRIBUTES = 6,
    END_TAG_WITH_TRAILING_SOLIDUS = 7,
    EOF_BEFORE_TAG_NAME = 8,
    EOF_IN_CDATA = 9,
    EOF_IN_COMMENT = 10,
    EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT = 11,
    EOF_IN_TAG = 12,
    INCORRECTLY_CLOSED_COMMENT = 13,
    INCORRECTLY_OPENED_COMMENT = 14,
    INVALID_FIRST_CHARACTER_OF_TAG_NAME = 15,
    MISSING_ATTRIBUTE_VALUE = 16,
    MISSING_END_TAG_NAME = 17,
    MISSING_SEMICOLON_AFTER_CHARACTER_REFERENCE = 18,
    MISSING_WHITESPACE_BETWEEN_ATTRIBUTES = 19,
    NESTED_COMMENT = 20,
    NONCHARACTER_CHARACTER_REFERENCE = 21,
    NULL_CHARACTER_REFERENCE = 22,
    SURROGATE_CHARACTER_REFERENCE = 23,
    UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME = 24,
    UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE = 25,
    UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME = 26,
    UNEXPECTED_NULL_CHARACTER = 27,
    UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME = 28,
    UNEXPECTED_SOLIDUS_IN_TAG = 29,
    X_INVALID_END_TAG = 30,
    X_MISSING_END_TAG = 31,
    X_MISSING_INTERPOLATION_END = 32,
    X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END = 33,
    X_V_IF_NO_EXPRESSION = 34,
    X_V_ELSE_NO_ADJACENT_IF = 35,
    X_V_FOR_NO_EXPRESSION = 36,
    X_V_FOR_MALFORMED_EXPRESSION = 37,
    X_V_BIND_NO_EXPRESSION = 38,
    X_V_ON_NO_EXPRESSION = 39,
    X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET = 40,
    X_V_SLOT_NAMED_SLOT_ON_COMPONENT = 41,
    X_V_SLOT_MIXED_SLOT_USAGE = 42,
    X_V_SLOT_DUPLICATE_SLOT_NAMES = 43,
    X_V_SLOT_EXTRANEOUS_DEFAULT_SLOT_CHILDREN = 44,
    X_V_SLOT_MISPLACED = 45,
    X_V_MODEL_NO_EXPRESSION = 46,
    X_V_MODEL_MALFORMED_EXPRESSION = 47,
    X_V_MODEL_ON_SCOPE_VARIABLE = 48,
    X_INVALID_EXPRESSION = 49,
    X_KEEP_ALIVE_INVALID_CHILDREN = 50,
    X_PREFIX_ID_NOT_SUPPORTED = 51,
    X_MODULE_MODE_NOT_SUPPORTED = 52,
    X_CACHE_HANDLER_NOT_SUPPORTED = 53,
    X_SCOPE_ID_NOT_SUPPORTED = 54,
    __EXTEND_POINT__ = 55
}

export declare type ExpressionNode = SimpleExpressionNode | CompoundExpressionNode;

export declare function findDir(node: ElementNode, name: string | RegExp, allowEmpty?: boolean): DirectiveNode | undefined;

export declare function findProp(node: ElementNode, name: string, dynamicOnly?: boolean): ElementNode['props'][0] | undefined;

export declare interface ForCodegenNode extends VNodeCall {
    isBlock: true;
    tag: typeof FRAGMENT;
    props: undefined;
    children: ForRenderListExpression;
    patchFlag: string;
    isForBlock: true;
}

export declare interface ForIteratorExpression extends FunctionExpression {
    returns: BlockCodegenNode;
}

export declare interface ForNode extends Node {
    type: NodeTypes.FOR;
    source: ExpressionNode;
    valueAlias: ExpressionNode | undefined;
    keyAlias: ExpressionNode | undefined;
    objectIndexAlias: ExpressionNode | undefined;
    parseResult: ForParseResult;
    children: TemplateChildNode[];
    codegenNode?: ForCodegenNode;
}

declare interface ForParseResult {
    source: ExpressionNode;
    value: ExpressionNode | undefined;
    key: ExpressionNode | undefined;
    index: ExpressionNode | undefined;
}

export declare interface ForRenderListExpression extends CallExpression {
    callee: typeof RENDER_LIST;
    arguments: [ExpressionNode, ForIteratorExpression];
}

export declare const FRAGMENT: unique symbol;

export declare interface FunctionExpression extends Node {
    type: NodeTypes.JS_FUNCTION_EXPRESSION;
    params: ExpressionNode | string | (ExpressionNode | string)[] | undefined;
    returns?: TemplateChildNode | TemplateChildNode[] | JSChildNode;
    body?: BlockStatement | IfStatement;
    newline: boolean;
    isSlot: boolean;
}

export declare function generate(ast: RootNode, options?: CodegenOptions): CodegenResult;

export declare const generateCodeFrame: (source: string, start?: number | undefined, end?: number | undefined) => string;

export declare function getBaseTransformPreset(prefixIdentifiers?: boolean): TransformPreset;

export declare function getInnerRange(loc: SourceLocation, offset: number, length?: number): SourceLocation;

export declare function hasDynamicKeyVBind(node: ElementNode): boolean;

export declare function hasScopeRef(node: TemplateChildNode | IfBranchNode | ExpressionNode | undefined, ids: TransformContext['identifiers']): boolean;

export declare const helperNameMap: any;

export declare type HoistTransform = (node: PlainElementNode, context: TransformContext) => JSChildNode;

export declare interface IfBranchNode extends Node {
    type: NodeTypes.IF_BRANCH;
    condition: ExpressionNode | undefined;
    children: TemplateChildNode[];
}

export declare interface IfConditionalExpression extends ConditionalExpression {
    consequent: BlockCodegenNode;
    alternate: BlockCodegenNode | IfConditionalExpression;
}

export declare interface IfNode extends Node {
    type: NodeTypes.IF;
    branches: IfBranchNode[];
    codegenNode?: IfConditionalExpression;
}

export declare interface IfStatement extends Node {
    type: NodeTypes.JS_IF_STATEMENT;
    test: ExpressionNode;
    consequent: BlockStatement;
    alternate: IfStatement | BlockStatement | ReturnStatement | undefined;
}

declare interface ImportItem {
    exp: string | ExpressionNode;
    path: string;
}

declare type InferCodegenNodeType<T> = T extends typeof RENDER_SLOT ? RenderSlotCall : CallExpression;

export declare function injectProp(node: VNodeCall | RenderSlotCall, prop: Property, context: TransformContext): void;

export declare interface InterpolationNode extends Node {
    type: NodeTypes.INTERPOLATION;
    content: ExpressionNode;
}

export declare function isBindKey(arg: DirectiveNode['arg'], name: string): boolean;

export declare const isBuiltInType: (tag: string, expected: string) => boolean;

export declare function isCoreComponent(tag: string): symbol | void;

export declare const isMemberExpression: (path: string) => boolean;

export declare const isSimpleIdentifier: (name: string) => boolean;

export declare function isSlotOutlet(node: RootNode | TemplateChildNode): node is SlotOutletNode;

export declare function isTemplateNode(node: RootNode | TemplateChildNode): node is TemplateNode;

export declare function isText(node: TemplateChildNode): node is TextNode | InterpolationNode;

export declare function isVSlot(p: ElementNode['props'][0]): p is DirectiveNode;

export declare type JSChildNode = VNodeCall | CallExpression | ObjectExpression | ArrayExpression | ExpressionNode | FunctionExpression | ConditionalExpression | CacheExpression | AssignmentExpression;

export declare const KEEP_ALIVE: unique symbol;

export declare interface ListDynamicSlotIterator extends FunctionExpression {
    returns: DynamicSlotNode;
}

export declare interface ListDynamicSlotNode extends CallExpression {
    callee: typeof RENDER_LIST;
    arguments: [ExpressionNode, ListDynamicSlotIterator];
}

export declare function loadDep(name: string): any;

export declare const locStub: SourceLocation;

export declare const MERGE_PROPS: unique symbol;

export declare type Namespace = number;

export declare const enum Namespaces {
    HTML = 0
}

export declare interface Node {
    type: NodeTypes;
    loc: SourceLocation;
}

export declare type NodeTransform = (node: RootNode | TemplateChildNode, context: TransformContext) => void | (() => void) | (() => void)[];

export declare const enum NodeTypes {
    ROOT = 0,
    ELEMENT = 1,
    TEXT = 2,
    COMMENT = 3,
    SIMPLE_EXPRESSION = 4,
    INTERPOLATION = 5,
    ATTRIBUTE = 6,
    DIRECTIVE = 7,
    COMPOUND_EXPRESSION = 8,
    IF = 9,
    IF_BRANCH = 10,
    FOR = 11,
    TEXT_CALL = 12,
    VNODE_CALL = 13,
    JS_CALL_EXPRESSION = 14,
    JS_OBJECT_EXPRESSION = 15,
    JS_PROPERTY = 16,
    JS_ARRAY_EXPRESSION = 17,
    JS_FUNCTION_EXPRESSION = 18,
    JS_CONDITIONAL_EXPRESSION = 19,
    JS_CACHE_EXPRESSION = 20,
    JS_BLOCK_STATEMENT = 21,
    JS_TEMPLATE_LITERAL = 22,
    JS_IF_STATEMENT = 23,
    JS_ASSIGNMENT_EXPRESSION = 24,
    JS_RETURN_STATEMENT = 25
}

export declare const noopDirectiveTransform: DirectiveTransform;

export declare interface ObjectExpression extends Node {
    type: NodeTypes.JS_OBJECT_EXPRESSION;
    properties: Array<Property>;
}

export declare const OPEN_BLOCK: unique symbol;

export declare type ParentNode = RootNode | ElementNode | IfBranchNode | ForNode;

export declare const parseJS: typeof parse;

export declare interface ParserOptions {
    isVoidTag?: (tag: string) => boolean;
    isNativeTag?: (tag: string) => boolean;
    isPreTag?: (tag: string) => boolean;
    isCustomElement?: (tag: string) => boolean;
    isBuiltInComponent?: (tag: string) => symbol | void;
    getNamespace?: (tag: string, parent: ElementNode | undefined) => Namespace;
    getTextMode?: (tag: string, ns: Namespace, parent: ElementNode | undefined) => TextModes;
    delimiters?: [string, string];
    namedCharacterReferences?: Record<string, string>;
    maxCRNameLength?: number;
    onError?: (error: CompilerError) => void;
}

export declare interface PlainElementNode extends BaseElementNode {
    tagType: ElementTypes.ELEMENT;
    codegenNode: VNodeCall | SimpleExpressionNode | CacheExpression | undefined;
    ssrCodegenNode?: TemplateLiteral;
}

export declare const POP_SCOPE_ID: unique symbol;

export declare const PORTAL: unique symbol;

export declare interface Position {
    offset: number;
    line: number;
    column: number;
}

export declare function processExpression(node: SimpleExpressionNode, context: TransformContext, asParams?: boolean, asRawStatements?: boolean): ExpressionNode;

export declare function processFor(node: ElementNode, dir: DirectiveNode, context: TransformContext, processCodegen?: (forNode: ForNode) => (() => void) | undefined): (() => void) | undefined;

export declare function processIf(node: ElementNode, dir: DirectiveNode, context: TransformContext, processCodegen?: (node: IfNode, branch: IfBranchNode, isRoot: boolean) => (() => void) | undefined): (() => void) | undefined;

export declare function processSlotOutlet(node: SlotOutletNode, context: TransformContext): SlotOutletProcessResult;

export declare interface Property extends Node {
    type: NodeTypes.JS_PROPERTY;
    key: ExpressionNode;
    value: JSChildNode;
}

declare type PropsExpression = ObjectExpression | CallExpression | ExpressionNode;

export declare const PUSH_SCOPE_ID: unique symbol;

export declare function registerRuntimeHelpers(helpers: any): void;

export declare const RENDER_LIST: unique symbol;

export declare const RENDER_SLOT: unique symbol;

export declare interface RenderSlotCall extends CallExpression {
    callee: typeof RENDER_SLOT;
    arguments: [string, string | ExpressionNode] | [string, string | ExpressionNode, PropsExpression] | [string, string | ExpressionNode, PropsExpression | '{}', TemplateChildNode[]];
}

export declare const RESOLVE_COMPONENT: unique symbol;

export declare const RESOLVE_DIRECTIVE: unique symbol;

export declare const RESOLVE_DYNAMIC_COMPONENT: unique symbol;

export declare function resolveComponentType(node: ComponentNode, context: TransformContext, ssr?: boolean): string | symbol | CallExpression;

export declare interface ReturnStatement extends Node {
    type: NodeTypes.JS_RETURN_STATEMENT;
    returns: TemplateChildNode | TemplateChildNode[] | JSChildNode;
}

export declare interface RootNode extends Node {
    type: NodeTypes.ROOT;
    children: TemplateChildNode[];
    helpers: symbol[];
    components: string[];
    directives: string[];
    hoists: JSChildNode[];
    imports: ImportItem[];
    cached: number;
    temps: number;
    ssrHelpers?: symbol[];
    codegenNode?: TemplateChildNode | JSChildNode | BlockStatement | undefined;
}

export declare const SET_BLOCK_TRACKING: unique symbol;

export declare interface SimpleExpressionNode extends Node {
    type: NodeTypes.SIMPLE_EXPRESSION;
    content: string;
    isStatic: boolean;
    isConstant: boolean;
    identifiers?: string[];
}

export declare type SlotFnBuilder = (slotProps: ExpressionNode | undefined, slotChildren: TemplateChildNode[], loc: SourceLocation) => FunctionExpression;

export declare interface SlotFunctionExpression extends FunctionExpression {
    returns: TemplateChildNode[];
}

export declare interface SlotOutletNode extends BaseElementNode {
    tagType: ElementTypes.SLOT;
    codegenNode: RenderSlotCall | CacheExpression | undefined;
    ssrCodegenNode?: CallExpression;
}

declare interface SlotOutletProcessResult {
    slotName: string | ExpressionNode;
    slotProps: PropsExpression | undefined;
}

export declare type SlotsExpression = SlotsObjectExpression | DynamicSlotsExpression;

export declare interface SlotsObjectExpression extends ObjectExpression {
    properties: SlotsObjectProperty[];
}

export declare interface SlotsObjectProperty extends Property {
    value: SlotFunctionExpression;
}

export declare interface SourceLocation {
    start: Position;
    end: Position;
    source: string;
}

export declare type SSRCodegenNode = BlockStatement | TemplateLiteral | IfStatement | AssignmentExpression | ReturnStatement;

export declare type StructuralDirectiveTransform = (node: ElementNode, dir: DirectiveNode, context: TransformContext) => void | (() => void);

export declare const SUSPENSE: unique symbol;

export declare type TemplateChildNode = ElementNode | InterpolationNode | CompoundExpressionNode | TextNode | CommentNode | IfNode | ForNode | TextCallNode;

export declare interface TemplateLiteral extends Node {
    type: NodeTypes.JS_TEMPLATE_LITERAL;
    elements: (string | JSChildNode)[];
}

export declare interface TemplateNode extends BaseElementNode {
    tagType: ElementTypes.TEMPLATE;
    codegenNode: undefined;
}

export declare type TemplateTextChildNode = TextNode | InterpolationNode | CompoundExpressionNode;

export declare interface TextCallNode extends Node {
    type: NodeTypes.TEXT_CALL;
    content: TextNode | InterpolationNode | CompoundExpressionNode;
    codegenNode: CallExpression | SimpleExpressionNode;
}

export declare const enum TextModes {
    DATA = 0,
    RCDATA = 1,
    RAWTEXT = 2,
    CDATA = 3,
    ATTRIBUTE_VALUE = 4
}

export declare interface TextNode extends Node {
    type: NodeTypes.TEXT;
    content: string;
}

export declare const TO_DISPLAY_STRING: unique symbol;

export declare const TO_HANDLERS: unique symbol;

export declare function toValidAssetId(name: string, type: 'component' | 'directive'): string;

export declare const trackSlotScopes: NodeTransform;

export declare const trackVForSlotScopes: NodeTransform;

export declare function transform(root: RootNode, options: TransformOptions): void;

export declare const transformBind: DirectiveTransform;

export declare interface TransformContext extends Required<TransformOptions> {
    root: RootNode;
    helpers: Set<symbol>;
    components: Set<string>;
    directives: Set<string>;
    hoists: JSChildNode[];
    imports: Set<ImportItem>;
    temps: number;
    cached: number;
    identifiers: {
        [name: string]: number | undefined;
    };
    scopes: {
        vFor: number;
        vSlot: number;
        vPre: number;
        vOnce: number;
    };
    parent: ParentNode | null;
    childIndex: number;
    currentNode: RootNode | TemplateChildNode | null;
    helper<T extends symbol>(name: T): T;
    helperString(name: symbol): string;
    replaceNode(node: TemplateChildNode): void;
    removeNode(node?: TemplateChildNode): void;
    onNodeRemoved(): void;
    addIdentifiers(exp: ExpressionNode | string): void;
    removeIdentifiers(exp: ExpressionNode | string): void;
    hoist(exp: JSChildNode): SimpleExpressionNode;
    cache<T extends JSChildNode>(exp: T, isVNode?: boolean): CacheExpression | T;
}

export declare const transformExpression: NodeTransform;

export declare const transformModel: DirectiveTransform;

export declare const transformOn: DirectiveTransform;

export declare interface TransformOptions {
    nodeTransforms?: NodeTransform[];
    directiveTransforms?: Record<string, DirectiveTransform | undefined>;
    transformHoist?: HoistTransform | null;
    isBuiltInComponent?: (tag: string) => symbol | void;
    prefixIdentifiers?: boolean;
    hoistStatic?: boolean;
    cacheHandlers?: boolean;
    scopeId?: string | null;
    ssr?: boolean;
    onError?: (error: CompilerError) => void;
}

export declare type TransformPreset = [NodeTransform[], Record<string, DirectiveTransform>];

export declare function traverseNode(node: RootNode | TemplateChildNode, context: TransformContext): void;

export declare interface VNodeCall extends Node {
    type: NodeTypes.VNODE_CALL;
    tag: string | symbol | CallExpression;
    props: PropsExpression | undefined;
    children: TemplateChildNode[] | TemplateTextChildNode | SlotsExpression | ForRenderListExpression | undefined;
    patchFlag: string | undefined;
    dynamicProps: string | undefined;
    directives: DirectiveArguments | undefined;
    isBlock: boolean;
    isForBlock: boolean;
}

export declare const walkJS: typeof walk;

export declare const WITH_DIRECTIVES: unique symbol;

export declare const WITH_SCOPE_ID: unique symbol;

export { }
