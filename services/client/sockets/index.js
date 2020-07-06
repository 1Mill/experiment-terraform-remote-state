const ioMiddlewareWildcard = require('socketio-wildcard')();
const { KAFKA_EVENTTYPE, subscribe } = require('@1mill/cloudevents');
const { getSecret } = require('./utilities/getSecret');

const server = require('http').createServer();
const io = require('socket.io')(server);
io.use(ioMiddlewareWildcard);

const main = async() => {
	subscribe({
		handler: async () => {
			console.log('Hello world!');
		},
		id: 'services.client.sockets',
		subscribeEventType: KAFKA_EVENTTYPE,
		subscribeTo: process.env.RAPIDS_URLS.split(','),
		types: ['hello-world.2020-07-05']
	});
};
main();
