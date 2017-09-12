import { h, Component } from 'preact';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import style from './style';
import {
	getQueryFor,
	loadMoreRepos
} from '../../common/profileHelpers';

import RepoPopup from '../../components/popup/Popup';
import Card from '../../components/card/Card';

class Profile extends Component {
	static defaultProps = {
		login: '',
		data: {
			repositories: []
		},
		errorHandler: () => {},
		tryUser: false,
	};

	state = {
		loadingMore: false,
		popupOpen: null,
	}

	popup = null;

	openPopup = name => {
		this.setState({ popupOpen: name });
	};

	closePopup = () => {
		this.setState({ popupOpen: null });
	}

	registerPopupRef = popup => {
		this.popup === popup;
	}

	closeFromBackdrop = e => {
		if (e.target.className === style.dialogWrapper) {
			this.closePopup();
		}
	}

	renderCards = (nodes) => nodes
		.filter(node => node.owner.login === this.props.login)
		.map(card => (
			<Card
				name={card.name}
				description={card.description}
				isFork={card.isFork}
				primaryLanguage={card.primaryLanguage}
				createdAt={card.createdAt}
				commitComments={card.commitComments}
				stargazers={card.stargazers}
				onClick={this.openPopup}
			/>
		));

	scrollListener = () => {
		const { scrollY, innerHeight } = window;
		const { scrollHeight } = document.body;
		const { tryUser, data } = this.props;
		const { pageInfo } = (tryUser ? data.user.repositories : data.organization.repositories);

		if (scrollY + innerHeight > scrollHeight - 100 && data.loading === false && pageInfo.hasNextPage && this.state.loadingMore === false) {
			this.setState({ loadingMore: true })
			this.props.loadMoreRepos()
				.then(() => this.setState({ loadingMore: false }));
		}
	}

	componentWillReceiveProps(nextProps) {
		const { tryUser, data: { error } } = nextProps;
		if (error !== undefined && tryUser === true) {
			this.props.errorHandler();
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', this.scrollListener);
		window.addEventListener('wheel', this.scrollListener);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.scrollListener);
		window.removeEventListener('wheel', this.scrollListener);
	}

	render() {
		const {
			loading,
			user,
			organization,
			error
		} = this.props.data;
		const { tryUser } = this.props;

		if (error) {
			return (
				<div className={style.emptyContainer}>
					<p>Oops.. There is on user or organization with name: {this.props.login}.</p>
				</div>
			);
		}

		if (loading) {
			return (
				<div className={style.emptyContainer}>
					<span className={style.spinner} aria-hidden={true} />
					<p>Looking in {tryUser ? 'users' : 'organizations'}...</p>
				</div>
			);
		}

		const data = tryUser ? user : organization;

		const {
			avatarUrl,
			name,
			login,
			repositories,
		} = data;

		return (
			<div className={style.profile}>
				<div className={style.userInfo}>
					<img 
						src={avatarUrl}
						alr={name}
						className={style.avatar}
					/>
					<div className={style.textData}>
						<p className={style.username}>{name}</p>
						<span className={style.login}>{'@' + login}</span>
					</div>
				</div>

				<section aria-label="Card list">
					<ul className={style.list}>
						{this.renderCards(repositories ? repositories.nodes : [])}
					</ul>
					{this.state.loadingMore && (
						<div className={style.spinner + ' ' + style.spinnerSmall} aria-hidden={true} />
					)}
				</section>
				{this.state.popupOpen !== null && (
					<section
						className={style.dialogWrapper}
						aria-label="Repository details"
						onClick={this.closeFromBackdrop}
						ref={this.registerPopupRef}
					>
						<RepoPopup
							login={login}
							name={this.state.popupOpen}
							onClose={this.closePopup}
						/>
					</section>
				)}
			</div>
		);
	}
}

const selector = ({ login }) => ({
	variables: {
		login,
		count: 10,
	}
});

const getOptions = () => ({
	options: selector,
	props: (props) => ({
		...props,
		loadMoreRepos: loadMoreRepos(props),
	}),
});

export const UserProfile = graphql(getQueryFor('user'), getOptions())(Profile);

export const OrganizationProfile = graphql(getQueryFor('organization'), getOptions())(Profile);

export default UserProfile;
