import {useEffect, useState} from "react";
import axios from "axios";
import {set} from "js-cookie";

export const SettingsModal = ({
                                  isSettingsModalOpen,
                                  setIsSettingsModalOpen,
                                  currencies,
                                  setAccounts,
                                  accounts,
                                  setSelectedAccountIndex,
                              }: any) => {
    const API_URL = 'http://localhost:3000';

    const [selectedCurrencyToDefault, setSelectedCurrencyToDefault] = useState(accounts.length > 0 ? accounts[0].currency : '');
    const [selectedCurrencyToRemove, setSelectedCurrencyToRemove] = useState(accounts.length > 0 ? accounts[0].currency : '');
    const [selectedCurrencyToAdd, setSelectedCurrencyToAdd] = useState(currencies.length > 0 ? currencies[0].country : '');

    const [error, setError] = useState('');

    const handleAdd = () => {
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
                setError(error.response.data.message);
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
            setError(error.response.data.message);
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
                response.data.forEach((account: any, index: number) => {
                    if (account.isDefault) {
                        setSelectedAccountIndex(index);
                    }
                });
                setSelectedCurrencyToRemove(accounts.length > 0 ? accounts[0].currency : '');
                setIsSettingsModalOpen(false);
            }).catch((error) => {
                console.log(error);
                setError(error.response.data.message);
            });
        }).catch((error) => {
            console.log(error);
            setError(error.response.data.message);
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
                setError(error.response.data.message);
            });
        }).catch((error) => {
            console.log(error);
            setError(error.response.data.message);
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

    const handleSelect = (e: any, type: string) => {
        const selectedCurrency = e.target.value
        if (selectedCurrency === null || selectedCurrency === undefined || selectedCurrency === '' || type === null || type === undefined || type === '') {
            return;
        }
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

    useEffect(() => {
        setError('');
    }, [isSettingsModalOpen]);

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
                                    {currencies.length > 0 ? (
                                        <select onChange={(e) => handleSelect(e, 'add')}>
                                            {currencyOptions}
                                        </select>
                                    ) : (
                                        <select>
                                            <option> No accounts</option>
                                        </select>
                                    )}

                                </div>
                                <button className="button is-success" onClick={handleAdd}>Add</button>
                            </div>

                        </div>
                        <div className="field mt-2">
                            <label className="label">Remove currency</label>
                            <div className="is-flex">

                                <div className="select is-fullwidth">
                                    {accounts.length > 0 ? (
                                        <select onChange={(e) => handleSelect(e, 'remove')}>
                                            {accountOptions}
                                        </select>
                                    ) : (
                                        <select>
                                            <option> No accounts</option>
                                        </select>
                                    )}
                                </div>
                                <button className="button is-success" onClick={handleRemove}>Remove</button>
                            </div>
                        </div>
                        <div className="field mt-2">
                            <label className="label">Set default currency</label>
                            <div className="is-flex">
                                <div className="select is-fullwidth">
                                    {accounts.length > 0 ? (
                                        <select onChange={(e) => handleSelect(e, 'default')}>
                                            {accountOptions}
                                        </select>
                                    ) : (
                                        <select>
                                            <option> No accounts</option>
                                        </select>
                                    )}
                                </div>
                                <button className="button is-success" onClick={handleDefault}> Set</button>
                            </div>
                        </div>
                        {error && <article className="message is-danger">
                            <div className="message-body">
                                {error}
                            </div>
                        </article>}
                    </div>
                </section>
                <footer className="modal-card-foot">
                </footer>
            </div>
        </div>
    );
}
