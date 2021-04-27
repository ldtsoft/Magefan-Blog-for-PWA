
const getUrlName = (url) => {
	return url.replace(/(^\w+:|^)\/\//, '');
}

export const extractUrl = (serverUrlObj) => {
	const baseUrlObj = process.env.MAGENTO_BACKEND_URL;
	if (serverUrlObj.includes(getUrlName(baseUrlObj))) {
		return '/' + getUrlName(serverUrlObj).replace(getUrlName(baseUrlObj), '');
	}

	return serverUrlObj;
}