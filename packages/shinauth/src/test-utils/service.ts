import { Socket } from "node:net";

export type TestService = {
	host: string;
	port: number;
	timeoutMs?: number;
};

export function isTestServiceAvailable({
	host,
	port,
	timeoutMs = 500,
}: TestService) {
	return new Promise<boolean>((resolve) => {
		const socket = new Socket();
		let settled = false;

		const finish = (available: boolean) => {
			if (settled) return;
			settled = true;
			socket.destroy();
			resolve(available);
		};

		socket.setTimeout(timeoutMs);
		socket.once("connect", () => finish(true));
		socket.once("error", () => finish(false));
		socket.once("timeout", () => finish(false));
		socket.connect(port, host);
	});
}
