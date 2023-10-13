"use client";
import { Font } from "@/models/Font";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import React from "react";
import { Component } from "react";
import io from "socket.io-client";
import Screen from "@/components/p5/screen";
import { Color, PixelMatrix } from "pixels-matrix";
import { infiniteScroll } from "matrix-text-scroll";
import { getFont } from "text2matrix";

export type FontPreviewProps = {
  font: Font | null;
};

type FontPreviewState = {
  size?: { width: number; height: number };
  textType: string;
};

export default class FontPreview extends Component<
  FontPreviewProps,
  FontPreviewState
> {
  private timeout = 1000;
  private texts: Record<string, string> = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
  };
  private screenRef: React.RefObject<Screen>;

  constructor(props: FontPreviewProps) {
    super(props);
    this.screenRef = React.createRef<Screen>();
  }

  state: Readonly<FontPreviewState> = {
    textType: "lowercase",
  };

  componentDidMount(): void {
    const socket = io("http://localhost:3000", {
      reconnection: false,
    });

    socket.on("init", (data: any) => {
      this.setState({ size: data });
    });

    setTimeout(() => {
      if (!this.state.size) {
        this.setState({ size: { width: 32, height: 8 } });
      }
    }, this.timeout);
  }

  componentDidUpdate(
    prevProps: Readonly<FontPreviewProps>,
    prevState: Readonly<FontPreviewState>
  ): void {
    if (!prevState.size && this.state.size) {
      // start the screen
      this.restart(this.currentSettings);
    }
    if (this.state.size && prevState.textType !== this.state.textType) {
      // restart the screen
      this.restart(this.currentSettings);
    }
  }

  private infScroll: any;
  private currentSettings = { fontSize: 5, letterSpacing: 0 };
  public restart(settings: { fontSize: number; letterSpacing: number }) {
    this.currentSettings = settings;
    if (!this.state.size) {
      return;
    }
    if (!this.infScroll) {
      this.startScreen(settings);
      return;
    }
    this.infScroll.requestStop();
    this.infScroll.waitEnd().then(() => {
      this.startScreen(settings);
    });
  }

  private startScreen(settings: { fontSize: number; letterSpacing: number }) {
    const pixelMatrix = new PixelMatrix(
      this.state.size!.width,
      this.state.size!.height
    );
    this.infScroll = infiniteScroll(
      this.texts[this.state.textType],
      (matrix) => {
        pixelMatrix.setMatrix(matrix, Color.Blue);
        this.screenRef.current?.applyPm(pixelMatrix);
      },
      {
        font: getFont(this.props.font!.hash),
        fontSize: settings.fontSize,
        letterSpacing: settings.letterSpacing,
        speed_x: -12,
        box: this.state.size!,
      }
    );
  }

  render() {
    return (
      <div className="mt-6 p-4 bg-bs-gray-1000 border-[1px] border-bs-gray-alpha-400 rounded-md shadow-sm">
        <div className="pb-4">
          <div className="pb-2 flex justify-between">
            <h3 className="text-lg font-medium text-background-200">Preview</h3>
            <Select
              labelId="Text"
              value={this.state.textType}
              label="Text"
              onChange={(e) => {
                this.setState({ textType: e.target.value as string });
              }}
            >
              <MenuItem value={"lowercase"}>Lowercase</MenuItem>
              <MenuItem value={"uppercase"}>Uppercase</MenuItem>
              <MenuItem value={"numbers"}>Numbers</MenuItem>
            </Select>
          </div>
          <p className="text-gray-300 text-sm">
            Preview of the font and settings. This is how the font will look on
            the screen.
          </p>
        </div>
        {this.props.font && this.state.size ? (
          <div className="w-full">
            <Screen
              ref={this.screenRef}
              resolution={{
                width: this.state.size.width,
                height: this.state.size.height,
              }}
            />
          </div>
        ) : (
          <div className="w-full min-h-[100px] flex items-center justify-center">
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}
