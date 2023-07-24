import React, { Component } from 'react';
import { RobotDataContext } from './RobotDataContext'

class StartRobot extends Component {
  constructor(props) {
    super(props);
    this.sendStartCommand = this.sendStartCommand.bind(this);
  }
  static contextType = RobotDataContext;
  static serverName = '/start_path';
  static actionName = 'my_husky_messages/MovePathAction'; 
  state = { ros: null }

  componentDidMount() {
    const ros = new window.ROSLIB.Ros()
    ros.on("connection", () => {
      console.log("StartRobot Connection established")
      this.setState({ connected: true, ros: ros })
    });
    ros.on("close", () => {
      console.log("Connection is closed!");
      this.setState({ connected: false, ros: null });
      // Retry every second
      setTimeout(() => {
        try {
          ros.connect(
            "ws://" + process.env.REACT_APP_IP_ROS + ":" + process.env.REACT_APP_PORT_ROS + "");
        } catch (error) {
          console.log("connection problem ");
        }
      }, Number(process.env.REACT_APP_REFRESH_TIMER))
    });

    ros.on('error', function (error) { console.log(error); });
    ros.on('connection', function () { console.log('Connection made!'); });


    try {
      ros.connect("ws://" + process.env.REACT_APP_IP_ROS + ":" + process.env.REACT_APP_PORT_ROS + "");
    } catch (error) {
      console.log("connection problem ");
    }
  }

  /* `sendStartCommand(event)` is a method that is called when the "Start Robot" button is clicked. It first
  checks if the ROS connection is established, if there are any navigation points to send and if the navigation 
  type has been selected. If all conditions are met, it creates a new ROS action server object and a new ROS action goal object.
  The action goal get's the information concerning the navigation type through the "input" fiald.
  Finally, it calls the ROS action server using the action goal object and displays an alert message depending
  on the success or failure of the action call. */
  sendStartCommand(event) {
    const { markerPath, navType } = this.context;
    const { ros } = this.state;
    console.log("start button clicked")
    if (!ros) {
      console.log("StartRobot - ROS not connected");
      alert("ROBOT NOT CONNECTED\nPlease make sure the robot is powered on and connected to the network");
      return;
    }
    console.log("Ros not null")
    if (navType === 0) {
      alert("No navigation type has been set. Please choose the navigation type in the dropdown menu.");
      return;
    }
    console.log("Nav type:", navType)
    if (markerPath.length < 1) {
      alert("No navigation points to send. Please click the map to generate navigation points");
      return;
    }
    console.log("markerPath > 1")

    const actionClient = new window.ROSLIB.ActionClient({
      ros: ros,
      serverName: StartRobot.serverName,
      actionName: StartRobot.actionName,
    });
    console.log("Server name: " + StartRobot.serverName)
    console.log("Action name: " + StartRobot.actionName)


    const actionGoal = new window.ROSLIB.Goal({
      actionClient: actionClient,
      goalMessage: {
      input: {navType}
      }
    });

    
    actionGoal.on('feedback', function(feedback) {
      console.log('Feedback: ' + feedback.sequence);
    });

    actionGoal.on('result', function(result) {
      console.log('Final Result: ' + result.sequence);
    });
    
    actionGoal.send();
    console.log("End");
  }
  render() {
    return (<button onClick={this.sendStartCommand} class="btn btn-success" type="button" style={{margin:"0px 10px 0px 0px"}}> Start Robot </button>);
  }
}

export default StartRobot;