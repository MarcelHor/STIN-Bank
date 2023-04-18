import {useState} from "react";
import axios from "axios";

export const ManageFundsModal = ({
                                     isDepositModalOpen,
                                     setIsDepositModalOpen,
                                     currencies,
                                     setAccounts,
                                 }: any) => {
    const API_URL = 'http://localhost:3000';
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0].country);

    const handleDeposit = () => {
        axios.post(`${API_URL}/api/accounts/deposit`, {
            balance: parseFloat(amount),
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
                setIsDepositModalOpen(false);
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleWithdraw = () => {
        axios.post(`${API_URL}/api/accounts/withdraw`, {
            balance: parseFloat(amount),
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
                setIsDepositModalOpen(false);

            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });

    }

    const options = currencies.map((currency: any) => {
        return <option key={currency.country} value={currency.country}>{currency.country} - {currency.code}
        </option>
    });

    const handleSelect = (e: any) => {
        const selectedOption = currencies.find((currency: any) => currency.country === e.target.value);
        setSelectedCurrency(selectedOption.country);
    };

    return (
        <div className={`modal ${isDepositModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background " onClick={() => setIsDepositModalOpen(false)}/>
            <div className="modal-card" style={{height: '500px'}}>
                <header className="modal-card-head">
                    <p className="modal-card-title">Deposit or Withdraw</p>
                    <button className="delete" aria-label="close" onClick={() => setIsDepositModalOpen(false)}/>
                </header>
                <section className="modal-card-body is-flex is-flex-direction-column is-justify-content-space-between">
                    <div>
                        <div className="field is-align-items-center">
                            <label className="label mr-2">Amount:</label>
                            <input
                                className="input"
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <div className="field mt-2">
                                <label className="label">Currency</label>
                                <div className="select">
                                    <select onChange={handleSelect}>
                                        {options}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success is-fullwidth" onClick={handleDeposit}>Deposit</button>
                    <button className="button is-danger is-fullwidth" onClick={handleWithdraw}>Withdraw</button>
                </footer>

            </div>
        </div>
    );
}
