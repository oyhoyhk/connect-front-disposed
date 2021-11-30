const NoList = ({ SERVER, userInfo, setUserInfo, openAddFriends, closeNotice }) => {
	return (
		<div className="noList">
			오른쪽 버튼을 눌러 친구를 추가해보세요
			<div
				className="addFriend"
				onClick={() => {
					openAddFriends(true);
					closeNotice(false);
				}}
			></div>
		</div>
	);
};

export default NoList;
