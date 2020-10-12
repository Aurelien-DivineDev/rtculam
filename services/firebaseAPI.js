
const { db } = require("../firebaseconfig");

const getNumberUsersRoom = (roomId) => {
	return db
		.collection("rooms")
		.get()
		.then((res) => {
			let roomNbUsers;
			res.forEach((element) => {
				const room = element.data();
				if (roomId == room.roomId) roomNbUsers = room.nbUsers;
			});
			return roomNbUsers;
		});
};

const updateRoom = async (roomId, operator) => {
	try {
		let nbUsers = await getNumberUsersRoom(roomId);
		const newNbUsers = operator === "add" ? nbUsers+1 : nbUsers-1;
		db.collection("rooms").doc(roomId).set({
			nbUsers: newNbUsers
		},
		{ merge: true}
		);
	} catch (error) {
		console.log(error);
	}
};


module.exports = {
	getNumberUsersRoom,
	updateRoom,
};