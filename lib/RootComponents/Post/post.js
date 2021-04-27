import React, {useState} from 'react';
import { shape, string, number } from 'prop-types';
import { useQuery } from '@apollo/client';

import { Meta, Title } from '@magento/venia-ui/lib/components/Head';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import GET_POST_QUERY from '../../queries/getPostQuery.graphql';
import FullPageLoading from '../../Components/FullPageLoading';
import NotFoundPost from '../../Components/NotFoundPost';
import PostContent from '../../Components/PostContent';
import Breadcrumbs from '../../Components/Breadcrumbs';
import defaultClasses from './post.css';

const PostPage = props => {
	const {id} = props;
	const pageSize = 6;
	const classes = mergeClasses(defaultClasses, props.classes);
	const [currentPage, setCurrentPage] = useState(1);
	const {loading, error, data} = useQuery(GET_POST_QUERY,{
		variables: {
			postId: id
		},
		fetchPolicy: 'cache-and-network'
	});

	if (loading) {
		return <FullPageLoading />
	}

	if (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.log(error);
		}
		return null;
	}

	const { blogPost } = data;

	if (!blogPost) {
		return <NotFoundPost />
	}

	const {
		meta_title,
        meta_description
	} = blogPost;

	return (
		<div className={classes.root}>
			<Title>{meta_title}</Title>
            <Meta name="description" content={meta_description} />
            <Breadcrumbs />
			<PostContent post={blogPost} />
		</div>
	);
}

export default PostPage;

PostPage.propTypes = {
	id: string,
    classes: shape({
        root: string
    })
};