const EmptyHotelsList = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <h3 className="font-medium">No hotels found</h3>
      <p className="text-sm text-gray-600 mt-1">
        Try adjusting your search criteria.
      </p>
    </div>
  );
};

export default EmptyHotelsList;
