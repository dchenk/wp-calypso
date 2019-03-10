/** @format */

/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Internal dependencies
 */
import Card from 'components/card/compact';
import getEmailForwardingMXServers from 'state/selectors/get-email-forwarding-mx-servers';

class EmailForwardingCustomMxList extends React.Component {
	static propTypes = {
		mxServers: PropTypes.arrayOf(
			PropTypes.shape( {
				server: PropTypes.string.isRequired,
				priority: PropTypes.string.isRequired,
			} )
		),
		selectedDomainName: PropTypes.string.isRequired,
	};

	render() {
		const { mxServers, translate } = this.props;
		return (
			<Card>
				<p className="email-forwarding__explanation">
					{ translate(
						'Your site has custom MX records, which prevents you from adding email forwards via WordPress.com. ' +
							'Please check with your email provider or remove the MX records to add email forwards.'
					) }
				</p>
				<ul className="email-forwarding__list">
					{ mxServers.map( ( { server, priority } ) => {
						return (
							<li key={ server }>
								<span>
									{ translate(
										'{{em1}}Mail handled by{{/em1}} {{strong1}}%(server)s{{/strong1}} {{em2}}with priority{{/em2}} {{strong2}}%(priority)s{{/strong2}}',
										{
											components: {
												strong1: <strong />,
												strong2: <strong />,
												em1: <em />,
												em2: <em />,
											},
											args: {
												server,
												priority,
											},
										}
									) }
								</span>
							</li>
						);
					} ) }
				</ul>
			</Card>
		);
	}
}

export default connect( ( state, ownProps ) => ( {
	mxServers: getEmailForwardingMXServers( state, ownProps.selectedDomainName ),
} ) )( localize( EmailForwardingCustomMxList ) );