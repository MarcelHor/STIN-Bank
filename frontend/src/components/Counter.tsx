import {useEffect, useState} from "react";

export const Counter = ({ time }: any) => {
    const [secondsLeft, setSecondsLeft] = useState(time);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSecondsLeft(secondsLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return (
        <div className="counter">
           {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
};