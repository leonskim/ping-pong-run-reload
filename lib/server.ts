import { Server } from "ws"
import { execSync } from "child_process"
import Message from "./message"

const printInfo = () => {
  console.log("================================================")
  console.log(" Please reload iOS Simulator / Android Emulator")
  console.log("================================================")
}

export function run(){
  enum Status  { Ready, Running, Done }
  try {
    const server = new Server({ port: 9696 })
    printInfo()
    let status: Status = Status.Ready
    server.on("error", e => {
      console.error("WebSocket Error: " + e)
      server.close()
    })
    server.on("connection", conn => {
      const [ , ,  preworkCommand, mainCommand] = process.argv
      conn.on("message", message => {
        if (message == Message.Ping) {
          switch(status) {
            case Status.Ready:
              status = Status.Running
              preworkCommand && execSync(preworkCommand)
              conn.send(Message.Pong)
              break
            case Status.Running:
              status = Status.Done
              mainCommand && execSync(mainCommand)
              conn.send(Message.Pong)
              break
            case Status.Done:
              conn.send(Message.Pong)
              server.close()
              break
          }
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
}
