import React from 'react';
import { useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './notFoundPost.css';

const NotFoundPost = props => {
	const { formatMessage } = useIntl();
	const classes = mergeClasses(defaultClasses, props.classes);

	const notFoundPostLabel = formatMessage({
		id: 'mfBlog.notFoundPostLabel',
		defaultMessage: 'Not found posts'
	});

	return (
		<div className={classes.root}>
			<p className={classes.message}>{notFoundPostLabel}</p>
		</div>
	)
}

export default NotFoundPost;

NotFoundPost.propTypes = {
    classes: shape({
        root: string,
        message: string
    })
};