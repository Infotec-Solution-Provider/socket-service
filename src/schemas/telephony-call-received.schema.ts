import z from "zod";

const telephonyCallReceivedSchema = z.object({
	uniqueid: z.string(),
	callerNumber: z.string(),
	callerName: z.string().nullable(),
	ramal: z.string(),
	operatorId: z.number().nullable(),
	instance: z.string(),
	receivedAt: z.string(),
	receptiveCallId: z.number().nullable(),
});

export default telephonyCallReceivedSchema;
