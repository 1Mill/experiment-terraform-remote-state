const {
	KAFKA_EVENTTYPE,
	createBroker,
	publish,
	subscribe,
} = require('@1mill/cloudevents');

const ID = 'services.modify-string';
const RAPIDS_URLS = process.env.RAPIDS_URLS.split(',');

const broker = createBroker({
	eventType: KAFKA_EVENTTYPE,
	id: ID,
	urls: RAPIDS_URLS,
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
	types: ['modify-string.2020-07-07']
});
