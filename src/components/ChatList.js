import React from 'react';

const ChatRoom = ({ openChat, SERVER, info }) => {
	return (
		<div className="chatList">
			<div className="profileImage" style={{ backgroundImage: `url(${SERVER}/${info.profileImage})` }}></div>
			<div className="name">{info.name}</div>
			<div className="lastMsg">{info.msg}</div>
			<div className="chatButton" onClick={() => openChat(info)}>
				채팅
			</div>
		</div>
	);
};
const ChatList = ({ openChat, SERVER, userInfo }) => {
	console.log(userInfo.chatList);
	return (
		<div className="chatListContainer">
			{userInfo.chatList &&
				userInfo.chatList.map(chat => <ChatRoom SERVER={SERVER} openChat={openChat} info={chat} key={chat.uid} />)}
		</div>
	);
};

export default ChatList;
