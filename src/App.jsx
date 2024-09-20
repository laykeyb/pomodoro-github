import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

// Function to format time as MM:SS
const formatTime = (minutes, seconds) => {
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");
  return `${minutesStr}:${secondsStr}`;
};

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [isSession, setIsSession] = useState(true); // true for session, false for break
  const [minutes, setMinutes] = useState(sessionLength);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(formatTime(sessionLength, 0));
  const [intervalId, setIntervalId] = useState(null);
  const beep = document.getElementById("beep");

  // Effect to reset timer when sessionLength, breakLength, or isSession changes
  useEffect(() => {
    console.log(
      "Resetting timer. isSession:",
      isSession,
      "minutes:",
      isSession ? sessionLength : breakLength
    );
    if (!isActive) {
      setMinutes(isSession ? sessionLength : breakLength);
      setSeconds(0);
    }
  }, [sessionLength, breakLength, isSession, isActive]);

  // Effect to handle the timer countdown
  useEffect(() => {
    if (isActive) {
      const id = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            if (minutes > 0) {
              setMinutes(minutes - 1);
              return 59;
            } else {
              // Timer ends
              console.log(
                "Timer ended. Switching to",
                isSession ? "break" : "session"
              );
              clearInterval(id);

              beep.play();
              //setIsActive(false);
              // Switch to the next timer
              if (isSession) {
                // Switch to break timer
                setIsSession(false);
                setMinutes(breakLength);
              } else {
                // Switch to session timer
                setIsSession(true);
                setMinutes(sessionLength);
              }

              return 0;
            }
          }
        });
      }, 1000); // Ensure the interval is set to 1000ms (1 second)
      setIntervalId(id);

      return () => clearInterval(id); // Cleanup interval on component unmount
    } else {
      setMinutes(minutes);
      setSeconds(seconds);
    }
  }, [isActive, minutes, seconds, isSession, breakLength, sessionLength]);

  // Update the displayed time whenever minutes or seconds change
  useEffect(() => {
    setTimeLeft(formatTime(minutes, seconds));
  }, [minutes, seconds]);

  const startStop = () => {
    if (!isActive) {
      setIsActive(true);
    }
    if (isActive) {
      setIsActive(false);
    }
  };

  const reset = () => {
    const beep = document.getElementById("beep");
    setSessionLength(25);
    setBreakLength(5);
    setMinutes(25);
    setSeconds(0);
    setIsActive(false);
    setIsSession(true);
    beep.pause();
    beep.currentTime = 0;
  };

  const incrementBreak = () => {
    if (breakLength < 60 && !isActive) {
      setBreakLength(breakLength + 1);
      if (!isSession) {
        setMinutes(breakLength + 1);
        setSeconds(0);
      }
    }
  };

  const decrementBreak = () => {
    if (breakLength > 1 && !isActive) {
      setBreakLength(breakLength - 1);
      if (!isSession) {
        setMinutes(breakLength - 1);
        setSeconds(0);
      }
    }
  };

  const incrementSession = () => {
    if (sessionLength < 60 && !isActive) {
      setSessionLength(sessionLength + 1);
      if (isSession) {
        setMinutes(sessionLength + 1);
        setSeconds(0);
      }
    }
  };

  const decrementSession = () => {
    if (sessionLength > 1 && !isActive) {
      setSessionLength(sessionLength - 1);
      if (isSession) {
        setMinutes(sessionLength - 1);
        setSeconds(0);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Pomodoro Clock</h1>
      <div className="row justify-content-center">
        <TimerUi
          text="Break length"
          type="break"
          value={breakLength}
          increment={incrementBreak}
          decrement={decrementBreak}
        />
        <TimerUi
          text="Session length"
          type="session"
          value={sessionLength}
          increment={incrementSession}
          decrement={decrementSession}
        />
      </div>
      <div className="row text-center">
        <div className="session rounded border border-5 border-black mx-auto">
          <h5 id="timer-label">{isSession ? "Session" : "Break"}</h5>
          <p className="text-center display-3" id="time-left">
            {timeLeft}
          </p>
        </div>
      </div>
      <audio
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        id="beep"
      ></audio>
      <div className="controls d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={startStop}
          id="start_stop"
        >
          <span>Play</span>
          <span>Pause</span>
        </button>
        <button type="button" id="reset" onClick={reset}>
          reset
        </button>
      </div>
    </div>
  );
}

const TimerUi = ({ text, type, value, increment, decrement }) => {
  return (
    <div className="col-4 text-center">
      <h5 id={`${type}-label`}>{text}</h5>
      <button type="button" id={`${type}-decrement`} onClick={decrement}>
        Decrement
      </button>
      <p id={`${type}-length`}>{value}</p>
      <button type="button" id={`${type}-increment`} onClick={increment}>
        Increment
      </button>
    </div>
  );
};

export default App;
