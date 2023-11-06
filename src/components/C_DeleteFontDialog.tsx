import { useTheme } from "@emotion/react";
import {
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import React, { useEffect } from "react";
import C_TextInput from "./mui/C_TextImput";
import { deleteFont } from "@/apis/fonts";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

export type C_DeleteFontDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
  name: string;
};

const C_DeleteFontDialog: React.FC<C_DeleteFontDialogProps> = (props) => {
  const [typedName, setTypedName] = React.useState("");

  useEffect(() => {
    if (props.open) {
      setTypedName("");
    }
  }, [props.open]);

  const handleCancel = () => {
    props.setOpen(false);
  };

  const handleDelete = async () => {
    props.onDelete();
    props.setOpen(false);
  };

  const isIdentical = typedName === props.name;

  return (
    <Dialog
      open={props.open}
      onClose={handleCancel}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {`Delete ${props.name}?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will permanently delete the font <strong>{props.name}</strong>.
          <br />
          <br />
          To confirm, please enter the name of the font.
        </DialogContentText>
        <C_TextInput
          autoFocus
          className="mt-1 w-full"
          value={typedName}
          onChange={(e) => {
            setTypedName(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleDelete} disabled={!isIdentical}>
          Delete Font
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default C_DeleteFontDialog;
