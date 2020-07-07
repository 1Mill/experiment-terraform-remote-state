const ioMiddlewareWildcard = require('socketio-wildcard')();
const {
	KAFKA_EVENTTYPE,
	create,
	createBroker,
	publish,
	subscribe,
} = require('@1mill/cloudevents');

const server = require('http').createServer();
const io = require('socket.io')(server);
io.use(ioMiddlewareWildcard);

const ID = 'services.client.sockets';
const RAPIDS_URLS = process.env.RAPIDS_URLS.split(',');

const broker = createBroker({
	eventType: KAFKA_EVENTTYPE,
	id: ID,
	urls: RAPIDS_URLS,
});

subscribe({
	broker,
	handler: async({ enrichment, isEnriched }) => {
		try {
			if (!isEnriched) { return; }
			console.log(enrichment);
		} catch (err) {
			console.err(err);
			publish({
				broker,
				cloudevent: { ...cloudevent, dlx: 'dead-letter' },
			});
		}
	},
	types: ['modify-string.2020-07-07'],
});

setInterval(async() => {
	const cloudevent = create({
		data: 'this-is-my-random-string',
		id: ID,
		type: 'modify-string.2020-07-07',
	});
	await publish({
		broker,
		cloudevent,
	});
}, 5000);
