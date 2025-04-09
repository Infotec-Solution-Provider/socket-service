import z from "zod";

const wppChatFinishedSchema = z.object({
	chatId: z.number().int()
})

export default wppChatFinishedSchema;
