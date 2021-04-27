import React, {useEffect, useMemo} from 'react';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { useQuery, useLazyQuery, gql } from '@apollo/client';

import { usePagination } from '@magento/peregrine';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import GET_POSTS_QUERY from '../../queries/getPostsQuery.graphql';
import FullPageLoading from '../../Components/FullPageLoading';
import NotFoundPost from '../../Components/NotFoundPost';
import PostList from '../../Components/PostList';
import Breadcrumbs from '../../Components/Breadcrumbs';
import { useBlogConfig } from '../../hooks/useBlogConfig';
import defaultClasses from './search.css';

const STORE_NAME_QUERY = gql`
	query getStoreName {
	    storeConfig {
	        id
	        store_name
	    }
	}
`;

const SearchPage = props => {
	const { id, pageSize } = props;
	const classes = mergeClasses(defaultClasses, props.classes);
	const { formatMessage } = useIntl();

	const { store_name } = useBlogConfig();

	const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

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
				currentPage,
				pageSize,
				sort: ["DESC"],
				filter: {
					search: {
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

	const searchPageTitle = formatMessage({
		id: 'mfBlog.searchPageTitle',
		defaultMessage: '{storeName} - Search Page'
	},{
		storeName: store_name
	});

	const searchLabel = formatMessage({
		id: 'mfBlog.searchLabel',
		defaultMessage: 'Search "{searchText}"'
	},{
		searchText: id
	});

	return (
		<div className={classes.root}>
			<Title>{searchPageTitle}</Title>
            <Meta name="description" content={id} />
            <Breadcrumbs />
            <div className={classes.title}>
            	<h1>{searchLabel}</h1>
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

export default SearchPage;

SearchPage.defaultProps = {
	pageSize: 6
}

SearchPage.propTypes = {
	id: string,
    classes: shape({
        root: string,
        title: string
    })
};