import z from "zod";

const internalChatFinishedSchema = z.object({
	chatId: z.number().int()
});

export default internalChatFinishedSchema;
