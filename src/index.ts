import Koa from "koa";

export type middleware = (ctx: Koa.Context, next: Function) => Promise<void>;
export type koaControllerAction = (ctx: Koa.Context) => Promise<any>;

export function toDecorator(middleware)  {
    return function(target: any, key: string | symbol, descriptor: any): void {
        let action: koaControllerAction = descriptor.value; 

        let decorated = async (ctx: Koa.Context) => {
            await middleware(ctx, action.bind(null, ctx));
        }
        
        descriptor.value = decorated;
    } 
}


