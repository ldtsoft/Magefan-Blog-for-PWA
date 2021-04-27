import React, {Suspense} from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { shape, string, object } from 'prop-types';
import { Clock as ClockIcon, User as UserIcon } from 'react-feather';

import Image from '@magento/venia-ui/lib/components/Image';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './postContent.css';
import { extractUrl } from '../../util/extractUrl';
import { formatDate } from '../../util/formatDate';
import PostCategories from '../PostList/postCategories';
import PostTags from '../PostList/postTags';
import { useDevice } from '../../hooks/useDevice';
import { useBlogConfig } from '../../hooks/useBlogConfig';

const ProductGrid = React.lazy(() => import ('../ProductGrid'));
const PostComments = React.lazy(() => import ('./postComments'));
const DesktopToolbar = React.lazy(() => import('../Toolbar/Desktop'));
const MobileToolbar = React.lazy(() => import('../Toolbar/Mobile'));

const PostContent = props => {
	const { formatMessage } = useIntl();
	const classes = mergeClasses(defaultClasses, props.classes);
	const config = useBlogConfig();

	const { post } = props;
	const {
		title, 
		first_image, 
		filtered_content, 
		post_url,
		creation_time,
		author,
		tags,
		categories,
		related_products
	} = post;

	const imageContent = first_image != "false" && <Image 
						classes={{root: classes.imageRoot, loaded: classes.imageLoaded}}
						alt={title}
                		resource={first_image}
					/>;

	const { isMobile, isTablet } = useDevice();
	const toolbar = (isMobile || isTablet) ? <MobileToolbar /> : <DesktopToolbar />

	const fetchingCommentsLabel = formatMessage({
		id: 'mfBlog.fetchingCommentsLabel',
		defaultMessage: 'Fetching comments ...'
	});

	const relatedProductLabel = formatMessage({
		id: 'mfBlog.relatedProductLabel',
		defaultMessage: 'Related Products'
	});

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<div className={classes.postTitle}>
					<h1>{title}</h1>
				</div>
				<div className={classes.postInfo}>
					{
						author && 
						<div className={classes.postAuthor}>
							<Icon size={20} src={UserIcon} />
							<Link to={extractUrl(author.author_url)} className={classes.createdDateText}>{ author.name }</Link>
						</div>
					}
					<div className={classes.createdDate}>
						<Icon size={20} src={ClockIcon} />
						<span className={classes.postAuthorText}>{ formatDate(creation_time) }</span>
					</div>
				</div>
				{imageContent}
				<div className={classes.postContent}>
					<RichContent html={filtered_content} />
				</div>
				<div className={classes.postCategorys}>
					<PostCategories categories={categories} />
				</div>
				<div className={classes.postTags}>
					<PostTags tags={tags} />
				</div>
				<div className={classes.postComments}>
					<Suspense fallback={fetchingCommentsLabel}>
						<PostComments post={post} />
					</Suspense>
				</div>
				{
					related_products && config.mfblog_post_view_related_products_enabled && (
						<div className={classes.relatedProducts}>
							<h3>{relatedProductLabel}</h3>
							<Suspense fallback={null}>
								<ProductGrid 
									skus={related_products}
									limit={config.mfblog_post_view_related_products_number_of_products}
								/>
							</Suspense>
						</div>
					)
				}
			</div>
			<div className={classes.toolbar}>
				{toolbar}
			</div>
		</div>
	);
}

export default PostContent;

PostContent.propTypes = {
    post: object.isRequired,
    classes: shape({
        root: string,
        content: string,
        postTitle: string,
        postInfo: string,
        postAuthor: string,
        createdDateText: string,
        createdDate: string,
        postAuthorText: string,
        postContent: string,
        postCategorys: string,
        postTags: string,
        postComments: string,
        relatedProducts: string,
        toolbar: string
    })
};