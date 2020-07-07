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
	handler: async({ isEnriched, cloudevent }) => {
		try {
			if ([true, false, false, false, false][Math.floor(Math.random() * 5)]) {
				throw new Error('Some kind of error happened');
			}
			if (isEnriched) {
				console.log('Enriched message was got');
			} else {
				console.log('Sending enriched message');
				return true;
			}
		} catch (err) {
			console.error(err);
			publish({
				broker,
				cloudevent: {
					...cloudevent,
					dlx: 'dead-letter',
				},
			});
		}
	},
	types: ['hello-world.2020-07-06'],
});

subscribe({
	broker: createBroker({
		eventType: KAFKA_EVENTTYPE,
		id: 'dead-letter-example',
		urls: RAPIDS_URLS,
	}),
	handler: async () => {
		console.log('Dead letter message was got');
	},
	types: ['dead-letter'],
});

setInterval(async() => {
	const cloudevent = create({
		id: ID,
		type: 'hello-world.2020-07-06',
	});
	await publish({
		broker,
		cloudevent,
	});
}, 5000);
