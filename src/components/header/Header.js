import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import classnames from 'classnames';
import style from './style';

export default class Header extends Component {
	static defaultProps = {
		isHomepage: true,
	};

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
						<Link className={style.back} href="/">Back</Link>
					</nav>
				)}
				<img
					className={style.logo}
					src="/assets/GitHub-Mark.svg"
					alt="Github's Octocat"
				/>
			</header>
		);
	}
}
