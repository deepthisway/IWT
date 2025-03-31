const http = require('http')
const {Server} = require('socket.io')
const fs = require('fs')

const server = http.createServer((req,res)=>    {
  fs.readFile('index.html', (err,data)=>  {
        if(err) {
            res.writeHead(404)
            res.end(JSON.stringify(err))
            return
        }
        else{
            res.writeHead(200)
            res.end(data)
        }
    })
})

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send data every second
    const interval = setInterval(() => {
        const serverData = {
            time: new Date().toLocaleTimeString(),
            randomValue: Math.floor(Math.random() * 100),
        };
        socket.emit('serverData', serverData);
    }, 1000);

    socket.on('disconnect', () => {
        clearInterval(interval);
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    
});