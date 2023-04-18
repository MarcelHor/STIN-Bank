import {useState} from "react";
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
    const [recipient, setRecipient] = useState('');

    const handleSend = () => {

    }

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
                                <select onChange={(e) => setSelectedCurrency(e.target.value)}>
                                    {accounts.map((currency: any) => {
                                        console.log(currency.currency);
                                        return <option key={currency.currency}>{currency.currency} - {currency.code}</option>
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
                        <input className="input" type="text" placeholder="Recipient" value={recipient}
                               onChange={(e) => setRecipient(e.target.value)}/>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success is-fullwidth" onClick={handleSend}>Send</button>
                </footer>
            </div>
        </div>
    );

}