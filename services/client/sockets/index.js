const ioMiddlewareWildcard = require('socketio-wildcard')();
const { v3: { createEventStream } } = require('@1mill/cloudevents');

const server = require('http').createServer();
const io = require('socket.io')(server);
io.use(ioMiddlewareWildcard);

const rapids = createEventStream({
	id: 'services.client.sockets',
	// mechanism: 'scram-sha-256',
	// password: process.env.RAPIDS_PASSWORD,
	protocal: 'kafka',
	urls: (process.env.RAPIDS_URLS || '').split(','),
	// username: process.env.RAPIDS_USERNAME,
})

rapids.listen({
	handler: async ({ enrichmentdata, id, isEnriched, type }) => {
		try {
			if (!isEnriched) { return }
			io.to(id).emit(type, enrichmentdata)
		} catch (err) {
			console.error(err)
		}
	},
	types: ['ddnlanm4-modify-string.2020-07-07'],
})

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
