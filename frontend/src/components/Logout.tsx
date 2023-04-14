import React, {useEffect} from "react";

export const Logout = () => {

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    return (
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                            <div className="field">
                                <h1 className="title">Logout</h1>
                                <h2 className="subtitle">You have been logged out</h2>
                                <a href="/" className={"button is-primary"}>Go back to home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}