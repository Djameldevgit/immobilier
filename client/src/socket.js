import { io } from "socket.io-client";

// Conectar con el servidor de Socket.io
const socket = io("http://localhost:5000"); // Asegúrate de que coincida con el backend

export default socket;