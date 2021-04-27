import { useIntl } from 'react-intl';

export const formatDate = (dateString) => {
	const { locale } = useIntl();
	const timeLocale = locale.replace('_', '-');
	const date = new Date(dateString);
	return new Intl.DateTimeFormat(
		timeLocale, 
		{ 
			year: 'numeric', 
			month: 'short', 
			day: '2-digit' 
		}
	).format(date);
}