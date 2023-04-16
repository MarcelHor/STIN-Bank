import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {Counter} from "./Counter";

export const TwoFactorForm = (props: any) => {

    return (<form action="" className="box" onSubmit={props.handleVerify}>
            <div className="field">
                <label htmlFor="" className="label">Enter your verification code</label>
                <p className="help">A verification code has been sent to your email</p>
                <div className="control has-icons-left is-flex is-align-items-center">
                    <input type="text" placeholder="e.g. 123456" className="input mr-2"
                           required value={props.code}
                           onChange={(e) => props.setCode(e.target.value)}/>
                    <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope}/>
                </span>
                    <Counter time={300}/>
                </div>
            </div>
            <div className="field">
                {props.errors &&
                    <div className="field">
                        <p className="help is-danger">{props.errors}</p>
                    </div>
                }
                <div className="buttons is-justify-content-space-between mt-4">
                    <button className="button is-primary">
                        Verify
                    </button>

                    <a href="/" className="" onClick={props.handleBack}> Go back to login page </a>
                </div>
            </div>
        </form>
    )
}
