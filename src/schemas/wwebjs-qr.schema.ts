import z from "zod";

const wwebjsQrSchema = z.object({
	qr: z.string(),
	phone: z.string()
});

export default wwebjsQrSchema;
