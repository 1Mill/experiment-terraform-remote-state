const ioMiddlewareWildcard = require('socketio-wildcard')();
const {
	KAFKA_EVENTTYPE,
	createBroker,
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

console.log(broker);
