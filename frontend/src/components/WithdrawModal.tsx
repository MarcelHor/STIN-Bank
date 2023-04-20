import {useState} from "react";
import axios from "axios";


export const WithdrawModal = ({
                                  isWithdrawModalOpen,
                                  setIsWithdrawModalOpen,
                                  setAccounts,
                                  accounts,
                              }: any) => {

    const API_URL = 'http://localhost:3000';
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(accounts[0].currency);

    const handleWithdraw = () => {
        console.log(selectedCurrency);
        axios.post(`${API_URL}/api/accounts/withdraw`, {
            balance: Math.abs(parseFloat(amount)),
            currency: selectedCurrency,
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
                setIsWithdrawModalOpen(false);

            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });

    }

    const options = accounts.map((currency: any) => {
        return <option key={currency.currency} value={currency.country}>{currency.currency} - {currency.code}
        </option>
    });

    const handleSelect = (e: any) => {
        const selected = e.target.value.split('-')[0].trim();
        setSelectedCurrency(selected);

    };

    return (
        <div className={`modal ${isWithdrawModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background " onClick={() => setIsWithdrawModalOpen(false)}/>
            <div className="modal-card" style={{height: '500px'}}>
                <header className="modal-card-head">
                    <p className="modal-card-title">Withdraw</p>
                    <button className="delete" aria-label="close" onClick={() => setIsWithdrawModalOpen(false)}/>
                </header>
                <section className="modal-card-body is-flex is-flex-direction-column is-justify-content-space-between">
                    <div>
                        <div className="field mt-2">
                            <label className="label">Currency</label>
                            <div className="select">
                                <select onChange={handleSelect}>
                                    {options}
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
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success is-fullwidth" onClick={handleWithdraw}>Withdraw</button>
                </footer>
            </div>
        </div>
    );
}
