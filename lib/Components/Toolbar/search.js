import React, {useState} from 'react';
import { useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useHistory } from '@magento/venia-ui/lib/drivers';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Field from '@magento/venia-ui/lib/components/Field';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { useBlogConfig } from '../../hooks/useBlogConfig';
import defaultClasses from './search.css';

const Search = props => {
	const classes = mergeClasses(defaultClasses, props.classes);
	const history = useHistory();
	const { formatMessage } = useIntl();
	const [searchText, setSearchText] = useState('');
	const { 
		mfblog_permalink_route: blogRouter, 
		mfblog_permalink_search_route: searchRouter
	} = useBlogConfig();

	const goToSearchPage = () => {
		history.push(`/${blogRouter}/${searchRouter}/${searchText}`);
	}

	const handleChange = event => {
		setSearchText(event.currentTarget.value);
	}

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
	      	goToSearchPage();
	    }
	}

	const searchLabel = formatMessage({
		id: 'mfBlog.searchLabel',
		defaultMessage: 'Search'
	});

	const searchPlaceholder = formatMessage({
		id: 'mfBlog.searchPlaceholder',
		defaultMessage: 'Search ...'
	});

	return (
		<div className={classes.root}>
			<Field id="search" label={searchLabel}>
				<TextInput
	                field="search"
	                initialValue={searchText}
	                placeholder={searchPlaceholder}
	                onKeyDown={handleKeyDown}
	                onChange={handleChange}
	            />
            </Field>
		</div>
	);
}

export default Search;

Search.propTypes = {
    classes: shape({
        root: string
    })
};