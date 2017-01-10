import React, { Component } from 'react';

export default class Visualization extends Component {
  constructor(props) {
    super(props);
    this.audioProcess = this.audioProcess.bind(this);
  }
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
  }
  componentDidReceiveProps() {

  }
  audioProcess(analyser) {
    if (this.ctx) {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, 732);
      gradient.addColorStop(1, 'skyblue');
      gradient.addColorStop(0.8, 'green');
      gradient.addColorStop(0.6, 'yellow');
      gradient.addColorStop(0.4, 'red');

      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      this.ctx.clearRect(0, 0, 766, 732);
      this.ctx.fillStyle = gradient;

      for (let i = 0; i < (array.length); i++) {
        const value = array[i];
        this.ctx.fillRect(i * 12, 732, 10, value * -2);
      }
    }
  }
  render() {
    return (
      <canvas
        className="react-music-canvas"
        width={766}
        height={732}
        ref={(c) => { this.canvas = c; }}
      />
    );
  }
}
