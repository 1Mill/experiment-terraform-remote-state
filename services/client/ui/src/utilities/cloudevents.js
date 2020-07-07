import io from 'socket.io-client';

const socket = io(process.env.VUE_APP_SOCKETS_URL);

export const publish = ({ type, payloads }) => {
	socket.emit({ type, payloads });
};

export const subscribe = ({ handler, type }) => {
	socket.on(type, (payload) => {
		handler({ payload });
	});
};
