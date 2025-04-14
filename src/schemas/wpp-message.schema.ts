import z from "zod";

const wppMessageSchema = z.object({
	messageId: z.number().int()
});

export default wppMessageSchema;
