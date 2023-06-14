import axios from 'axios';
import { EnhancedOutage, Outage, SiteInfo } from '../interfaces';
import { getOutages, getSiteInfo, postSiteOutages } from './endpoints';
import * as utils from './utils';

jest.mock('axios');

// Type the mocked module
const mockedAxios = jest.mocked(axios);

const handleErrorSpy = jest.spyOn(utils, 'handleRequestError');

/**
 *  Validates that failed endpoint requests are handled correctly
 *
 * @param endpointFn the endpoint being tested
 * @param requestMethod the method used for the request
 * @param args optional args to pass to the endpointFn
 */
const assertUnsuccessfulStatusResponses = async <T, ArgT>(endpointFn: (args?: ArgT) => T, requestMethod: 'get' | 'post', args?: ArgT) => {
  mockedAxios[requestMethod]
    .mockRejectedValueOnce({ data: { message: 'Forbidden' }, status: 403 })
    .mockRejectedValueOnce({ data: { message: 'Not found' }, status: 404 })
    .mockRejectedValueOnce({ data: { message: 'Rate-limit exceed' }, status: 429 });

  await expect(endpointFn(args)).resolves.toBeUndefined();
  await expect(endpointFn(args)).resolves.toBeUndefined();
  await expect(endpointFn(args)).resolves.toBeUndefined();

  expect(mockedAxios[requestMethod]).toHaveBeenCalledTimes(3);
  expect(handleErrorSpy).toHaveBeenCalledTimes(3);
};

/**
 * Validates that endpoint functions return the correct data / state *
 *
 * @param resolvedData Any data that returns from the request promise
 * @param requestMethod the method used for the request
 * @param endpointFn the endpoint being tested
 * @param resource the resource endoint e.g. /outages
 * @param endpointArgs any args to pass the endpointFn
 * @param requestArgs args that would be passed into the underlying request
 */
const assertSuccessfulStatusResponses = async <DataType, EndArg, Res, ReqArg>(
  resolvedData: DataType,
  requestMethod: 'get' | 'post',
  endpointFn: (args?: EndArg) => Res,
  resource: string,
  endpointArgs?: EndArg,
  requestArgs?: ReqArg,
) => {
  mockedAxios[requestMethod].mockResolvedValue({ data: resolvedData, status: 200 });

  await expect(endpointFn(endpointArgs)).resolves.toStrictEqual(resolvedData);
  expect(mockedAxios[requestMethod]).toHaveBeenCalledTimes(1);

  requestArgs
    ? expect(mockedAxios[requestMethod]).toHaveBeenCalledWith(resource, requestArgs, expect.anything())
    : expect(mockedAxios[requestMethod]).toHaveBeenCalledWith(resource, expect.anything());
};

describe("'Exercise' endpoint integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOutages fn', () => {
    test('Returns an array with an outage', async () => {
      const expectedResponse: Outage = {
        id: 'dummy-id',
        begin: '2022-01-01T00:00:00.000Z',
        end: '2022-01-10T00:00:00.000Z',
      };

      assertSuccessfulStatusResponses<Outage[], never, Promise<Outage[] | undefined>, never>([expectedResponse], 'get', getOutages, '/outages');
    });

    test('Returns undefined when API return non-200 status', async () => {
      assertUnsuccessfulStatusResponses<Promise<Outage[] | undefined>, never>(getOutages, 'get');
    });
  });

  describe('getSiteInfo fn', () => {
    test('Returns information about a site', async () => {
      const expectedResponse: SiteInfo = {
        id: 'dummy-id',
        name: 'dummy-site-name',
        devices: [
          {
            id: 'device-id',
            name: 'device-name',
          },
        ],
      };

      assertSuccessfulStatusResponses<SiteInfo, string, Promise<SiteInfo | undefined>, never>(
        expectedResponse,
        'get',
        getSiteInfo,
        '/site-info/dummy-site-name',
        'dummy-site-name',
      );
    });

    test('Returns undefined when API return non-200 status', async () => {
      assertUnsuccessfulStatusResponses<Promise<SiteInfo | undefined>, string>(getSiteInfo, 'get', 'dummy-site-name');
    });
  });

  describe('postSiteOutages fn', () => {
    const outages: EnhancedOutage[] = [
      {
        id: 'dummy-id',
        begin: '2022-01-01T00:00:00.000Z',
        end: '2022-01-10T00:00:00.000Z',
        name: 'dummy-device-name',
      },
    ];

    test('Returns true on successful post', async () => {
      assertSuccessfulStatusResponses<boolean, { siteId: string; siteOutages: EnhancedOutage[] }, Promise<boolean | undefined>, EnhancedOutage[]>(
        true,
        'post',
        postSiteOutages,
        '/site-outages/dummy-site-name',
        { siteId: 'dummy-site-name', siteOutages: outages },
        outages,
      );
    });

    test('Returns undefined when API return non-200 status', async () => {
      assertUnsuccessfulStatusResponses<Promise<boolean | undefined>, { siteId: string; siteOutages: EnhancedOutage[] }>(postSiteOutages, 'post', {
        siteId: 'dummy-site-name',
        siteOutages: outages,
      });
    });
  });
});
