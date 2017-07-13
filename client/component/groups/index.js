/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'lib/locale';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */

import Table from 'component/table';
import TableNav from 'component/table/navigation';
import SearchBox from 'component/table/search';
import TableFilter from 'component/table/filter';
import Spinner from 'component/wordpress/spinner';
import GroupRow from './row';
import ErrorNotice from 'component/wordpress/error-notice';
import { getModule } from 'state/module/action';
import { getGroup, setPage, setSearch, performTableAction, setAllSelected, setOrderBy, setFilter, createGroup } from 'state/group/action';
import { STATUS_COMPLETE } from 'state/settings/type';

const headers = [
	{
		name: 'cb',
		check: true,
	},
	{
		name: 'name',
		title: __( 'Name' ),
	},
	{
		name: 'redirects',
		title: __( 'Redirects' ),
		sortable: false,
	},
	{
		name: 'module',
		title: __( 'Module' ),
		sortable: false,
	},
];

const bulk = [
	{
		id: 'delete',
		name: __( 'Delete' ),
	},
	{
		id: 'enable',
		name: __( 'Enable' ),
	},
	{
		id: 'disable',
		name: __( 'Disable' ),
	},
];

class Groups extends React.Component {
	constructor( props ) {
		super( props );

		this.props.onLoadGroups();
		this.props.onLoadModules();

		this.state = { name: '', moduleId: 1 };
		this.handleName = this.onChange.bind( this );
		this.handleModule = this.onModule.bind( this );
		this.handleSubmit = this.onSubmit.bind( this );
	}

	renderRow( row, key, status ) {
		return <GroupRow item={ row } key={ key } selected={ status.isSelected } isLoading={ status.isLoading } />;
	}

	getModules( modules ) {
		return [
			{
				id: '',
				name: __( 'All modules' ),
			}
		].concat( modules.map( item => ( { id: item.module_id, name: item.displayName } ) ) );
	}

	onChange( ev ) {
		this.setState( { name: ev.target.value } );
	}

	onModule( ev ) {
		this.setState( { moduleId: ev.target.value } );
	}

	onSubmit() {
		this.props.onCreate( this.state.name, this.state.moduleId );
		this.setState( { name: '' } );
	}

	render() {
		const { status, total, table, rows, saving, error } = this.props.group;
		const { module } = this.props;

		return (
			<div>
				{ error && total > 0 && <ErrorNotice message={ error } /> }
				{ module.error && <ErrorNotice message={ module.error } /> }

				<SearchBox status={ status } table={ table } onSearch={ this.props.onSearch } />
				<TableNav total={ total } selected={ table.selected } table={ table } onChangePage={ this.props.onChangePage } onAction={ this.props.onAction } bulk={ bulk }>
					<TableFilter selected="0" options={ this.getModules( module.rows ) } isEnabled={ module.status === STATUS_COMPLETE } onFilter={ this.props.onFilter } />
				</TableNav>
				<Table headers={ headers } rows={ rows } total={ total } row={ this.renderRow } table={ table } status={ status } error={ error } onSetAllSelected={ this.props.onSetAllSelected } onSetOrderBy={ this.props.onSetOrderBy } />
				<TableNav total={ total } selected={ table.selected } table={ table } onChangePage={ this.props.onChangePage } onAction={ this.props.onAction } />

				<h2>{ __( 'Add Group' ) }</h2>
				<p>{ __( 'Use groups to organise your redirects. Groups are assigned to a module, which affects how the redirects in that group work. If you are unsure then stick to the WordPress module.' ) }</p>

				<table className="form-table">
					<tbody>
						<tr>
							<th style={ { width: '50px' } }>{ __( 'Name' ) }</th>
							<td>
								<input size="30" className="regular-text" type="text" name="name" value={ this.state.name } onChange={ this.handleName } disabled={ saving || module.status !== STATUS_COMPLETE } />

								<select name="module_id" value={ this.state.moduleId } onChange={ this.handleModule } disabled={ saving || module.status !== STATUS_COMPLETE }>
									{ module.rows.map( item => <option key={ item.module_id } value={ item.module_id }>{ item.displayName }</option> ) }
								</select>

								&nbsp;
								<input className="button-primary" type="submit" name="add" value="Add" onClick={ this.handleSubmit } disabled={ saving || this.state.name === '' || module.status !== STATUS_COMPLETE } />

								{ saving && <Spinner /> }
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	const { group, module } = state;

	return {
		group,
		module,
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		onLoadGroups: () => {
			dispatch( getGroup() );
		},
		onLoadModules: () => {
			dispatch( getModule() );
		},
		onSearch: search => {
			dispatch( setSearch( search ) );
		},
		onChangePage: page => {
			dispatch( setPage( page ) );
		},
		onAction: action => {
			dispatch( performTableAction( action ) );
		},
		onSetAllSelected: onoff => {
			dispatch( setAllSelected( onoff ) );
		},
		onSetOrderBy: ( column, direction ) => {
			dispatch( setOrderBy( column, direction ) );
		},
		onFilter: moduleId => {
			dispatch( setFilter( 'module', moduleId ) );
		},
		onTableAction: action => {
			dispatch( performTableAction( action ) );
		},
		onCreate: ( name, moduleId ) => {
			dispatch( createGroup( name, moduleId ) );
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)( Groups );
