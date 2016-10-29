import * as lib from "../src";
import * as assert from "assert";

const testMwFac1 = (options: any) => {
    return async function (ctx, next) {
        ctx.foo = "bar";
        await next();
    }
}

const testMwFac2 = (options: any) => {
    return async function (ctx, next) {
        ctx.foo = "not bar";
        ctx.yes = "no";
        await next();
    }
}

const mw1 = lib.toDecorator(testMwFac1);
const mw2 = lib.toDecorator(testMwFac2);

class TestClassMethod {
    @mw1({})
    getSomething(ctx) {
        console.log(ctx);
        return ctx;
    }
}

async function testSingleOnMethod() {
    let instance = new TestClassMethod();
    let ctx = {};
    let res = await instance.getSomething(ctx);
    console.log(ctx);
    // assert.equal(res.foo, "bar");
}

(async function(){
    await testSingleOnMethod();
}());
