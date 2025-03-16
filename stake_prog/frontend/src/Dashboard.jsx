// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// const Dashboard = () => {
//     const [games, setGames] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filters, setFilters] = useState({
//         startDate: '',
//         endDate: '',
//         pastGameId: '',
//         page: 1
//     });
//     const [totalPages, setTotalPages] = useState(1);
//     const [selectedTimestamp, setSelectedTimestamp] = useState(null);

//     useEffect(() => {
//         fetchData();
//     }, [filters]);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const queryParams = new URLSearchParams({
//                 ...filters,
//                 limit: 10
//             });

//             const response = await fetch(`http://localhost:3000/api/games?${queryParams}`);
//             const data = await response.json();

//             setGames(data.data);
//             setTotalPages(data.pages);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({
//             ...prev,
//             [name]: value,
//             page: 1 // Reset to first page when filters change
//         }));
//     };

//     const toggleTimestamp = (timestamp) => {
//         setSelectedTimestamp(prev => (prev === timestamp ? null : timestamp));
//     };

//     return (
//         <div className="p-6">
//             <div className="mb-6 bg-white rounded-lg shadow p-4">
//                 <h1 className="text-2xl font-bold mb-4">Game Tracker Dashboard</h1>

//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                     <input
//                         type="date"
//                         name="startDate"
//                         value={filters.startDate}
//                         onChange={handleFilterChange}
//                         className="border rounded p-2"
//                     />
//                     <input
//                         type="date"
//                         name="endDate"
//                         value={filters.endDate}
//                         onChange={handleFilterChange}
//                         className="border rounded p-2"
//                     />
//                     <input
//                         type="text"
//                         name="pastGameId"
//                         value={filters.pastGameId}
//                         onChange={handleFilterChange}
//                         placeholder="Search by Game ID"
//                         className="border rounded p-2"
//                     />
//                     <button
//                         onClick={() => setFilters({ startDate: '', endDate: '', pastGameId: '', page: 1 })}
//                         className="bg-red-500 text-white rounded p-2"
//                     >
//                         Clear Filters
//                     </button>
//                 </div>

//                 {loading ? (
//                     <div className="text-center py-4">Loading...</div>
//                 ) : (
//                     <>
//                         <div className="overflow-x-auto">
//                             {games.map((game, i) => (
//                                 <div key={i} className="border-b py-4">
//                                     <div
//                                         className="cursor-pointer bg-gray-200 p-3 rounded"
//                                         onClick={() => toggleTimestamp(game.timestamp)}
//                                     >
//                                         <span>{new Date(game.timestamp).toLocaleString()}</span>
//                                     </div>

//                                     {selectedTimestamp === game.timestamp && (
//                                         <div className="pl-4 pt-2">
//                                             <table className="min-w-full bg-white">
//                                                 <thead>
//                                                     <tr>
//                                                         <th className="p-2 border">Game ID</th>
//                                                         <th className="p-2 border">Content</th>
//                                                         <th className="p-2 border">Last Game Index</th>
//                                                         {/* <th className="p-2 border">Button Colors</th> */}
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {game.games.map((g, j) => (
//                                                         <tr key={`${i}-${j}`}>
//                                                             <td className="p-2 border">{g.pastGameId}</td>
//                                                             <td
//                                                                 className={`p-2 border font-semibold text-white ${parseFloat(g.content.split('×')[0]) > 10.00
//                                                                     ? 'bg-orange-500 ' // Orange color for above 10.00
//                                                                     : parseFloat(g.content.split('×')[0]) > 4.00
//                                                                         ? 'bg-blue-500 ' // Blue color for above 4.00
//                                                                         : parseFloat(g.content.split('×')[0]) >= 2.00
//                                                                             ? 'bg-green-500 ' // Green color for 2.00 to 4.00
//                                                                             : 'bg-red-500 '
//                                                                     }`}
//                                                             >
//                                                                 {g.content}
//                                                             </td>

//                                                             <td className="p-2 border">{g.lastGameIndex}</td>
//                                                             {/* <td className="p-2 border">
//                                 <button
//                                   style={{
//                                     backgroundColor: g.buttonBackground,
//                                     color: g.buttonForeground
//                                   }}
//                                   className="rounded px-4 py-2"
//                                 >
//                                   Hover Me
//                                 </button>
//                               </td> */}
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="mt-4 flex justify-between items-center">
//                             <button
//                                 onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
//                                 disabled={filters.page === 1}
//                                 className="bg-blue-500 text-white rounded p-2 disabled:bg-gray-300"
//                             >
//                                 Previous
//                             </button>
//                             <span>Page {filters.page} of {totalPages}</span>
//                             <button
//                                 onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
//                                 disabled={filters.page === totalPages}
//                                 className="bg-blue-500 text-white rounded p-2 disabled:bg-gray-300"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState('aggregated'); // 'aggregated' or 'individual'
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    pastGameId: '',
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);
  const handleDownload = () => {
    // Fetch the CSV file from the backend
    fetch('http://localhost:3000/api/export-individual-games-csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to download CSV file');
        }
        return response.blob();
      })
      .then(blob => {
        // Create a link to download the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'individualGames.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('Error downloading CSV file:', error);
        alert('Error downloading the CSV file');
      });
  };

  useEffect(() => {
    fetchData();
  }, [filters, viewMode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        limit: 10
      });

      const endpoint = viewMode === 'aggregated'
        ? 'http://localhost:3000/api/games'
        : 'http://localhost:3000/api/individual-games';

      const response = await fetch(`${endpoint}?${queryParams}`);
      const data = await response.json();

      setGames(data.data);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const processExistingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/process-existing-data', {
        method: 'POST'
      });
      const data = await response.json();
      alert(data.message);
      fetchData();
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Error processing historical data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Game Tracker Dashboard</h1>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setViewMode('aggregated')}
              className={`px-4 py-2 rounded ${viewMode === 'aggregated' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Aggregated View
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
            >
              Export Individual Games CSV
            </button>
            <button
              onClick={() => setViewMode('individual')}
              className={`px-4 py-2 rounded ${viewMode === 'individual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Individual Games
            </button>
            <button
              onClick={processExistingData}
              className="px-4 py-2 rounded bg-green-500 text-white"
            >
              Process Historical Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border rounded p-2"
          />
          <input
            type="text"
            name="pastGameId"
            value={filters.pastGameId}
            onChange={handleFilterChange}
            placeholder="Search by Game ID"
            className="border rounded p-2"
          />
          <button
            onClick={() => setFilters({ startDate: '', endDate: '', pastGameId: '', page: 1 })}
            className="bg-red-500 text-white rounded p-2"
          >
            Clear Filters
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Game ID</th>
                    <th className="p-2 border">Content</th>
                    {viewMode === 'individual' && (
                      <>
                        <th className="p-2 border">First Seen</th>
                        <th className="p-2 border">Occurrences</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {viewMode === 'aggregated' ? (
                    games.map((game, i) => (
                      game.games.map((g, j) => (
                        <tr key={`${i}-${j}`}>
                          <td className="p-2 border">{new Date(game.timestamp).toLocaleString()}</td>
                          <td className="p-2 border">{g.pastGameId}</td>
                          <td className="p-2 border">{g.content}</td>
                        </tr>
                      ))
                    ))
                  ) : (
                    games.map((game) => (
                      <tr key={game.pastGameId}>
                        <td className="p-2 border">{new Date(game.lastSeen).toLocaleString()}</td>
                        <td className="p-2 border">{game.pastGameId}</td>
                        <td className="p-2 border">{game.content}</td>
                        <td className="p-2 border">{new Date(game.firstSeen).toLocaleString()}</td>
                        <td className="p-2 border">{game.occurrences}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={filters.page === 1}
                className="bg-blue-500 text-white rounded p-2 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span>Page {filters.page} of {totalPages}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                disabled={filters.page === totalPages}
                className="bg-blue-500 text-white rounded p-2 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;