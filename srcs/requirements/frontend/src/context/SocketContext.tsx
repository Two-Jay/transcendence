import React from "react";
import io, { Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER as string;

const connectionOptions =  {
  // forceNew : true,
  reconnectionAttempts: 3, //"Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
  timeout : 10000, //before connect_error and connect_timeout are emitted.
  transports : ["websocket"],
  //closeOnBeforeunload: true,
  autoConnect: false,
  withCredentials: true,
}

export let socket : Socket = io(socketUrl, connectionOptions);
export const SocketContext = React.createContext(socket);

