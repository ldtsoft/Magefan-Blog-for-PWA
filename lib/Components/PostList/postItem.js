import React from 'react';
import { Link } from 'react-router-dom';
import { Clock as ClockIcon, User as UserIcon } from 'react-feather';
import { shape, string, object } from 'prop-types';
import { useIntl } from 'react-intl';

import Image from '@magento/venia-ui/lib/components/Image';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './post.css';
import { extractUrl } from '../../util/extractUrl';
import { formatDate } from '../../util/formatDate';
import PostCategories from './postCategories';
import PostTags from './postTags';

const PostItem = props => {
	const { formatMessage } = useIntl();
	const classes = mergeClasses(defaultClasses, props.classes);
	const { post } = props;
	const {
		title, 
		first_image, 
		short_filtered_content, 
		post_url,
		creation_time,
		author,
		tags,
		categories
	} = post;

	const imageContent = first_image != "false" && <Image 
						classes={{root: classes.imageRoot, loaded: classes.imageLoaded}}
						alt={title}
                		resource={first_image}
					/>;

	const readMoreLabel = formatMessage({
		id: 'mfBlog.readMoreLabel',
		defaultMessage: 'Read more »'
	});

	return (
		<li className={classes.root}>
			<Link to={extractUrl(post_url)} className={classes.postTitle}>
				<h3>{title}</h3>
			</Link>
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
				<RichContent html={short_filtered_content} />
			</div>
			<div className={classes.postCategorys}>
				<PostCategories categories={categories} />
			</div>
			<div className={classes.postTags}>
				<PostTags tags={tags} />
			</div>
			<div className={classes.readMore}>
				<Link to={extractUrl(post_url)}>
					{readMoreLabel}
				</Link>
			</div>
		</li>
	);
}

export default PostItem;

PostItem.propTypes = {
    post: object.isRequired,
    classes: shape({
        imageRoot: string,
        imageLoaded: string,
        root: string,
        postTitle: string,
        postInfo: string,
        postAuthor: string,
        createdDateText: string,
        createdDate: string,
        postAuthorText: string,
        postContent: string,
        postTags: string,
        readMore: string
    })
};