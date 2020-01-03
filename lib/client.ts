import Message from "./message"

export function initPingPongRunReload(client: any, reload: () => void) {
  client.onopen = () => {
    client.send(Message.Ping)
  }
  client.onmessage = message => {
    if (message.data == Message.Pong) {
      client.send(Message.Ping)
      client.close()
      reload()
    }
  }
}
