import Koa from "koa";

export type middleware = (ctx: Koa.Context, next: Function) => Promise<void>;
export type middlewareFactory = (options: any) => middleware;
export type koaControllerAction = (ctx: Koa.Context) => Promise<any>;
export type jsDecorator = (target: any, key?: PropertyKey, descriptor?: PropertyDescriptor) => void;
export type decoratorFactory = (options: any) => jsDecorator;

function _decorateClass(target: any, mw: middleware) {
    let keys: PropertyKey[] = Reflect.ownKeys(target.prototype).filter((k) => {
        return k !== "constructor";
    });

    console.log(keys);

    // keys.forEach((k) => {
    //     console.log(k);
    //     let descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target.prototype, k);
    //     // console.log(descriptor);
    //     // console.log(target.prototype);
    //     _decorateMethod(mw, target.prototype, k, descriptor);
    // });

    for (let k of keys) {
        console.log(k);
        let descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target.prototype, k);
        // console.log(descriptor);
        // console.log(target.prototype);
        _decorateMethod(mw, target.prototype, k, descriptor);
    }
}

function _decorateMethod(mw: middleware, target: any, key: PropertyKey, descriptor: PropertyDescriptor) {
    let action: koaControllerAction = descriptor.value;

    let decorated = async (ctx: Koa.Context) => {
        await mw(ctx, action.bind(null, ctx));
    }

    descriptor.value = decorated;
}

export function toStaticDecorator(middleware: middleware): jsDecorator {
    return function (target: any, key?: PropertyKey, descriptor?: PropertyDescriptor): void {
        if (!key && !descriptor) {
            _decorateClass(target, middleware);
        }

        else {
            _decorateMethod(middleware, target, key, descriptor);
        }
    }
}

export function toDynamicDecorator(factory: middlewareFactory): decoratorFactory {
    return function (options: any) {
        let middleware = factory(options);
        return toStaticDecorator(middleware);
    }
}

