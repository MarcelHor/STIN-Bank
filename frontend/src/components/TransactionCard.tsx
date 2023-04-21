import {useState, useEffect} from "react";
import axios from "axios";


interface Transaction {
    id: number;
    date: string;
    from_account: string;
    amount: number;
    to_account: string;
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


    const API_URL = 'http://localhost:3000';
    const fetchTransactions = async (offset: number, limit: number) => {
        setLoading(true);
        axios.get(`${API_URL}/api/transactions?offset=${offset}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setTransactions(prevTransactions => [...prevTransactions, ...response.data]);
            setLoading(false);
            setHasMore(response.data.length > 0);
        }).catch((error) => {
            console.log(error);
            setError(error.response.data.message);
            setLoading(false);
        });
    };

    const handleShowMore = () => {
        setOffset(prevOffset => prevOffset + limit);
    };

    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">Transaction History</p>
            </header>
            <div className="card-content">
                <div className="content" style={{height: "320px", overflowY: "scroll"}}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <table className="table is-hoverable is-fullwidth">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>From</th>
                                <th>Amount</th>
                                <th>To</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((transaction: Transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.date.split('T')[0]}</td>
                                    <td>{transaction.from_account}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.to_account}</td>
                                </tr>
                            ))}
                            {hasMore && (
                                <tr>
                                    <td colSpan={4}>
                                        <button onClick={handleShowMore} className="button is-primary is-fullwidth">
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
    );
};
