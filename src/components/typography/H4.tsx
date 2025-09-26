type H4Props = {
  children: React.ReactNode;
};
export function H4({ children }: H4Props) {
  return (
    <h4 className="scroll-m-20 text-xl font-bold tracking-tight">{children}</h4>
  );
}
