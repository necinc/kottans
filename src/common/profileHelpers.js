import gql from 'graphql-tag';

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

export const getRepoQueryFor = (type = 'user') => gql`
query($login: String!, $count: Int!, $endCursor: String!) {
  ${type}(login: $login) {
    repositories(first: $count, after: $endCursor) {
      ...repoData
    }
  }
}

${repoFragment}
`;

export const getQueryFor = (type = 'user') => gql`
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

export const loadMoreRepos = (props) => () => {
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
};
