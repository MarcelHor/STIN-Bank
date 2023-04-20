import {useEffect, useState} from "react";
import axios from "axios";

export const SettingsModal = ({
                                  isSettingsModalOpen,
                                  setIsSettingsModalOpen,
                                  currencies,
                                  setAccounts,
                                  accounts,
                              }: any) => {
    const API_URL = 'http://localhost:3000';

    const [selectedCurrencyToDefault, setSelectedCurrencyToDefault] = useState("");
    const [selectedCurrencyToRemove, setSelectedCurrencyToRemove] = useState("");
    const [selectedCurrencyToAdd, setSelectedCurrencyToAdd] = useState("");

    const handleAdd = () => {
        console.log(selectedCurrencyToAdd);
        axios.post(`${API_URL}/api/accounts/add`, {
            currency: selectedCurrencyToAdd,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(() => {
            axios.get(`${API_URL}/api/accounts/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                setAccounts(response.data);
                setIsSettingsModalOpen(false);
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleRemove = () => {
        axios.delete(`${API_URL}/api/accounts/remove`, {
            data: {
                currency: selectedCurrencyToRemove,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        }).then(() => {
            axios.get(`${API_URL}/api/accounts/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                setAccounts(response.data);
                setIsSettingsModalOpen(false);
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleDefault = () => {
        axios.post(`${API_URL}/api/accounts/default`, {
            currency: selectedCurrencyToDefault,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(() => {
            axios.get(`${API_URL}/api/accounts/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                setAccounts(response.data);
                setIsSettingsModalOpen(false);
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const currencyOptions = currencies.map((currency: any) => {
        return <option key={currency.country} value={currency.country}>{currency.country} - {currency.code}
        </option>
    });

    const accountOptions = accounts.map((account: any) => {
        return <option key={account.currency} value={account.currency}>{account.currency} - {account.code}
        </option>
    });

    useEffect(() => {
        if (accounts.length === 0) return;
        setSelectedCurrencyToDefault(accounts[0].currency);
        setSelectedCurrencyToRemove(accounts[0].currency);
        setSelectedCurrencyToAdd(accounts[0].currency);
    }, [accounts]);

    const handleSelect = (e: any, type: string) => {
        const selectedCurrency = e.target.value
        switch (type) {
            case 'add':
                setSelectedCurrencyToAdd(selectedCurrency);
                break;
            case 'remove':
                setSelectedCurrencyToRemove(selectedCurrency);
                break;
            case 'default':
                setSelectedCurrencyToDefault(selectedCurrency);
                break;
        }
    }

    return (
        <div className={`modal ${isSettingsModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background " onClick={() => setIsSettingsModalOpen(false)}/>
            <div className="modal-card" style={{height: '500px'}}>
                <header className="modal-card-head">
                    <p className="modal-card-title">Currencies settings</p>
                    <button className="delete" aria-label="close" onClick={() => setIsSettingsModalOpen(false)}/>
                </header>
                <section
                    className="modal-card-body is-flex is-flex-direction-column is-justify-content-space-between">
                    <div
                        className="container is-flex is-flex-direction-column is-justify-content-space-between settings-buttons">
                        <div className="field mt-2">
                            <label className="label">Add new currency</label>
                            <div className="is-flex">
                                <div className="select is-fullwidth">
                                    <select onChange={(e) => handleSelect(e, 'add')}>
                                        {currencyOptions}
                                    </select>
                                </div>
                                <button className="button is-success" onClick={handleAdd}>Add</button>
                            </div>

                        </div>
                        <div className="field mt-2">
                            <label className="label">Remove currency</label>
                            <div className="is-flex">

                                <div className="select is-fullwidth">
                                    <select onChange={(e) => handleSelect(e, 'remove')}>
                                        {accountOptions}
                                    </select>
                                </div>
                                <button className="button is-success" onClick={handleRemove}>Remove</button>
                            </div>
                        </div>
                        <div className="field mt-2">
                            <label className="label">Set default currency</label>
                            <div className="is-flex">
                                <div className="select is-fullwidth">
                                    <select onChange={(e) => handleSelect(e, 'default')}>
                                        {accountOptions}
                                    </select>
                                </div>
                                <button className="button is-success" onClick={handleDefault}> Set</button>
                            </div>
                        </div>

                    </div>
                </section>
                <footer className="modal-card-foot">
                </footer>
            </div>
        </div>
    );
}
