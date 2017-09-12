import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Home extends Component {
	input = null;

	registerInput = input => {
		this.input = input;
	}

	search = e => {
		e.preventDefault();
		var username = this.input.value || '';
		if (username.length) {
			route(this.input.value.trim());
		} else {
			this.input.focus();
		}
	}

	render() {
		return (
			<div class={style.searchContainer}>
				<label className={style.hiddenLabel} htmlFor="mainSearch" id="mainSearchLabel">User/organisation name:</label>
				<input
					type="text"
					id="mainSearch"
					ref={this.registerInput}
					className={style.searchInput}
					onKeyUp={this.changeHandler}
					placeholder="User / Organisation"
					aria-labelledby="mainSearchLabel"
				/>
				<button
					type="submit"
					className={style.searchBtn}
					aria-label="Search"
					onClick={this.search}
				>
					Search...
				</button>
			</div>
		);
	}
}
