

export const TransactionCard = (props: any) => {

    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">Transaction History</p>
            </header>
            <div className="card-content">
                <div className="content">
                    <table className="table is-hoverable is-fullwidth">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>04/15/2023</td>
                            <td>Payment to John Doe</td>
                            <td>$100.00</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}