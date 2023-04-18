import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";

export const AccountCard = ({
                                user,
                                accounts,
                                setIsDepositModalOpen,
                                selectedAccountIndex,
                                setSelectedAccountIndex,
                                setIsSendModalOpen
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
                {accounts !== null && accounts[selectedAccountIndex] && (

                    <div className="dropdown is-hoverable is-right">
                        <div className="dropdown-trigger">
                            <button className="button is-white mr-2" aria-haspopup="true"
                                    aria-controls="dropdown-menu4">
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
                )}

            </header>
            <div className="card-content">
                <p className={"subtitle is-size-6"}>{user[0].accountNumber}</p>
                <div className="is-flex is-align-items-center">
                    {accounts === null || selectedAccountIndex < 0 || selectedAccountIndex >= accounts.length ? (
                        <p className={"has-text-danger"}>Please deposit some funds to your account</p>
                    ) : (
                        <div className="is-flex">
                            <p className="mr-2 has-text-weight-bold has-text-primary">Current Balance:</p>
                            {accounts[selectedAccountIndex].balance} {accounts[selectedAccountIndex].code}
                        </div>
                    )}
                </div>

                <div className="columns mt-6">
                    <button className="button is-primary mr-2 is-fullwidth column mt-1" onClick={() => {
                        setIsDepositModalOpen(true);
                    }}>Manage funds
                    </button>
                    <button className="button is-danger is-fullwidth column mt-1" onClick={() => {
                        setIsSendModalOpen(true);
                    }}>Send funds
                    </button>
                </div>
            </div>
        </div>
    );
}