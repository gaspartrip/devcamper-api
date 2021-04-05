const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");
const users = require("./routes/users");
const auth = require("./routes/auth");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const reviews = require("./routes/reviews");
const errorHandler = require("./middleware/error");

connectDB();
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/reviews", reviews);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
