
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { db } = require("./firebaseconfig");
const { getNumberUsersRoom, updateRoom } = require("./services/firebaseAPI");
// let port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

let freeRooms = [];

db.collection("rooms").onSnapshot(snapshot => {
	freeRooms = [];
	snapshot.forEach(doc=>{
		const room = doc.data();
		if (room.nbUsers < 2 && !freeRooms.includes(room)) {
			freeRooms.push(room);
		}

		if (freeRooms.length > 2 && room.nbUsers <= 0) {
			doc.ref.delete();
		}
	});

	if (freeRooms.length === 0){
		const dataTime = String(Date.now());
		db.collection("rooms").doc(dataTime).set({
			nbUsers: 0,
			roomId: dataTime,
		});
	}

	console.log("freeRooms ", freeRooms);
});

app.get("/",(req,res)=>{
	// res.send("Bienvenue vidéoconférence");
	const randomNumber = Math.floor(Math.random() * freeRooms.length);
	const randomRoom = freeRooms[randomNumber].roomId;
	updateRoom(randomRoom, "add");
	res.redirect(`/${randomRoom}`);
});

app.get("/:room",(req,res)=>{
	res.render("room", {roomId: req.params.room});
});

io.on("connection", (socket) => {
	socket.on("join-room", (roomId, userId) => {
		socket.join(roomId);
		socket.to(roomId).broadcast.emit("user-connected", userId);

		socket.on("disconnect", async () => {
			await updateRoom(roomId, "delete");
			socket.to(roomId).broadcast.emit("user-disconnected", userId);
		});
	});
});

server.listen("3000");

// server.listen(port, () => {
// 	console.log(`Exemple app is on port http://localhost:${port}`);
// });