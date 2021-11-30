import axios from 'axios';

const Wait = ({ setNotice, userInfo, setUserInfo, data, SERVER }) => {
	const onSubmitWaitListButton = e => {
		const req = e.target.textContent === '수락' ? 'accept' : 'refuse';
		axios.get(`${SERVER}/${req}_add_friend/${sessionStorage.uid}/${data.uid}`).then(res => {
			console.log(res.data);
			console.log(userInfo);
			const { friendsList, receivedAddFriends } = res.data;
			setNotice(false);
			setUserInfo({ ...userInfo, receivedAddFriends, friendsList });
		});
		console.log(data);
	};

	return (
		<div className="waiting">
			<div className="profileImage" style={{ backgroundImage: `url(${SERVER}/${data.profileImage})` }}></div>
			<div className="name">{data.name.length <= 3 ? data.name : data.name.substr(0, 3) + '..'}</div>
			<div className="statusMessage">
				{data.statusMessage.length <= 8 ? data.statusMessage : data.statusMessage.substr(0, 8) + '..'}
			</div>
			<div className="acceptButton" onClick={onSubmitWaitListButton}>
				수락
			</div>
			<div className="refuseButton" onClick={onSubmitWaitListButton}>
				거절
			</div>
		</div>
	);
};

const Notice = ({ setNotice, userInfo, setUserInfo, list, SERVER }) => {
	return (
		<div className="noticeContainer">
			{list && list.length !== 0
				? list.map(element => (
						<Wait
							setNotice={setNotice}
							userInfo={userInfo}
							setUserInfo={setUserInfo}
							SERVER={SERVER}
							key={element.uid}
							data={element}
						/>
				  ))
				: '새로운 친구 요청이 없습니다.'}
		</div>
	);
};

export default Notice;
