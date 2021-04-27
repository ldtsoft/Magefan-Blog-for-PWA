import React, {useEffect} from 'react';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { useLazyQuery } from '@apollo/client';

import { usePagination } from '@magento/peregrine';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';

import GET_POSTS_QUERY from '../../queries/getPostsQuery.graphql';
import FullPageLoading from '../../Components/FullPageLoading';
import NotFoundPost from '../../Components/NotFoundPost';
import PostList from '../../Components/PostList';
import Breadcrumbs from '../../Components/Breadcrumbs';
import { useBlogConfig } from '../../hooks/useBlogConfig';
import defaultClasses from './blog.css';

const BlogPage = props => {
	const {pageSize} = props;
	const classes = mergeClasses(defaultClasses, props.classes);
	const { formatMessage } = useIntl();

	const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

	const [runQuery, queryResponse] = useLazyQuery(GET_POSTS_QUERY);
	const {loading, error, data} = queryResponse;
	const totalPostPages = data ? data.blogPosts.total_pages : null;

	const {
		store_name,
		mfblog_index_page_title: page_title,
		mfblog_index_page_meta_description: meta_description
	} = useBlogConfig();

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
				sort: ["DESC"]
			},
			fetchPolicy: 'cache-and-network'
        });
    }, [currentPage, pageSize, runQuery]);

    useScrollTopOnChange(currentPage);

	if (loading) {
		return <FullPageLoading />
	}

	if (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.log(error);
		}
		return null;
	}

	if (!data) return null;

	const {total_count, total_pages, items} = data.blogPosts;

	if (total_count == 0) {
		return <NotFoundPost />
	}

	const blogPageTitle = formatMessage({
		id: 'mfBlog.blogPageTitle',
		defaultMessage: '{storeName} - Blog Page'
	},{
		storeName: store_name
	});

	const blogLabel = formatMessage({
		id: 'global.blog',
		defaultMessage: 'Blog'
	});

	return (
		<div className={classes.root}>
			<Title>{page_title || blogPageTitle}</Title>
            <Meta name="description" content={meta_description} />
			<Breadcrumbs />
			<div className={classes.title}>
            	<h1>{blogLabel}</h1>
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

export default BlogPage;

BlogPage.propTypes = {
    classes: shape({
        root: string
    })
};

BlogPage.defaultProps = {
	pageSize: 6
}