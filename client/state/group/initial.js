/**
 * Internal dependencies
 */

import { STATUS_IN_PROGRESS } from 'state/settings/type';
import { getDefaultTable } from 'lib/table';

export function getInitialGroup() {
	return {
		rows: [],
		total: 0,
		status: STATUS_IN_PROGRESS,
		saving: false,
		error: false,

		table: getDefaultTable( [ 'name' ], [ 'name' ], 'name', [ 'groups' ] )
	};
}
