"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemas = exports.loginInput = exports.createUserInput = void 0;
const zod_1 = require("zod");
exports.createUserInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    password: zod_1.z.string().min(6),
});
exports.loginInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const userCore = {
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
};
const createUserResponse = zod_1.z.object({
    id: zod_1.z.string(),
    ...userCore,
});
const loginResponse = zod_1.z.object({
    token: zod_1.z.string(),
});
exports.userSchemas = {
    createUserResponse,
    loginResponse,
};
