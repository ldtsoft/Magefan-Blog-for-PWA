import React, {useEffect} from 'react';
import { shape, string, number } from 'prop-types';
import { useQuery, useLazyQuery } from '@apollo/client';

import { usePagination } from '@magento/peregrine';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import GET_CATEGORY_QUERY from '../../queries/getCategoryQuery.graphql';
import GET_POSTS_QUERY from '../../queries/getPostsQuery.graphql';
import FullPageLoading from '../../Components/FullPageLoading';
import NotFoundPost from '../../Components/NotFoundPost';
import PostList from '../../Components/PostList';
import Breadcrumbs from '../../Components/Breadcrumbs';
import defaultClasses from './category.css';

const CategoryPage = props => {
	const { id, pageSize } = props;
	const classes = mergeClasses(defaultClasses, props.classes);
	
	const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

	const {
		loading: catLoading, 
		error: catError, 
		data: catData
	} = useQuery(GET_CATEGORY_QUERY,{
		variables: {
			id: id
		},
		fetchPolicy: 'cache-and-network'
	});

	const [runQuery, queryResponse] = useLazyQuery(GET_POSTS_QUERY);
	const {loading, error, data} = queryResponse;
	const totalPostPages = data ? data.blogPosts.total_pages : null;

	useEffect(() => {
        setTotalPages(totalPostPages);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPostPages]);

    useEffect(() => {
        runQuery({
            variables: {
				currentPage: Number(currentPage),
	            pageSize: Number(pageSize),
				sort: ["DESC"],
				filter: {
					category_id: {
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

	if (error || catError) {
		if (process.env.NODE_ENV !== 'production') {
			console.log(error);
			console.log(catError);
		}
		return null;
	}

	if (!data) return null;

	const {total_count, total_pages, items} = data.blogPosts;

	if (!total_count) {
		return <NotFoundPost />
	}

	const {meta_title, meta_description, title, breadcrumbs} = catData.blogCategory;

	return (
		<div className={classes.root}>
			<Title>{meta_title}</Title>
            <Meta name="description" content={meta_description} />
            <Breadcrumbs normalizedData={breadcrumbs} />
            <div className={classes.title}>
            	<h1>{title}</h1>
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

export default CategoryPage;

CategoryPage.defaultProps = {
	pageSize: 6
}

CategoryPage.propTypes = {
	id: string,
    classes: shape({
        root: string,
        title: string
    })
};