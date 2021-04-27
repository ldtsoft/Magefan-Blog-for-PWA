import React from 'react';
import { useIntl } from 'react-intl';
import {X as CloseIcon} from 'react-feather';
import { shape, string } from 'prop-types';

import Trigger from '@magento/venia-ui/lib/components/Trigger';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Search from '../search';
import defaultClasses from './toolbarModal.css';

const CategoryList = React.lazy(() => import('../categoryList'));

const ToolbarModal = props => {
	const { formatMessage } = useIntl();
	const classes = mergeClasses(defaultClasses, props.classes);
	const {openToolbar, setOpenToolbar} = props;

	const rootClass = openToolbar ? classes.root_open : classes.root;
    const bodyClassName = openToolbar ? classes.body_masked : classes.body;

	const handleClose = () => {
		setOpenToolbar(false);
	}

	const menuLabel = formatMessage({
		id: 'mfBlog.toolbarMenuLabel',
		defaultMessage: 'Menu'
	});

	return (
		<div className={rootClass}>
			<header className={classes.header}>
	            <h2 className={classes.title}>
	                <span>{menuLabel}</span>
	            </h2>
	            <Trigger key="closeButton" action={handleClose}>
	                <Icon src={CloseIcon} />
	            </Trigger>
            </header>
            <div className={bodyClassName}>
                <Search />
				<CategoryList />
            </div>
		</div>
	);
}

export default ToolbarModal;

ToolbarModal.propTypes = {
    classes: shape({
        root_open: string,
        root: string,
        body_masked: string,
        body: string,
        header: string,
        title: string
    })
};