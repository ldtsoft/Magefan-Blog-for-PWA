import React, { Fragment, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, array, string } from 'prop-types';

import { Link, resourceUrl } from '@magento/venia-drivers';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { useBlogConfig } from '../../hooks/useBlogConfig';
import defaultClasses from './breadcrumbs.css';

const DELIMITER = '/';
/**
 * Breadcrumbs! Generates a display of category links.
 *
 */
const Breadcrumbs = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { normalizedData } = props;
    const {
        mfblog_permalink_route: blogRouter
    } = useBlogConfig();

    // For all links generate a fragment like "/ Text"
    const links = useMemo(() => {
        return (normalizedData || []).map(({ category_name: text, category_url_path: path }) => {
            return (
                <Fragment key={text}>
                    <span className={classes.divider}>{DELIMITER}</span>
                    <Link className={classes.link} to={'/' + resourceUrl(path)}>
                        {text}
                    </Link>
                </Fragment>
            );
        });
    }, [classes.divider, classes.link, normalizedData]);

    return (
        <div className={classes.root}>
            <Link className={classes.link} to="/">
                <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
            </Link>
            <span className={classes.divider}>{DELIMITER}</span>
            <Link className={classes.link} to={`/${blogRouter}`}>
                <FormattedMessage id={'global.blog'} defaultMessage={'Blog'} />
            </Link>
            {links}
        </div>
    );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
    normalizedData: array,
    classes: shape({
        root: string,
        link: string,
        divider: string
    })
};
