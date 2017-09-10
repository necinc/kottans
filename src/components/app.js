import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header/Header';
import Home from 'async!../routes/home';
import Profile from 'async!../routes/profile/entry';

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
			<div id="app">
				<Header isHomepage={this.state.isHomepage} />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/:login" />
				</Router>
			</div>
		);
	}
}
