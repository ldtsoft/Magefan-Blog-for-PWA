import React, { useEffect } from 'react';
import { shape, string, object, array } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Pagination from '@magento/venia-ui/lib/components/Pagination';

import PostItem from './postItem';
import defaultClasses from './postList.css';
import { useDevice } from '../../hooks/useDevice';

const DesktopToolbar = React.lazy(() => import('../Toolbar/Desktop'));
const MobileToolbar = React.lazy(() => import('../Toolbar/Mobile'));

const PostList = props => {
	const classes = mergeClasses(defaultClasses, props.classes);
	const { items, pageControl } = props;

	const itemsContent = Array.from(items, (post, index) => {
		if (!post.is_active) {
			return null;
		}

		return <PostItem key={index} post={post} />
	});

	const {isDesktop} = useDevice();
	const toolbar = isDesktop ? <DesktopToolbar /> : <MobileToolbar />

	return (
		<div className={classes.root}>
			<ul className={classes.postList}>
				{itemsContent}
			</ul>
			<div className={classes.toolbar}>
				{toolbar}
			</div>
			<div className={classes.pagination}>
                <Pagination pageControl={pageControl} />
            </div>
		</div>
	);
}

export default PostList;

PostList.propTypes = {
    items: array.isRequired,
    pageControl: object,
    classes: shape({
        root: string,
        postList: string,
        toolbar: string,
        pagination: string
    })
};