import { z } from 'zod';
export declare const createTodoInput: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
}>;
export type CreateTodoInput = z.infer<typeof createTodoInput>;
