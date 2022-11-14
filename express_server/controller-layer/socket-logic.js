// import { Server as SocketIoServer, Socket } from "socket.io";
// const SocketIoServer = require("socket.io");
const { Server } = require("socket.io");

let socketIoServer;


        function initSocketIo(httpServer) {
            const options = {
                cors: { origin: "*" }
            };
            socketIoServer = new Server(httpServer, options);
            socketIoServer.sockets.on("connection", (socket) => {
                console.log("One client has been connected...");
                socket.on("disconnect", () => {
                    console.log("One client has been disconnected...");
                });
            });
        }

        function emitAddProduct(product) {
            console.log("admin-add-product")
            socketIoServer.sockets.emit("admin-add-product", product);
        }
        
        function emitUpdateProduct(product) {
            console.log("admin-update-product")
            socketIoServer.sockets.emit("admin-update-product", product);
        }
        
        function emitDeleteProduct(id) {
            console.log("admin-delete-product")
            socketIoServer.sockets.emit("admin-delete-product", id);
        }


module.exports =   {
    initSocketIo, 
    emitAddProduct,
    emitUpdateProduct,
    emitDeleteProduct
}