import { h, Component } from 'preact';
import { graphql } from 'react-apollo';

import style from './style';
import { repoQuery} from '../../common/popupHelpers';

class RepoPopup extends Component {
  static defaultProps = {
    login: '',
    name: '',
    onClose: () => {},
    data: {
      repository: {},
    },
  };

  dialog = null;

  escapeHandler = e => {
    if (e.keyCode === 27) {
      e.preventDefault();
      this.props.onClose();
    }
  };

  registerRef = btn => {
    setTimeout(() => btn !== null && btn.focus(), 50);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.escapeHandler);
    document.body.classList.add(style.dialogOpen);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.escapeHandler);
    document.body.classList.remove(style.dialogOpen);
  }

  renderBeautySize(size) {
    const kb = 1024;
    const mb = 1024 * 1024;
    if (size >= kb && size < mb) {
      return (size / kb).toFixed(2) + 'KB';
    }
    
    return (size / mb).toFixed(2) + 'MB';
  }

  renderLanguageList(languages) {
    if (languages === null || languages.edges.length === 0) {
      return null;
    }
    return (
      <table className={style.languageTable}>
        <tr>
          <th>Language name</th>
          <th>Used in project</th>
        </tr>
        {languages.edges.map(edge => {
          if (edge.size < 1000) { return null; }

          return (
            <tr>
              <td>
                <span className={style.languageColor} style={{ backgroundColor: edge.node.color }} />
                <span className={style.languageName}>{edge.node.name}</span>
              </td>
              <td>
                {this.renderBeautySize(edge.size)}
              </td>
            </tr>
          )
        })}
      </table>
    )
  }

  renderPRList(prs) {
    if (prs === null || prs.nodes.length === 0) {
      return null;
    }

    return (
      <section className={style.prList} aria-label="Top commented pull requests">
        <h3>Top commented pull requests</h3>
        {prs.nodes.map(pr => (
          <a href={pr.url} target="_blank" className={style.prContainer}>
            <span className={style.prNumber}>#{pr.number}</span>
            <p className={style.prTitle}>{pr.title}</p>
          </a>
        ))}
      </section>
    );
  }

  render() {
    const { loading, repository } = this.props.data;

    if (loading) {
      return (
        <div className={style.dialog}>
          <h4>Loading...</h4>
        </div>  
      );
    }

    const {
      name,
      url,
      isFork,
      languages,
      pullRequests,
      parent
    } = repository;

    return (
      <div role="dialog" className={style.dialog} onClick={this.prevent}>
        <div className={style.dialogHeader}>
          <button
            type="button"
            className={style.closeButton}
            onClick={this.props.onClose}
            aria-label="Close repository popup"
            ref={this.registerRef}
          />
        </div>
        <h2 className={style.title} aria-label="Repository name">
          <a href={url} className={style.externalLink} target="_blank">
            {name}
          </a>
        </h2>
        {isFork && (
          <p className={style.parentLink}><a href={parent.url}>Parent repository</a></p>
        )}
        {this.renderLanguageList(languages)}
        {this.renderPRList(pullRequests)}
      </div>
    );
  }
}

const selector = ({ login, name }) => ({
  variables: {
    login,
    name,
  },
});

export default graphql(repoQuery, {
  options: selector,
})(RepoPopup);
