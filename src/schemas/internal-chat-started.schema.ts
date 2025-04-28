import z from "zod";

const internalChatStartedSchema = z.object({
	chatId: z.number().int()
});

export default internalChatStartedSchema;
