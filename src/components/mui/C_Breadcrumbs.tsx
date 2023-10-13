import { Breadcrumbs, BreadcrumbsProps } from "@mui/material";

const C_Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  return (
    <Breadcrumbs
      className={props.className ?? ""}
      aria-label="breadcrumb"
      sx={{
        "& .MuiBreadcrumbs-separator": {
          color: "var(--bs-gray-900)",
        },
        "& .MuiBreadcrumbs-li": {
          color: "var(--bs-gray-900)",
        },
      }}
    >
      {props.children}
    </Breadcrumbs>
  );
};

export default C_Breadcrumbs;
