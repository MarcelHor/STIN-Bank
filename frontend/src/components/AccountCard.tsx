import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";

export const AccountCard = ({
                                user,
                                accounts,
                                setIsDepositModalOpen,
                                selectedAccountIndex,
                                setSelectedAccountIndex
                            }: any) => {

    const [dropdownItems, setDropdownItems] = React.useState<any>(null);


    useEffect(() => {
        if (accounts === undefined || accounts === null) {
            return;
        }
        const dropdownItems = accounts.map((account: any, index: number) => {
            return (
                <a
                    href="#"
                    className="dropdown-item"
                    key={account.id}
                    onClick={() => {
                        setSelectedAccountIndex(index);
                    }}
                >
                    {account.code}
                </a>
            );
        });
        setDropdownItems(dropdownItems);
    }, [accounts]);

    return (
        <div className="card">
            <header className="card-header is-align-items-center">
                <p className="card-header-title">Account Balance</p>
                <div className="dropdown is-hoverable is-right">
                    <div className="dropdown-trigger">
                        <button className="button is-white mr-2" aria-haspopup="true" aria-controls="dropdown-menu4">
                            <FontAwesomeIcon icon={faCaretDown}/>
                            <span className={"ml-2"}>Choose currency</span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                            {dropdownItems}
                        </div>
                    </div>
                </div>
            </header>
            <div className="card-content">
                <p className={"subtitle is-size-6"}>{user[0].accountNumber}</p>
                <div className="is-flex is-align-items-center">
                    <p className="mr-2">Current Balance:</p>
                    <p className="has-text-weight-bold has-text-primary">  {accounts === null ? "null" : (
                        <span>{accounts[selectedAccountIndex].balance} {accounts[selectedAccountIndex].code}</span>)}</p>
                </div>
                <div className="buttons mt-4">
                    <button className="button is-primary mr-2" onClick={() => {
                        setIsDepositModalOpen(true)
                    }}>Deposit
                    </button>
                    <button className="button is-danger">Send</button>
                </div>
            </div>
        </div>
    );
}