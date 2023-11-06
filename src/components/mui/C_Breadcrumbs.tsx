import { Breadcrumbs, BreadcrumbsProps } from "@mui/material";
import Link from "next/link";
import React from "react";

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

export type C_LinkBreadcrumbsProps = {
  links: { href: string; text: string }[];
  className?: string;
};

export const C_LinkBreadcrumbs: React.FC<C_LinkBreadcrumbsProps> = (props) => {
  return (
    <C_Breadcrumbs className={`${props.className ?? ""}`}>
      {props.links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={
            index === props.links.length - 1
              ? "text-bs-gray-1000"
              : "text-bs-gray-900"
          }
        >
          {link.text}
        </Link>
      ))}
    </C_Breadcrumbs>
  );
};

export default C_Breadcrumbs;
