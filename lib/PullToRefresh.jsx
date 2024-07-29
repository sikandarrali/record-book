import React, { useState } from 'react';
import PullToRefresh from 'react-pull-to-refresh';

const PullToRefreshApp = () => {
    const [data, setData] = useState('Initial data');

    const handleRefresh = async () => {
        // Simulate a data fetch
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData('Refreshed data at ' + new Date().toLocaleTimeString());
    };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h1>{data}</h1>
            </div>
        </PullToRefresh>
    );
};

export default PullToRefreshApp;
