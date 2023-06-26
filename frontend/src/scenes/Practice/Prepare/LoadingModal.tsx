export default function LoadingModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="col-center h-[600px] w-full px-10 sm:px-20">
      <div className="h-full w-full rounded-md bg-background p-6 shadow-md sm:w-[440px]">
        {children}
      </div>
    </div>
  );
}
