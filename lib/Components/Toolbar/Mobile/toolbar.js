import React, {useState} from 'react';
import { Menu as MenuIcon} from 'react-feather';
import { shape, string } from 'prop-types';

import Icon from '@magento/venia-ui/lib/components/Icon';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './toolbar.css';
import ToolbarModal from './toolbarModal';

const Toolbar = props => {
	const classes = mergeClasses(defaultClasses, props.classes);
	const [openToolbar, setOpenToolbar] = useState(false);
	
	const handleClick = () => {
		setOpenToolbar(true);
	}
	return (
		<div className={classes.root}>
			<button onClick={handleClick} className={classes.triggerButton}>
				<Icon classes={{root: classes.iconRoot}} size={30} src={MenuIcon} />
			</button>
			<ToolbarModal openToolbar={openToolbar} setOpenToolbar={setOpenToolbar} />
		</div>
	);
}

export default Toolbar;

Toolbar.propTypes = {
    classes: shape({
        root: string,
        triggerButton: string,
        iconRoot: string
    })
};