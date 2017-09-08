import { h, Component } from 'preact';
import { Router } from 'preact-router';

import {
	ApolloProvider,
	createNetworkInterface,
	ApolloClient,
} from 'react-apollo';

import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';


const networkInterface = createNetworkInterface({
	uri: 'https://api.github.com/graphql',
	opts: {
		headers: {
			'Authorization': 'bearer 786e1fc00a6b82188751b876b13c95d70dc4fab3',
		}
	}
});

const client = new ApolloClient({
  networkInterface,
});

export default class App extends Component {
	state = {
		isHomepage: true,
	};

	handleRoute = e => {
		if (e.url === '/' && this.state.isHomepage === false) {
			this.setState({ isHomepage: true });
		} else if (e.url !== '/' && this.state.isHomepage === true) {
			this.setState({ isHomepage: false });
		}
	}

	componentDidMount() {
		this.handleRoute({ url: location.pathname });
	}

	render() {
		return (
			<ApolloProvider client={client}>
				<div id="app">
					<Header isHomepage={this.state.isHomepage} />
					<Router onChange={this.handleRoute}>
						<Home path="/" />
						<Profile path="/:user" />
					</Router>
				</div>
			</ApolloProvider>
		);
	}
}
