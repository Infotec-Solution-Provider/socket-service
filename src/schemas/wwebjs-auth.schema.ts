import z from "zod";

const wwebjsAuthSchema = z.object({
    phone: z.string(),
	success: z.boolean()
});

export default wwebjsAuthSchema;
