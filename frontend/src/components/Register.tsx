import {API_URL} from '../../config';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {FormEvent, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";

export const Register = (props: any) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [FirstName, setFirstName] = useState<string>('');
    const [LastName, setLastName] = useState<string>('');
    const [errors, setErrors] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axios.post(`${API_URL}/api/register`, {
            email,
            password,
            firstName: FirstName,
            lastName: LastName
        }).then((response) => {
            if (response.status === 201) {
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
                navigate('/');
            }
        }).catch((error) => {
            setErrors(error.response.data);
        });
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, []);


    return (
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-4-widescreen">
                            <form className="box" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">First Name</label>
                                    <div className="control has-icons-left">
                                        <input type="text" placeholder="First Name" className="input" required
                                               value={FirstName}
                                               onChange={(e) => setFirstName(e.target.value)}/>
                                        <span className="icon is-small is-left">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Last Name</label>
                                    <div className="control has-icons-left">
                                        <input type="text" placeholder="Last Name" className="input" required
                                               value={LastName}
                                               onChange={(e) => setLastName(e.target.value)}/>
                                        <span className="icon is-small is-left">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control has-icons-left">
                                        <input type="email" placeholder="e.g." className="input" required
                                               value={email}
                                               onChange={(e) => setEmail(e.target.value)}/>
                                        <span className="icon is-small is-left">
                                            <FontAwesomeIcon icon={faEnvelope}/>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control has-icons-left">
                                        <input type="password" placeholder="*******" className="input" required
                                               value={password}
                                               onChange={(e) => setPassword(e.target.value)}/>
                                        <span className="icon is-small is-left">
                                            <FontAwesomeIcon icon={faLock}/>
                                        </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <a href="/">Already have an account?</a>
                                </div>
                                <div className="field">
                                    <button className="button is-primary">
                                        Register
                                    </button>
                                </div>
                                {errors && <div className="field">
                                    <p className="help is-danger">{errors}</p>
                                </div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}