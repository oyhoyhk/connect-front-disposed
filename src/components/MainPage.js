import React, { useEffect, useRef, useState } from 'react';
import '../style.css';
import defaultProfileImage from '../img/default_profile.jpg';
import axios from 'axios';
import AddFriends from './AddFriends';
import socketio from 'socket.io-client';
import NoList from './NoList';
import SearchBox from './SearchBox';
import Notice from './Notice';
import FriendsList from './FriendsList';
import Chat from './Chat';
import ChatList from './ChatList';
import TagContainer from './TagContainer';
import EditTags from './EditTags';
import RandomChattingLists from './RandomChattingLists';

const MainPage = ({ SERVER }) => {
	const [tab, setTab] = useState('friend');
	const [userInfo, setUserInfo] = useState({
		uid: null,
		tel: null,
		nickname: null,
		addFriends: [],
		profileImage: null,
		friendsList: [],
		randomProfileImage: null,
		recieveAddFriends: [],
		sid: null,
		statusMessage: null,
		tags: null,
		useRandomChatting: null,
	});
	const userInfoRef = useRef(userInfo);
	const [addFriends, openAddFriends] = useState(false);
	const [connectedUsers, setConnectedUsers] = useState(0);
	const [noticeToggle, openNotice] = useState(false);
	const [editTags, openEditTags] = useState(false);
	const [chat, setChat] = useState({
		active: false,
		otherPerson: null,
	});
	const socket = socketio.connect(SERVER);
	const socketRef = useRef(socket);
	useEffect(() => {
		// axios.get(SERVER + '/login/' + sessionStorage.uid).then(res => {
		// 	console.log(res.data);
		// 	setUserInfo({ ...res.data });
		// 	console.log(socket);
		// });
		socket.emit('login', sessionStorage.uid, res => {
			console.log('when emit login', res);
			setUserInfo({
				...res.userData,
			});
			userInfoRef.current = {
				...res.userData,
			};
		});
		socket.on('connectedUsers', users => {
			setConnectedUsers(users);
		});
		// socket.on('logout', users => {
		// 	setConnectedUsers(users);
		// });

		socket.on('canceled_add_friend', result => {
			console.log('when socket.on canceled_add_friend', result);
			console.log(userInfoRef.current);
			console.log(result);
			setUserInfo({
				...userInfoRef.current,
				receivedAddFriends: result,
			});
		});
		socket.on('update_msg', result => {
			console.log('socket on update_msg', result);
		});
		socket.on('receive_add_friend', result => {
			console.log('when received add friend', userInfoRef.current);
			setUserInfo({
				...userInfoRef.current,
				receivedAddFriends: result,
			});
		});
		socket.on('add_friend_accepted', (result, receiver) => {
			setUserInfo({
				...userInfoRef.current,
				friendsList: result.friendsList,
				addFriends: result.addFriends,
			});
			new Notification(`${receiver}?????? ?????? ????????? ?????????????????????.`);
		});
		socket.on('add_friend_refused', (result, receiver) => {
			setUserInfo({
				...userInfoRef.current,
				friendsList: result.friendsList,
				addFriends: result.addFriends,
			});
			new Notification(`${receiver}?????? ?????? ????????? ?????????????????????.`);
		});
		socket.on('friend_login', uid => {
			setUserInfo({
				...userInfoRef.current,
				friendsList: userInfoRef.current.friendsList.map(el => {
					if (el.uid === Number(uid))
						return {
							...el,
							status: 1,
						};
					return el;
				}),
			});
		});
		socket.on('friend_logout', uid => {
			setUserInfo({
				...userInfoRef.current,
				friendsList: userInfoRef.current.friendsList.map(el => {
					if (el.uid === Number(uid))
						return {
							...el,
							status: 0,
						};
					return el;
				}),
			});
		});

		socket.on('received_msg', (sender, msg) => {
			console.log('in MainPage socekt received_msg');
			if (chat.active && chat.otherPerson.uid === Number(sender)) {
				return;
			}
		});
		return () => {
			// ???????????? ????????? ???????????? ????????????
			socket.emit('logout', sessionStorage.uid);
			socket.disconnect();
		};
	}, []);
	const switchTab = () => {
		if (tab === 'friend') {
			setTab('chatting');
		} else {
			setTab('friend');
		}
	};
	const toggleRandomChatting = () => {
		setUserInfo({
			...userInfoRef.current,
			useRandomChatting: userInfo.useRandomChatting === 1 ? 0 : 1,
		});
		axios.post(SERVER + '/toggle_random_chatting', {
			uid: userInfo.uid,
			useRandomChatting: userInfo.useRandomChatting === 1 ? 0 : 1,
		});
	};
	const updateTags = tags => {
		setUserInfo({
			...userInfo,
			tags,
		});
	};
	const setAddFriendsList = data => {
		setUserInfo({
			...userInfoRef.current,
			addFriends: data,
		});
	};
	const setRecentChatList = data => {
		setUserInfo({
			...userInfo,
			chatList: [...data],
		});
	};
	const toggleNotice = () => {
		openNotice(!noticeToggle);
	};
	const openChat = target => {
		setChat({
			active: !chat.active,
			otherPerson: chat.active ? null : target,
		});
	};
	const onLogout = () => {
		socket.emit('logout', sessionStorage.uid);
		delete sessionStorage.uid;
		window.location.href = '/';
		// axios.get(SERVER + '/logout/' + sessionStorage.uid).then(res => {
		// 	console.log(res);
		// 	delete sessionStorage.uid;
		// 	window.location.href = '/';
		// });
	};
	return (
		<div className="mainPage">
			<div className="left">
				<div className="myProfile">
					<div className="text"> {userInfo.nickname} </div>
					<div
						className="myProfileImage"
						style={{
							backgroundImage:
								userInfo.profileImage !== 'null'
									? `url(${userInfo.profileImage ? SERVER + '/' + userInfo.profileImage : defaultProfileImage})`
									: defaultProfileImage,
							backgroundSize: '100% 100%',
						}}
					></div>
				</div>
				{userInfo.useRandomChatting ? (
					<div className="randomProfile">
						<div className="text"> {userInfo.nickname} </div>
						<div
							className="randomProfileImage"
							style={{
								backgroundImage: `url(${
									userInfo.randomProfileImage !== null ? SERVER + '/' + userInfo.randomProfileImage : defaultProfileImage
								})`,
								backgroundSize: '100% 100%',
							}}
						></div>
					</div>
				) : (
					''
				)}
				<div className="siteInfo"> ?????? ?????? ?????? ?????????: {connectedUsers || ''} </div>
			</div>
			<div className="right">
				<div className="menus">
					<div className="upper">
						<div onClick={switchTab} className={`menu ${tab === 'friend' ? 'currentTab' : ''}`}>
							??? ???
						</div>
						<div onClick={switchTab} className={`menu ${tab === 'chatting' ? 'currentTab' : ''}`}>
							{' '}
							??? ???{' '}
						</div>
					</div>
					<div className="lower">
						<div className="help"> </div>
						<div
							className={
								userInfo.receivedAddFriends && userInfo.receivedAddFriends.length === 0 ? 'notice' : 'notice notice_on'
							}
							onClick={toggleNotice}
						>
							{userInfo.receivedAddFriends && userInfo.receivedAddFriends.length !== 0 ? (
								<div className="receivedAddFriendsCount"> {userInfo.receivedAddFriends.length} </div>
							) : (
								''
							)}
						</div>
						<div className="setting"> </div>
						<div className="logout" onClick={onLogout}></div>
						{noticeToggle ? (
							<Notice
								setNotice={openNotice}
								userInfo={userInfo}
								setUserInfo={setUserInfo}
								SERVER={SERVER}
								list={userInfo.receivedAddFriends}
							/>
						) : (
							''
						)}
					</div>
				</div>
				<div className="contents">
					{tab === 'friend' ? (
						<div className="contentsLeft">
							<SearchBox />
							{userInfo.friendsList && userInfo.friendsList.length !== 0 ? (
								<FriendsList openChat={openChat} SERVER={SERVER} userInfo={userInfo} />
							) : (
								''
							)}
							<NoList
								SERVER={SERVER}
								userInfo={userInfo}
								setUserInfo={setUserInfo}
								openAddFriends={openAddFriends}
								closeNotice={openNotice}
							/>
						</div>
					) : (
						<div className="contentLeft">
							<SearchBox />
							{userInfo.chatList && userInfo.chatList.length !== 0 ? (
								<ChatList SERVER={SERVER} userInfo={userInfo} openChat={openChat} />
							) : (
								''
							)}
						</div>
					)}
					<div className="contentsRight">
						<div className="randomChatContainer">
							<div className="randomChatSwitch">
								<div className="text"> ?????? ?????? </div>
								<div className={`randomChatToggle`} onClick={toggleRandomChatting}>
									<div className={`randomChatButton ${userInfo.useRandomChatting ? 'clicked' : ''}`}> </div>
								</div>
							</div>
							{userInfo.useRandomChatting ? <TagContainer editTags={openEditTags} tags={userInfo.tags} /> : ''}
							{userInfo.useRandomChatting ? <RandomChattingLists /> : ''}
						</div>
					</div>
				</div>
			</div>
			{addFriends ? (
				<AddFriends
					socket={socket}
					onClose={openAddFriends}
					setAddFriendsList={setAddFriendsList}
					SERVER={SERVER}
					addFriends={userInfo.addFriends}
				/>
			) : (
				''
			)}
			{chat.active ? (
				<Chat SERVER={SERVER} socket={socketRef.current} chat={chat} openChat={openChat} setRecentChatList={setRecentChatList} />
			) : (
				''
			)}
			{editTags ? <EditTags socket={socket} updateTags={updateTags} tags={userInfo.tags} editTags={openEditTags} /> : ''}
		</div>
	);
};

export default MainPage;
