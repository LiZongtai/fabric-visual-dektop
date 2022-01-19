import React, {Component} from 'react';
import {ResponsiveCirclePacking} from "@nivo/circle-packing";

export default class CirclePacking extends Component {
    render() {
        const {network} = this.props;
        return (
            <ResponsiveCirclePacking
                data={ network }
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                id="name"
                value="loc"
                colors={{ scheme: 'nivo' }}
                childColor={{ from: 'color', modifiers: [ [ 'brighter', 0.4 ] ] }}
                padding={4}
                enableLabels={true}
                labelsFilter={function(e){return 2===e.node.depth}}
                labelsSkipRadius={10}
                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.5 ] ] }}
                defs={[
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'none',
                        color: 'inherit',
                        rotation: -45,
                        lineWidth: 5,
                        spacing: 8
                    }
                ]}
                fill={[ { match: { depth: 1 }, id: 'lines' } ]}
            />
        );
    }
}
