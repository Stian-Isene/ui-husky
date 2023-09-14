import React, {Component} from "react";
import { RobotDataContext } from './RobotDataContext'; 
import Leaflet from "leaflet";
// eslint-disable-next-line
//import bootstrap from "bootstrap"; 


class LoadPath extends Component {
    constructor(props) {
        super(props);
        this.state = {
          toggleText: "Manage path"
        };
        this.savePath = this.savePath.bind(this);
        this.downloadPath = this.downloadPath.bind(this);
        this.link = document.createElement("a"); 
        this.handleChange = this.handleChange.bind(this);
        this.uploadPath = this.uploadPath.bind(this);
    }
    static contextType = RobotDataContext;
    

    savePath() {
        var now = new Date().toISOString();
        console.log("Path saved " + now);
        this.setState({toggleText: "Path saved " + now});
        var {markerPath} = this.context;
        console.log(markerPath);
        const fileData = JSON.stringify(markerPath);
        const blob = new Blob([fileData], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        this.link.download = now +".json";
        this.link.href = url;
    }


    downloadPath() {
        if (this.link !== null) {
            this.link.click();
            this.setState({toggleText: "Path downloaded"});
        }
        else {
            this.setState({toggleText: "No path has been saved yet"});
        }
    }

    handleChange = e => {
        var {files, setFiles} = this.context;
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
          setFiles(JSON.parse(e.target.result));
        };
        this.setState({toggleText: e.target.files[0].name});

    }

    uploadPath(){
        var {setMarkerPos, markerPath, setMarkerPath, files, setFiles} = this.context;
        if (files.lenght !== 0){
            setMarkerPos(null);
            setMarkerPath([]);
            var coordinates = []
            console.log(files.length)
            for (var i=0; i < files.length; i++){
                var obj = files[i]
                const coord = new Leaflet.latLng(obj.lat, obj.lng)
                coordinates = [...coordinates, coord]
                console.log(coordinates)
            }
            setMarkerPath(coordinates);
        }
        else {
            this.setState({toggleText: "No file selected"});
        }
        
    };


    render() {
        return (    
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" style={{margin:"0px 10px 0px 10px"}} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.toggleText}
                    </button>

                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <button className="dropdown-item" onClick={this.savePath}> Save the current path </button>
                        <button className="dropdown-item" onClick={this.downloadPath}> Download the saved path</button>
                        <input type="file" onChange={this.handleChange} />
                        <button className="dropdown-item" onClick={this.uploadPath}> Upload the path from file</button>
                    </div>
                </div>
                )
}
}

export default LoadPath;