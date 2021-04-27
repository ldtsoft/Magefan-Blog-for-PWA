import { useQuery } from '@apollo/client';
import GET_CONFIG_DATA from '../queries/getConfigQuery.graphql';

export const useBlogConfig = props => {
	const { data } = useQuery(GET_CONFIG_DATA, {
		fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
	});

	const configData = data && data.storeConfig ? data.storeConfig : {};

	return {
		...configData
	};
}