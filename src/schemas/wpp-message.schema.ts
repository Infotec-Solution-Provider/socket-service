import z from "zod";

const wppMessageSchema = z.object({
	id: z.string(),
	text: z.string(),
});

export default wppMessageSchema;
