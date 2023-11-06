"use client";
import { Font, FontSettings } from "@/models/Font";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import React from "react";
import { Component } from "react";
import io from "socket.io-client";
import Screen from "@/components/p5/screen";
import { Color, PixelMatrix } from "pixels-matrix";
import { infiniteScroll } from "matrix-text-scroll";
import { getFont } from "text2matrix";
import C_BoxHeader from "../basics/C_BoxHeader";
import TextField from "@mui/material/TextField";
import C_Select from "../mui/C_Select";

export type FontPreviewProps = {
  fontHash: string | null;
  fontSettings: FontSettings;
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
  private infScroll?: ReturnType<typeof infiniteScroll>;

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

  async componentDidUpdate(
    prevProps: Readonly<FontPreviewProps>,
    prevState: Readonly<FontPreviewState>
  ): Promise<void> {
    await this.restart();
  }

  private isClosing = false;
  public async restart() {
    if (this.infScroll && !this.isClosing) {
      this.infScroll.requestStop();
      this.isClosing = true;
      await this.infScroll.waitEnd();
      this.infScroll = undefined;
      this.isClosing = false;
    } else if (this.isClosing) {
      return;
    }

    this.startScreen();
  }

  private startScreen() {
    if (!this.props.fontHash || !this.state.size || this.infScroll) {
      return;
    }
    const pixelMatrix = new PixelMatrix(
      this.state.size.width,
      this.state.size.height
    );
    console.log("startScreen");
    this.infScroll = infiniteScroll(
      this.texts[this.state.textType],
      (matrix) => {
        pixelMatrix.setMatrix(matrix, Color.Blue);
        this.screenRef.current?.applyPm(pixelMatrix);
      },
      {
        font: getFont(this.props.fontHash),
        fontSize: this.props.fontSettings.fontSize,
        letterSpacing: this.props.fontSettings.letterSpacing,
        speed_x: -12,
        box: this.state.size,
      }
    );
  }

  render() {
    return (
      // <div className="mt-6 p-4 bg-bs-gray-1000 border-[1px] border-bs-gray-alpha-400 rounded-md shadow-sm">
      <C_BoxHeader title="Preview">
        <div>
          <div className="pb-2 flex justify-between">
            <C_Select
              value={this.state.textType}
              size="small"
              select
              label="Text type"
              onChange={(e) => {
                this.setState({ textType: e.target.value as string });
              }}
              choices={[
                { value: "lowercase", label: "Lowercase" },
                { value: "uppercase", label: "Uppercase" },
                { value: "numbers", label: "Numbers" },
              ]}
            />
          </div>
        </div>
        {this.props.fontHash && this.state.size ? (
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
          <div className="w-full min-h-[100px] flex gap-4 items-center justify-center">
            <CircularProgress />
            {this.state.size ? (
              <span>Waiting for font</span>
            ) : (
              <span>Fetching Screen Size...</span>
            )}
          </div>
        )}
      </C_BoxHeader>
    );
  }
}
