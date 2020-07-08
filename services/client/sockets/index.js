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
	handler: async({ data, enrichment, isEnriched }) => {
		try {
			if (!isEnriched) { return; }
			console.log('data:', data)
			console.log('enrichment: ', enrichment);
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

io.on('connect', socket => {
	socket.on('*', packet => {
		try {
			const [{ type, payloads = [{}] }] = packet.data;
			payloads.forEach(payload => {
				const cloudevent = create({
					data: payload,
					id: socket.id,
					source: packet.nsp,
					type,
				});
				publish({
					broker,
					cloudevent,
				});

				console.log(cloudevent);
			});
		} catch (err) {
			console.error(err);
		}
	});
});

server.listen(process.env.PORT, () => {
	console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`);
});
