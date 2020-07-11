const {
	KAFKA_EVENTTYPE,
	createAuthentication,
	createBroker,
	publish,
	subscribe,
} = require('@1mill/cloudevents');

const authentication = createAuthentication({
	type: 'sasl',
	config: {
		mechanism: 'scram-sha-256',
		password: process.env.RAPIDS_PASSWORD,
		username: process.env.RAPIDS_USERNAME,
	},
});
const broker = createBroker({
	authentication,
	eventType: KAFKA_EVENTTYPE,
	id: 'services.modify-string',
	urls: (process.env.RAPIDS_URLS || '').split(','),
});

subscribe({
	broker,
	handler: async({ data, isEnriched }) => {
		try {
			if (isEnriched) { return; }

			const string = data;
			const numbers = string.match(/[0-9 , \.]+/g) || [];
			return numbers.join('');
		} catch(err) {
			console.error(err);
			publish({
				broker,
				cloudevent: { ...cloudevent, dlx: 'dead-letter' },
			});
		}
	},
	types: ['ddnlanm4-modify-string.2020-07-07']
});
