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


// function testMiddleware(options: any){
//     return async (ctx: Koa.Context, next: Function) => {
//         try {
//             console.log(options.foo);
//             await next();
//             console.log('sdfdsfs!!!');
//         }

//         catch (err){
//             console.error(err);
//         }
//     }
// }

// function anotherOne(options?: any){
//     return async (ctx: Koa.Context, next: Function) => {
//         console.log("first");
//         await next();
//     }
// }

// const mockContext = <Koa.Context>{};

// const testDecorator = toDecorator(testMiddleware({foo: true}));
// const anotherDecorator = toDecorator(anotherOne({}));

// class FakeController {
//     @anotherDecorator
//     @testDecorator
//     async testEndpoint(ctx: Koa.Context): Promise<void> {
//         console.log('oboy');
//     }
// }


// async function test(){
//    const f = new FakeController();
//    f.testEndpoint(mockContext); 
// }

// test();




