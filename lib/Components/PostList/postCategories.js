import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { shape, string, array } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { extractUrl } from '../../util/extractUrl';
import defaultClasses from './postCategories.css';

const PostCategories = props => {
	const { formatMessage } = useIntl();
	const classes = mergeClasses(defaultClasses, props.classes);
	const { categories } = props;

	if (categories.length == 0) {
		return null;
	}

	const categoriesLink = Array.from(categories, category => {
		const {category_id, category_url, title} = category;
		return <Link className={classes.link} key={category_id} to={extractUrl(category_url)}>
				{title}
			</Link>;
	});

	const postedInLabel = formatMessage({
		id: 'mfBlog.postedInLabel',
		defaultMessage: 'Posted in: '
	});

	return (
		<div className={classes.root}>
			<span className={classes.text}>
				{postedInLabel}
			</span>
			{categoriesLink}
		</div>
	);
}

export default PostCategories;

PostCategories.propTypes = {
    categories: array,
    classes: shape({
        root: string,
        text: string,
        link: string
    })
};