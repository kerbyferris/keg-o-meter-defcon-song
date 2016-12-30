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
      playing: true,
      tempo: 110,
      defcon: 1,
      maxReading: 21,
      reading: 0,
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);
  }

  handleAudioProcess(analyser) {
    this.visualization.audioProcess(analyser);
  }

  convertToDefcon(value) {
    const divisor = 5 //convert values into defcon levels 1-5

    return Math.floor(parseFloat(value/divisor))
  }
  
  componentDidMount() {
    setInterval( () => { 
      fetch('./data.json')
        .then((res) => res.json())
        .then((data) => {
          let d = data[1] 
          let defcon = this.convertToDefcon(d)

          this.setState({
            defcon: defcon})
          this.setState({reading: d})
        });
    }, 1000 );
  }

  handlePlayToggle() {
    this.setState({
      playing: !this.state.playing,
    });
  }

  renderDefconOne() {
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
  renderDefconTwo() {
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

  renderDefconFour() {
    return (
      <Sampler
        sample="samples/drumLoop.wav"
        steps={[
          0, 4, 8
        ]}
      />
    )
  }

  renderDefconFive() {
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
    const defconOne = (this.state.defcon >= 0);
    const defconTwo = (this.state.defcon >= 1);
    const defconThree = (this.state.defcon >= 2);
    const defconFour = (this.state.defcon >= 3);
    const defconFive = (this.state.defcon >= 4);
    return (
      <div>
        <Song
          playing={this.state.playing}
          tempo={this.state.tempo}
        >
          <Analyser onAudioProcess={this.handleAudioProcess}>
            <Sequencer
              resolution={16}
              bars={2}
            >
              {defconOne? this.renderDefconOne() : null}
              {defconTwo? this.renderDefconTwo() : null}
              {defconThree? this.renderDefconThree() : null}
              {defconFour? this.renderDefconFour() : null}
              {defconFive? this.renderDefconFive() : null}
            </Sequencer>
          </Analyser>
        </Song>

        <Visualization ref={(c) => { this.visualization = c; }} />

        <button
          className="react-music-button"
          type="button"
          onClick={this.handlePlayToggle}
        >
          {this.state.playing ? 'Stop' : 'Play'}
        </button>
        <div className="react-music-button">
          <p>Defcon: {this.state.defcon.toString()}</p>
          <p>Data In: {this.state.reading.toString()}</p>
        </div>
      </div>
    );
  }
}
