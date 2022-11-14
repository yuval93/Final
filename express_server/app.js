global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
const express = require("express");
const cors = require("cors");
const socketLogic = require("./controller-layer/socket-logic");
// import socketLogic from "./controller-layer/socket-logic";



// const database = require("./database/database");
const product_controller = require("./controller-layer/product-controller");
const auth_controller = require("./controller-layer/auth-controller");
const category_controller = require("./controller-layer/category-controller");
const marker_controller = require("./controller-layer/marker-controller");
const tweeter_controller = require("./controller-layer/tweeter-controller");
const log = require("./middleware/logger");
// const preventDelete = require("./middleware/prevent-delete");
const fileUpload = require("express-fileupload");
const verifyLoggedIn = require("./middleware/verify-logged-in");

// 1. Create REST API server
const expressServer = express();
// expressServer.use(cors({origin: ["http://localhost:4200/", "http://cnn.com/"]}));
expressServer.use(cors());
expressServer.use(fileUpload());

expressServer.use(log);
// expressServer.use(preventDelete);


// 2. Configure REQUEST parser to use JSON (PARSER that automaticlaly parses JSON into JS objects)
expressServer.use(express.json()); // REST API works with JSON 
// expressServer.use(express.urlencoded({extended: true})); // HTML Form submit

expressServer.use((err, request, response, next) => {
    response.status(err.status).send(err.message);
});

expressServer.use("/token/verify", verifyLoggedIn, (request, response) => {

});
expressServer.use("/api/auth", auth_controller);
expressServer.use("/api/products", product_controller);
expressServer.use("/api/categories", category_controller);
expressServer.use("/api/markers", marker_controller);
expressServer.use("/api/tweeter", tweeter_controller);



expressServer.use("*", (request, response) => {
    response.status(404).send("Route not found.");
});

// 4. Open server for client requests using a specific port +
// Listen using express but get back a listener object: 

const httpServer = expressServer.listen(3000, () => console.log("Server is listening in port 3000..."));
socketLogic.initSocketIo(httpServer);






