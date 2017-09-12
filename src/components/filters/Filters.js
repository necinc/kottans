import { h, Component } from 'preact';
import style from './style';

export default class Filters extends Component {
  static defaultProps = {
    onApply: () => {},
  }

  state = {
    open: false,
    filters: {},
  };

  onApply = e => {
    if (e) { e.preventDefault() }
    this.onApply(this.state.filters);
  }

  toggleFilters = e => {
    if (e) { e.preventDefault(); }
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div className={style.filters}>
        <a href="#filter" onClick={this.toggleFilters} className={style.filterLink}>Filter</a>
        {this.state.open && (
          <form action='/' onSubmit={this.onApply}>
            <div>
              <input type="checkbox" name="hasOpenIssues" id="issueCheckbox" />
              <label htmlFor="issueCheckbox">Has open issues</label>
            </div>
            <div>
              <button type="submit">Apply</button>
            </div>
          </form>
        )} 
      </div>  
    );
  }
}
