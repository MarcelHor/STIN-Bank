import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from '../../config';

export const SendModal = ({
                              isSendModalOpen,
                              setIsSendModalOpen,
                              setAccounts,
                              currencies,
                          }: any) => {
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(currencies.length > 0 ? currencies[0].country : '');
    const [receiver, setReceiver] = useState('');

    const [error, setError] = useState('');

    const handleSend = () => {
        console.log(selectedCurrency);
        if (amount === '') {
            setError('Amount is required');
            return;
        } else if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        } else if (receiver === '') {
            setError('Receiver is required');
            return;
        }

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
                setError(error.response.data.message);
            });
        }).catch((error) => {
            console.log(error);
            setError(error.response.data.message);
        });
    }

    const handleSelect = (e: any) => {
        const selectedCurrency = e.target.value.split(' - ')[0];
        if (selectedCurrency) {
            setSelectedCurrency(selectedCurrency);
        }
    }

    const options = currencies.map((currency: any) => {
        return <option key={currency.country} value={currency.country}>{currency.country} - {currency.code}
        </option>
    });

    useEffect(() => {
        setError('');
    }, [isSendModalOpen]);

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
                                {currencies.length > 0 ? (
                                    <select onChange={handleSelect}>
                                        {options}
                                    </select>
                                ) : (
                                    <select>
                                        <option> No currency available </option>
                                    </select>
                                )}
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
                        <input className="input" type="number" placeholder="Recipient" value={receiver}
                               onChange={(e) => setReceiver(e.target.value)}/>
                    </div>
                    {error && <article className="message is-danger">
                        <div className="message-body">
                            {error}
                        </div>
                    </article>}
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success is-fullwidth" onClick={handleSend}>Send</button>
                </footer>
            </div>
        </div>
    );

}