import app from '@adonisjs/core/services/app';
import Ws from '#services/Ws';
import ChannelManager from '#services/ChannelManager';

let channelManager: ChannelManager | null = null;

app.ready(() => {
  Ws.boot();
  const io = Ws.io;

  channelManager = new ChannelManager();
  io?.on('connection', async (socket) => {
    console.log(`Client connected: ${socket.id}`);
  });
});

auth: () => import('#middleware/auth_middleware');

export { channelManager }; // Export this channelManager instance for app to work correctly