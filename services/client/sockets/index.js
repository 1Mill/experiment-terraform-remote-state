const ioMiddlewareWildcard = require('socketio-wildcard')();
const { KAFKA_EVENTTYPE, subscribe } = require("@1mill/cloudevents");

const server = require('http').createServer();
const io = require('socket.io')(server);
io.use(ioMiddlewareWildcard);

// subscribe({
// 	handler: async() => {
// 		console.log('Hello world!');
// 	},
// 	id: 'services.client.sockets',
// 	subscribeEventType: KAFKA_EVENTTYPE,
// 	subscribeTo: [],
// 	types: ['hello-world.2020-07-05']
// })

const main = async() => {
	const { getSecret } = require('./utility/getSecret');
	const data = await getSecret({ path: './secrets/brokers.sops.json' });
	console.log(data);
};
main();
