const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("dotenv");
const { userSocketIDs, onlineUsers, setIO } = require("./config/socketStore");

const app = express();
const server = http.createServer(app);

env.config({ path: ".env" });

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Configure the CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, postman or curl)
      if (!origin) return callback(null, true);
      // Check if the origin is in our list of allowed origins
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// Your custom header setting middleware is completely removed as it's redundant and a source of conflict.

// =======================================================
// === SOCKET.IO CORS CONFIGURATION ===
// =======================================================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Use the same production URL here
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});
setIO(io);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("trust proxy", 1);

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRouter");
const chatRoute = require("./routes/chatRoute");
const adminRoute = require("./routes/adminRoute");
const { socketAuthenticator } = require("./middleware/socketAuthenticator");
const {
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} = require("./config/socketkeys");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id);
  onlineUsers.add(user._id.toString());

  io.emit(ONLINE_USERS, [...onlineUsers]);

  socket.on(START_TYPING, ({ filterMe, filterOther }) => {
    filterOther.forEach((element) => {
      if (userSocketIDs.has(element)) {
        const getUserSocketID = userSocketIDs.get(element);
        socket.to(getUserSocketID).emit(START_TYPING, filterMe);
      }
    });
  });

  socket.on(STOP_TYPING, ({ filterMe, filterOther }) => {
    filterOther.forEach((element) => {
      if (userSocketIDs.has(element)) {
        const getUserSocketID = userSocketIDs.get(element);
        socket.to(getUserSocketID).emit(STOP_TYPING, filterMe);
      }
    });
  });

  socket.on("disconnect", () => {
    if (userSocketIDs.has(user._id.toString()))
      userSocketIDs.delete(user._id.toString());
    if (onlineUsers.has(user._id.toString()))
      onlineUsers.delete(user._id.toString());
    io.emit(ONLINE_USERS, [...onlineUsers]);
  });
});

module.exports = {
  server,
};
