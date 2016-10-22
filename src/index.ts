import Koa from "koa";

type middleware = (ctx: Koa.Context, next: Function) => Promise<void>;
type koaControllerAction = (ctx: Koa.Context) => Promise<any>;

export function toDecorator(middleware)  {
    return function(target: any, key: string | symbol, descriptor: any): void {
        let action: koaControllerAction = descriptor.value; 

        let decorated = async (ctx: Koa.Context) => {
            await middleware(ctx, action);
        }
        
        descriptor.value = decorated;
    } 
}


