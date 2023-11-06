import { MenuItem, TextField, TextFieldProps } from "@mui/material";

export type C_SelectProps = TextFieldProps & {
  choices: { value: string; label: string }[];
};

const C_Select: React.FC<C_SelectProps> = (props) => {
  return (
    <TextField size="small" select {...props}>
      {props.choices.map((choice) => (
        <MenuItem key={choice.value} value={choice.value}>
          {choice.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default C_Select;
