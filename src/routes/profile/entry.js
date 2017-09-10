import { h, Component } from 'preact';
import {
	ApolloProvider,
	createNetworkInterface,
	ApolloClient,
} from 'react-apollo';

import config from '../../config';
import { UserProfile, OrganizationProfile } from './profile';

const networkInterface = createNetworkInterface({
	uri: 'https://api.github.com/graphql',
	opts: {
		headers: {
			'Authorization': `bearer ${config.github_token}`,
		}
	}
});

const client = new ApolloClient({
  networkInterface,
});

class ProfileContainer extends Component {
	state = {
		isTryingUser: true,	
	}

	setOrganisation = () => {
		this.setState({ isTryingUser: false });
	}

	render() {
		return (
			<ApolloProvider client={client}>
				{this.state.isTryingUser ? (
					<UserProfile
						{...this.props}
						tryUser
						errorHandler={this.setOrganisation}
					/>
				) : (
					<OrganizationProfile
						{...this.props}
						errorHandler={this.setOrganisation}
					/>
				)}
			</ApolloProvider>
		);
	}
}

export default ProfileContainer;
