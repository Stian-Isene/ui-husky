import React, { Component } from 'react';
import Alert from "react-bootstrap/Alert";


/* When the component is mounted, connect to the ROS websocket and set the state of the component to
connected if the connection is successful. 
*/
class ConnectionStatus extends Component {
  state = { connected: false, ros: null }

  /* `componentDidMount()` is a lifecycle method in React that is called after a component is mounted
  (i.e., inserted into the DOM). In this code, `componentDidMount()` is used to connect to a ROS
  (Robot Operating System) websocket and set the state of the component to "connected" if the
  connection is successful. It also sets up a listener for when the connection is closed, and
  attempts to reconnect every `REACT_APP_REFRESH_TIMER` milliseconds if the connection is lost. */
  componentDidMount() {
    const ros = new window.ROSLIB.Ros();
    ros.on("connection", () => {
      console.log("Connection established! ConnectionStatus")
      this.setState({ connected: true, ros: ros })
    });

    ros.on("close", () => {
      console.log("Connection is closed! ConnectionStatus");
      this.setState({ connected: false, ros: null });
      // Retry every REACT_APP_REFRESH_TIMER ms
      setTimeout(() => {
        try {
          ros.connect("ws://" + process.env.REACT_APP_IP_ROS + ":" + process.env.REACT_APP_PORT_ROS + "");
        } catch (error) {
          console.log("connection problem: ConnectionStatus");
        }
      }, Number(process.env.REACT_APP_REFRESH_TIMER))
    });

    try {
      ros.connect("ws://" + process.env.REACT_APP_IP_ROS + ":" + process.env.REACT_APP_PORT_ROS + "");
    } catch (error) {
      console.log("connection problem: ConnectionStatus");
    }
  }

  /**
   * This is a React component that renders an Alert component with a message indicating whether the
   * component is connected or disconnected.
   * @returns A React component that renders an Alert with a variant of either "success" or "danger"
   * depending on the value of the "connected" state. The text of the Alert will display either
   * "Connected" or "Disconnected" depending on the value of the "connected" state.
   */
  render() {
    return (
      <div>
        <Alert className='text-center m-3'
          variant={this.state.connected ? "success" : "danger"}>
          {this.state.connected ? "robot status: Connected" : "robot status: Disconnected"}
        </Alert>
      </div>
    );
  }
}

export default ConnectionStatus;