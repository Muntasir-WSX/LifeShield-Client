import React from 'react';
import Banner from './Banner';
import PopularPolicies from './PopularPolicies';
import Agents from './Agents';

const Home = () => {
    return (
        <div>
            {/* Banner */}
            <Banner></Banner>
            {/* Popular Policies */}
             <PopularPolicies></PopularPolicies>
             {/* Meet Our Agents */}
             <Agents></Agents>
        </div>
    );
};

export default Home;