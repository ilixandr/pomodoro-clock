import React, { Component } from 'react';
import './App.css';

/* Constants area */
const INITIALBREAK = 5
const INITIALSESSION = 25
const TWENTYFIVEMINUTES = 25 * 60
const MININTERVAL = 1
const MAXINTERVAL = 60
const SECONDSINAMINUTE = 60
const SESSIONSTOP = -1
const SOUNDINITTIME = 0
/* Build components here */
class Tomato extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
      breakLength: INITIALBREAK,
      sessionLength: INITIALSESSION,
      timeLeft: TWENTYFIVEMINUTES,
      countdownType: "Session"
    };
    this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
    this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
    this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
    this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.playSound = this.playSound.bind(this);
    this.stopSound = this.stopSound.bind(this);
  }
  playSound() {
    let sound = document.getElementById("beep");
    sound.currentTime = SOUNDINITTIME;
    sound.play();
  }
  stopSound() {
    let sound = document.getElementById("beep");
    sound.pause();
    sound.currentTime = SOUNDINITTIME;
  }
  handleBreakDecrement() {
    if (this.state.breakLength > MININTERVAL && !this.state.isOn) {
      this.setState({breakLength: this.state.breakLength - 1});
     }
  }
  handleBreakIncrement() {
    if (this.state.breakLength < MAXINTERVAL  && !this.state.isOn){
      this.setState({breakLength: this.state.breakLength + 1});
    } 
  }
  handleSessionDecrement() {
    if (this.state.sessionLength > MININTERVAL  && !this.state.isOn){
      this.setState({sessionLength: this.state.sessionLength - 1, timeLeft: (this.state.sessionLength - 1) * SECONDSINAMINUTE});
    }
  }
  handleSessionIncrement() {
    if (this.state.sessionLength < MAXINTERVAL  && !this.state.isOn){
      this.setState({sessionLength: this.state.sessionLength + 1, timeLeft: (this.state.sessionLength + 1) * SECONDSINAMINUTE});
    } 
  }
  handleStart() {
    if (this.state.isOn) return;
    this.setState((prevState, props) => ({isOn: true}));
    if (this.state.countdownType === "Session") {
      this.sessionTimer = setInterval(() => {
        this.setState((prevState, props) => ({timeLeft: prevState.timeLeft - 1}));
        if(this.state.timeLeft === SESSIONSTOP) {
          clearInterval(this.sessionTimer);
          this.setState({timeLeft: this.state.breakLength * SECONDSINAMINUTE, countdownType: "Break"});
          this.playSound();
          this.breakTimer = setInterval(() => {
            this.setState((prevState, props) => ({timeLeft: prevState.timeLeft - 1}));
            if(this.state.timeLeft === SESSIONSTOP) {
              clearInterval(this.breakTimer);
              this.setState({timeLeft: this.state.sessionLength * SECONDSINAMINUTE, countdownType: "Session"});
              this.playSound();
            }
          }, 1000);
        }
      }, 1000);
    } 
  }
  handleStop() {
    this.setState({isOn: false});
    this.started = false;
    clearInterval(this.sessionTimer);
    clearInterval(this.breakTimer);
  }
  handleReset() {
    this.setState({breakLength: INITIALBREAK, sessionLength: INITIALSESSION, timeLeft: TWENTYFIVEMINUTES, countdownType: "Session", isOn: false});
    clearInterval(this.sessionTimer);
    clearInterval(this.breakTimer);
    this.stopSound();
  }
  render() {
    let minutes = Math.floor(this.state.timeLeft / 60.0);
    let seconds = this.state.timeLeft - minutes * 60;
    return (
      <div id="content">
        <div className="left-panel">
          <h2 id="break-label">Break Length</h2>
          <div className="controls-left">
            <i id="break-decrement" className="fa fa-minus-square" onClick={this.handleBreakDecrement}></i>&nbsp;
            <div id="break-length">{this.state.breakLength}</div>&nbsp;
            <i id="break-increment" className="fa fa-plus-square" onClick={this.handleBreakIncrement}></i>
          </div>
        </div>
        <div className="right-panel">
          <h2 id="session-label">Session Length</h2>
          <div className="controls-right">
            <i id="session-decrement" className="fa fa-minus-square" onClick={this.handleSessionDecrement}></i>&nbsp;
            <div id="session-length">{this.state.sessionLength}</div>&nbsp;
            <i id="session-increment" className="fa fa-plus-square" onClick={this.handleSessionIncrement}></i>
          </div>
        </div>
        <div className="bottom-center-panel">
          <h2 id="timer-label">{this.state.countdownType}</h2>
          <div id="time-left" className={this.state.timeLeft < 60 ? "yellow-text" : "white-text"}>{minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}</div>
          <div className="time-controls">
            <i id="start_stop" className={this.state.isOn ? "fa fa-stop-circle" : "fa fa-play-circle"} onClick={this.state.isOn ? this.handleStop : this.handleStart}></i>
            <i id="reset" className="fas fa-sync-alt" onClick={this.handleReset}></i>
          </div>
        </div>
        <audio id="beep">
          <source src="https://www.soundjay.com/button/button-2.mp3" type="audio/mpeg"/>
        </audio>
      </div>
    );
  }
}

export default Tomato;
