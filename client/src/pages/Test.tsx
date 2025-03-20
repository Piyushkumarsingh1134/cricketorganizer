export default function BackgroundShapeDemo() {
    return (
      <div className="relative flex items-center justify-center h-screen bg-gray-100">
        {/* Irregular Background Shape */}
        <div className="absolute -top-16 -right-16 w-[550px] h-[400px] bg-yellow-100 rounded-[40%] transform rotate-12"></div>
  
        {/* Example Content */}
        <div className="relative z-10 p-10 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900">
            Custom Background Shape
          </h2>
          <p className="text-gray-600">This shape is more organic and dynamic instead of a perfect circle.</p>
        </div>
      </div>
    );
  }
  
  