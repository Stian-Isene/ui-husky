import { Component } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

class MapComp extends Component {
  state = {
    connected: false,
    ros: null,
    huskypos: [61.45874, 5.88743],
    markerPos: null,
  };

  componentDidMount() {
    const ros = new window.ROSLIB.Ros();
    ros.on("connection", () => {
      console.log("Connection established! MapComp");
      this.setState({ connected: true, ros: ros });
      this.getRobotState()
    });

    ros.on("close", () => {
      console.log("Connection is closed! MapComp");
      this.setState({ connected: false, ros: null });
      // Retry every second
      setTimeout(() => {
        try {
          ros.connect(
            "ws://" +
              process.env.REACT_APP_IP_ROS +
              ":" +
              process.env.REACT_APP_PORT_ROS +
              ""
          );
        } catch (error) {
          console.log("connection problem MapComp");
        }
      }, Number(process.env.REACT_APP_REFRESH_TIMER));
    });
    this.getRobotState()

    try {
      ros.connect(
        "ws://" +
          process.env.REACT_APP_IP_ROS +
          ":" +
          process.env.REACT_APP_PORT_ROS +
          ""
      );
    } catch (error) {
      console.log("connection problem MapComp");
    }
  }
  getRobotState() {
    console.log("getRobotState run")
    if (!this.state.ros) return;
    // Pose subscriber
    var pose_subscriber = new window.ROSLIB.Topic({
        ros: this.state.ros,
        name: "/emlid/fix",
        messageType: "sensor_msgs/NavSatFix",
    })
    // Pose callback
    pose_subscriber.subscribe((message) => {
        console.log("pose_subscriber run")
        //this.setState({x: message.latitude.toFixed(7)})
        //this.setState({y: message.longitude.toFixed(7)})
        //log.message({[message.latitude, message.longitude]})
        this.setState({huskypos: [message.latitude, message.longitude]})
        //this.setState({orientation: this.getOrientation(message.pose.pose.orientation).toFixed(0)})

    })
}
  render() {
    const cicon = new Icon({
      iconUrl:
        "https://cdn-icons-png.flaticon.com/512/2776/2776000.png", // kan ref fil her også
      iconSize: [38, 38],
    });
    return (
      <MapContainer
        center={[61.45874, 5.88743]}
        zoom={18}
        scrollWheelZoom={true}
        maxZoom={25}
        whenCreated={(map) => {
          this.map = map;
        }}
      >
        <TileLayer
          maxNativeZoom={19}
          maxZoom={25}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={this.state.huskypos} icon={cicon}>
          <Popup>
            Husky <br /> Mobile robot
          </Popup>
        </Marker>
      </MapContainer>
    );
  }
}

export default MapComp;