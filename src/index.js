const bunyan = require('bunyan');
const { Socket, Client } = require('@hatchapp/client');

const settings = JSON.parse(process.argv[2] || '{}');
const logger = bunyan.createLogger({ name: 'socket-client' });
const { EVENTS, DEFAULT_SOCKET_URL, DEFAULT_CLIENT_URL } = require('./constants');
const { createSocket } = Socket({ url: DEFAULT_SOCKET_URL });
const { createAnonymous } = Client({ backend: { base_url: DEFAULT_CLIENT_URL } });

const readline = require('readline');
const { roomId = 'test' } = settings || {};

let lineHandler = null;
const interface = readline.createInterface(process.stdin);

interface.on('line', (line) => lineHandler !== null ? lineHandler(line) : null);
interface.on('close', () => logger.info('closed'));

async function main() {
	const {token$, client$, stop: stopClient} = await createAnonymous();
	const {socket$, stop: stopSocket} = createSocket(token$, roomId);

	const createSocketLineEmitter = socket => line => {
		if (line === "room_change") {
			socket.emit(EVENTS.ROOM_CHANGE, 'hellocan');
		} else {
			const sayData = {say: line, date: Date.now()};
			logger.info({data: sayData}, 'sent say');
			socket.emit(EVENTS.SAY, sayData);
		}
	};

	function registerToSocket(socket) {
		logger.info('registering to socket');
		lineHandler = createSocketLineEmitter(socket);
		['connect', 'disconnect', ...Object.keys(EVENTS).map((key) => EVENTS[key])].forEach((event) => {
			socket.on(event, function () {
				logger.info({event, args: [...arguments]}, 'event happened');
			});
		});
	}

	socket$.subscribe(registerToSocket, (err) => logger.error('console register error', err));
}

main().catch((err) => logger.error(err));
