"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
function toDecorator(middleware) {
    return function (target, key, descriptor) {
        let action = descriptor.value;
        let decorated = (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield middleware(ctx, action);
        });
        descriptor.value = decorated;
    };
}
exports.toDecorator = toDecorator;
