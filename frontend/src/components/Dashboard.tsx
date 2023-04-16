import React, {useEffect, useState} from 'react';
import {Header} from "./Header";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {RatesModal} from "./RatesModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {AccountCard} from "./AccountCard";
import {TransactionCard} from "./TransactionCard";


export const Dashboard = (props: any) => {
    const API_URL = 'http://localhost:3000';
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

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
            localStorage.removeItem('token');
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
            <RatesModal toggleModal={toggleModal} isModalOpen={isModalOpen}/>

            <section className="hero is-primary is-small">
                <div className={"hero-body"}>
                    <h1 className="title">Welcome!</h1>
                    <p className="subtitle">{user[0].firstName} {user[0].lastName}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-half">
                            <AccountCard user={user}/>
                        </div>
                        <div className="column is-half">
                            <TransactionCard/>
                        </div>
                    </div>
                </div>
            </section>
        </>);
}