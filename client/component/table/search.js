/**
 * External dependencies
 */

import React from 'react';
import { connect } from 'react-redux';
import { translate as __ } from 'lib/locale';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { STATUS_IN_PROGRESS } from 'state/settings/type';

class SearchBox extends React.Component {
	constructor( props ) {
		super( props );

		this.state = { search: props.table.filter };
		this.handleChange = this.onChange.bind( this );
		this.handleSubmit = this.onSubmit.bind( this );
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.table.filterBy !== this.props.table.filterBy || nextProps.table.filter !== this.props.table.filter ) {
			this.setState( { search: nextProps.table.filter } );
		}
	}

	onChange( ev ) {
		this.setState( { search: ev.target.value } );
	}

	onSubmit( ev ) {
		ev.preventDefault();
		this.props.onSearch( this.state.search );
	}

	render() {
		const { status } = this.props;
		const disabled = status === STATUS_IN_PROGRESS || ( this.state.search === '' && this.props.table.filter === '' );
		const name = this.props.table.filterBy === 'ip' ? __( 'Search by IP' ) : __( 'Search' );

		return (
			<form onSubmit={ this.handleSubmit }>
				<p className="search-box">
					<input type="search" name="s" value={ this.state.search } onChange={ this.handleChange } />
					<input type="submit" className="button" value={ name } disabled={ disabled } />
				</p>
			</form>
		);
	}
}

SearchBox.propTypes = {
	table: PropTypes.object.isRequired,
	status: PropTypes.string.isRequired,
	onSearch: PropTypes.func.isRequired,
};

export default SearchBox;
