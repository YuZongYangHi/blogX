import React from 'react';

export const IconText = ({ icon }: { icon: any }) => (
    <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
  </span>
);