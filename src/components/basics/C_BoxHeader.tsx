import React from "react";
import C_Box from "./C_Box";

export type C_BoxHeaderProps = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

const C_BoxHeader: React.FC<C_BoxHeaderProps> = (props) => {
  return (
    <C_Box className={`${props.className ?? ""} flex flex-col`}>
      <div className="px-5 py-3 bg-background-150 border-b">
        <h2 className="text-bs-gray-1000 text-lg font-semibold">
          {props.title}
        </h2>
      </div>
      <div className="px-5 pb-5 pt-4 flex-1">{props.children}</div>
    </C_Box>
  );
};

export default C_BoxHeader;
