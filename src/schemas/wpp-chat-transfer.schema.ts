import z from "zod";

const wppChatTransferSchema = z.object({
	chatId: z.number().int()
});

export default wppChatTransferSchema;
