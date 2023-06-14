import 'dotenv/config';
import * as exerciseEndpoints from './integrations/exercise/endpoints';
import { outageWithinDateLimit } from './integrations/exercise/utils';
import { EnhancedOutage } from './integrations/interfaces';

const SITE_ID = 'norwich-pear-tree';

const postEnhancedOutageData = async (siteId: string) => {
  const allOutages = await exerciseEndpoints.getOutages();

  if (!allOutages) {
    return;
  }

  const siteInfo = await exerciseEndpoints.getSiteInfo(siteId);

  if (!siteInfo) {
    return;
  }

  const deviceIdNameMap = siteInfo.devices.reduce((acc, device) => {
    acc.set(device.id, device.name);
    return acc;
  }, new Map<string, string>());

  const filteredOutages = allOutages.filter((outage) => deviceIdNameMap.has(outage.id) && outageWithinDateLimit(outage));

  const siteOutages = filteredOutages.map((outage) => ({ ...outage, name: deviceIdNameMap.get(outage.id) } as EnhancedOutage));

  (await exerciseEndpoints.postSiteOutages({ siteId, siteOutages })) && console.log(`Succesfull POST of site outage data for ID: ${siteId}`);
};

postEnhancedOutageData(SITE_ID);
