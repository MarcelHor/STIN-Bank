import React, {FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {LoginForm} from "./LoginForm";
import {TwoFactorForm} from "./TwoFactorForm";
import { API_URL } from '../../config';

export const Login = (props: any) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<string>('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState('login');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axios.post(`${API_URL}/api/login`, {
            email,
            password
        }).then((response) => {
            if (response.status === 200) {
                setStep('verify');
            }
        }).catch((error) => {
            setErrors(error.response.data.message);
        });
    }

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        await axios.post(`${API_URL}/api/verify`, {email, code})
            .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('token', response.data.token);
                        navigate('/dashboard');
                    }
                }
            ).catch((error) => {
                setErrors(error.response.data.message);

            });
    };

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
                            {step === 'login' && <LoginForm
                                email={email}
                                setEmail={setEmail}
                                password={password}
                                setPassword={setPassword}
                                handleSubmit={handleSubmit}
                                errors={errors}
                            />}
                            {step === 'verify' && <TwoFactorForm
                                code={code}
                                setCode={setCode}
                                handleVerify={handleVerify}
                                errors={errors}
                            />}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

