"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodoInput = void 0;
const zod_1 = require("zod");
// 1. O VALIDADOR (usado no runtime pelo zValidator)
exports.createTodoInput = zod_1.z.object({
    title: zod_1.z.string().min(1, "Título é obrigatório"),
    description: zod_1.z.string().optional(),
});
