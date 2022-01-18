import { useRef, useState, useEffect } from 'react';
const Tag = ({ tag, deleteTags }) => {
	return (
		<div className="tag">
			<div>{tag}</div>
			<div className="delete" onClick={() => deleteTags(tag)}></div>
		</div>
	);
};
const EditTags = ({ socket, updateTags, tags, editTags }) => {
	const [tempTags, setTempTags] = useState([]);
	useEffect(() => {
		if (tags === '') {
			setTempTags([]);
		} else {
			setTempTags([...tags.split('@$@$')]);
		}
	}, []);
	const inputRef = useRef();
	const inputChange = e => {
		if (e.target.value !== '') {
			const last = e.target.value[e.target.value.length - 1];
			if ((last.charCodeAt() >= 48 && last.charCodeAt() <= 57) || (last.charCodeAt() >= 97 && last.charCodeAt() <= 122)) {
				inputRef.current.style.width = 18 + e.target.value.length * 9 + 'px';
			} else {
				inputRef.current.style.width = 18 + e.target.value.length * 19 + 'px';
			}
		} else {
			inputRef.current.style.width = '130px';
		}
	};
	const deleteTags = tag => {
		setTempTags(tempTags.filter(el => el !== tag));
	};
	const inputSubmit = e => {
		if (e.key === 'Enter') {
			const val = inputRef.current.value;
			if (tempTags.length === 20) {
				alert('태그는 20개까지 입력 가능합니다!');
				inputRef.current.value = '';
				inputRef.current.style.width = '130px';
				return;
			}
			if (tempTags.includes(val)) {
				alert('이미 존재하는 태그입니다!');
				inputRef.current.value = '';
				inputRef.current.style.width = '130px';
				return;
			} else {
				setTempTags([...tempTags, val]);
			}
			inputRef.current.value = '';
			inputRef.current.style.width = '130px';
		}
	};
	const submitTags = () => {
		updateTags(tempTags.join('@$@$'));
		socket.emit('updateTags', sessionStorage.uid, tempTags.join('@$@$'));
	};
	return (
		<div className="editTagsBackground">
			<div className="editTags">
				<input
					className="tagInput"
					onKeyPress={inputSubmit}
					onChange={inputChange}
					ref={inputRef}
					type="text"
					maxLength="10"
					placeholder="태그 입력..."
				/>
				<div className="tagLists">
					{tempTags.length !== 0 ? (
						tempTags.map(tag => <Tag tag={tag} deleteTags={deleteTags} key={tag} />)
					) : (
						<div>태그를 추가해주세요.</div>
					)}
				</div>
				<button
					className="close"
					onClick={() => {
						editTags(false);
						submitTags();
					}}
				>
					완 료
				</button>
			</div>
		</div>
	);
};

export default EditTags;
