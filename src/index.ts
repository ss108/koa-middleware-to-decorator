import Koa from "koa";

type middleware = (ctx: Koa.Context, next: Function) => Promise<void>;
type koaControllerAction = (ctx: Koa.Context) => Promise<any>;

function toDecorator(middleware)  {
    return function(target: any, key: string | symbol, descriptor: any): void {
        let action: koaControllerAction = target[key];
        let decorated = async (ctx: Koa.Context) => {
            await middleware(ctx, action);
        }
        
        descriptor.value = decorated;
    } 
}


function testMiddleware1(options: any){
    return async (ctx: Koa.Context, next: Function) => {
        try {
            console.log(options.foo);
            await next();
            console.log('sdfdsfs!!!');
        }

        catch (err){
            console.error(err);
        }
    }
}

const mockContext = <Koa.Context>{};

const testDecorator1 = toDecorator(testMiddleware1({foo: true}));

class FakeController {
    @testDecorator1
    async testEndpoint(ctx: Koa.Context): Promise<void> {
        console.log('oboy');
    }
}


async function test(){
   const f = new FakeController();
   f.testEndpoint(mockContext); 
}

test();




