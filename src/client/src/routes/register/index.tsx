import { h } from 'preact';
import style from './style.css';
import { useForm } from "react-hook-form";
import { useRef, useState } from 'preact/hooks';

const Register = () => {
    const [ isSuccess, setIsSuccess ] = useState(false);
    const [ errMessage, setErrMessage ] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    const copyTextRef = useRef(null);
    const [ buttonText, setButtonText ] = useState('Copy');

    const onSubmit = async(data) => {
        const res = await fetch('/api/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (res.status === 200) {
            setIsSuccess(true);
        } else {
            setErrMessage(json.message);
        }
    };

    const handleCopyTextClick = async() => {
        await navigator.clipboard.writeText(copyTextRef.current.value);
        setButtonText('Copied');
    }

	return (
		<div class={style.page}>
            {!isSuccess && <form id="register-form" class={style.register} onSubmit={handleSubmit(onSubmit)}>
                <p>Please fill in the below fields.</p>
                <div class={style.inputWrapper}>
                    <label for="nickname">Name</label>
                    <div>
                        <input style={{width: '60%'}} id="name" {...register('name', { required: true, minLength: {
                            value: 4,
                            message: 'You can choose a name with at least 4 characters.'
                        } })} />
                        <label>@nostrprotocol.net</label>
                    </div>
                    {errors.name && <span class={style.error}>{errors.name?.message ? errors.name?.message : 'Name is required.'}</span>}
                </div>
                <div class={style.inputWrapper}>
                    <label for="publickey">Public key</label>
                    <input id="publickey" {...register('publicKey', { required: true })} />
                    {errors.publickey && <span class={style.error}>Public key is required</span>}
                </div>
                <div class={style.inputWrapper}>
                    <label for="email">E-Mail</label>
                    <input id="email" type="email" {...register('email', { required: true })} />
                    {errors.email && <span class={style.error}>E-mail is required</span>}
                </div>
                {!isSuccess && errMessage && <span class={style.error}>{errMessage}</span>}
                <div class={style.inputWrapper}>
                    <button type="submit" form="register-form">Register</button>
                </div>
            </form>}
            {isSuccess && <div style={{paddingTop: '100px', fontSize: '18px'}}>
                <p>Congratulations, your registration has been created. What you need to do now is:</p>
                <ul>
                    <li>
                        <div>
                        Copy the following text.
                        </div>
                        <textarea ref={copyTextRef} class={style.textarea} readOnly>
                            Please approve my NIP-05 request on https://nip05.nostprotocol.net @npub17l9ne578dcljxmw47590knghalel5crjm449w8k4cnc2dnqcz9qq32yxme
                        </textarea>
                        <button onClick={handleCopyTextClick}>{buttonText}</button>
                    </li>
                    <li>Share the copied message from a client. Recommended relay is wss://relay.nostrprotocol.net Recommended clients; <a href="https://damus.io/">Damus (IOS)</a>, <a href="https://github.com/vitorpamplona/amethyst">Amethyst (Android)</a> <a href="https://nostrgram.co/">Nostrgram (Web)</a>, <a href="https://iris.to/">iris (Web)</a></li>
                    <li>Your request will be approved within 30 minutes and you will be notified with a direct message.</li>
                </ul>
                <p>Points to remember:</p>
                <ul>
                    <li>Send the message exactly as it is.</li>
                    <li>Make sure the message is sent from an account that matches the public key you provided during registration.</li>
                </ul>
            </div>}
		</div>
	);
};

export default Register;
