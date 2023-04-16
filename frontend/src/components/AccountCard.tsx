import React from "react";

export const AccountCard = (props: any) => {

    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">Account Balance</p>
            </header>
            <div className="card-content">
                <p className={"subtitle is-size-6"}>{props.user[0].accountNumber}</p>
                <div className="is-flex is-align-items-center">
                    <p className="mr-2">Current Balance:</p>
                    <p className="has-text-weight-bold has-text-primary">$100</p>
                </div>
                <div className="buttons mt-4">
                    <button className="button is-primary mr-2">Deposit</button>
                    <button className="button is-danger">Withdraw</button>
                </div>
            </div>
        </div>
    );
}