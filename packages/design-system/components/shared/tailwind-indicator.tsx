const TailwindIndicator = () => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  return (
    <div className="fixed right-4 bottom-4 z-50 flex items-center justify-center rounded bg-gray-50 px-1.5 py-1 font-mono text-black text-xs">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
};

TailwindIndicator.displayName = 'TailwindIndicator';

export default TailwindIndicator;
