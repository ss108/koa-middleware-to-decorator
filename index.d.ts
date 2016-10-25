import * as Koa from "koa";
import { middleware, middlewareFactory, jsDecorator, decoratorFactory, koaControllerAction } from "./src";

declare module "mw2dec" {
    export function toOptionedDecorator(middleware: middleware): jsDecorator;
    export function toDecorator(middlewareFactory): decoratorFactory;
}

