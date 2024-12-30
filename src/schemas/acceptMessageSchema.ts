import { z } from "zod";

export const acceptMessageSchema = z.object({
    exceptMessage: z.boolean(),
})