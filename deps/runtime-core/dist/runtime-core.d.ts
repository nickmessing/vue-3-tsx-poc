import { ComputedGetter } from '@vue/reactivity';
import { ComputedRef } from '@vue/reactivity';
import { DebuggerEvent } from '@vue/reactivity';
import { isReactive } from '@vue/reactivity';
import { isReadonly } from '@vue/reactivity';
import { isRef } from '@vue/reactivity';
import { markNonReactive } from '@vue/reactivity';
import { markReadonly } from '@vue/reactivity';
import { reactive } from '@vue/reactivity';
import { ReactiveEffect } from '@vue/reactivity';
import { ReactiveEffectOptions } from '@vue/reactivity';
import { readonly } from '@vue/reactivity';
import { Ref } from '@vue/reactivity';
import { ref } from '@vue/reactivity';
import { shallowReactive } from '@vue/reactivity';
import { toRaw } from '@vue/reactivity';
import { toRefs } from '@vue/reactivity';
import { TrackOpTypes } from '@vue/reactivity';
import { TriggerOpTypes } from '@vue/reactivity';
import { UnwrapRef } from '@vue/reactivity';
import { WritableComputedOptions } from '@vue/reactivity';
import { WritableComputedRef } from '@vue/reactivity';

export declare interface App<HostElement = any> {
    config: AppConfig;
    use(plugin: Plugin, ...options: any[]): this;
    mixin(mixin: ComponentOptions): this;
    component(name: string): Component | undefined;
    component(name: string, component: Component): this;
    directive(name: string): Directive | undefined;
    directive(name: string, directive: Directive): this;
    mount(rootContainer: HostElement | string): ComponentPublicInstance;
    unmount(rootContainer: HostElement | string): void;
    provide<T>(key: InjectionKey<T> | string, value: T): this;
    _component: Component;
    _props: Data | null;
    _container: HostElement | null;
    _context: AppContext;
}

export declare interface AppConfig {
    devtools: boolean;
    performance: boolean;
    readonly isNativeTag?: (tag: string) => boolean;
    isCustomElement?: (tag: string) => boolean;
    errorHandler?: (err: Error, instance: ComponentPublicInstance | null, info: string) => void;
    warnHandler?: (msg: string, instance: ComponentPublicInstance | null, trace: string) => void;
}

export declare interface AppContext {
    config: AppConfig;
    mixins: ComponentOptions[];
    components: Record<string, Component>;
    directives: Record<string, Directive>;
    provides: Record<string | symbol, any>;
    reload?: () => void;
}

export declare const BaseTransition: new () => {
    $props: BaseTransitionProps;
};

export declare interface BaseTransitionProps {
    mode?: 'in-out' | 'out-in' | 'default';
    appear?: boolean;
    persisted?: boolean;
    onBeforeEnter?: (el: any) => void;
    onEnter?: (el: any, done: () => void) => void;
    onAfterEnter?: (el: any) => void;
    onEnterCancelled?: (el: any) => void;
    onBeforeLeave?: (el: any) => void;
    onLeave?: (el: any, done: () => void) => void;
    onAfterLeave?: (el: any) => void;
    onLeaveCancelled?: (el: any) => void;
}

export declare function callWithAsyncErrorHandling(fn: Function | Function[], instance: ComponentInternalInstance | null, type: ErrorTypes, args?: unknown[]): any[];

export declare function callWithErrorHandling(fn: Function, instance: ComponentInternalInstance | null, type: ErrorTypes, args?: unknown[]): any;

export declare const camelize: (s: string) => string;

export declare type CleanupRegistrator = (invalidate: () => void) => void;

export declare function cloneVNode<T, U>(vnode: VNode<T, U>, extraProps?: Data & VNodeProps): VNode<T, U>;

export declare const Comment: unique symbol;

declare interface CompiledSlotDescriptor {
    name: string;
    fn: Slot;
}

export declare type Component = ComponentOptions | FunctionalComponent;

declare type ComponentInjectOptions = string[] | Record<string | symbol, string | symbol | {
    from: string | symbol;
    default?: unknown;
}>;

export declare interface ComponentInternalInstance {
    type: FunctionalComponent | ComponentOptions;
    parent: ComponentInternalInstance | null;
    appContext: AppContext;
    root: ComponentInternalInstance;
    vnode: VNode;
    next: VNode | null;
    subTree: VNode;
    update: ReactiveEffect;
    render: RenderFunction | null;
    effects: ReactiveEffect[] | null;
    provides: Data;
    accessCache: Data | null;
    renderCache: (Function | VNode)[] | null;
    components: Record<string, Component>;
    directives: Record<string, Directive>;
    renderContext: Data;
    data: Data;
    props: Data;
    attrs: Data;
    vnodeHooks: Data;
    slots: Slots;
    proxy: ComponentPublicInstance | null;
    withProxy: ComponentPublicInstance | null;
    propsProxy: Data | null;
    setupContext: SetupContext | null;
    refs: Data;
    emit: Emit;
    asyncDep: Promise<any> | null;
    asyncResult: unknown;
    asyncResolved: boolean;
    sink: {
        [key: string]: any;
    };
    isMounted: boolean;
    isUnmounted: boolean;
    isDeactivated: boolean;
    [LifecycleHooks.BEFORE_CREATE]: LifecycleHook;
    [LifecycleHooks.CREATED]: LifecycleHook;
    [LifecycleHooks.BEFORE_MOUNT]: LifecycleHook;
    [LifecycleHooks.MOUNTED]: LifecycleHook;
    [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook;
    [LifecycleHooks.UPDATED]: LifecycleHook;
    [LifecycleHooks.BEFORE_UNMOUNT]: LifecycleHook;
    [LifecycleHooks.UNMOUNTED]: LifecycleHook;
    [LifecycleHooks.RENDER_TRACKED]: LifecycleHook;
    [LifecycleHooks.RENDER_TRIGGERED]: LifecycleHook;
    [LifecycleHooks.ACTIVATED]: LifecycleHook;
    [LifecycleHooks.DEACTIVATED]: LifecycleHook;
    [LifecycleHooks.ERROR_CAPTURED]: LifecycleHook;
    renderUpdated?: boolean;
}

export declare type ComponentObjectPropsOptions<P = Data> = {
    [K in keyof P]: Prop<P[K]> | null;
};

export declare type ComponentOptions = ComponentOptionsWithoutProps | ComponentOptionsWithProps | ComponentOptionsWithArrayProps;

declare interface ComponentOptionsBase<Props, RawBindings, D, C extends ComputedOptions, M extends MethodOptions> extends LegacyOptions<Props, RawBindings, D, C, M>, SFCInternalOptions {
    setup?: (this: void, props: Props, ctx: SetupContext) => RawBindings | RenderFunction | void;
    name?: string;
    template?: string | object;
    render?: Function;
    ssrRender?: (ctx: any, push: (item: any) => void, parentInstance: ComponentInternalInstance) => void;
    components?: Record<string, Component | {
        new (): ComponentPublicInstance<any, any, any, any, any>;
    }>;
    directives?: Record<string, Directive>;
    inheritAttrs?: boolean;
    call?: never;
    __isFragment?: never;
    __isPortal?: never;
    __isSuspense?: never;
}

export declare type ComponentOptionsWithArrayProps<PropNames extends string = string, RawBindings = {}, D = {}, C extends ComputedOptions = {}, M extends MethodOptions = {}, Props = Readonly<{
    [key in PropNames]?: any;
}>> = ComponentOptionsBase<Props, RawBindings, D, C, M> & {
    props: PropNames[];
} & ThisType<ComponentPublicInstance<Props, RawBindings, D, C, M>>;

export declare type ComponentOptionsWithoutProps<Props = {}, RawBindings = {}, D = {}, C extends ComputedOptions = {}, M extends MethodOptions = {}> = ComponentOptionsBase<Readonly<Props>, RawBindings, D, C, M> & {
    props?: undefined;
} & ThisType<ComponentPublicInstance<{}, RawBindings, D, C, M, Readonly<Props>>>;

export declare type ComponentOptionsWithProps<PropsOptions = ComponentObjectPropsOptions, RawBindings = {}, D = {}, C extends ComputedOptions = {}, M extends MethodOptions = {}, Props = Readonly<ExtractPropTypes<PropsOptions>>> = ComponentOptionsBase<Props, RawBindings, D, C, M> & {
    props: PropsOptions;
} & ThisType<ComponentPublicInstance<Props, RawBindings, D, C, M>>;

export declare type ComponentPropsOptions<P = Data> = ComponentObjectPropsOptions<P> | string[];

export declare type ComponentPublicInstance<P = {}, B = {}, D = {}, C extends ComputedOptions = {}, M extends MethodOptions = {}, PublicProps = P> = {
    $data: D;
    $props: PublicProps;
    $attrs: Data;
    $refs: Data;
    $slots: Slots;
    $root: ComponentInternalInstance | null;
    $parent: ComponentInternalInstance | null;
    $emit: Emit;
    $el: any;
    $options: ComponentOptionsBase<P, B, D, C, M>;
    $forceUpdate: ReactiveEffect;
    $nextTick: typeof nextTick;
    $watch: typeof instanceWatch;
} & P & UnwrapRef<B> & D & ExtractComputedReturns<C> & M;

declare type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[];

declare type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>;

export declare function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;

export declare function computed<T>(options: WritableComputedOptions<T>): WritableComputedRef<T>;

declare type ComputedOptions = Record<string, ComputedGetter<any> | WritableComputedOptions<any>>;
export { ComputedRef }

declare interface Constructor<P = any> {
    __isFragment?: never;
    __isPortal?: never;
    __isSuspense?: never;
    new (): {
        $props: P;
    };
}

export declare type CreateAppFunction<HostElement> = (rootComponent: Component | {
    new (): ComponentPublicInstance<any, any, any, any, any>;
}, rootProps?: Data | null) => App<HostElement>;

export declare function createBlock(type: VNodeTypes, props?: {
    [key: string]: any;
} | null, children?: any, patchFlag?: number, dynamicProps?: string[]): VNode;

export declare function createCommentVNode(text?: string, asBlock?: boolean): VNode;

declare function createComponentInstance(vnode: VNode, parent: ComponentInternalInstance | null): ComponentInternalInstance;

export declare const createHook: <T extends Function = () => any>(lifecycle: LifecycleHooks) => (hook: T, target?: ComponentInternalInstance | null) => false | void;

declare function createRecord(id: string, comp: ComponentOptions): boolean;

/**
 * The createRenderer function accepts two generic arguments:
 * HostNode and HostElement, corresponding to Node and Element types in the
 * host environment. For example, for runtime-dom, HostNode would be the DOM
 * `Node` interface and HostElement would be the DOM `Element` interface.
 *
 * Custom renderers can pass in the platform specific types like this:
 *
 * ``` js
 * const { render, createApp } = createRenderer<Node, Element>({
 *   patchProp,
 *   ...nodeOps
 * })
 * ```
 */
export declare function createRenderer<HostNode extends object = any, HostElement extends HostNode = any>(options: RendererOptions<HostNode, HostElement>): {
    render: RootRenderFunction<HostNode, HostElement>;
    createApp: CreateAppFunction<HostElement>;
};

export declare function createSlots(slots: Record<string, Slot>, dynamicSlots: (CompiledSlotDescriptor | CompiledSlotDescriptor[])[]): Record<string, Slot>;

export declare function createStaticVNode(content: string): VNode;

export declare function createTextVNode(text?: string, flag?: number): VNode;

export declare function createVNode(type: VNodeTypes, props?: (Data & VNodeProps) | null, children?: unknown, patchFlag?: number, dynamicProps?: string[] | null): VNode;

declare type Data = {
    [key: string]: unknown;
};
export { DebuggerEvent }

export declare type DebuggerHook = (e: DebuggerEvent) => void;

declare type DefaultFactory<T> = () => T | null | undefined;

export declare function defineComponent<Props, Events = void, RawBindings = object>(setup: (props: Readonly<Props>, ctx: SetupContext<Events>) => RawBindings | RenderFunction): {
    new (): ComponentPublicInstance<Props, RawBindings, {}, {}, {}, VNodeProps & Props & EventListenerProp<Events>>;
};

export declare function defineComponent<Props, RawBindings, D, C extends ComputedOptions = {}, M extends MethodOptions = {}>(options: ComponentOptionsWithoutProps<Props, RawBindings, D, C, M>): {
    new (): ComponentPublicInstance<Props, RawBindings, D, C, M, VNodeProps & Props>;
};

export declare function defineComponent<PropNames extends string, RawBindings, D, C extends ComputedOptions = {}, M extends MethodOptions = {}>(options: ComponentOptionsWithArrayProps<PropNames, RawBindings, D, C, M>): {
    new (): ComponentPublicInstance<VNodeProps, RawBindings, D, C, M>;
};

export declare function defineComponent<PropsOptions extends Readonly<ComponentPropsOptions>, RawBindings, D, C extends ComputedOptions = {}, M extends MethodOptions = {}>(options: ComponentOptionsWithProps<PropsOptions, RawBindings, D, C, M>): {
    new (): ComponentPublicInstance<ExtractPropTypes<PropsOptions>, RawBindings, D, C, M, VNodeProps & ExtractPropTypes<PropsOptions, false>>;
};

export declare type Directive<T = any> = ObjectDirective<T> | FunctionDirective<T>;

export declare type DirectiveArguments = Array<[Directive] | [Directive, any] | [Directive, any, string] | [Directive, any, string, DirectiveModifiers]>;

export declare interface DirectiveBinding {
    instance: ComponentPublicInstance | null;
    value: any;
    oldValue: any;
    arg?: string;
    modifiers: DirectiveModifiers;
    dir: ObjectDirective;
}

export declare type DirectiveHook<T = any> = (el: T, binding: DirectiveBinding, vnode: VNode<any, T>, prevVNode: VNode<any, T> | null) => void;

declare type DirectiveModifiers = Record<string, boolean>;

declare type Emit<Events = void> = Events extends object ? TypedEmit<Events> : (event: string, ...args: unknown[]) => any[];

export declare type ErrorCapturedHook = (err: Error, instance: ComponentPublicInstance | null, info: string) => boolean | void;

declare const enum ErrorCodes {
    SETUP_FUNCTION = 0,
    RENDER_FUNCTION = 1,
    WATCH_GETTER = 2,
    WATCH_CALLBACK = 3,
    WATCH_CLEANUP = 4,
    NATIVE_EVENT_HANDLER = 5,
    COMPONENT_EVENT_HANDLER = 6,
    DIRECTIVE_HOOK = 7,
    TRANSITION_HOOK = 8,
    APP_ERROR_HANDLER = 9,
    APP_WARN_HANDLER = 10,
    FUNCTION_REF = 11,
    SCHEDULER = 12
}

declare type ErrorTypes = LifecycleHooks | ErrorCodes;

declare interface EventListenerProp<Events extends Record<string, any> = {}> {
    on?: {
        [key in keyof Required<Events>]?: (payload: Events[key]) => void;
    };
}

declare type ExtractComputedReturns<T extends any> = {
    [key in keyof T]: T[key] extends {
        get: Function;
    } ? ReturnType<T[key]['get']> : ReturnType<T[key]>;
};

declare type ExtractPropTypes<O, MakeDefaultRequired extends boolean = true> = O extends object ? {
    [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]>;
} & {
    [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<O[K]>;
} : {
    [K in string]: any;
};

export declare const Fragment: {
    new (): {
        $props: VNodeProps;
    };
    __isFragment: true;
};

export declare interface FunctionalComponent<P = {}> extends SFCInternalOptions {
    (props: P, ctx: SetupContext): VNodeChild;
    props?: ComponentPropsOptions<P>;
    inheritAttrs?: boolean;
    displayName?: string;
}

export declare type FunctionDirective<T = any> = DirectiveHook<T>;

export declare const getCurrentInstance: () => ComponentInternalInstance | null;

export declare function h(type: string, children?: RawChildren): VNode;

export declare function h(type: string, props?: RawProps | null, children?: RawChildren): VNode;

export declare function h(type: typeof Fragment, children?: VNodeArrayChildren): VNode;

export declare function h(type: typeof Fragment, props?: RawProps | null, children?: VNodeArrayChildren): VNode;

export declare function h(type: typeof Portal, props: RawProps & {
    target: any;
}, children: RawChildren): VNode;

export declare function h(type: typeof Suspense, children?: RawChildren): VNode;

export declare function h(type: typeof Suspense, props?: (RawProps & SuspenseProps) | null, children?: RawChildren | RawSlots): VNode;

export declare function h(type: FunctionalComponent, children?: RawChildren): VNode;

export declare function h<P>(type: FunctionalComponent<P>, props?: (RawProps & P) | ({} extends P ? null : never), children?: RawChildren | RawSlots): VNode;

export declare function h(type: ComponentOptions, children?: RawChildren): VNode;

export declare function h(type: ComponentOptionsWithoutProps | ComponentOptionsWithArrayProps, props?: RawProps | null, children?: RawChildren | RawSlots): VNode;

export declare function h<O>(type: ComponentOptionsWithProps<O>, props?: (RawProps & ExtractPropTypes<O>) | ({} extends ExtractPropTypes<O> ? null : never), children?: RawChildren | RawSlots): VNode;

export declare function h(type: Constructor, children?: RawChildren): VNode;

export declare function h<P>(type: Constructor<P>, props?: (RawProps & P) | ({} extends P ? null : never), children?: RawChildren | RawSlots): VNode;

export declare function handleError(err: Error, instance: ComponentInternalInstance | null, type: ErrorTypes): void;

export declare interface HMRRuntime {
    createRecord: typeof createRecord;
    rerender: typeof rerender;
    reload: typeof reload;
}

declare type InferPropType<T> = T extends null ? any : T extends {
    type: null | true;
} ? any : T extends ObjectConstructor | {
    type: ObjectConstructor;
} ? {
    [key: string]: any;
} : T extends Prop<infer V> ? V : T;

export declare function inject<T>(key: InjectionKey<T> | string): T | undefined;

export declare function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T;

export declare function injectHook(type: LifecycleHooks, hook: Function & {
    __weh?: Function;
}, target?: ComponentInternalInstance | null, prepend?: boolean): void;

export declare interface InjectionKey<T> extends Symbol {
}

export declare function instanceWatch(this: ComponentInternalInstance, source: string | Function, cb: Function, options?: WatchOptions): StopHandle;

declare type InternalSlots = {
    [name: string]: Slot;
};
export { isReactive }
export { isReadonly }
export { isRef }

declare function isVNode(value: any): value is VNode;

export declare const KeepAlive: new () => {
    $props: KeepAliveProps;
};

export declare interface KeepAliveProps {
    include?: MatchPattern;
    exclude?: MatchPattern;
    max?: number | string;
}

declare type LegacyComponent = ComponentOptions;

declare interface LegacyOptions<Props, RawBindings, D, C extends ComputedOptions, M extends MethodOptions> {
    el?: any;
    data?: D | ((this: ComponentPublicInstance<Props>) => D);
    computed?: C;
    methods?: M;
    watch?: ComponentWatchOptions;
    provide?: Data | Function;
    inject?: ComponentInjectOptions;
    mixins?: LegacyComponent[];
    extends?: LegacyComponent;
    beforeCreate?(): void;
    created?(): void;
    beforeMount?(): void;
    mounted?(): void;
    beforeUpdate?(): void;
    updated?(): void;
    activated?(): void;
    deactivated?(): void;
    beforeUnmount?(): void;
    unmounted?(): void;
    renderTracked?: DebuggerHook;
    renderTriggered?: DebuggerHook;
    errorCaptured?: ErrorCapturedHook;
}

declare type LifecycleHook = Function[] | null;

declare const enum LifecycleHooks {
    BEFORE_CREATE = "bc",
    CREATED = "c",
    BEFORE_MOUNT = "bm",
    MOUNTED = "m",
    BEFORE_UPDATE = "bu",
    UPDATED = "u",
    BEFORE_UNMOUNT = "bum",
    UNMOUNTED = "um",
    DEACTIVATED = "da",
    ACTIVATED = "a",
    RENDER_TRIGGERED = "rtg",
    RENDER_TRACKED = "rtc",
    ERROR_CAPTURED = "ec"
}

declare type MapSources<T> = {
    [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
};
export { markNonReactive }
export { markReadonly }

declare type MatchPattern = string | RegExp | string[] | RegExp[];

export declare function mergeProps(...args: (Data & VNodeProps)[]): Data;

declare interface MethodOptions {
    [key: string]: Function;
}

declare const enum MoveType {
    ENTER = 0,
    LEAVE = 1,
    REORDER = 2
}

export declare function nextTick(fn?: () => void): Promise<void>;

declare function normalizeVNode<T, U>(child: VNodeChild<T, U>): VNode<T, U>;

export declare interface ObjectDirective<T = any> {
    beforeMount?: DirectiveHook<T>;
    mounted?: DirectiveHook<T>;
    beforeUpdate?: DirectiveHook<T>;
    updated?: DirectiveHook<T>;
    beforeUnmount?: DirectiveHook<T>;
    unmounted?: DirectiveHook<T>;
}

export declare function onActivated(hook: Function, target?: ComponentInternalInstance | null): void;

export declare const onBeforeMount: (hook: () => any, target?: ComponentInternalInstance | null) => false | void;

export declare const onBeforeUnmount: (hook: () => any, target?: ComponentInternalInstance | null) => false | void;

export declare const onBeforeUpdate: (hook: () => any, target?: ComponentInternalInstance | null) => false | void;

export declare function onDeactivated(hook: Function, target?: ComponentInternalInstance | null): void;

export declare const onErrorCaptured: (hook: ErrorCapturedHook, target?: ComponentInternalInstance | null) => void;

export declare const onMounted: (hook: () => any, target?: ComponentInternalInstance | null) => false | void;

export declare const onRenderTracked: (hook: DebuggerHook, target?: ComponentInternalInstance | null) => false | void;

export declare const onRenderTriggered: (hook: DebuggerHook, target?: ComponentInternalInstance | null) => false | void;

export declare const onUnmounted: (hook: () => any, target?: ComponentInternalInstance | null) => false | void;

export declare const onUpdated: (hook: () => any, target?: ComponentInternalInstance | null) => false | void;

export declare function openBlock(disableTracking?: boolean): void;

declare type OptionalKeys<T, MakeDefaultRequired> = Exclude<keyof T, RequiredKeys<T, MakeDefaultRequired>>;

export declare const PatchFlags: {
    TEXT: number;
    CLASS: number;
    STYLE: number;
    PROPS: number;
    NEED_PATCH: number;
    FULL_PROPS: number;
    STABLE_FRAGMENT: number;
    KEYED_FRAGMENT: number;
    UNKEYED_FRAGMENT: number;
    DYNAMIC_SLOTS: number;
    BAIL: number;
};

export declare type Plugin = PluginInstallFunction & {
    install?: PluginInstallFunction;
} | {
    install: PluginInstallFunction;
};

declare type PluginInstallFunction = (app: App, ...options: any[]) => any;

export declare function popScopeId(): void;

export declare const Portal: {
    new (): {
        $props: VNodeProps & {
            target: string | object;
        };
    };
    __isPortal: true;
};

export declare type Prop<T> = PropOptions<T> | PropType<T>;

declare type PropConstructor<T = any> = {
    new (...args: any[]): T & object;
} | {
    (): T;
};

declare interface PropOptions<T = any> {
    type?: PropType<T> | true | null;
    required?: boolean;
    default?: T | DefaultFactory<T> | null | undefined;
    validator?(value: unknown): boolean;
}

export declare type PropType<T> = PropConstructor<T> | PropConstructor<T>[];

export declare function provide<T>(key: InjectionKey<T> | string, value: T): void;

export declare function pushScopeId(id: string): void;

declare type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any);

declare type RawProps = VNodeProps & {
    _isVNode?: never;
    [Symbol.iterator]?: never;
};

declare type RawSlots = {
    [name: string]: unknown;
    $stable?: boolean;
    _?: 1;
};
export { reactive }
export { ReactiveEffect }
export { ReactiveEffectOptions }
export { readonly }

export declare function recordEffect(effect: ReactiveEffect): void;
export { Ref }
export { ref }

export declare function registerRuntimeCompiler(_compile: any): void;

declare function reload(id: string, newComp: ComponentOptions): void;

declare function renderComponentRoot(instance: ComponentInternalInstance): VNode;

declare interface RendererInternals<HostNode = any, HostElement = any> {
    patch: (n1: VNode<HostNode, HostElement> | null, // null means this is a mount
    n2: VNode<HostNode, HostElement>, container: HostElement, anchor?: HostNode | null, parentComponent?: ComponentInternalInstance | null, parentSuspense?: SuspenseBoundary<HostNode, HostElement> | null, isSVG?: boolean, optimized?: boolean) => void;
    unmount: (vnode: VNode<HostNode, HostElement>, parentComponent: ComponentInternalInstance | null, parentSuspense: SuspenseBoundary<HostNode, HostElement> | null, doRemove?: boolean) => void;
    move: (vnode: VNode<HostNode, HostElement>, container: HostElement, anchor: HostNode | null, type: MoveType, parentSuspense?: SuspenseBoundary<HostNode, HostElement> | null) => void;
    next: (vnode: VNode<HostNode, HostElement>) => HostNode | null;
    options: RendererOptions<HostNode, HostElement>;
}

export declare interface RendererOptions<HostNode = any, HostElement = any> {
    patchProp(el: HostElement, key: string, value: any, oldValue: any, isSVG?: boolean, prevChildren?: VNode<HostNode, HostElement>[], parentComponent?: ComponentInternalInstance | null, parentSuspense?: SuspenseBoundary<HostNode, HostElement> | null, unmountChildren?: (children: VNode<HostNode, HostElement>[], parentComponent: ComponentInternalInstance | null, parentSuspense: SuspenseBoundary<HostNode, HostElement> | null) => void): void;
    insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void;
    remove(el: HostNode): void;
    createElement(type: string, isSVG?: boolean): HostElement;
    createText(text: string): HostNode;
    createComment(text: string): HostNode;
    setText(node: HostNode, text: string): void;
    setElementText(node: HostElement, text: string): void;
    parentNode(node: HostNode): HostElement | null;
    nextSibling(node: HostNode): HostNode | null;
    querySelector?(selector: string): HostElement | null;
    setScopeId?(el: HostElement, id: string): void;
    cloneNode?(node: HostNode): HostNode;
    insertStaticContent?(content: string, parent: HostElement, anchor: HostNode | null, isSVG: boolean): HostElement;
}

export declare type RenderFunction = {
    (): VNodeChild;
    isRuntimeCompiled?: boolean;
};

export declare function renderList(source: unknown, renderItem: (value: unknown, key: string | number, index?: number) => VNodeChild): VNodeChild[];

export declare function renderSlot(slots: Record<string, Slot>, name: string, props?: Data, fallback?: VNodeArrayChildren): VNode;

declare type RequiredKeys<T, MakeDefaultRequired> = {
    [K in keyof T]: T[K] extends {
        required: true;
    } | (MakeDefaultRequired extends true ? {
        default: any;
    } : never) ? K : never;
}[keyof T];

declare function rerender(id: string, newRender?: RenderFunction): void;

export declare function resolveComponent(name: string): Component | undefined;

export declare function resolveDirective(name: string): Directive | undefined;

export declare function resolveDynamicComponent(component: unknown, instance: ComponentInternalInstance): Component | undefined;

export declare function resolveTransitionHooks(vnode: VNode, { appear, persisted, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled }: BaseTransitionProps, state: TransitionState, instance: ComponentInternalInstance): TransitionHooks;

export declare type RootRenderFunction<HostNode, HostElement> = (vnode: VNode<HostNode, HostElement> | null, dom: HostElement) => void;

export declare function setBlockTracking(value: number): void;

declare function setCurrentRenderingInstance(instance: ComponentInternalInstance | null): void;

export declare function setTransitionHooks(vnode: VNode, hooks: TransitionHooks): void;

declare function setupComponent(instance: ComponentInternalInstance, parentSuspense: SuspenseBoundary | null, isSSR?: boolean): Promise<void> | undefined;

export declare interface SetupContext<Events = void> {
    attrs: Data;
    slots: Slots;
    emit: Emit<Events>;
}

declare interface SFCInternalOptions {
    __scopeId?: string;
    __cssModules?: Data;
    __hmrId?: string;
    __hmrUpdated?: boolean;
}
export { shallowReactive }

export declare const ShapeFlags: {
    ELEMENT: ShapeFlags_2;
    FUNCTIONAL_COMPONENT: ShapeFlags_2;
    STATEFUL_COMPONENT: ShapeFlags_2;
    TEXT_CHILDREN: ShapeFlags_2;
    ARRAY_CHILDREN: ShapeFlags_2;
    SLOTS_CHILDREN: ShapeFlags_2;
    SUSPENSE: ShapeFlags_2;
    COMPONENT_SHOULD_KEEP_ALIVE: ShapeFlags_2;
    COMPONENT_KEPT_ALIVE: ShapeFlags_2;
    COMPONENT: ShapeFlags_2;
};

declare const enum ShapeFlags_2 {
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 2,
    STATEFUL_COMPONENT = 4,
    TEXT_CHILDREN = 8,
    ARRAY_CHILDREN = 16,
    SLOTS_CHILDREN = 32,
    SUSPENSE = 64,
    COMPONENT_SHOULD_KEEP_ALIVE = 128,
    COMPONENT_KEPT_ALIVE = 256,
    COMPONENT = 6
}

export declare type Slot = (...args: any[]) => VNode[];

export declare type Slots = Readonly<InternalSlots>;

export declare const ssrUtils: {
    createComponentInstance: typeof createComponentInstance;
    setupComponent: typeof setupComponent;
    renderComponentRoot: typeof renderComponentRoot;
    setCurrentRenderingInstance: typeof setCurrentRenderingInstance;
    isVNode: typeof isVNode;
    normalizeVNode: typeof normalizeVNode;
};

declare const Static: unique symbol;

export declare type StopHandle = () => void;

export declare const Suspense: {
    new (): {
        $props: SuspenseProps;
    };
    __isSuspense: true;
};

export declare interface SuspenseBoundary<HostNode = any, HostElement = any, HostVNode = VNode<HostNode, HostElement>> {
    vnode: HostVNode;
    parent: SuspenseBoundary<HostNode, HostElement> | null;
    parentComponent: ComponentInternalInstance | null;
    isSVG: boolean;
    optimized: boolean;
    container: HostElement;
    hiddenContainer: HostElement;
    anchor: HostNode | null;
    subTree: HostVNode;
    fallbackTree: HostVNode;
    deps: number;
    isResolved: boolean;
    isUnmounted: boolean;
    effects: Function[];
    resolve(): void;
    recede(): void;
    move(container: HostElement, anchor: HostNode | null, type: MoveType): void;
    next(): HostNode | null;
    registerDep(instance: ComponentInternalInstance, setupRenderEffect: (instance: ComponentInternalInstance, parentSuspense: SuspenseBoundary<HostNode, HostElement> | null, initialVNode: VNode<HostNode, HostElement>, container: HostElement, anchor: HostNode | null, isSVG: boolean) => void): void;
    unmount(parentSuspense: SuspenseBoundary<HostNode, HostElement> | null, doRemove?: boolean): void;
}

declare const SuspenseImpl: {
    __isSuspense: boolean;
    process(n1: VNode<any, any> | null, n2: VNode<any, any>, container: object, anchor: object | null, parentComponent: ComponentInternalInstance | null, parentSuspense: SuspenseBoundary<any, any, VNode<any, any>> | null, isSVG: boolean, optimized: boolean, rendererInternals: RendererInternals<any, any>): void;
};

export declare interface SuspenseProps {
    onResolve?: () => void;
    onRecede?: () => void;
}

export declare const Text: unique symbol;

export declare const toDisplayString: (s: unknown) => string;

export declare function toHandlers(obj: Record<string, any>): Record<string, any>;
export { toRaw }
export { toRefs }
export { TrackOpTypes }

export declare interface TransitionHooks {
    persisted: boolean;
    beforeEnter(el: object): void;
    enter(el: object): void;
    leave(el: object, remove: () => void): void;
    afterLeave?(): void;
    delayLeave?(el: object, earlyRemove: () => void, delayedLeave: () => void): void;
    delayedLeave?(): void;
}

export declare interface TransitionState {
    isMounted: boolean;
    isLeaving: boolean;
    isUnmounting: boolean;
    leavingVNodes: Map<any, Record<string, VNode>>;
}
export { TriggerOpTypes }

declare type TypedEmit<Events extends Record<string, any> = {}> = UnionToIntersection<{
    [key in keyof Required<Events>]: undefined extends Events[key] ? (event: key, payload?: Events[key]) => void : (event: key, payload: Events[key]) => void;
}[keyof Events]>;

declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export { UnwrapRef }

export declare function useCSSModule(name?: string): Record<string, string>;

export declare function useTransitionState(): TransitionState;

export declare const version: string;

export declare interface VNode<HostNode = any, HostElement = any> {
    _isVNode: true;
    type: VNodeTypes;
    props: VNodeProps | null;
    key: string | number | null;
    ref: string | Ref | ((ref: object | null) => void) | null;
    scopeId: string | null;
    children: VNodeNormalizedChildren<HostNode, HostElement>;
    component: ComponentInternalInstance | null;
    suspense: SuspenseBoundary<HostNode, HostElement> | null;
    dirs: DirectiveBinding[] | null;
    transition: TransitionHooks | null;
    el: HostNode | null;
    anchor: HostNode | null;
    target: HostElement | null;
    shapeFlag: number;
    patchFlag: number;
    dynamicProps: string[] | null;
    dynamicChildren: VNode[] | null;
    appContext: AppContext | null;
}

export declare interface VNodeArrayChildren<HostNode = any, HostElement = any> extends Array<VNodeArrayChildren<HostNode, HostElement> | VNodeChildAtom<HostNode, HostElement>> {
}

declare type VNodeChild<HostNode = any, HostElement = any> = VNodeChildAtom<HostNode, HostElement> | VNodeArrayChildren<HostNode, HostElement>;

declare type VNodeChildAtom<HostNode, HostElement> = VNode<HostNode, HostElement> | string | number | boolean | null | void;

export declare type VNodeNormalizedChildren<HostNode = any, HostElement = any> = string | VNodeArrayChildren<HostNode, HostElement> | RawSlots | null;

export declare interface VNodeProps {
    [key: string]: any;
    key?: string | number;
    ref?: string | Ref | ((ref: object | null) => void);
    onVnodeBeforeMount?: (vnode: VNode) => void;
    onVnodeMounted?: (vnode: VNode) => void;
    onVnodeBeforeUpdate?: (vnode: VNode, oldVNode: VNode) => void;
    onVnodeUpdated?: (vnode: VNode, oldVNode: VNode) => void;
    onVnodeBeforeUnmount?: (vnode: VNode) => void;
    onVnodeUnmounted?: (vnode: VNode) => void;
}

export declare type VNodeTypes = string | Component | typeof Fragment | typeof Portal | typeof Text | typeof Static | typeof Comment | typeof SuspenseImpl;

export declare function warn(msg: string, ...args: any[]): void;

export declare function watch(effect: WatchEffect, options?: WatchOptions): StopHandle;

export declare function watch<T>(source: WatchSource<T>, cb: WatchCallback<T>, options?: WatchOptions): StopHandle;

export declare function watch<T extends Readonly<WatchSource<unknown>[]>>(sources: T, cb: WatchCallback<MapSources<T>>, options?: WatchOptions): StopHandle;

export declare type WatchCallback<T = any> = (value: T, oldValue: T, onCleanup: CleanupRegistrator) => any;

export declare type WatchEffect = (onCleanup: CleanupRegistrator) => void;

declare type WatchOptionItem = string | WatchCallback | {
    handler: WatchCallback;
} & WatchOptions;

export declare interface WatchOptions {
    lazy?: boolean;
    flush?: 'pre' | 'post' | 'sync';
    deep?: boolean;
    onTrack?: ReactiveEffectOptions['onTrack'];
    onTrigger?: ReactiveEffectOptions['onTrigger'];
}

export declare type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T);

export declare function withDirectives<T extends VNode>(vnode: T, directives: DirectiveArguments): T;

export declare function withScopeId(id: string): <T extends Function>(fn: T) => T;
export { WritableComputedOptions }

export { }
