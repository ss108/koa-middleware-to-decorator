import { Expect, Test, AsyncTest } from "alsatian";
import Koa from "koa";

import * as lib from "../src";

const testMwFac1 = (options: any) => {
  return async function (ctx, next) {
    // console.log('hi');
    // console.log(ctx);
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

export class ExampleTestFixture {

  get mockCtx() {
    let b = {};
    return <Koa.Context>(b);
  }

  @Test()
  public exampleTest() {
    class TestController {
      @mw1({})
      // @mw2({})
      getSomething(ctx) {
        return ctx;
      }
    }
    let ctx = this.mockCtx;
    ctx.body = "b";

    const ctrl = new TestController();
    let res = ctrl.getSomething(ctx);

    // Expect(res.foo).toBe("bar");

  }
}