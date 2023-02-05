import { h } from 'preact';
import style from './style.css';

const Home = () => {
	return (
		<div class={style.home}>
			<h1>What is NIP-05 for Nostr?</h1>
			<p>
			In the NIP-05 nostr protocol, a human-readable identifier is used instead of a public key to describe users. 
			This identifier is often described as something similar to an email address. 
			For example, using an address like me@nostrprotocol.net allows your friends to easily find and 
			follow you as a follower with this address.
			</p>
			<h1>What is a Nostrprotocol.net Identifier?</h1>
			<p>
			You can easily obtain a Nostrprotocol.net identifier for your nickname or name for free with Nostrprotocol.net. 
			All you have to do is follow the steps below.
			</p>
			<h1>Steps to obtain an identifier</h1>
			<ul>
				<li>First, open the registration page.</li>
				<li>Enter the public key value you are using on Nostr.</li>
				<li>Choose a prefix for your identifier. For example, if you choose 'nostr', 
					your identifier will be 'nostr@nostrprotocol.net'. You must select a minimum of 4 characters.</li>
				<li>In this step, you need to send the text given to you through any Nostr client.</li>
				<li>The system will send you an automatic direct message confirming that the transaction has been 
					approved after it has recognized the message you sent. Afterwards, you can enter your NIP-05 identifier
					through any Nostr client of your choice.</li>
			</ul>
			<h1>Contact</h1>
			<p>
			If you have any qu	estions, you can send an email to <a href="mailto:nip05@nostrprotocol.net">nip05@nostrprotocol.net</a> or 
			send a message through nostr.</p>
		</div>
	);
};

export default Home;
