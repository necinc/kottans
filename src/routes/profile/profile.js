import { h, Component } from 'preact';
import style from './style';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import {
	getQueryFor,
	loadMoreRepos
} from '../../common/profileHelpers';

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

	renderCards = (nodes) => nodes.map(card => (
		<Card
			name={card.name}
			description={card.description}
			isFork={card.isFork}
			primaryLanguage={card.primaryLanguage}
			createdAt={card.createdAt}
			commitComments={card.commitComments}
			stargazers={card.stargazers}
		/>
	));

	requestSent = false;
	scrollListener = () => {
		const { scrollY, innerHeight } = window;
		const { scrollHeight } = document.body;
		const { tryUser, data } = this.props;
		const { pageInfo } = (tryUser ? data.user.repositories : data.organization.repositories);

		if (scrollY + innerHeight > scrollHeight - 100 && data.loading === false && pageInfo.hasNextPage && this.requestSent === false) {
			this.requestSent = true;
			this.props.loadMoreRepos().then(() => {
				this.requestSent = false;
			});
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
				</section>
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
