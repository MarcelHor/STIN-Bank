import axios from 'axios';
import {useEffect, useState} from "react";

export const RatesModal = (props:any) => {

    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/currencies')
            .then((response) => {
                setCurrencies(response.data);
            })
    }, [])

    return (
        <div className={`modal ${props.isRatesModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={() => props.setIsRatesModalOpen(false)}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Currencies</p>
                    <button className="delete" aria-label="close" onClick={() => props.setIsRatesModalOpen(false)}></button>
                </header>
                <section className="modal-card-body">
                    <table className="table is-fullwidth">
                        <thead>
                        <tr>
                            <th>Country</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Rate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currencies.map((currency: any) => (
                            <tr key={currency.country}>
                                <td>{currency.country}</td>
                                <td>{currency.code}</td>
                                <td>{currency.name}</td>
                                <td>{currency.amount}</td>
                                <td>{currency.exchangeRate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    )

}