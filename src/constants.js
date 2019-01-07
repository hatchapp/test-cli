const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SOCKET_PORT = process.env.SOCKET_PORT || '8080';
const CLIENT_PORT = process.env.CLIENT_PORT || '8080';

module.exports = {
	EVENTS: {
		ROOM_CONNECTED: 'room_connected',
		ROOM_CHANGE: 'room_change',
		HATCH_STATUS: 'hatch',
		ANSWER: 'answer',
		TELL_ANSWER: 'tell_answer',
		RIGHT_ANSWER: 'right_answer',
		ROUND_START: 'round_start',
		ROUND_END: 'round_end',
		USER_DISCONNECTED: 'user_disconnect',
		ANOTHER_USER_CONNECTED: 'another_user_connected',
		LEADERBOARD_UPDATE: 'leaderboard_update',
		SAY: 'say',
		TELL: 'tell',
		PICK_ANSWER: 'pick_answer',
		CHOOSE_CATEGORY: 'choose_category',
	},
	DEFAULT_SOCKET_URL: `http://${SERVER_HOST}:${SOCKET_PORT}`,
	DEFAULT_CLIENT_URL: `http://${SERVER_HOST}:${CLIENT_PORT}`,
};
