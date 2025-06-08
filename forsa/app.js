var createError = require("http-errors");
var express = require("express");
const MongoClient = require("mongodb").MongoClient;
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var cors = require("cors");
var usersRouter = require("./routes/usersRoute");
var categoryRouter = require("./routes/categoryRoute");
var propertyRouter = require("./routes/propertyRoute");
var keywordRouter = require("./routes/keywordRoute");
var notificationRouter = require("./routes/notificationRoute");
var ListRouter = require("./routes/listRoute");
var FAQRouter = require("./routes/faqRoute");
var bugRouter = require("./routes/bugRoute");
var AdRouter = require("./routes/adRoute");
var app = express();

//for production

// mongoose.connect("mongodb://waseem:waseem950@ds239936.mlab.com:39936/forsa", {
//   useNewUrlParser: true
// });

//for staging

const uri = "mongodb+srv://forsa123:forsa123@forsa-cluster-3v0uk.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri,{ useNewUrlParser: true }, function(err,connect){
  if(err) return res.status(500).json({isSuccess: false, message:'Connection with database is failed!'});
  console.log('connected to the database:')
})

// app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client")));

app.use(
  "/api",
  usersRouter,
  categoryRouter,
  propertyRouter,
  keywordRouter,
  notificationRouter,
  ListRouter,
  FAQRouter,
  bugRouter,
  AdRouter
);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(500).send("some thing went wrong");
});

module.exports = app;
