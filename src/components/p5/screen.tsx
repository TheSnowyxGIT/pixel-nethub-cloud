"use client";
import React, { Component } from "react";
import type p5 from "p5";
import P5Sketch from "./sketch";
import { Color, PixelMatrix } from "pixels-matrix";

export interface ScreenProps {
  className?: string;
  style?: React.CSSProperties;
  resolution: { width: number; height: number };
  offColor?: Color;
}

export default class Screen extends Component<ScreenProps> {
  private matrix: PixelMatrix;
  private offColor: Color;
  private hasChanged: boolean = true;
  constructor(props: ScreenProps) {
    super(props);
    this.matrix = new PixelMatrix(
      props.resolution.width,
      props.resolution.height
    );
    this.offColor = props.offColor ?? new Color(40, 40, 40);
  }

  public applyBuffer(buffer: ArrayBuffer) {
    this.matrix = PixelMatrix.FromBuffer(
      buffer,
      this.props.resolution.width,
      this.props.resolution.height,
      { y_mirrored: true }
    );
    this.hasChanged = true;
  }

  public applyPm(pm: PixelMatrix) {
    const buffer = Buffer.from(pm.ToArray().buffer);
    this.matrix = PixelMatrix.FromBuffer(
      buffer,
      this.props.resolution.width,
      this.props.resolution.height,
      { y_mirrored: true }
    );
    this.hasChanged = true;
  }

  private boxSize: number = 0;
  private boxXOffset: number = 0;
  private boxYOffset: number = 0;
  private setup = (p5: p5) => {
    const boxXSize = p5.width / this.props.resolution.width;
    const boxYSize = p5.height / this.props.resolution.height;
    this.boxSize = Math.min(boxXSize, boxYSize);
    this.boxXOffset =
      (p5.width - this.boxSize * this.props.resolution.width) / 2;
    this.boxYOffset =
      (p5.height - this.boxSize * this.props.resolution.height) / 2;
    this.hasChanged = true;
  };

  private glow = (p5: p5, color: string, v: number) => {
    p5.drawingContext.shadowColor = color;
    p5.drawingContext.shadowBlur = v;
  };

  private noGlow = (p5: p5) => {
    p5.drawingContext.shadowBlur = 0;
  };

  private draw = (p5: p5) => {
    if (!this.hasChanged) {
      return;
    }
    p5.background(0);
    this.hasChanged = false;
    for (let x = 0; x < this.props.resolution.width; x++) {
      for (let y = 0; y < this.props.resolution.height; y++) {
        const borderSize = this.boxSize / 5;
        p5.noStroke();
        let [r, g, b] = this.matrix.getColor({ x, y }).getRGB();
        if (r === 0 && g === 0 && b === 0) {
          [r, g, b] = this.offColor.getRGB();
        } else {
          //this.glow(p5, `rgb(${r}, ${g}, ${b})`, 20);
          p5.rect(
            this.boxXOffset + x * this.boxSize + borderSize,
            this.boxYOffset + y * this.boxSize + borderSize,
            this.boxSize - borderSize * 2,
            this.boxSize - borderSize * 2
          );
          //this.glow(p5, `rgb(${r}, ${g}, ${b})`, 100);
          p5.rect(
            this.boxXOffset + x * this.boxSize + borderSize,
            this.boxYOffset + y * this.boxSize + borderSize,
            this.boxSize - borderSize * 2,
            this.boxSize - borderSize * 2
          );
        }
        p5.fill(r, g, b);
        p5.rect(
          this.boxXOffset + x * this.boxSize + borderSize,
          this.boxYOffset + y * this.boxSize + borderSize,
          this.boxSize - borderSize * 2,
          this.boxSize - borderSize * 2
        );
        this.noGlow(p5);
      }
    }
  };

  private windowResized = (p5: p5) => {
    this.setup(p5);
  };

  render() {
    const width = this.props.resolution.width;
    const height = this.props.resolution.height;

    return (
      <div
        className={`${this.props.className}`}
        style={{
          aspectRatio: `${width} / ${height}`,
          width: width >= height ? "100%" : undefined,
          height: width < height ? "100%" : undefined,
        }}
      >
        <P5Sketch
          responsive
          setup={this.setup}
          draw={this.draw}
          windowResized={this.windowResized}
        />
      </div>
    );
  }
}
