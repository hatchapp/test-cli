const bunyan = require('bunyan');
const socketio = require('socket.io-client');
const { EVENTS } = require('./constants');
const logger = bunyan.createLogger({ name: 'socket-client' });
const settings = JSON.parse(process.argv[2] || '{}');
const url = process.argv[3] || 'http://localhost:8080';
const readline = require('readline');
const { roomId, userId } = settings || {};
const socket = socketio(url, {
	query: { roomId, userId },
});

['connect', 'disconnect', ...Object.keys(EVENTS).map((key) => EVENTS[key])].forEach((event) => {
	socket.on(event, function(){
		logger.info({ event, args: [...arguments] }, 'event happened');
	});
});

const interface = readline.createInterface(process.stdin);

interface.on('line', (line) => {
	if(line === "room_change") {
		socket.emit(EVENTS.ROOM_CHANGE, 'hellocan');
	} else {
		const sayData = {say: line, date: Date.now()};
		logger.info({data: sayData}, 'sent say');
		socket.emit(EVENTS.SAY, sayData);
	}
});

interface.on('close', () => logger.info('closed'));
