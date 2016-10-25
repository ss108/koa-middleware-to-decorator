import Koa from "koa";

export type middleware = (ctx: Koa.Context, next: Function) => Promise<void>;
export type middlewareFactory = (options: any) => middleware;
export type koaControllerAction = (ctx: Koa.Context) => Promise<any>;
export type jsDecorator = (target: any, key: string | symbol, descriptor: any) => void;
export type decoratorFactory = (options: any) => jsDecorator;

function _decorateClass(target){
    let keys: PropertyKey[] = Reflect.ownKeys(target).filter((k) => {
       return k !== "constructor"; 
    });

}

export function toOptionedDecorator(middleware): jsDecorator {
    return function (target: any, key: string | symbol, descriptor: any): void {
        let action: koaControllerAction = descriptor.value;

        let decorated = async (ctx: Koa.Context) => {
            await middleware(ctx, action.bind(null, ctx));
        }

        descriptor.value = decorated;
    }
}

function toDecorator(factory: middlewareFactory): decoratorFactory {
    return function (options: any) {
        let middleware = factory(options);
        return function (target: any, key: string | symbol, descriptor: any): void {
            let action: koaControllerAction = descriptor.value;

            let decorated = async (ctx: Koa.Context) => {
                await middleware(ctx, action.bind(null, ctx));
            }

            descriptor.value = decorated;
        }
    }
}


