import { h, Component } from 'preact';
import style from './style';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

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

const repoFragment = `
	fragment repoData on RepositoryConnection {
		pageInfo {
			endCursor
			hasNextPage
		}
		nodes {
			name
			description
			isFork
			primaryLanguage {
				name
				color
			}
			createdAt
			stargazers(first: 0) {
				totalCount # Count of stars
			} 
		}
	}
`;

const getRepoQueryFor = (type = 'user') => gql`
	query($login: String!, $count: Int!, $endCursor: String!) {
		${type}(login: $login) {
			repositories(first: $count, after: $endCursor) {
				...repoData
			}
		}
	}

	${repoFragment}
`;

const getQueryFor = (type = 'user') => gql`
	query($login: String!, $count: Int!) {
		${type}(login: $login) {
			name
			login
			avatarUrl(size: 200),
			repositories(first: $count) {
				...repoData 
			}
		}
	}

	${repoFragment}
`;

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
		loadMoreRepos() {
			const { data, ownProps: { tryUser, login } } = props;
			const loadedData = tryUser ? data.user : data.organization;
			const endCursor = loadedData.repositories.pageInfo.endCursor;

			return data.fetchMore({
				query: getRepoQueryFor(tryUser ? 'user' : 'organization'),
				variables: {
					login,
					count: 10,
					endCursor,
				},
				updateQuery: (prev, result) => {
					const oldRepos = tryUser ? prev.user.repositories : prev.organization.repositories;
					const newRepos = tryUser
						? result.fetchMoreResult.user.repositories
						: result.fetchMoreResult.organization.repositories;

					return tryUser ? {
						...prev,
						user: {
							...prev.user,
							repositories: {
								...prev.user.repositories,
								nodes: [...prev.user.repositories.nodes, ...newRepos.nodes],
								pageInfo: newRepos.pageInfo,
							},
						},
					} : {
						...prev,
						organization: {
							...prev.organization,
							repositories: {
								...prev.organization.repositories,
								nodes: [...prev.organization.repositories.nodes, ...newRepos.nodes],
								pageInfo: newRepos.pageInfo
							},
						},
					};
				},
			});
		},
	}),
});

export const UserProfile = graphql(getQueryFor('user'), getOptions())(Profile);

export const OrganizationProfile = graphql(getQueryFor('organization'), getOptions())(Profile);

export default UserProfile;
