import React from 'react';
import Banner from './Banner';
import Agents from "./Agent/Agents"
import Articles from './Article/Articles';
import PopularPolicies from './PopularPolicies/PopularPolicies';
import Testimonials from './Testimonials/Testimonials';
import Newsletter from './Newsletter/Newsletter';

const Home = () => {
    return (
        <div>
            {/* Banner */}
            <Banner></Banner>
            {/* Popular Policies */}
             <PopularPolicies></PopularPolicies>
             {/* Meet Our Agents */}
             <Agents></Agents>
             {/* Articles */}
             <Articles></Articles>
             {/* Customer Reviews Section */}
             <Testimonials></Testimonials>
             {/* Newsletter Subscription  */}
             <Newsletter></Newsletter>
        </div>
    );
};

export default Home;