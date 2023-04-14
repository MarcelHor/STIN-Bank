import React, {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";


export const Login = (props: any) => {
    const API_URL = 'http://localhost:3000';
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axios.post(`${API_URL}/api/login`, {
            email,
            password
        }).then((response) => {
            console.log(response);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                            <form action="" className="box" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label htmlFor="" className="label">Email</label>
                                    <div className="control has-icons-left">
                                        <input type="email" placeholder="e.g. bobsmith@gmail.com" className="input"
                                               required value={email}
                                               onChange={(e) => setEmail(e.target.value)}/>
                                        <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope}/>
                </span>
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="" className="label">Password</label>
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
                                    <button className="button is-primary">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

