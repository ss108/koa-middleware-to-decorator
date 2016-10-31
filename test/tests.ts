import { Expect, AsyncTest } from "alsatian";
import * as lib from "../src";


const testMwFac1 = (options?: any) => {
    return async function (ctx, next) {
        ctx.foo = "bar";
        await next();
    }
}

const testMwFac2 = (options: { isCool: boolean }) => {
    return async function (ctx, next) {
        ctx.foo = "not bar";
        ctx.isCool = options.isCool;
        await next();
    }
}

const testClassMw = (options?: any) => {
    return async function (ctx, next) {
        ctx.user = {
            username: "bogus",
            role: 1
        }

        await next();
    }
}

const mw1 = lib.toDecorator(testMwFac1);
const mw2 = lib.toDecorator(testMwFac2);
const dynClassMw = lib.toDecorator(testClassMw);

const mw3 = lib.toOptionedDecorator(testMwFac1({}));
const mw4 = lib.toOptionedDecorator(testMwFac2({ isCool: true }));

@dynClassMw({})
class TestDynamic {

    private _someLogic(id: number) {
        return {};
    }

    @mw1({})
    getSomething(ctx) {
        ctx.body = "hi";
    }

    @mw1({})
    @mw2({ isCool: false })
    getSomethingElse(ctx) {
        ctx.body = "stuff";
    }

    // @mw3
    // someOtherEndpoint(ctx) {
    //     ctx.body = "some other endpoint";
    // }

    // @mw3
    // @mw4
    // yetEvenAnotherAdditionalEndpoint(ctx) {
    //     ctx.body = "#somanyendpoint";
    // }
}

export class DynamicOptionTests {
    @AsyncTest()
    async testSingleOnMethod() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.getSomething(ctx);
        Expect(ctx.foo).toBe("bar");
    }

    @AsyncTest()
    async testMultiOnMethod() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.getSomethingElse(ctx);
        Expect(ctx.foo).toBe("not bar");
    }

    @AsyncTest()
    async testOptions() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.getSomethingElse(ctx);
        Expect(ctx.isCool).toBe(false);
    }

    @AsyncTest()
    async testCtrlActionExpectation() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.getSomething(ctx);
        Expect(ctx.body).toBe("hi");
    }

    @AsyncTest()
    async testClassDecoration() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.getSomething(ctx);
        Expect(ctx.user).toEqual({username: "bogus", role: 1});
    }
}

// export class StaticOptionTests {
//     @AsyncTest()
//     async testSingleOnMethod() {
//         let instance = new TestClassMethod();
//         let ctx: any = {};
//         await instance.someOtherEndpoint(ctx);
//         Expect(ctx.foo).toBe("bar");
//     }

//     @AsyncTest()
//     async testMultiOnMethod() {
//         let instance = new TestClassMethod();
//         let ctx: any = {};
//         await instance.yetEvenAnotherAdditionalEndpoint(ctx);
//         Expect(ctx.foo).toBe("not bar");
//     }

//     @AsyncTest()
//     async testOptions() {
//         let instance = new TestClassMethod();
//         let ctx: any = {};
//         await instance.yetEvenAnotherAdditionalEndpoint(ctx);
//         Expect(ctx.isCool).toBe(true);
//     }

//     @AsyncTest()
//     async testCtrlActionExpectation() {
//         let instance = new TestClassMethod();
//         let ctx: any = {};
//         await instance.yetEvenAnotherAdditionalEndpoint(ctx);
//         Expect(ctx.body).toBe("#somanyendpoint");
//     }
// }

