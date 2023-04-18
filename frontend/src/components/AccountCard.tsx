import React, {useEffect} from "react";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faStar as faBorderStar} from "@fortawesome/free-regular-svg-icons";
// import {faStar as faSolidStar} from "@fortawesome/free-solid-svg-icons";


export const AccountCard = ({
                                user,
                                accounts,
                                setIsDepositModalOpen,
                                selectedAccountIndex,
                                setSelectedAccountIndex,
                                setIsSendModalOpen
                            }: any) => {

    const [options, setOptions] = React.useState<any>(null);


    useEffect(() => {
        if (accounts === undefined || accounts === null) {
            return;
        }

        const options = accounts.map((account: any, index: number) => {
            return (
                <option key={index} value={index}>{account.code}</option>
            );
        });
        setOptions(options);
    }, [accounts]);

    return (
        <div className="card">
            <header className="card-header is-align-items-center">
                <p className="card-header-title">Account Balance</p>
                {accounts !== null && accounts[selectedAccountIndex] && (
                    <>
                        {/*<p className="mr-4"><FontAwesomeIcon icon={faSolidStar} color={"yellow"}/> Set as default currency</p>*/}
                        <div className="select mr-4">
                            <select value={selectedAccountIndex} onChange={(e) => {
                                setSelectedAccountIndex(parseInt(e.target.value));
                            }}>
                                {options}
                            </select>
                        </div>
                    </>
                )}
            </header>
            <div className="card-content">
                <div className="is-flex">
                    <p className="mr-2 has-text-weight-bold has-text-primary">Account
                        Number:</p>
                    <p>{user[0].accountNumber}</p>
                </div>
                <div className="is-flex is-align-items-center mt-2">
                    {accounts === null || selectedAccountIndex < 0 || selectedAccountIndex >= accounts.length ? (
                        <p className={"has-text-danger"}>Please deposit some funds to your account</p>
                    ) : (
                        <div className="is-flex">
                            <p className="mr-2 has-text-weight-bold has-text-primary">Current Balance:</p>
                            <p> {accounts[selectedAccountIndex].balance} {accounts[selectedAccountIndex].code}</p>
                        </div>
                    )}
                </div>

                <div className="card-buttons">
                    <button className="button is-primary mr-2 is-fullwidth" onClick={() => {
                        setIsDepositModalOpen(true);
                    }}>Manage funds
                    </button>
                    <button className="button is-danger is-fullwidth" onClick={() => {
                        setIsSendModalOpen(true);
                    }}>Send funds
                    </button>
                </div>
            </div>
        </div>
    );
}