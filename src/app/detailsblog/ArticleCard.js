const ArticleCard = ({ item }) => {
  const categoryColors = {
    Health: 'bg-green-600',
    Education: 'bg-blue-600',
    Guidelines: 'bg-red-600',
    Default: 'bg-gray-400',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span
          className={`${categoryColors[item.category] || categoryColors.Default} text-white text-xs font-semibold px-2 py-0.5 rounded-md`}
        >
          {item.category}
        </span>
        {item.status && (
          <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-md">
            {item.status}
          </span>
        )}
      </div>
      <h3 className="text-lg font-medium mt-2">{item.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
    </div>
  );
};

export default ArticleCard;
