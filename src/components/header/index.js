import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import classnames from 'classnames';
import style from './style';

export default class Header extends Component {
	static defaultProps = {
		isHomepage: true,
	};
	
	handleBack = e => {
		e && e.preventDefault();
		history.back();
	}

	render() {
		const { isHomepage } = this.props;
		const headerClassNames = classnames({
			[style.header]: true,
			[style.headerHome]: isHomepage,
		});

		return (
			<header className={headerClassNames}>
				{isHomepage === false && (
					<nav>
						<a className={style.back} onClick={this.handleBack} href="/">Back</a>
					</nav>
				)}
				<img className={style.logo} src="/assets/GitHub-Mark.svg" />
			</header>
		);
	}
}
