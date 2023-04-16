import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const LoginForm = (props: any) => {

    return (<form action="" className="box" onSubmit={props.handleSubmit}>
            <div className="field">
                <label htmlFor="" className="label">Email</label>
                <div className="control has-icons-left">
                    <input type="email" placeholder="e.g. bobsmith@gmail.com" className="input"
                           required value={props.email}
                           onChange={(e) => props.setEmail(e.target.value)}/>
                    <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope}/>
                </span>
                </div>
            </div>
            <div className="field">
                <label htmlFor="" className="label">Password</label>
                <div className="control has-icons-left">
                    <input type="password" placeholder="*******" className="input" required autoComplete="on"
                           value={props.password}
                           onChange={(e) => props.setPassword(e.target.value)}/>
                    <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faLock}/>
                </span>
                </div>
            </div>
            <div className="field">
                {props.errors &&
                    <div className="field">
                        <p className="help is-danger">{props.errors}</p>
                    </div>
                }
                <button className="button is-primary">
                    Login
                </button>
            </div>
        </form>
    )
}