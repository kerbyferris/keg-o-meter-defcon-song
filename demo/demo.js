import React, { Component } from 'react';

import {
  Analyser,
  Song,
  Sequencer,
  Sampler,
  Synth,
  Reverb,
  PingPong,
} from '../src';

import Polysynth from './polysynth';
import Visualization from './visualization';

import './index.css';

export default class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      tempo: 110,
      defcon: 1,
      maxReading: 21,
      reading: 0,
      dataOverride: true,
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);
    this.handleLevelSelect = this.handleLevelSelect.bind(this);
  }

  handleAudioProcess(analyser) {
    this.visualization.audioProcess(analyser);
  }

  convertToDefcon = value => {
    const maxValue = (this.state.maxReading < value)? this.state.maxReading : value
    const divisor = 5 //convert values into defcon levels 1-5

    return (Math.floor(maxValue/divisor)+1)
  }
  
  componentDidMount() {
    if(!this.state.dataOverride) {
      setInterval( () => {
        fetch('./data.json')
          .then((res) => res.json())
          .then((data) => {
            let d = data[1]
            let defcon = this.convertToDefcon(d)

            this.setState({defcon: defcon})
            this.setState({reading: d})
          });
      }, 1000 );
    }
  }

  handlePlayToggle() {
    this.setState({playing: !this.state.playing});
  }

  handleLevelSelect(e) {
    this.setState({defcon: e});
  }

  renderDefconFive() {
    return (
      <PingPong>
        <Synth
          type="sine"
          steps={[
            [0, 8, 'e2'],
            [16, 8, 'g#3'],
            [24, 8, 'b2'],
          ]}
        />
      </PingPong>
    )

  }
  renderDefconFour() {
    return (
      <Sampler
        sample="samples/drumLoop.wav"
        steps={[0]}
      />
    )
  }

  renderDefconThree() {
    return (
      <Reverb>
        <PingPong>
          <Polysynth
            steps={[
              [0, 1, ['b4']],
              [0, 1, ['e4']],
              [1, 1, ['e3']],
              [2, 1, ['g#4']],
              [2, 1, ['g#4']],
              [6, 1, ['b3']],
              [8, 1, ['g#2']],
              [12, 1, ['e4']],
              [12, 4, ['e2']],
              [18, 1, ['e5']],
              [19, 1, ['g#2', 'b4']],
              [19, 1, ['e2', 'g#2']],
              [20, 1, ['e1', 'b3']],
              [22, 1, ['b3', 'e2']],
              [25, 1, ['g#3', 'e2']],
              [26, 1, ['e3', 'g#2']],
              [30, 1, ['g#3']],
              [31, 1, ['b2']],
            ]}
          />
        </PingPong>
      </Reverb>
    )
  }

  renderDefconTwo() {
    return (
      <Sampler
        sample="samples/drumLoop.wav"
        steps={[
          0, 4, 8
        ]}
      />
    )
  }

  renderDefconOne() {
    return (
      <PingPong>
        <Sampler
          sample="samples/mara.wav"
          steps={[0]}
        />
      </PingPong>
    )
  }

  render() {
    return (
      <div id="main">
        <Song
          playing={this.state.playing}
          tempo={this.state.tempo}
        >
          <Analyser onAudioProcess={this.handleAudioProcess}>
            <Sequencer
              resolution={16}
              bars={2}
            >
              {this.state.defcon <= 1? this.renderDefconOne() : null}
              {this.state.defcon <= 2? this.renderDefconTwo() : null}
              {this.state.defcon <= 3? this.renderDefconThree() : null}
              {this.state.defcon <= 4? this.renderDefconFour() : null}
              {this.state.defcon <= 5? this.renderDefconFive() : null}

            </Sequencer>
          </Analyser>
        </Song>

        <div id="visualize">
          <div className="react-music-metadata">
            <span>Defcon: {this.state.defcon.toString()}</span>
            <span>Data In: {this.state.reading.toString()}</span>
          </div>
          <Visualization ref={(c) => { this.visualization = c; }} />
        </div>
        <div id="meter">
          <div id="defcon-1" className="defcon" onClick={()=>this.handleLevelSelect(1)}>1</div>
          <div id="defcon-2" className="defcon" onClick={()=>this.handleLevelSelect(2)}>2</div>
          <div id="defcon-3" className="defcon" onClick={()=>this.handleLevelSelect(3)}>3</div>
          <div id="defcon-4" className="defcon" onClick={()=>this.handleLevelSelect(4)}>4</div>
          <div id="defcon-5" className="defcon" onClick={()=>this.handleLevelSelect(5)}>5</div>
        </div>
        <button
          className="react-music-button"
          type="button"
          style={{marginRight:(5 - this.state.defcon) * 160 + 8}}
          onClick={this.handlePlayToggle}
        >
          {this.state.playing ? '\u25A0' : '\u25B2'}
        </button>

      </div>
    );
  }
}
