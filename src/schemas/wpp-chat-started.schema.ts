import z from "zod";

const wppChatStartedSchema = z.object({
	chatId: z.number().int()
});

export default wppChatStartedSchema;
