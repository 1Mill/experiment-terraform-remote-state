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

const main = async() => {
	const cloudevent = create({
		id: ID,
		type: 'hello-world.2020-07-06',
	});
	await publish({
		broker,
		cloudevent,
	});

	await subscribe({
		broker,
		handler: async({ isEnriched }) => {
			if (isEnriched) {
				console.log('Enriched message was got');
			} else {
				console.log('Sending enriched message');
				return true;
			}
		},
		types: ['hello-world.2020-07-06']
	});
};
main();
