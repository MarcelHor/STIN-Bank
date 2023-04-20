import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faWallet, faStar} from "@fortawesome/free-solid-svg-icons";

export const AccountCard = ({
                                user,
                                accounts,
                                setIsDepositModalOpen,
                                selectedAccountIndex,
                                setSelectedAccountIndex,
                                setIsSendModalOpen,
                                setIsWithdrawModalOpen,
                                setIsSettingsModalOpen
                            }: any) => {

    const [options, setOptions] = React.useState<any>(null);


    useEffect(() => {
        if (accounts === undefined || accounts === null) {
            return;
        }

        const options = accounts.map((account: any, index: number) => {
            console.log(account.isDefault);
            return (
                <option key={index} value={index}>{account.code}</option>
            );
        });
        setOptions(options);
    }, [accounts]);

    return (
        <div className="card">
            <header className="card-header is-align-items-center">
                <FontAwesomeIcon icon={faWallet} size={"xl"} className={"ml-4"} color={"#3A3A3A"}/>
                <p className="card-header-title">Account Balance</p>
                <button className="button is-white" onClick={() => {
                    setIsSettingsModalOpen(true);
                }}><FontAwesomeIcon icon={faGear} size={"lg"} color={"#3A3A3A"}/>
                </button>
                {accounts !== null && accounts[selectedAccountIndex] && (
                    <>
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
                        <div className="is-flex is-align-items-center">
                            <p className="mr-2 has-text-weight-bold has-text-primary">Current Balance:</p>
                            <p> {accounts[selectedAccountIndex].balance} {accounts[selectedAccountIndex].code}</p>
                            {accounts[selectedAccountIndex].isDefault === 1 && (
                                <FontAwesomeIcon icon={faStar} size={"lg"} color={"yellow"} className={"ml-2"}/>)}
                        </div>
                    )}
                </div>

                <div className="card-buttons">
                    <div className="is-flex mb-2">
                        <button className="button is-primary mr-2 is-fullwidth" onClick={() => {
                            setIsDepositModalOpen(true);
                        }}>Deposit
                        </button>
                        <button className="button is-primary is-fullwidth" onClick={() => {
                            setIsWithdrawModalOpen(true);
                        }}>Withdraw
                        </button>
                    </div>
                    <button className="button is-danger is-fullwidth" onClick={() => {
                        setIsSendModalOpen(true);
                    }}>Send
                    </button>
                </div>
            </div>
        </div>
    );
}