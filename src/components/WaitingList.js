import axios from 'axios';
import React from 'react';

const WaitingList = ({ socket, setAddFriendsList, SERVER, info }) => {
	const onDelete = () => {
		axios.delete(SERVER + '/cancel_add_friend', { data: { sender: Number(sessionStorage.uid), receiver: info.RECEIVER } }).then(res => {
			console.log(res.data);
			setAddFriendsList(res.data);
		});
		// socket.emit('delete_add_friend', { sender: Number(sessionStorage.uid), receiver: info.RECEIVER });
	};
	return (
		<div className="waitingList">
			<div className="profileImage" style={{ backgroundImage: `url(${SERVER}/${info.profileImage})` }}></div>
			<div className="name">{info.name}</div>
			<div className="statusMessage">
				{info.statusMessage
					? info.statusMessage.length > 8
						? info.statusMessage.substr(0, 7) + '...'
						: info.statusMessage
					: '...'}
			</div>
			<div className="cancel" onClick={onDelete}></div>
		</div>
	);
};

export default WaitingList;
