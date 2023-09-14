import React, { Component } from 'react'
import { Row, Col, } from 'react-bootstrap'
import * as Three from "three"

/* This is a React component that subscribes to ROS topics and displays the latitude and longitude
values of a robot's position. */
class RobotState extends Component {
  state = {
    ros: null,
    x: 0,
    y: 0,
    orientation: 0,
    linear_v: 0,
    angular_v: 0,
  };

  /* `componentDidMount()` is a lifecycle method in React that is called after a component is mounted
  (i.e., inserted into the DOM). In this code, it is used to establish a connection to a ROS server
  and subscribe to two topics (`/emlid/fix` and `/husky_velocity_controller/odom`) to receive
  updates on the robot's position and velocity. It also sets up a callback function to update the
  component's state with the received data. */
  componentDidMount() {
    const ros = new window.ROSLIB.Ros();
    ros.on("connection", () => {
      console.log("Connection established! Robotstate")
      this.setState({ connected: true, ros: ros })
      this.getRobotState()
    });

    ros.on("close", () => {
      console.log("Connection is closed! Robotstate");
      this.setState({ connected: false, ros: null });
      // Retry every process.env.REACT_APP_REFRESH_TIMER ms
      setTimeout(() => {
        try {
          ros.connect(
            "ws://" +
            process.env.REACT_APP_IP_ROS + ":" + process.env.REACT_APP_PORT_ROS + "");
        } catch (error) {
          console.log("connection problem Robotstate " + process.env.REACT_APP_IP_ROS + ":" + process.env.REACT_APP_PORT_ROS);
        }
      }, Number(process.env.REACT_APP_REFRESH_TIMER));
    });
    this.getRobotState()

    try {
      ros.connect(
        "ws://" + process.env.REACT_APP_IP_ROS + ":" + process.env.REACT_APP_PORT_ROS + "");
    } catch (error) {
      console.log("connection problem Robotstate " + process.env.REACT_APP_IP_ROS + ":" + process.env.REACT_APP_PORT_ROS);
    }
  }

  /* `getRobotState()` is a function that subscribes to two ROS topics (`/emlid/fix` and
  `/husky_velocity_controller/odom`) to receive updates on the robot's position and velocity. It
  sets up two subscribers (`pose_subscriber` and `velocity_subscriber`) and defines callback
  functions to update the component's state with the received data. The latitude and longitude
  values are extracted from the `/emlid/fix` topic and stored in the component's state as `x` and
  `y`, respectively. The linear and angular velocity values are extracted from the
  `/husky_velocity_controller/odom` topic and stored in the component's state as `linear_v` and
  `angular_v`, respectively. */
  getRobotState() {
    if (!this.state.ros) return;
    // Pose subscriber
    var pose_subscriber = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/emlid/fix",
      messageType: "sensor_msgs/NavSatFix",
    })
    // Velosity subscriber
    var velosity_subscriber = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "/husky_velocity_controller/odom",
      messageType: "nav_msgs/Odometry",
    })
    // Pose callback
    pose_subscriber.subscribe((message) => {
      this.setState({ x: message.latitude.toFixed(7) })
      this.setState({ y: message.longitude.toFixed(7) })
      //this.setState({orientation: this.getOrientation(message.pose.pose.orientation).toFixed(0)})

    })
    // Vel callback
    velosity_subscriber.subscribe((message) => {
      this.setState({ linear_v: message.twist.twist.linear.x.toFixed(3) })
      this.setState({ angular_v: message.twist.twist.angular.z.toFixed(3) })
    })
  }
  /**
   * This function takes a quaternion representing orientation and returns the z-axis rotation in
   * degrees.
   * @returns the z-axis rotation in degrees, calculated from a given ROS orientation quaternion.
   * 
   * This is not used in the current version of the project.
   */
  getOrientation(ros_orientation) {
    var q = new Three.Quaternion(
      ros_orientation.x,
      ros_orientation.y,
      ros_orientation.z,
      ros_orientation.w
    )
    var RPY = new Three.Euler().setFromQuaternion(q);

    return (RPY["_z"] * (180 / Math.PI)) + 180 // Return z in deg
  }

  /**
   * This is a React component that renders two paragraphs displaying the latitude and longitude values
   * stored in the component's state.
   * @returns A React component that renders two columns with the latitude and longitude values stored in
   * the component's state.
   */
  render() {
    return (
      <div>
        <Row style={{padding:`16px`, display: `flex`, alignItems:`center`}}>
          <p className='mt-0' style={{margin:`0px`}}>Current location:  </p>
          <Col>
            <p className='mt-0'>Lat:{this.state.x} </p>
          </Col>
          <Col>
            <p className='mt-0'>Lon:{this.state.y}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RobotState;