import logo from './logo.svg';
import './App.css';
import React from 'react';
import BasicLayout from './layouts/BasicLayout';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flag: 0,
    };

    this.getChildMessage = this.getChildMessage.bind(this);
  }


  getChildMessage(newFlag) {
    this.setState({
      flag: newFlag,
    });
  }

  render() {
    return (
      <BasicLayout onGetChildMessage={this.getChildMessage} />
    );
  }
}

