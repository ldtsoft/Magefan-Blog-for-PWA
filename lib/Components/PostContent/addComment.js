import React, { useState, useMemo, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string, number } from 'prop-types';
import { Form, useFormState } from 'informed';
import { useApolloClient, useMutation } from '@apollo/client';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useToasts } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';

import ADD_COMMENT_MUTATION from '../../queries/addCommentMutation.graphql';
import defaultClasses from './addComment.css';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const AddComment = props => {
    const { post_id, parent_id, classes: propsClasses } = props;
    const classes = mergeClasses(defaultClasses, propsClasses);
    const { formatMessage } = useIntl();

    const [{ isSignedIn, currentUser }] = useUserContext();
    const { email: author_email, firstname, lastname } = currentUser;
    const author_nickname = isSignedIn ? `${firstname} ${lastname}` : null;

    const [, { addToast }] = useToasts();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formInitialValues = {
        author_nickname,
        author_email
    };

    const [addComment, { data, error: addCommentError }] = useMutation(
        ADD_COMMENT_MUTATION,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const handleSubmit = useCallback(
        async (formValues) => {
            setIsSubmitting(true);
            try {
                // Add a comment with the mutation.
                await addComment({
                    variables: {
                        post_id: Number(post_id),
                        author_email: isSignedIn
                            ? author_email
                            : formValues.author_email,
                        author_nickname: isSignedIn
                            ? author_nickname
                            : formValues.author_nickname,
                        text: formValues.text,
                        parent_id: parent_id
                    }
                });

                addToast({
                    type: 'info',
                    message: formatMessage({
                        id: 'commentForm.successMessage',
                        defaultMessage: 'Thank you for your comment.'
                    }),
                    timeout: 5000
                });
                setIsSubmitting(false);
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
                addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: error,
                    dismissable: true,
                    timeout: 10000
                });
                setIsSubmitting(false);
            }
        },
        [
            addComment,
            isSignedIn,
            author_email,
            author_nickname
        ]
    );

    const addCommentLabel = formatMessage({
        id: 'commentForm.addCommentLabel',
        defaultMessage: 'Add a comment...'
    });

    const nicknameLabel = formatMessage({
        id: 'commentForm.nicknameLabel',
        defaultMessage: 'Full Name'
    });

    const emailLabel = formatMessage({
        id: 'commentForm.emailLabel',
        defaultMessage: 'Email'
    });

    const guestFields = !isSignedIn ? (
        <div className={classes.information}>
            <div className={classes.nickname}>
                    <TextInput
                        id={classes.nickname}
                        field="author_nickname"
                        validate={isRequired}
                        disabled={isSignedIn}
                        placeholder={nicknameLabel}
                    />
            </div>
            <div className={classes.author_email}>
                    <TextInput
                        id={classes.author_email}
                        field="author_email"
                        validate={isRequired}
                        disabled={isSignedIn}
                        placeholder={emailLabel}
                    />
            </div>
        </div>
    ) : null;

    return (
        <Form
            initialValues={formInitialValues}
            onSubmit={handleSubmit}
            className={classes.root}
        >
            <div className={classes.text}>
                    <TextArea
                        id={classes.text}
                        field="text"
                        validate={isRequired}
                        placeholder={addCommentLabel}
                    />
            </div>
            <div className={classes.footer}>
                {guestFields}
                <div className={classes.actions}>
                    <Button type="submit" priority="high" disabled={isSubmitting}>
                        <FormattedMessage
                            id={'commentForm.submitLabel'}
                            defaultMessage={'Submit'}
                        />
                    </Button>
                </div>
            </div>
        </Form>
    );
};

export default AddComment;

AddComment.defaultProps = {
    parent_id: 0
}

AddComment.propTypes = {
    post_id: number.isRequired,
    parent_id: number,
    classes: shape({
        root: string,
        text: string,
        footer: string,
        actions: string,
        information: string,
        nickname: string,
        author_email: string
    })
};
