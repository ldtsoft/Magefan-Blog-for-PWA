import React, { Fragment, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string, array } from 'prop-types';

import { useQuery } from '@apollo/client';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import GalleryItem from './item';
import GET_PRODUCTS from '../../queries/getProductsQuery.graphql';
import defaultClasses from './productGrid.css';

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const ProductGrid = props => {
    const { skus, limit, enable, classes: propsClasses } = props;
    const classes = mergeClasses(defaultClasses, propsClasses);

    // Fetch the data using apollo react hooks
    const { data, error } = useQuery(GET_PRODUCTS, {
        variables: {
            filters: {
                sku: {
                    in: skus
                }
            }
        },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    const items = data ? data.products.items : '';

    // Thanks to https://stackoverflow.com/a/42374933 for adding a limit
    const galleryItems = useMemo(
        () =>
            items &&
            items.slice(0, limit).map((item, index) => {
                if (item === null) {
                    return <GalleryItem key={index} />;
                }
                return (
                    <GalleryItem
                        key={index}
                        item={mapGalleryItem(item)}
                    />
                );
            }),
        [items]
    );

    return (
        <div className={classes.root}>{galleryItems}</div>
    );
};

export default ProductGrid;

ProductGrid.defaultProps = {
    limit: 5
};

ProductGrid.propTypes = {
    skus: array.isRequired,
    classes: shape({
        root: string
    })
};