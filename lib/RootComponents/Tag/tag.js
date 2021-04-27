import React, {useEffect} from 'react';
import { shape, string, number } from 'prop-types';
import { useQuery, useLazyQuery } from '@apollo/client';

import { usePagination } from '@magento/peregrine';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';

import GET_TAG_QUERY from '../../queries/getTagQuery.graphql';
import GET_POSTS_QUERY from '../../queries/getPostsQuery.graphql';
import FullPageLoading from '../../Components/FullPageLoading';
import NotFoundPost from '../../Components/NotFoundPost';
import PostList from '../../Components/PostList';
import Breadcrumbs from '../../Components/Breadcrumbs';
import defaultClasses from './tag.css';

const TagPage = props => {
	const { id, pageSize } = props;
	const classes = mergeClasses(defaultClasses, props.classes);

	const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

	const [runQuery, queryResponse] = useLazyQuery(GET_POSTS_QUERY);
	const {loading, error, data} = queryResponse;
	const totalPostPages = data ? data.blogPosts.total_pages : null;

	const {
		loading: tagLoading, 
		error: tagError, 
		data: tagData
	} = useQuery(GET_TAG_QUERY,{
		variables: {
			id: id
		},
		fetchPolicy: 'cache-and-network'
	});

	useEffect(() => {
        setTotalPages(totalPostPages);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPostPages]);

    useEffect(() => {
        runQuery({
            variables: {
				currentPage,
				pageSize,
				sort: ["DESC"],
				filter: {
					tag_id: {
						eq: id
					}
				}
			},
			fetchPolicy: 'cache-and-network'
        });
    }, [currentPage, pageSize, runQuery]);

    useScrollTopOnChange(currentPage);

	if (loading) {
		return <FullPageLoading />
	}

	if (error || tagError) {
		if (process.env.NODE_ENV !== 'production') {
			console.log(error);
			console.log(tagError);
		}
		return null;
	}

	if (!data) return null;

	const {total_count, total_pages, items} = data.blogPosts;

	if (total_count == 0) {
		return <NotFoundPost />
	}

	const {meta_title, meta_description, title} = tagData.blogTag;

	const tagLabel = formatMessage({
		id: 'mfBlog.tagLabel',
		defaultMessage: 'Tag "{tagName}"'
	},{
		tagName: title
	});

	return (
		<div className={classes.root}>
			<Title>{meta_title}</Title>
            <Meta name="description" content={meta_description} />
            <Breadcrumbs />
            <div className={classes.title}>
            	<h1>{tagLabel}</h1>
            </div>
			<PostList 
				items={items} 
				pageControl={{
					currentPage,
			        setPage: setCurrentPage,
			        totalPages
				}}
			/>
		</div>
	);
}

export default TagPage;

TagPage.defaultProps = {
	pageSize: 6
}

TagPage.propTypes = {
	id: string,
    classes: shape({
        root: string,
        title: string
    })
};