import React, {useEffect, useState} from 'react';
import {Header} from "./Header";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {RatesModal} from "./RatesModal";
import {AccountCard} from "./AccountCard";
import {TransactionCard} from "./TransactionCard";
import {CurrenciesModal} from "./CurrenciesModal";


export const Dashboard = (props: any) => {
    const API_URL = 'http://localhost:3000';
    const navigate = useNavigate();

    const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        axios.get(`${API_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setUser(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const [accounts, setAccounts] = useState<any>(null);
    useEffect(() => {
        axios.get(`${API_URL}/api/accounts/getAll`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setAccounts(response.data);
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
                    <div className="containerd">
                        <h1 className="title">Loading...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header handleLogout={handleLogout} setIsRatesModalOpen={setIsRatesModalOpen} setIsCurrencyModalOpen={setIsCurrencyModalOpen}/>
            <RatesModal isRatesModalOpen={isRatesModalOpen} setIsRatesModalOpen={setIsRatesModalOpen} />
            <CurrenciesModal isCurrencyModalOpen={isCurrencyModalOpen} setIsCurrencyModalOpen={setIsCurrencyModalOpen} />

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
                            <AccountCard user={user} accounts={accounts} />
                        </div>
                        <div className="column is-half">
                            <TransactionCard/>
                        </div>
                    </div>
                </div>
            </section>
        </>);
}