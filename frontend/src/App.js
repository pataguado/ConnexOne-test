import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';
import Logo from './assets/connexlogolight.svg';

const App = () => {
  const [serverTime, setServerTime] = useState('');
  const [clientTime, setClientTime] = useState(moment());
  const [metrics, setMetrics] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch server time and metrics on component mount
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch server time
      const timeResponse = await axios.get('/time', {
        headers: { Authorization: 'mysecrettoken' },
      });
      setServerTime(timeResponse.data.epoch);

      // Fetch metrics
      const metricsResponse = await axios.get('/metrics', {
        headers: { Authorization: 'mysecrettoken' },
      });
      setMetrics(metricsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update client time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setClientTime(moment());
      console.log(clientTime);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const getStopwatchTime = () => {
    const differenceInSeconds = serverTime ? moment().diff(moment.unix(serverTime), 'seconds') : 0;
    return moment.utc(differenceInSeconds * 1000).format('HH:mm:ss');
  };

  return (
    <div className='app'>
      <div className='container'>
        <div className='left-section'>
          <div className='logo'>
            <img src={Logo} alt='Logo' width={200} />
            <h1>TEST</h1>
          </div>
          <div className='tag'>
            <h2>Server Time</h2>
            <div className='data'>{serverTime}</div>
          </div>
          <div className='tag'>
            <h2>Client Time</h2>
            <div className='data'>{clientTime ? clientTime.unix() : 0}</div>
          </div>
          <div className='tag'>
            <h2>Difference</h2>
            <div className='data'>{getStopwatchTime()}</div>
          </div>
        </div>
        <div className='right-section'>
          <div className='wrap'>
            <h2>Metrics</h2>
            <pre className='metrics'>{metrics}</pre>
          </div>
        </div>
      </div>
      {loading && <div className='loading'>Loading...</div>}
    </div>
  );
};

export default App;
