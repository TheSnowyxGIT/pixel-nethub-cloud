import React from "react";

export type C_BoxProps = {
  children?: React.ReactNode;
  className?: string;
};

const C_Box: React.FC<C_BoxProps> = (props) => {
  return (
    <div
      className={`${
        props.className ?? ""
      } bg-background-100 border-[1px] border-bs-gray-alpha-400 rounded-md shadow-sm`}
    >
      {props.children}
    </div>
  );
};

export default C_Box;
