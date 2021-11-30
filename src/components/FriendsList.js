import React from 'react';

const Friend = ({ openChat, SERVER, info }) => {
	return (
		<div className="friend">
			<div className={info.status ? 'online' : 'offline'} title={info.status ? 'Online' : 'Offline'}></div>
			<div className="profileImage" style={{ backgroundImage: `url(${SERVER}/${info.profileImage})` }}></div>
			<div className="name">{info.name}</div>
			<div className="statusMessage">{info.statusMessage}</div>
			<div className="chatButton" onClick={() => openChat(info)}>
				채팅
			</div>
		</div>
	);
};
const FriendsList = ({ openChat, SERVER, userInfo }) => {
	return (
		<div className="friendsList">
			{userInfo.friendsList &&
				userInfo.friendsList.map(friend => <Friend openChat={openChat} info={friend} key={friend.uid} SERVER={SERVER} />)}
		</div>
	);
};

export default FriendsList;
