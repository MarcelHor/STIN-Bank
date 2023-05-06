import {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";

export const Header = (props: any) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar py-2" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <img src="https://bulma.io/assets/Bulma%20Icon.svg"/>
                    <span className="ml-2 has-text-weight-bold is-size-5  has-text-black">STINBANK</span>
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
                    <a className="navbar-item" onClick={() => props.setIsRatesModalOpen(true)}> Currency Rates </a>
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
