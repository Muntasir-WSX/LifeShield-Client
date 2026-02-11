import React from 'react';
import Banner from './Banner';
import PopularPolicies from './PopularPolicies';

const Home = () => {
    return (
        <div>
            {/* Banner */}
            <Banner></Banner>
            {/* Popular Policies */}
             <PopularPolicies></PopularPolicies>
        </div>
    );
};

export default Home;