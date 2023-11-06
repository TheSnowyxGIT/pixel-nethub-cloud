export type C_ContainerProps = {
  children: React.ReactNode;
};

const C_Container: React.FC<C_ContainerProps> = (props) => {
  return <div className="max-w-6xl mx-auto">{props.children}</div>;
};

export default C_Container;
