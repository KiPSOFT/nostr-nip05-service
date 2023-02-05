import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
		<header class={style.header}>
			<a href="/" class={style.logo}>
				<img src="../../assets/logo.webp" alt="Nostr Logo" height="32" width="32" />
				<h1>Free Nostr NIP-05 Identifier Service</h1>
			</a>
			<nav>
				<Link activeClassName={style.active} href="/">
					Home
				</Link>
				<Link activeClassName={style.active} href="/register">
					Register
				</Link>
			</nav>
		</header>
);

export default Header;
