import React from 'react';
import { Link } from 'react-router-dom';
import { shape, string, array } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { extractUrl } from '../../util/extractUrl';
import defaultClasses from './postTags.css';

const PostTags = props => {
	const classes = mergeClasses(defaultClasses, props.classes);
	const { tags } = props;

	if (tags.length == 0) {
		return null;
	}

	const tagsLink = Array.from(tags, tag => {
		const {tag_id, tag_url, title} = tag;
		return <Link className={classes.link} key={tag_id} to={extractUrl(tag_url)}>{title}</Link>;
	});

	return (
		<div className={classes.root}>
			{tagsLink}
		</div>
	);
}

export default PostTags;

PostTags.propTypes = {
    tags: array,
    classes: shape({
        root: string,
        link: string
    })
};