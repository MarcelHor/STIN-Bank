import {useState} from "react";
import axios from "axios";

export const DepositModal = ({isDepositModalOpen, setIsDepositModalOpen, currency}: any) => {
    const API_URL = 'http://localhost:3000';
    const [amount, setAmount] = useState('');

    const handleDeposit = () => {
        axios.post(`${API_URL}/api/accounts/addBalance`, {
            balance: parseFloat(amount),
            currency: currency,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setIsDepositModalOpen(false);
        }).catch((error) => {
            console.log(error);
        });
    }


    return (
        <div className={`modal ${isDepositModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background " onClick={() => setIsDepositModalOpen(false)}/>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Deposit</p>
                    <button className="delete" aria-label="close" onClick={() => setIsDepositModalOpen(false)}/>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label">Amount</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleDeposit();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={handleDeposit}>Deposit</button>
                    <button className="button" onClick={() => setIsDepositModalOpen(false)}>Cancel</button>
                </footer>
            </div>
        </div>


    );
}
