import { Slider, SliderProps } from "@mui/material";

const C_Slider: React.FC<SliderProps> = (props) => {
  return <Slider size="small" valueLabelDisplay="auto" {...props} />;
};

export default C_Slider;
