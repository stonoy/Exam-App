import React from 'react';
import {Link} from 'react-router-dom'

const Gallery = ({ allTests }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {allTests.map((test) => (
        <div key={test.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{test.name}</h3>
            <p className="text-gray-700 mb-1"><strong>Description:</strong> {test.description}</p>
            <p className="text-gray-700 mb-1"><strong>Subject:</strong> {test.subject}</p>
            <p className="text-gray-700 mb-1"><strong>Duration:</strong> {test.duration} minutes</p>
            <p className="text-gray-700 mb-1"><strong>Total Participants:</strong> {test.total_participents}</p>
            <p className="text-gray-700 mb-1"><strong>Max Score:</strong> {test.max_score}</p>
            <p className="text-gray-700 mb-1"><strong>Avg Score:</strong> {test.avg_score}</p>
            <Link to={`tests/${test.id}`} className="mt-4 inline-block bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
                  See
                </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
