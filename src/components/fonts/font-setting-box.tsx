import { ErrorMessage, Field, Form, Formik } from "formik";
import C_Box from "../basics/C_Box";
import C_BoxHeader from "../basics/C_BoxHeader";
import C_NumberInput from "../mui/C_NumberInput";
import { FontSettings } from "@/models/Font";
import C_Button from "../mui/C_Button";
import { Cancel } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import C_Slider from "../mui/C_Slider";
import { useEffect } from "react";

export type FontSettingBoxProps = {
  className?: string;
  defaultValues: FontSettings;
  values: FontSettings;
  onChange: (values: FontSettings) => void;
};

const FontSettingBox: React.FC<FontSettingBoxProps> = (props) => {
  useEffect(() => {}, []);
  return (
    <C_BoxHeader
      title="Default Settings"
      className={`${props.className ?? ""}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-2">
          <C_NumberInput
            className="flex-1"
            label="Font Size"
            value={props.values.fontSize}
            min={1}
            step={1}
            required
            onChange={(e, val) => {
              props.onChange({ ...props.values, fontSize: val! });
            }}
          />
          <IconButton
            disabled={
              !props.defaultValues ||
              props.values.fontSize === props.defaultValues.fontSize
            }
            color="primary"
            aria-label="reset"
            onClick={() => {
              props.onChange({
                ...props.values,
                fontSize:
                  props.defaultValues?.fontSize ?? props.values.fontSize,
              });
            }}
          >
            <Cancel />
          </IconButton>
        </div>
        <div className="flex items-end gap-2">
          <C_Slider
            className="flex-1"
            value={props.values.letterSpacing}
            max={10}
            min={-2}
            step={0.05}
            onChange={(e, val) => {
              props.onChange({
                ...props.values,
                letterSpacing: val! as number,
              });
            }}
          />

          <IconButton
            disabled={
              !props.defaultValues ||
              props.values.letterSpacing === props.defaultValues.letterSpacing
            }
            color="primary"
            aria-label="reset"
            onClick={() => {
              props.onChange({
                ...props.values,
                letterSpacing:
                  props.defaultValues?.letterSpacing ??
                  props.values.letterSpacing,
              });
            }}
          >
            <Cancel />
          </IconButton>
        </div>
      </div>
    </C_BoxHeader>
  );
};

export default FontSettingBox;
