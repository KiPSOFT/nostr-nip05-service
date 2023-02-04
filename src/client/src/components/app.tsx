import { h } from 'preact';
import { Route, Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Register from '../routes/register';

const App = () => (
	<div id="app">
		<Header />
		<main>
			<Router>
				<Route path="/" component={Home} />
				<Route path="/register" component={Register} />
				<Route path="/faq" component={Home} />
			</Router>
		</main>
	</div>
);

export default App;
