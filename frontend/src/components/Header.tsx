import {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";

export const Header = (props: any) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar py-2" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="https://bulma.io">
                    <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28"/>
                </a>

                <button
                    className={`navbar-burger burger ${isMenuOpen ? 'is-active' : ''}`}
                    aria-label="menu"
                    aria-expanded="false"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>

            <div id="navbarBasicExample" className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
                <div className="navbar-start">
                    <a className="navbar-item" onClick={() => props.setIsRatesModalOpen(true)}> Rates </a>
                    <a className="navbar-item" onClick={() => props.setIsCurrencyModalOpen(true)}> Add currencies </a>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-danger" onClick={props.handleLogout}>
                                <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                                <span className={"ml-2"}>Log Out</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
