import z from "zod";

const wwebjsAuthSchema = z.object({
    phone: z.string(),
});

export default wwebjsAuthSchema;
