import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { EnhancedOutage, Outage, SiteInfo } from '../interfaces';
import { handleRequestError } from './utils';

const API_HEADER_NAME = 'x-api-key';

const axiosConfig: AxiosRequestConfig = {
  baseURL: process.env.BASE_URL,
  headers: {
    [API_HEADER_NAME]: process.env.API_KEY,
  },
};

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => error.status === 500 || error.response?.status === 500,
});

/**
 * @returns All outages in the system
 */
export const getOutages = async (): Promise<Outage[] | undefined> => {
  try {
    const { data } = await axios.get<Outage[]>('/outages', axiosConfig);
    return data;
  } catch (err) {
    handleRequestError(err);
  }
};

/**
 * @returns Site info for a given site ID
 */
export const getSiteInfo = async (siteId: string): Promise<SiteInfo | undefined> => {
  try {
    const { data } = await axios.get<SiteInfo>(`/site-info/${siteId}`, axiosConfig);
    return data;
  } catch (err) {
    handleRequestError(err);
  }
};

/**
 * Send outages for a given site
 *
 * @param {siteId, siteOutages} site ID string & EnhancedOutage[]
 * @returns boolean
 */
export const postSiteOutages = async ({ siteId, siteOutages }: { siteId: string; siteOutages: EnhancedOutage[] }): Promise<boolean | undefined> => {
  try {
    await axios.post(`/site-outages/${siteId}`, siteOutages, axiosConfig);
    return true;
  } catch (err) {
    handleRequestError(err);
  }
};
