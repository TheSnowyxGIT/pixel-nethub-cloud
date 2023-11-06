import { Button, InputLabel } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import C_Button from "./C_Button";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export type C_FileInputProps = {
  className?: string;
  label: string;
  selectedFile?: File;
  setSelectedFile: (file?: File) => void;
  disabled?: boolean;
};

const C_FileInput: React.FC<C_FileInputProps> = (props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      props.setSelectedFile(undefined);
    } else {
      const file = e.target.files[0];
      props.setSelectedFile(file);
    }
  };

  return (
    <div className={`${props.className ?? ""}`}>
      <InputLabel className="mb-1">{props.label}</InputLabel>
      <C_Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        className="mb-1"
        disabled={props.disabled}
      >
        Upload file
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </C_Button>
      {props.selectedFile && (
        <div className="flex gap-1">
          <span>File name : </span>
          <span className="font-bold">{props.selectedFile.name}</span>
        </div>
      )}
    </div>
  );
};

export default C_FileInput;
