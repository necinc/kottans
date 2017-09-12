import gql from 'graphql-tag';

export const repoQuery = gql`
  query($login: String!, $name: String!) {
    repository(owner: $login, name: $name) {
      name,
      url,
      languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
        edges {
          node {
            name
            color
          }
          size
        }
      }
      pullRequests(first: 5, states: OPEN ,orderBy: { field: COMMENTS, direction: DESC}) {
        nodes {
          title,
          url,
          number
          comments {
            totalCount
          }
        }
      }
      isFork
      parent {
        url
      }
    }
  }
`
