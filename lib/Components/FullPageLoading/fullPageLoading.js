import React from 'react';
import { RotateCw as LoaderIcon } from 'react-feather';
import { shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './fullPageLoading.css';

const FullPageLoading = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Icon
                src={LoaderIcon}
                size={24}
                classes={{ root: classes.loading }}
            />
        </div>
    );
};

export default FullPageLoading;

FullPageLoading.propTypes = {
    classes: shape({
        root: string,
        loading: string
    })
};