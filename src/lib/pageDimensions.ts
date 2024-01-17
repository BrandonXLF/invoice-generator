import type { PageSize } from './PageSize';

const pageDimensions: Record<
	PageSize,
	{
		width: string;
		height: string;
	}
> = {
	letter: {
		width: '8.5in',
		height: '11in'
	},
	a4: {
		width: '210mm',
		height: '297mm'
	},
	legal: {
		width: '8.5in',
		height: '14in'
	}
};

export default pageDimensions;
