import { AxiosError, AxiosHeaders } from "axios";
import { Outage } from "../interfaces";
import { handleRequestError, outageWithinDateLimit } from "./utils";

const assertOutageWithinDateLimit = (beginDatetime: string, state: boolean) => {
	const passingOutage: Outage = {
		id: "dummy-id",
		end: "2023-01-01T00:00:00.000Z",
		begin: beginDatetime
	};

	expect(outageWithinDateLimit(passingOutage)).toBe(state);
};

describe("OutageWithinDateLimit fn tests", () => {

	test("Returns correctly for an outage which begins a second after the LOWER_DATETIME_LIMIT", () => {
		assertOutageWithinDateLimit("2022-01-01T00:00:01.000Z", true);
	});

	test("Returns correctly for an outage which begins on the LOWER_DATETIME_LIMIT", () => {
		assertOutageWithinDateLimit("2022-01-01T00:00:00.000Z", true);
	});

	test("Returns correctly for an outage which begins a year before the LOWER_DATETIME_LIMIT", () => {
		assertOutageWithinDateLimit("2021-01-01T00:00:00.000Z", false);
	});

	test("Returns correctly for an outage which begins a second before the LOWER_DATETIME_LIMIT", () => {
		assertOutageWithinDateLimit("2021-12-31T23:59:59.000Z", false);
	});
});

const assertHandleRequestErrorWithAxiosResponse = (statusCode: number) => {
	const error: AxiosError = {
		isAxiosError: true,
		response: {
			data: {
				message: "Dummy error message"
			},
			statusText: "",
			headers: {},
			config: {
				headers: new AxiosHeaders()
			},
			status: statusCode

		},
		name: "",
		message: "",
		toJSON: () => ({})
	};

	handleRequestError(error);

	expect(console.log).toHaveBeenCalledTimes(3);
	expect(console.log).nthCalledWith(2, `Status: ${statusCode}`);
};

describe("handleRequestError fn tests", () => {

	beforeAll(() => {
		console.log = jest.fn();
	});

	test("Handles expected response codes", () => {
		assertHandleRequestErrorWithAxiosResponse(403);
		jest.clearAllMocks();

		assertHandleRequestErrorWithAxiosResponse(404);
		jest.clearAllMocks();

		assertHandleRequestErrorWithAxiosResponse(429);
		jest.clearAllMocks();

		assertHandleRequestErrorWithAxiosResponse(500);
		jest.clearAllMocks();
	});

	test("Handles unexpected errors", () => {
		const error: Error = new Error("Dummy error message");

		handleRequestError(error);
		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toBeCalledWith("An unknown error occured retrieving outage data");
		jest.clearAllMocks();

	});
});