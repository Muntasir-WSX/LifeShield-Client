import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Target, Trophy, Users, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";


const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("story");

  const teamData = [
    {
      name: "Muntasir Mahmud",
      role: "Founder & Visionary Lead",
      image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974393/IMG_20240202_014303_140_bi3kwg.jpg",
      desc: "The driving force behind LifeShield's mission to digitalize insurance."
    },
    {
      name: "Sumsed Tareq Jami",
      role: "Chief Operations Officer",
      image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974341/Screenshot_2026-02-02_012423_angnqd.png"
    },
    {
      name: "Kabir Nabil",
      role: "Lead Strategic Investor",
      image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974340/Screenshot_2026-02-02_012534_gjpb7a.png"
    },
    {
      name: "Tanjim Ahmed",
      role: "Head of Agent Network",
      image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974463/Screenshot_2025-11-26_012321_cfcidy.png"
    },
    {
      name: "SA Bappy",
      role: "Lead Product Architect",
      image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974352/bappy_djtzz6.jpg"
    },
    {
      name: "KS Mahi",
      role: "Investment Strategy Head",
      image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974350/sala_mahi_xfzo4o.jpg"
    },
    {
      name: "Minhaz Ahmed",
      role: "Customer Success Lead",
      image: "https://res.cloudinary.com/dnk0bvpym/image/upload/v1769974351/minhaz_vhhakm.jpg"
    }
  ];

  const tabContents = {
    story: "LifeShield started with a simple vision: making life insurance accessible to every household in Bangladesh. We believe that financial security shouldn't be a complex puzzle, but a transparent and digital experience for everyone.",
    mission: "Our mission is to bridge the gap between traditional insurance and modern technology. We aim to protect 1 million families by 2030 through our simplified digital claim process and transparent policy management.",
    success: "Since our launch, we have successfully processed over 5,000+ claims with a 98% satisfaction rate. We are honored to be recognized as the fastest-growing InsurTech startup of 2026.",
  };

  const tabIcons = {
    story: <History size={20} />,
    mission: <Target size={20} />,
    success: <Trophy size={20} />,
    team: <Users size={20} />,
  };

  const tabs = [
    { id: "story", label: "Our Story" },
    { id: "mission", label: "Mission" },
    { id: "success", label: "Milestones" },
    { id: "team", label: "Leadership Team" },
  ];

  const founder = teamData.slice(0, 1);
  const executives = teamData.slice(1, 3);
  const coreTeam = teamData.slice(3);

  const TeamCard = ({ member, index, isFounder }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group bg-gray-50 p-8 rounded-[40px] border border-transparent hover:border-[#00332C] hover:bg-white flex flex-col items-center text-center transition-all duration-300 shadow-sm ${isFounder ? 'ring-2 ring-green-100' : ''}`}
    >
      <div className="relative mb-6">
        <img
          src={member.image}
          alt={member.name}
          className={`w-32 h-32 md:w-44 md:h-44 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border-4 border-transparent group-hover:border-green-400 shadow-lg`}
        />
        {isFounder && (
            <div className="absolute -bottom-2 right-0 bg-[#00332C] text-white p-2 rounded-full border-4 border-white">
                <ShieldCheck size={20} />
            </div>
        )}
      </div>
      <h3 className="font-black text-2xl text-[#00332c] mb-1">{member.name}</h3>
      <p className="text-xs md:text-sm text-green-700 font-black uppercase tracking-[0.2em]">
        {member.role}
      </p>
      {isFounder && <p className="mt-3 text-sm text-gray-500 italic max-w-xs">{member.desc}</p>}
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 bg-white rounded-[40px] shadow-sm border border-gray-100 mt-10">
      <Helmet>
                  <title> About Us | Life Shield - Secure Your Tomorrow</title>
                  <meta name="description" content="Welcome to Life Shield. Explore our popular insurance policies, meet our expert agents, and stay updated with our latest health and life articles." />
          </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h2 className="text-5xl md:text-6xl font-black text-[#00332c] mb-4 tracking-tighter uppercase">
            WHO WE <span className="text-green-500">ARE</span>
          </h2>
          <p className="text-gray-500 max-w-xl text-lg">
            Empowering your future with digital insurance solutions that are fast, 
            secure, and always by your side.
          </p>
        </div>
        <div className="bg-green-100 px-8 py-4 rounded-3xl border border-green-200">
          <p className="font-black text-green-800 text-sm uppercase tracking-widest">
            Established 2026
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 md:gap-12 border-b border-gray-100 mb-12 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-lg md:text-xl font-bold transition-all flex items-center gap-2 relative whitespace-nowrap ${
              activeTab === tab.id ? "text-green-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tabIcons[tab.id]}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#00332C] rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="min-h-125">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "team" ? (
              <div className="space-y-16">
                {/* Founder Section */}
                <div className="flex flex-col items-center">
                   <p className="text-green-500 font-black uppercase tracking-widest mb-6">Our Founder</p>
                   <div className="w-full max-w-md">
                        <TeamCard member={founder[0]} index={0} isFounder={true} />
                   </div>
                </div>

                {/* Executives / Investors */}
                <div className="space-y-8">
                    <p className="text-center text-gray-400 font-bold uppercase tracking-widest">Executive Board & Investors</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {executives.map((m, i) => (
                            <TeamCard key={i} member={m} index={i + 1} />
                        ))}
                    </div>
                </div>

                {/* Managers & Heads */}
                <div className="space-y-8">
                    <p className="text-center text-gray-400 font-bold uppercase tracking-widest">Department Heads</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreTeam.map((m, i) => (
                            <TeamCard key={i} member={m} index={i + 3} />
                        ))}
                    </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl">
                <p className="text-[#00332c] leading-relaxed text-2xl md:text-4xl font-black mb-12 border-l-8 border-green-500 pl-8">
                  {tabContents[activeTab]}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-10 bg-gray-50 rounded-[3rem] border-b-4 border-green-600">
                    <p className="text-gray-600 font-medium">
                      "We don't just sell policies; we build a shield of trust around your family's future."
                    </p>
                  </div>
                  <div className="p-10 bg-[#00332C] rounded-[3rem] border-b-4 border-[#00332c]">
                    <p className="text-white font-black uppercase italic tracking-tighter text-xl">
                      Transparent. <br /> Digital. <br /> Reliable.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AboutUs;