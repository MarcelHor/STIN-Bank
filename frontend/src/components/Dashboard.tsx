import React, {useEffect, useState} from 'react';
import {Header} from "./Header";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {RatesModal} from "./RatesModal";
import {AccountCard} from "./AccountCard";
import {TransactionCard} from "./TransactionCard";
import {DepositModal} from "./DepositModal";
import {SendModal} from "./SendModal";
import {WithdrawModal} from "./WithdrawModal";
import {SettingsModal} from "./SettingsModal";

export const Dashboard = () => {
    const API_URL = 'https://stinapi.marcel-horvath.me';
    const navigate = useNavigate();

    //modals
    const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = React.useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = React.useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);


    //data
    const [user, setUser] = useState<any>(null);
    const [currencies, setCurrencies] = useState([]);
    const [accounts, setAccounts] = useState<any>(null);


    const [selectedAccountIndex, setSelectedAccountIndex] = React.useState(0);

    useEffect(() => {
        axios.get(`${API_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setUser(response.data);
        }).catch((error) => {
            console.log(error);
            localStorage.removeItem('token');
        });

        axios.get(`${API_URL}/api/currencies`)
            .then((response) => {
                setCurrencies(response.data);
            }).catch((error) => {
            console.log(error);
        });

        axios.get(`${API_URL}/api/accounts/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setAccounts(response.data);
            response.data.forEach((account: any, index: number) => {
                if (account.isDefault) {
                    setSelectedAccountIndex(index);
                }
            });
        }).catch((error) => {
            console.log(error);
        });

    }, []);

    const handleLogout = () => {
        navigate('/logout');
    }

    useEffect(() => {
        if (accounts) {
            if (selectedAccountIndex >= accounts.length || selectedAccountIndex < 0) {
                accounts.forEach((account: any, index: number) => {
                    if (account.isDefault) {
                        setSelectedAccountIndex(index);
                    }
                });
            }
        }
    }, [accounts]);


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
            <Header handleLogout={handleLogout} setIsRatesModalOpen={setIsRatesModalOpen}/>

            <RatesModal isRatesModalOpen={isRatesModalOpen} setIsRatesModalOpen={setIsRatesModalOpen}
                        currencies={currencies}/>
            {accounts &&
                <DepositModal isDepositModalOpen={isDepositModalOpen} setIsDepositModalOpen={setIsDepositModalOpen}
                              currencies={currencies} setAccounts={setAccounts} accounts={accounts}/>}
            {accounts && <SendModal isSendModalOpen={isSendModalOpen} setIsSendModalOpen={setIsSendModalOpen}
                                    setAccounts={setAccounts} accounts={accounts}/>}

            {accounts &&
                <WithdrawModal isWithdrawModalOpen={isWithdrawModalOpen} setIsWithdrawModalOpen={setIsWithdrawModalOpen}
                               currencies={currencies} setAccounts={setAccounts} accounts={accounts}/>}

            {accounts &&
                <SettingsModal isSettingsModalOpen={isSettingsModalOpen} setIsSettingsModalOpen={setIsSettingsModalOpen}
                               setAccounts={setAccounts} currencies={currencies} accounts={accounts}
                               setSelectedAccountIndex={setSelectedAccountIndex}/>}

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
                            {accounts &&  <AccountCard user={user} accounts={accounts}
                                         setIsDepositModalOpen={setIsDepositModalOpen}
                                         selectedAccountIndex={selectedAccountIndex}
                                         setSelectedAccountIndex={setSelectedAccountIndex}
                                         setIsSendModalOpen={setIsSendModalOpen}
                                         setIsWithdrawModalOpen={setIsWithdrawModalOpen}
                                         setIsSettingsModalOpen={setIsSettingsModalOpen}/>}
                        </div>
                        <div className="column is-half">
                            <TransactionCard accounts={accounts}/>
                        </div>
                    </div>
                </div>
            </section>
        </>);
}