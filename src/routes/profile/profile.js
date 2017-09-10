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

	componentWillReceiveProps(nextProps) {
		const { tryUser, data: { error } } = nextProps;
		if (error !== undefined && tryUser === true) {
			this.props.errorHandler();
		}
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

const queryUser = gql`
	query($login: String!, $count: Int!) {
		user(login: $login) {
			name
			login
			avatarUrl(size: 200),
			repositories(first: $count) {
				...repoData 
			}
		}
	}

	fragment repoData on RepositoryConnection {
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


const queryOrganization = gql`
	query($login: String!, $count: Int!) {
		organization(login: $login) {
			name
			login
			avatarUrl(size: 200),
			repositories(first: $count) {
				...repoData 
			}
		}
	}

	fragment repoData on RepositoryConnection {
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

const selector = ({ login }) => ({
	variables: {
		login,
		count: 10,
	}
});

export const UserProfile = graphql(queryUser, {
	options: selector
})(Profile);

export const OrganizationProfile = graphql(queryOrganization, {
	options: selector,
})(Profile);

export default UserProfile;
