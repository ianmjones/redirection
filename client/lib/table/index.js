/* global Redirectioni10n */
/**
 * Internal dependencies
 */

import { getPageUrl, setPageUrl } from 'lib/wordpress-url';

const tableParams = [ 'orderBy', 'direction', 'page', 'perPage', 'filter', 'filterBy' ];

const removeIfExists = ( current, newItems ) => {
	const newArray = [];

	for ( let x = 0; x < current.length; x++ ) {
		if ( newItems.indexOf( current[ x ] ) === -1 ) {
			newArray.push( current[ x ] );
		}
	}

	return newArray;
};

export const getDefaultTable = ( allowedOrder = [], allowedFilter = [], defaultOrder = '', subParams = [] ) => {
	const query = getPageUrl();
	const defaults = {
		orderBy: defaultOrder,
		direction: 'desc',
		page: 0,
		perPage: parseInt( Redirectioni10n.per_page, 10 ),
		selected: [],
		filterBy: '',
		filter: '',
	};

	if ( query.sub && subParams.indexOf( query.sub ) === -1 ) {
		return defaults;
	}

	return {
		... defaults,
		orderBy: query.orderby && allowedOrder.indexOf( query.orderby ) !== -1 ? query.orderby : defaults.orderBy,
		direction: query.direction && query.direction === 'asc' ? 'asc' : defaults.direction,
		page: query.offset && parseInt( query.offset, 10 ) > 0 ? parseInt( query.offset, 10 ) : defaults.page,
		perPage: Redirectioni10n.per_page ? parseInt( Redirectioni10n.per_page, 10 ) : defaults.perPage,
		filterBy: query.filterby && allowedFilter.indexOf( query.filterby ) ? query.filterby : defaults.filterBy,
		filter: query.filter ? query.filter : defaults.filter,
	};
};

export const mergeWithTableForApi = ( state, params ) => {
	const newState = {};

	for ( let x = 0; x < tableParams.length; x++ ) {
		const value = tableParams[ x ];

		newState[ value ] = state[ value ];
	}

	return Object.assign( {}, newState, params );
};

export const mergeWithTable = ( state, params ) => {
	const newState = Object.assign( {}, state );

	for ( let x = 0; x < tableParams.length; x++ ) {
		if ( params[ tableParams[ x ] ] !== undefined ) {
			newState[ tableParams[ x ] ] = params[ tableParams[ x ] ];
		}
	}

	return newState;
};

export const setTableParams = ( state, params, defaultOrder = '' ) => {
	const newState = mergeWithTable( state, params );
	const { orderBy, direction, page, perPage, filter, filterBy } = newState;

	setPageUrl( { orderBy, direction, offset: page, perPage, filter, filterBy }, { orderBy: defaultOrder, direction: 'desc', offset: 0, filter: '', filterBy: '', perPage: parseInt( Redirectioni10n.per_page, 10 ) } );

	return newState;
};

export const setTableSelected = ( table, newItems ) => ( { ... table, selected: removeIfExists( table.selected, newItems ).concat( removeIfExists( newItems, table.selected ) ) } );
export const setTableAllSelected = ( table, rows, onoff ) => ( { ... table, selected: onoff ? rows.map( item => item.id ) : [] } );
