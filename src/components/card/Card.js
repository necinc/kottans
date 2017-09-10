import { h, Component } from 'preact';
import style from './style';

export default class Card extends Component {
  static defaultProps = {
    name: '',
    description: '',
    isFork: false,
    primaryLanguage: {
      name: '',
      color: '',
    },
    createdAt: new Date(),
    commitComments: {
      nodes: []
    },
    stargazers: {
      totalCount: 0,
    }
  }

  beautify = count => {
    if (count > 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count + ''
  }

  parseDate = date => {
    const year = String(date.getFullYear());

    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : '' + month;
    
    let day = date.getDay() + 1;
    day = day < 10 ? '0' + day : '' + day;

    return year + '/' + month + '/' + day;
  }

  render() {
    const {
      name,
      description,
      isFork,
      primaryLanguage,
      createdAt,
      stargazers,
    } = this.props;

    const stars = this.beautify(stargazers.totalCount);
    const creationDate = this.parseDate(new Date(createdAt));

    return (
      <li className={style.card} tabIndex={0}>
        <h2 className={style.title}>{name}</h2>
        {isFork && (
          <img
            className={style.forkMark}
            src="/assets/fork.svg"
            alr="Fork icon"
            aria-label="Repository is a fork"
          />
        )}
        
        <div className={style.repoData}>
          {primaryLanguage && (
            <div>
              <span
                aria-label="language color"
                className={style.languageColor}
                style={{ background: primaryLanguage.color}}
              />
              <span className={style.languageName}>{primaryLanguage.name}</span>
            </div>
          )}
          <span className={style.stars}>{stars}</span>
          <span className={style.createdAt}>{creationDate}</span>
        </div>
        
        <p className={style.description}>{description}</p>
      </li>
    );
  }
}
