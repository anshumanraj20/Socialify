const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const app = express();
const { authSocket, socketServer } = require("./socketServer");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");
const PostLike = require("./models/PostLike");
const Post = require("./models/Post");

dotenv.config();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://socialify-ch3i.onrender.com/"],
  },
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));


const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const mongoURI = process.env.MONGO_URI;

const connectToDatabse = async () =>{
try{
    await mongoose.connect(mongoURI,connectionParams);
    console.log("database connected succesfully");
}
catch(err){
    console.log("database connection error",err);
}

};
connectToDatabse();


httpServer.listen(process.env.PORT || 4000, () => {
  console.log("Listening");
});

app.use(express.json());
app.use(cors());
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
