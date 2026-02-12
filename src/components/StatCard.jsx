import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-6 h-full border border-gray-100 hover:-translate-y-1">
      <div className={`p-5 rounded-[1.5rem] ${colorClass} bg-opacity-10 flex items-center justify-center h-20 w-20 shrink-0`}>
        <Icon className={`h-9 w-9 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div className="text-left flex-1">
        <h3 className="text-5xl font-extrabold text-[#1f2937] mb-2 tracking-tight">{value}</h3>
        <p className="text-gray-400 text-sm font-bold tracking-wide">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
