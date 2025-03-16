import React, { useState, useEffect } from 'react';

const UniqueGamesTable = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc' for sorting

    useEffect(() => {
        fetchGames();
    }, [page, sortOrder]);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:3000/api/unique-games?page=${page}&limit=10`
            );
            const data = await response.json();

            // Sort the data by firstTimestamp
            const sortedData = data.data.sort((a, b) => {
                const dateA = new Date(a.firstTimestamp);
                const dateB = new Date(b.firstTimestamp);
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });

            setGames(sortedData);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to toggle sorting order
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Unique Games</h1>

            {/* Sorting Button */}
            <button
                onClick={toggleSortOrder}
                className="bg-gray-700 text-white rounded p-2 mb-4"
            >
                Sort by Time ({sortOrder === 'desc' ? 'Latest to Oldest' : 'Oldest to Latest'})
            </button>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="p-2 border">Game ID</th>
                                <th className="p-2 border">Content</th>
                                <th className="p-2 border">Last Game Index</th>
                                <th className="p-2 border">First Appearance Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((game, index) => (
                                <tr key={index}>
                                    <td className="p-2 border">{game.pastGameId}</td>
                                    <td
                                        className={`p-2 border font-semibold text-white ${
                                            parseFloat(game.content.split('×')[0]) > 10.00
                                                ? 'bg-orange-500'
                                                : parseFloat(game.content.split('×')[0]) > 4.00
                                                ? 'bg-blue-500'
                                                : parseFloat(game.content.split('×')[0]) >= 2.00
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }`}
                                    >
                                        {game.content}
                                    </td>
                                    <td className="p-2 border">{game.lastGameIndex}</td>
                                    <td className="p-2 border">
                                        {new Date(game.firstTimestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="bg-blue-500 text-white rounded p-2 disabled:bg-gray-300"
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className="bg-blue-500 text-white rounded p-2 disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniqueGamesTable;