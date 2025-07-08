class WebSocketService {
    constructor(url) {
      this.socket = new WebSocket(url);
      this.queue = [];
      this.isConnected = false;
  
      this.socket.onopen = () => {
        this.isConnected = true;
        this.queue.forEach(msg => this.send(msg));
        this.queue = [];
      };
    }

    send(message) {
      if (this.isConnected) {
        this.socket.send(JSON.stringify(message));
      } else {
        this.queue.push(message);
      }
    }
  
    onMessage(callback) {
      this.socket.onmessage = event => {
        const data = JSON.parse(event.data);
        console.log(data)
        callback(data);
      };
    }
  
    onClose(callback) {
      this.socket.onclose = callback;
    }
  }
  
  const webSocketService = new WebSocketService("wss://sathishzuss-ai-answer-avlidation.hf.space/ws");
  export default webSocketService;
  
