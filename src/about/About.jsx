import React from 'react';
import { FaRocket, FaUsers, FaBullseye, FaLightbulb, FaArrowRight } from 'react-icons/fa';

const teamMembers = [
  {
    role: "Founder",
    name: "Aditya Kumar Gupta",
    desc: "The creative driving force behind Internship Catalyst, envisioning a platform that transforms career development. With extensive industry experience, the Founder ensures innovative solutions.",
  },
  {
    role: "Co-Founder",
    name: "Meraj Hussain",
    desc: "The strategic backbone of the organization, responsible for scaling operations and building strong partnerships with financial acumen and business expertise.",
  },
  {
    role: "Managing Director",
    name: "Akib Raza",
    desc: "Oversees daily operations with exceptional leadership skills. Ensures smooth execution of company goals and drives operational excellence across all departments.",
  },
  {
    role: "Marketing Expert",
    name: "Kumar Nishu",
    desc: "Shapes the brand narrative and develops innovative marketing strategies. Excels at creating compelling campaigns and building brand awareness across all channels.",
  },
  {
    role: "Database Expert",
    name: "Ajeet Kumar",
    desc: "Manages and optimizes our robust database infrastructure. Implements efficient data solutions and maintains data integrity for lightning-fast performance.",
  },
  {
    role: "UI Specialist",
    name: "Shivam Saket",
    desc: "Crafts beautiful and intuitive user interfaces that delight users. Combines artistic vision with technical expertise for exceptional user experience.",
  },
  {
    role: "Data Analytics Expert",
    name: "Thakur Kumar",
    desc: "Transforms raw data into actionable insights, helping businesses make informed decisions with precision and clarity.",
  },
  {
    role: "Data Science Expert",
    name: "Nagendra Kushwaha",
    desc: "Specializes in uncovering patterns and trends in data, driving strategic growth through advanced analytical & Science techniques.",
  },
  {
    role: "N8N Automation Expert",
    name: "Ankit Kumar Gupta",
    desc: "Streamlines workflows and enhances productivity by designing efficient N8N automation solutions for seamless operations.",
  },
];

const About = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-x-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-black to-black pointer-events-none"></div>
      {/* Introduction Section */}
      <div className="relative px-6 py-16 md:px-12 lg:px-24 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-white bg-clip-text text-transparent mb-8">
            About Internship Catalyst
          </h1>

          <p className="text-xl text-sky-200 leading-9 mb-6">
            Internship Catalyst is a comprehensive platform designed to bridge the gap between ambitious
            job seekers and exciting career opportunities. Our mission is to empower students and professionals
            by providing cutting-edge tools and resources to excel in their careers.
          </p>

          <p className="text-lg text-sky-200 leading-8 mb-12">
            We believe that with the right guidance, opportunities, and skills, anyone can achieve their
            career goals. Our platform offers AI-powered resume optimization, job matching, interview preparation,
            and career guidance to help you stand out in the competitive job market.
          </p>
        </div>
      </div>

      {/* Team Members Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-white bg-clip-text text-transparent mb-8">Meet Our Exceptional Team</h2>
          <p className="text-xl text-sky-200 max-w-2xl mx-auto">Visionary leaders and talented professionals dedicated to transforming careers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="group bg-black/40 backdrop-blur-xl rounded-3xl border border-sky-500/20 p-8 flex flex-col items-center text-center transition-all duration-500 hover:bg-black/60 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-3">
              <div className="w-28 h-28 rounded-full mb-6 bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden border-2 border-sky-500/40 shadow-lg group-hover:scale-110 transition-transform duration-500 relative">
                <div className="absolute inset-0 bg-sky-500/10 blur-xl rounded-full"></div>
                <svg className="w-14 h-14 text-sky-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
              </div>

              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-3 drop-shadow-sm">
                {member.role}
              </h3>
              <p className="text-2xl font-bold text-white mb-4 tracking-wide">
                {member.name}
              </p>
              <p className="text-lg text-sky-100/80 leading-relaxed font-light">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black text-white mb-4">Join Our Mission</h2>
        <p className="text-xl text-sky-200 max-w-2xl mx-auto mb-8">
          Be part of a community transforming careers and creating opportunities for the next generation
        </p>
        <button className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500/20 border border-sky-500/40 rounded-lg text-sky-300 font-semibold hover:bg-sky-500/30 hover:border-sky-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20">
          Get Started Today <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    </div>
  );
};

export default About;
