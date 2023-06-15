# KrakenFlex Back End Test

Service will retrieve a list of [EnhancedOutages](https://github.com/olinew/kraken-flex/blob/cd08ff0a6d07148d67e6457d7e04c87a02f39363/src/integrations/interfaces.d.ts#L17) by combining all [Outages](https://github.com/olinew/kraken-flex/blob/cd08ff0a6d07148d67e6457d7e04c87a02f39363/src/integrations/interfaces.d.ts#L5) from "GET /outages" endpoint with the [SiteInfo](https://github.com/olinew/kraken-flex/blob/cd08ff0a6d07148d67e6457d7e04c87a02f39363/src/integrations/interfaces.d.ts#L23) for the specified site ID from "GET /site-info/[siteId]" - filtered to devices of that site ID & beginning on or after 2022-01-01T00:00:00.00.

Will then post these to "/site-outages/[siteId]"

## Uses:

- Node
- Typescript
- Jest for unit test
- Axios for requests
- AxiosRetry for 500's
- eslint & prettier

## Running:

- Add the API key to a .env file at the root of the project
- Run `npm install && npm start` - see package.json for more options

## Comments:

- Written FP
- There are generation libraries for swagger docs but given the scope that felt a little overkill - types have been done manually.
- Some values that could be better suited to being provisioned during CI/CD or received via CLI / Request. Eg. the desired siteId would be via request & the API key should be a GH secret
