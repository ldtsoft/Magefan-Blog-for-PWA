import React, {useState} from 'react';
import { useIntl } from 'react-intl';
import { Clock as ClockIcon} from 'react-feather';
import { shape, string, object, number } from 'prop-types';
import { useQuery } from '@apollo/client';

import Icon from '@magento/venia-ui/lib/components/Icon';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './postComments.css';
import { formatDate } from '../../util/formatDate';
import GET_COMMENTS_QUERY from '../../queries/getBlogCommentsQuery.graphql';
import AddComment from './addComment';

const PostComments = props => {
	const { formatMessage } = useIntl();
	const classes = mergeClasses(defaultClasses, props.classes);
	const { post, pageSize } = props;
	const { post_id } = post;

	const [currentPage, setCurrentPage] = useState(1);
	const [currentReplyId, setCurrentReplyId] = useState(null);
	const {loading, error, data} = useQuery(GET_COMMENTS_QUERY,{
		variables: {
			currentPage,
			pageSize,
			filter: {
				post_id: {
					eq: post_id
				}
			}
		},
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

	const replyLabel = 'Reply';

	const {total_count, total_pages, items: comments} = data.blogComments;
	const commentList = Array.from(comments, comment => {
		const {comment_id, author_nickname, creation_time, text, replies} = comment;

		const showReplyForm = e => {
			e.preventDefault();
			setCurrentReplyId(comment_id == currentReplyId ? null : comment_id);
		}

		return (
			<li key={comment_id} className={classes.comment}>
				<div className={classes.commentTitle}>
					<span className={classes.commentAuthor}>{author_nickname}</span>
				</div>
				<div className={classes.commentContent}>
					{text}
				</div>
				<div className={classes.commentActions}>
					<a onClick={showReplyForm} className={classes.replyAction} href="#">{replyLabel}</a>
					<span className={classes.commentTime}>
						<Icon size={16} src={ClockIcon} />
						{formatDate(creation_time)}
					</span>
				</div>
				{
					comment_id == currentReplyId && <AddComment post_id={post_id} parent_id={comment_id} />
				}
				<ul className={`${classes.commentList} ${classes.replies}`}>
					{
						replies.length > 0 && replies.map(reply => {
							const {
								comment_id: repId,
								author_nickname: repNickname, 
								text: reptext,
								creation_time: repCreationTime
							} = reply;

							return (
								<li key={repId} className={classes.comment}>
									<div className={classes.commentTitle}>
										<span className={classes.commentAuthor}>{repNickname}</span>
										<span className={classes.commentTime}>
											<Icon size={16} src={ClockIcon} />
											{formatDate(repCreationTime)}
										</span>
									</div>
									<div className={classes.commentContent}>
										{reptext}
									</div>
								</li>
							);
						})
					}
				</ul>
			</li>
		);
	});

	const commentCountLabel = formatMessage({
		id: 'mfBlog.commentCountLabel',
		defaultMessage: '{total_count} Comment(s)'
	}, { total_count: total_count });

	return (
		<div className={classes.root}>
			<div className={classes.count}>
				<h3>{commentCountLabel}</h3>
			</div>
			<AddComment post_id={post_id} />
			<ul className={classes.commentList}>
				{commentList}
			</ul>
		</div>
	);
}

export default PostComments;

PostComments.defaultProps = {
    pageSize: 6
}

PostComments.propTypes = {
    post: object.isRequired,
    pageSize: number,
    classes: shape({
        root: string,
        count: string,
        commentList: string,
        comment: string,
        commentTitle: string,
        commentAuthor: string,
        commentContent: string,
        commentActions: string,
        replyAction: string,
        commentTime: string,
        replies: string
    })
};