const ioMiddlewareWildcard = require('socketio-wildcard')();
const {
	KAFKA_EVENTTYPE,
	create,
	createAuthentication,
	createBroker,
	publish,
	subscribe,
} = require('@1mill/cloudevents');

const server = require('http').createServer();
const io = require('socket.io')(server);
io.use(ioMiddlewareWildcard);

const authentication = process.env.RAPIDS_PASSWORD && process.env.RAPIDS_USERNAME
	? createAuthentication({
		type: 'sasl',
		config: {
			mechanism: 'scram-sha-256',
			password: process.env.RAPIDS_PASSWORD,
			username: process.env.RAPIDS_USERNAME,
		},
	})
	: {};
const broker = createBroker({
	authentication,
	eventType: KAFKA_EVENTTYPE,
	id: 'services.client.sockets',
	urls: (process.env.RAPIDS_URLS || '').split(','),
});

subscribe({
	broker,
	handler: async({ enrichment, id, isEnriched, type }) => {
		try {
			if (!isEnriched) { return; }
			io.to(id).emit(type, enrichment);
		} catch (err) {
			console.err(err);
			publish({
				broker,
				cloudevent: { ...cloudevent, dlx: 'dead-letter' },
			});
		}
	},
	types: ['ddnlanm4-modify-string.2020-07-07'],
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
			});
		} catch (err) {
			console.error(err);
		}
	});
});

server.listen(process.env.PORT, () => {
	console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`);
});
