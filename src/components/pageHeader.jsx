import React from 'react';

const PageHeader = ({ title, desc }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500">{desc}</p>
  </div>
);

export default PageHeader;