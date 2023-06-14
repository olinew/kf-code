import { AxiosError, isAxiosError } from 'axios';
import { ErrorResponse, Outage } from '../interfaces';

const LOWER_DATETIME_LIMIT = new Date('2022-01-01T00:00:00.000Z');

/**
 * Checks if an outage.begin datetime is greater than or equal to LOWER_DATETIME_LIMIT
 *
 * @param outage The outage to check
 * @returns bool
 */
export const outageWithinDateLimit = (outage: Outage) => new Date(outage.begin) >= LOWER_DATETIME_LIMIT;

/**
 * Handles errors according to type
 *
 * @param err The error caught in the endpoint fns
 */
export const handleRequestError = (err: Error | AxiosError<ErrorResponse>) => {
  if (isAxiosError(err)) {
    const error: ErrorResponse = err.response?.data;
    console.log('Failed to retrieve outage data');
    console.log(`Status: ${err.response?.status}`);
    console.log(`Message: ${error.message}`);
  } else {
    console.log('An unknown error occured retrieving outage data');
  }
};
