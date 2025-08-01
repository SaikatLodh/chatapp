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

env.config({ path: ".env" });

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});
setIO(io);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS,HEAD,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

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
