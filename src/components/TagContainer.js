import { useEffect, useState } from 'react';

const Tag = ({ tag }) => {
	return <div className="tag">{tag}</div>;
};
const TagContainer = ({ editTags, tags }) => {
	const [filter, setFilter] = useState([]);
	useEffect(() => {
		if (tags !== '') {
			setFilter(tags.split('@$@$'));
			console.log(filter);
		} else {
			setFilter();
		}
	}, []);
	return (
		<div className="tagContainer">
			{tags !== '' ? tags.split('@$@$').map(tag => <Tag tag={tag} />) : <div>태그를 추가해주세요</div>}
			<div className="edit" onClick={() => editTags(true)}>
				Edit
			</div>
		</div>
	);
};
export default TagContainer;
