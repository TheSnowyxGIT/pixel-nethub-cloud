import { CircularProgress } from "@mui/material";

type LoadingScreenProps = {
  text?: string;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = (props) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full backdrop-blur flex items-center justify-center flex-col">
      <CircularProgress />
      {props.text && <span className="pt-4 text-xl">{props.text}</span>}
    </div>
  );
};
