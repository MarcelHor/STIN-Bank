import React, {useEffect, useState} from 'react';
import {Header} from "./Header";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {CurrenciesModal} from "./CurrenciesModal";


export const Dashboard = (props: any) => {
    const API_URL = 'http://localhost:3000';
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    useEffect(() => {
        axios.get(`${API_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setUser(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const handleLogout = () => {
        navigate('/logout');
    }

    if (!user) {
        return (
            <div className="hero is-primary is-fullheight">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">Loading...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header handleLogout={handleLogout} toggleModal={toggleModal}/>
            <section className="hero is-primary is-small">
                <div className={"hero-body"}>
                    <h1 className="title">Welcome!</h1>
                    <p className="subtitle">{user[0].firstName} {user[0].lastName}</p>
                </div>
            </section>

            <CurrenciesModal toggleModal={toggleModal} isModalOpen={isModalOpen}/>

            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-one-third">
                            <div className="card">
                                <div className="card-content">
                                    <p className="title">Account Balance</p>
                                    <p className={"subtitle is-size-6"}>{user[0].accountNumber}</p>
                                    <div className="is-flex is-align-items-center">
                                        <p className="mr-2">Current Balance:</p>
                                        <p className="has-text-weight-bold has-text-primary">$100</p>
                                    </div>
                                    <div className="buttons mt-4">
                                        <button className="button is-primary mr-2">Deposit</button>
                                        <button className="button is-danger">Withdraw</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}