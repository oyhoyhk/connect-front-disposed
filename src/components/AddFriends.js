import React, { useRef, useState } from 'react';
import axios from 'axios';
import WaitingList from './WaitingList';

const AddFriends = ({ socket, onClose, setAddFriendsList, SERVER, addFriends }) => {
	const inputRef = useRef();
	const messageRef = useRef();
	const [list, setList] = useState(null);
	const [searchTarget, setTarget] = useState('');
	const onSearchTargetChange = e => {
		e.target.value = e.target.value.replace(/[^A-Za-z0-9]/gi, '');
		setTarget(e.target.value);
	};
	const clickAddFriend = () => {
		axios.post(`${SERVER}/send_add_friend_request`, { sender: Number(sessionStorage.uid), receiver: list.uid }).then(res => {
			if (res.data) setAddFriendsList(res.data);

			setList(null);
		});
	};
	const searchFriends = () => {
		if (searchTarget === '') return;
		axios.get(SERVER + '/search_user/' + searchTarget + '/' + sessionStorage.uid).then(res => {
			const data = res.data;

			if (data.length === 0) {
				messageRef.current.textContent = '아이디를 확인해주세요';
			} else {
				setList(...data);
				console.log(data);
				messageRef.current.textContent = '';
			}
		});
		inputRef.current.value = '';
		setTarget('');
	};
	return (
		<div className="addFriendsBackground">
			<div className="addFriends">
				<div className="title">친구 찾기</div>
				<div className="inputBox">
					<input
						ref={inputRef}
						type="text"
						maxLength="15"
						placeholder="상대방 아이디를 입력해주세요"
						onChange={onSearchTargetChange}
					/>
					<button onClick={searchFriends}>찾 기</button>
				</div>
				<div className="messageBox" ref={messageRef}></div>
				{list ? (
					<div className="target">
						<div
							className="targetProfileImage"
							style={{ backgroundImage: `url(${SERVER}/${list.profileImage})`, backgroundSize: '100% 100%' }}
						></div>
						<div className="below">
							<div className="targetName">{list.name}</div>
							<div className="targetStatusMessage">
								{list.statusMessage
									? list.statusMessage.length > 12
										? list.statusMessage.substr(0, 13) + '...'
										: list.statusMessage
									: ''}
							</div>
							<div onClick={clickAddFriend} className="addButton"></div>
						</div>
					</div>
				) : (
					''
				)}
			</div>
			{addFriends && addFriends.length !== 0 ? (
				<div className="waiting">
					<div className="title">승인 대기 중</div>
					<div className="waitingListContainer">
						{addFriends.map(list => (
							<WaitingList
								socket={socket}
								setAddFriendsList={setAddFriendsList}
								key={list.RECEIVER}
								SERVER={SERVER}
								info={list}
							/>
						))}
					</div>
				</div>
			) : (
				''
			)}
			<div
				className="exitButton"
				onClick={() => onClose(false)}
				style={{ left: addFriends && addFriends.length !== 0 ? 'calc(50% + 480px)' : 'calc(50% + 20px)' }}
			></div>
		</div>
	);
};

export default AddFriends;
