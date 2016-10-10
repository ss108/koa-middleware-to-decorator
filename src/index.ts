import Koa from "koa";

type middleware = (ctx: Koa.Context, next: Function) => Promise<void>;
type middlwareFactory = (options: any) => middleware;

function toDecorator(mw: middlewareFactory) : (middleware) => void {
    
    return function(target: middleware, key?: any, descriptor?: any): void {
        console.log(`${target.name} key: ${key}`);
        console.log(descriptor);
    } 
    
}


function testMiddleware(options: any){
    return async (ctx: Koa.Context, next: Function) => {
        try {
            await next();
        }
        
        catch (err){
            console.error(err);
        }
    }
}


toDecorator(testMiddleware);
