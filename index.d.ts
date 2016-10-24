import * as Koa from "koa";
import {middleware, koaControllerAction} from "./src";

declare module "mw2dec" {
    export function toDecorator(middleware: middleware) : void;
}

