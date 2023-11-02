let io;

module.exports = {
    init: server => {
        io = require('socket.io')(server, {
            cors: {
                origin: ["http://localhost:4200", "http://localhost:56545", "http://192.168.7.50:4200"],
                methods: ["GET", "POST"]
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket not definded');
        }
        return io;
    }
}