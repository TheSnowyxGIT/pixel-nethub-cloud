import * as React from "react";

import TextField, { TextFieldProps } from "@mui/material/TextField";

const C_TextInput: React.FC<TextFieldProps> = (props) => {
  return <TextField variant="outlined" {...props} size="small" />;
};

export default C_TextInput;
