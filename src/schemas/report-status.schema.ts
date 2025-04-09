import z from "zod";

const reportStatusSchema = z.object({
	id: z.number(),
	type: z.string(),
	progress: z.number().optional(),
	isCompleted: z.boolean(),
	isFailed: z.boolean(),
	error: z.string().optional(),
	fileId: z.number().optional(),
	messages: z.number().optional(),
	chats: z.number().optional(),
});

export default reportStatusSchema;
