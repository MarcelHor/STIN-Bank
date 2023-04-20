import {useEffect, useState} from "react";
import axios from "axios";

export const SendModal = ({
                              isSendModalOpen,
                              setIsSendModalOpen,
                              setAccounts,
                              accounts,
                          }: any) => {
    const API_URL = 'http://localhost:3000';
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [receiver, setReceiver] = useState('');

    const handleSend = () => {
        console.log(selectedCurrency, receiver, amount);
        axios.post(`${API_URL}/api/accounts/send`, {
            balance: Math.abs(parseFloat(amount)),
            currency: selectedCurrency,
            receiver: receiver,
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
                setIsSendModalOpen(false);
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleSelect = (e: any) => {
        const selectedCurrency = e.target.value.split(' - ')[0];
        console.log(selectedCurrency);
        setSelectedCurrency(selectedCurrency);
    }

    useEffect(() => {
        if (accounts.length > 0) {
            setSelectedCurrency(accounts[0].currency);
        }
    }, [accounts]);

    return (
        <div className={`modal ${isSendModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={() => setIsSendModalOpen(false)}/>
            <div className="modal-card" style={{height: '500px'}}>
                <header className="modal-card-head">
                    <p className="modal-card-title">Send</p>
                    <button className="delete" aria-label="close" onClick={() => setIsSendModalOpen(false)}/>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label">Currency</label>
                        <div className="control">
                            <div className="select">
                                <select onChange={handleSelect}>
                                    {accounts.map((currency: any) => {
                                        return <option
                                            key={currency.currency}>{currency.currency} - {currency.code}</option>
                                    })}                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Amount</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="Amount"
                                   value={amount}
                                   onChange={(e) => setAmount(e.target.value)}/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">To</label>
                        <input className="input" type="text" placeholder="Recipient" value={receiver}
                               onChange={(e) => setReceiver(e.target.value)}/>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success is-fullwidth" onClick={handleSend}>Send</button>
                </footer>
            </div>
        </div>
    );

}