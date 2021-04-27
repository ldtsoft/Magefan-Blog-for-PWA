import React from 'react';
import { useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { useQuery } from '@apollo/client';
import { Link } from '@magento/venia-ui/lib/drivers';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './categoryList.css';
import { extractUrl } from '../../util/extractUrl';
import GET_CATEGORIES_QUERY from '../../queries/getBlogCategoriesQuery.graphql';

const CategoryList = props => {
	const { formatMessage } = useIntl();
	const classes = mergeClasses(defaultClasses, props.classes);
	const {loading, error, data} = useQuery(GET_CATEGORIES_QUERY, {
		fetchPolicy: 'cache-and-network'
	});

	if (loading) {
		return <LoadingIndicator />
	}

	if (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.log(error);
		}
		return null;
	}

	const {total_count, items} = data.blogCategories;

	if (total_count == 0) {
		return null;
	}

	const categoryList = Array.from(items, category => {
		const {
			category_id,
			title,
            category_url,
            is_active,
            include_in_menu,
            category_level,
            posts_count
		} = category;

		if (!is_active || !include_in_menu) {
			return null;
		}

		return (
			<li key={category_id} className={classes.category}>
				<Link to={extractUrl(category_url)}>
					<span>{`${title} (${posts_count})`}</span>
				</Link>
			</li>
		);
	});

	const categoriesLabel = formatMessage({
		id: 'mfBlog.categoryListLabel',
		defaultMessage: 'Categories'
	});

	return (
		<div className={classes.root}>
			<h3>{categoriesLabel}</h3>
			<ul className={classes.list}>
				{categoryList}
			</ul>
		</div>
	);
}

export default CategoryList;

CategoryList.propTypes = {
    classes: shape({
        root: string,
        list: string,
        category: string
    })
};