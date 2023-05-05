import React, {useState, useEffect} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClockRotateLeft, faMoneyBillTransfer, faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";


interface Transaction {
    id: number;
    date: string;
    from_account: string;
    from_currency: string;
    amount: number;
    to_account: string;
    to_currency: string;
    operation: string;
    fromCode: string;
    toCode: string;
}


export const TransactionCard = (props: any) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchTransactions(offset, limit);
    }, [offset, limit]);

    useEffect(() => {
        setTransactions([]);
        setOffset(0);
        setLimit(10);
        setHasMore(true);
        fetchTransactions(offset, limit);
    }, [props.accounts]);


    const API_URL = 'https://stinapi.marcel-horvath.me';
    const [fetching, setFetching] = useState(false);

    const fetchTransactions = async (offset: number, limit: number) => {
        if (fetching) return;
        setFetching(true);
        setLoading(true);
        axios.get(`${API_URL}/api/transactions?offset=${offset}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setTransactions(prevTransactions => [...prevTransactions, ...response.data]);
            setLoading(false);
            setHasMore(response.data.length > 0);
            setFetching(false);
        }).catch((error) => {
            console.log(error);
            setError(error.response.data.message);
            setLoading(false);
            setFetching(false);
        });
    };


    const handleShowMore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setOffset(prevOffset => prevOffset + limit);
    };


    //change icon based on operation
    const operationIcon = (operation: string) => {
        if (operation === "deposit") {
            return <FontAwesomeIcon icon={faPlus} size={"lg"} color={"green"}/>
        } else if (operation === "withdraw") {
            return <FontAwesomeIcon icon={faMinus} size={"lg"} color={"red"}/>
        } else if (operation === "send") {
            return <FontAwesomeIcon icon={faMoneyBillTransfer} size={"lg"} color={"red"}/>
        } else if (operation === "receive") {
            return <FontAwesomeIcon icon={faMoneyBillTransfer} size={"lg"} color={"green"}/>
        }
    }

    return (
        <div className="card">
            <header className="card-header is-flex is-align-items-center">
                <FontAwesomeIcon icon={faClockRotateLeft} size={"xl"} className={"ml-4"} color={"#3A3A3A"}/>
                <p className="card-header-title">Transaction History</p>
            </header>
            <div className="card-content">
                <div className="content" style={{height: "320px", overflowY: "scroll"}}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <table className="table is-hoverable is-fullwidth" style={{fontSize: "1rem"}}>
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>From</th>
                                <th>Amount</th>
                                <th>Operation</th>
                                <th>To</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((transaction: Transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.date.split('T')[0]}</td>
                                        <td>{transaction.from_account}
                                            <div className="is-size-7">({transaction.from_currency})</div>
                                        </td>
                                        <td>{transaction.amount} {transaction.fromCode}</td>
                                        <td>{operationIcon(transaction.operation)}</td>
                                        <td className={""}> {transaction.to_account}
                                            {transaction.to_currency &&
                                                <div className="is-size-7">({transaction.to_currency})</div>}
                                        </td>
                                    </tr>
                                )
                            )}


                            {hasMore && (
                                <tr>
                                    <td colSpan={5}>
                                        <button onClick={handleShowMore}
                                                className="button is-primary is-fullwidth">
                                            Show More
                                        </button>
                                    </td>
                                </tr>
                            )}
                            </tbody>

                        </table>
                    )}

                </div>
            </div>
        </div>
    )
        ;
};
