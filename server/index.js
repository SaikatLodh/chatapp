const cluster = require("node:cluster");
const os = require("os");
const connectDb = require("./app/config/db");
const { server } = require("./app/app");
// const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const PORT = process.env.BASE_URL || 5000;
  connectDb()
    .then(() =>
      server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    )
    .catch((error) => console.error(error));
}
