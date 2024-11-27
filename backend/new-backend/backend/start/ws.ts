import app from '@adonisjs/core/services/app';
import Ws from '#services/Ws';
import ChannelManager from '#services/ChannelManager';

let channelManager: ChannelManager | null = null; // Fix typo: Rename 'channelManger' to 'channelManager'

app.ready(() => {
  Ws.boot();
  const io = Ws.io;

  channelManager = new ChannelManager(); // Properly assign to the correctly named variable
  io?.on('connection', async (socket) => {
    console.log(`Client connected: ${socket.id}`);
  });
});

auth: () => import('#middleware/auth_middleware');

export { channelManager }; // Export the correctly named variable