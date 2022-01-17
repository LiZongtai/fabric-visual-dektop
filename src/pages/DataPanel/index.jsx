import React, {Component} from 'react';
import { Button, message } from 'antd';

export class DataPanel extends Component {
  state = {

  };
  render() {
    return (
      <div >
        <Button onClick={() => message.warn('View Block Hight')}>View Block Hight</Button>
      </div>
    );
  }
}