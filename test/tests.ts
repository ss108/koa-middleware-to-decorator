import { Expect, AsyncTest, FocusTest} from "alsatian";
import * as lib from "../src";

const applyBar = (options?: any) => {
    return async function (ctx, next) {
        ctx.foo = "bar";
        await next();
    }
}

const negateBar = (options: { isCool: boolean }) => {
    return async function (ctx, next) {
        ctx.foo = "not bar";
        ctx.isCool = options.isCool;
        await next();
    }
}

const testClassMw = (options: {role: number}) => {
    return async function (ctx, next) {
        ctx.user = {
            username: "bogus",
            role: options.role 
        }

        await next();
    }
}

const dynamicBar = lib.toDynamicDecorator(applyBar);
const dynamicNegateBar = lib.toDynamicDecorator(negateBar);
const dynClassMw = lib.toDynamicDecorator(testClassMw);

const staticBar = lib.toStaticDecorator(applyBar({}));
const staticNegateBar = lib.toStaticDecorator(negateBar({ isCool: true }));
const staticClassMw = lib.toStaticDecorator(testClassMw({role: 3}));

@dynClassMw({role: 1})
class TestDynamic {

    // private _someLogic(id: number) {
    //     return {};
    // }

    // @dynamicBar({})
    async expectBar(ctx) {
        ctx.body = "hi";
    }

    // @dynamicBar({})
    // @dynamicNegateBar({ isCool: false })
    async expectNotBar(ctx) {
        ctx.body = "stuff";
    }
}

// @staticClassMw
// class TestStatic {

//     @staticBar
//     async expectBar(ctx) {
//         ctx.body = "hi";
//     }
// }

export class DynamicOptionTests {
    @AsyncTest()
    async testSingleOnMethod() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.expectBar(ctx);
        Expect(ctx.foo).toBe("bar");
    }

    @AsyncTest()
    async testMultiOnMethod() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.expectNotBar(ctx);
        Expect(ctx.foo).toBe("not bar");
    }

    @AsyncTest()
    async testOptions() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.expectNotBar(ctx);
        Expect(ctx.isCool).toBe(false);
    }

    @AsyncTest()
    async testCtrlActionExpectation() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.expectBar(ctx);
        Expect(ctx.body).toBe("hi");
    }

    @FocusTest
    @AsyncTest()
    async testClassDecoration() {
        let instance = new TestDynamic();
        let ctx: any = {};
        await instance.expectBar(ctx);
        Expect(ctx.user).toEqual({username: "bogus", role: 1});
    }
}

// export class StaticOptionTests {
//     @AsyncTest()
//     async testSingleOnMethod() {
//         let instance = new TestStatic();
//         let ctx: any = {};
//         await instance.expectBar(ctx);
//         Expect(ctx.foo).toBe("bar");
//     }

// }

