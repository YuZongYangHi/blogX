import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import {ArticleReleaseTrendRequest} from '@/services/dashboard/index'
import Title from '@/components/CustomizeTitle'

export default  () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = async () => {
   const result = await ArticleReleaseTrendRequest();
   if (result.success) {
     setData(result.data.list)
   }
  };
  const config = {
    data,
    padding: 'auto',
    xField: 'date',
    yField: 'scales',
    xAxis: {
      tickCount: 5,
    },
  };

  return <div style={{
    background: '#FFFFFF',
    marginTop: 14,
    padding: 45.5,
    marginBottom: 24
  }}>
    <Title title={"近7天文章发布趋势"}/>
    <Line {...config} />
  </div>
};
