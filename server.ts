import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import http from "http";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  // Matchmaking state
  let waitingPlayer: any = null;

  io.on("connection", (socket) => {
    socket.on("search", () => {
      if (waitingPlayer && waitingPlayer.id !== socket.id) {
        // Match found!
        const matchId = `match_${Math.random().toString(36).substr(2,9)}`;
        const player1 = waitingPlayer;
        const player2 = socket;
        
        waitingPlayer = null;

        player1.join(matchId);
        player2.join(matchId);

        player1.emit("matched", { matchId, color: "white" });
        player2.emit("matched", { matchId, color: "black" });
      } else {
        waitingPlayer = socket;
      }
    });

    socket.on("cancel_search", () => {
      if (waitingPlayer && waitingPlayer.id === socket.id) {
        waitingPlayer = null;
      }
    });

    socket.on("move", ({ matchId, move }) => {
      socket.to(matchId).emit("moved", { move });
    });

    socket.on("resign", ({ matchId }) => {
      socket.to(matchId).emit("opponent_resigned");
    });

    socket.on("leave_match", ({ matchId }) => {
      socket.leave(matchId);
      socket.to(matchId).emit("opponent_disconnected");
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          socket.to(room).emit("opponent_disconnected");
        }
      }
    });

    socket.on("disconnect", () => {
      if (waitingPlayer && waitingPlayer.id === socket.id) {
        waitingPlayer = null;
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
