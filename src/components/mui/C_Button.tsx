import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const MyButton = styled(Button)({
  backgroundColor: "rgb(var(--active)) !important",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(var(--active), .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
});

const C_Button: React.FC<ButtonProps> = (props) => {
  return <MyButton {...props}></MyButton>;
};

export default C_Button;
