export const ScheduleTournament = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            🏆 Schedule Tournament
          </h1>
  
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Tournament Name */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="tournamentName">
                Tournament Name
              </label>
              <input
                type="text"
                id="tournamentName"
                placeholder="Enter tournament name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700"
              />
            </div>
  
            {/* Start Date */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700"
              />
            </div>
  
            {/* End Date */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700"
              />
            </div>
  
            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter tournament description"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700 h-24 resize-none"
              ></textarea>
            </div>
  
            {/* Entry Fee */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="entryFee">
                Entry Fee (₹)
              </label>
              <input
                type="number"
                id="entryFee"
                placeholder="Enter entry fee"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700"
              />
            </div>
  
            {/* Submit Button */}
            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
              Schedule Tournament
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  