import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './toolbar.css';
import Search from '../search';

const CategoryList = React.lazy(() => import('../categoryList'));

const Toolbar = props => {
	const classes = mergeClasses(defaultClasses, props.classes);

	return (
		<div className={classes.root}>
			<Search />
			<CategoryList />
		</div>
	);
}

export default Toolbar;

Toolbar.propTypes = {
    classes: shape({
        root: string
    })
};