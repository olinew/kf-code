export interface ErrorResponse {
	message: string;
}

export interface Outage {
	id: string;
	// example: 44c02564-a229-4f51-8ded-cc7bcb202566
	// The device ID the outage pertains to
	begin: string;
	// example: 2022-01-01T00:00:00.000Z
	// Outage begin date time
	end: string;
	// example: 2022-01-02T12:01:59.123Z
	// Outage end date time
}

export interface EnhancedOutage extends Outage {
	name: string;
	// example: Partridge
	// The display name of the device the outage pertains to
}

export interface SiteInfo {
	id: string;
	// example: pear-tree
	// The ID of the site
	name: string;
	// example: Pear Tree
	// The display name of the site
	devices: Array<{
		id: string;
		// example: 44c02564-a229-4f51-8ded-cc7bcb202566
		// The device ID
		name: string;
		// example: Partridge
		// The display name of the device
	}>;
}