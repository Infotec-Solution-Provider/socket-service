import { Request, Response, NextFunction } from "express";
import { Logger } from "@in.pulse-crm/utils";

function onlyLocal(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const allowedHosts = ["127.0.0.1", "localhost", "::1"];
	const requestHost = req.hostname;

	if (!allowedHosts.includes(requestHost)) {
		Logger.debug(`Blocked request from non-localhost: ${requestHost}`);

		return res
			.status(403)
			.send("Access forbidden: only localhost requests are allowed.");
	}

	return next();
}

export default onlyLocal;
