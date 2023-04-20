import {useState} from "react";
import axios from "axios";

export const DepositModal = ({
                                 isDepositModalOpen,
                                 setIsDepositModalOpen,
                                 currencies,
                                 setAccounts,
                                 accounts,
                             }: any) => {
    const API_URL = 'http://localhost:3000';
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0].country);
    const [receiverCurrency, setReceiverCurrency] = useState(accounts[0].currency);

    const handleDeposit = () => {
        axios.post(`${API_URL}/api/accounts/deposit`, {
            balance: Math.abs(parseFloat(amount)),
            currency: selectedCurrency,
            receiver: receiverCurrency
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
                setIsDepositModalOpen(false);
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

    const receiverOptions = accounts.map((currency: any) => {
        return <option key={currency.currency} value={currency.country}>{currency.currency} - {currency.code}
        </option>
    });

    const handleSelect = (e: any) => {
        const selected = e.target.value.split('-')[0].trim();
        setSelectedCurrency(selected);
    };

    const handleReceiverSelect = (e: any) => {
        const selected = e.target.value.split('-')[0].trim();
        setReceiverCurrency(selected);
    }

    return (
        <div className={`modal ${isDepositModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background " onClick={() => setIsDepositModalOpen(false)}/>
            <div className="modal-card" style={{height: '500px'}}>
                <header className="modal-card-head">
                    <p className="modal-card-title">Deposit</p>
                    <button className="delete" aria-label="close" onClick={() => setIsDepositModalOpen(false)}/>
                </header>
                <section className="modal-card-body is-flex is-flex-direction-column is-justify-content-space-between">
                    <div>
                        <div className="field mt-2">
                            <label className="label">Currency</label>
                            <div className="select">
                                <select onChange={handleSelect}>
                                    {currencyOptions}
                                </select>
                            </div>
                        </div>
                        <div className="field is-align-items-center">
                            <label className="label mr-2">Amount:</label>
                            <input
                                className="input"
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="field mt-2">
                            <label className="label">To account</label>
                            <div className="select">
                                <select onChange={handleReceiverSelect}>
                                    {receiverOptions}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success is-fullwidth" onClick={handleDeposit}>Deposit</button>
                </footer>
            </div>
        </div>
    );
}
