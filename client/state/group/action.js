/**
 * Internal dependencies
 */
import {
	GROUP_LOADING,
	GROUP_LOADED,
	GROUP_FAILED,
	GROUP_ITEM_SAVING,
	GROUP_ITEM_FAILED,
	GROUP_ITEM_SAVED,
	GROUP_SET_SELECTED,
	GROUP_SET_ALL_SELECTED,
} from './type';
import getApi from 'lib/api';
import { mergeWithTable, mergeWithTableForApi } from 'lib/table';

const groupCollect = json => ( { rows: json.items, total: json.total } );

const processRequest = ( action, dispatch, params = {}, table = {} ) => {
	const data = table ? mergeWithTableForApi( table, params ) : params;
	const reducer = table ? Object.assign( {}, mergeWithTable( table, params ), params ) : params;

	getApi( action, data )
		.then( json => {
			dispatch( { type: GROUP_LOADED, ... groupCollect( json ) } );
		} )
		.catch( error => {
			dispatch( { type: GROUP_FAILED, error } );
		} );

	return dispatch( { ... reducer, type: GROUP_LOADING } );
};

export const getGroup = args => {
	return ( dispatch, getState ) => {
		const { table } = getState().group;

		return processRequest( 'red_get_group', dispatch, args, table );
	};
};

export const setOrderBy = ( orderBy, direction ) => getGroup( { orderBy, direction } );
export const setPage = page => getGroup( { page } );
export const setSearch = filter => getGroup( { filter, page: 0 } );
export const setFilter = ( filterBy, filter ) => getGroup( { filterBy, filter } );

export const setSelected = items => ( { type: GROUP_SET_SELECTED, items } );
export const setAllSelected = onoff => ( { type: GROUP_SET_ALL_SELECTED, onoff } );

export const saveGroup = ( groupId, name, moduleId ) => {
	return ( dispatch, getState ) => {
		const data = { groupId, name, moduleId };
		const { table } = getState().group;

		getApi( 'red_set_group', mergeWithTableForApi( table, data ) )
			.then( json => {
				dispatch( { type: GROUP_ITEM_SAVED, ... json } );
			} )
			.catch( error => {
				dispatch( { type: GROUP_ITEM_FAILED, error } );
			} );

		return dispatch( { type: GROUP_ITEM_SAVING, ... table, group: data } );
	};
};

export const performTableAction = ( action, ids ) => {
	return ( dispatch, getState ) => {
		const { table, total } = getState().group;
		const params = {
			items: ids ? ids : table.selected.join( ',' ),
			bulk: action,
		};

		if ( action === 'delete' && params.page > 0 && params.perPage * params.page === total - 1 ) {
			params.page -= 1;
		}

		return processRequest( 'red_group_action', dispatch, params, table );
	};
};

export const createGroup = ( name, moduleId ) => {
	return ( dispatch, getState ) => {
		const { table } = getState().group;
		const params = {
			name,
			moduleId,
		};

		params.orderBy = 'id';
		params.direction = 'desc';

		getApi( 'red_create_group', mergeWithTableForApi( table, params ) )
			.then( json => {
				dispatch( { type: GROUP_ITEM_SAVED, ... json } );
			} )
			.catch( error => {
				dispatch( { type: GROUP_ITEM_FAILED, error } );
			} );

		return dispatch( { type: GROUP_ITEM_SAVING, ... table, group: { name, moduleId } } );
	};
};
