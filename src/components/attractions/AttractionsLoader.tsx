const AttractionsLoader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading attractions...</span>
    </div>
  );
};

export default AttractionsLoader;
