import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function AICoverLetter() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    skills: "",
  });
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    setLoading(true);

    // Simulate AI generation delay
    setTimeout(() => {
      let letter = "";
      const { name, company, role, skills } = formData;
      const date = new Date().toLocaleDateString();

      if (tone === "Professional") {
        letter = `Subject: Application for ${role} position

Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With my background in ${skills}, I am confident in my ability to contribute effectively to your team.

I have been following ${company}'s work and am impressed by your commitment to innovation. My experience matches well with the requirements of this role, particularly my expertise in ${skills}.

Thank you for considering my application. I look forward to the possibility of discussing how I can bring value to ${company}.

Sincerely,
${name || "[Your Name]"}`;
      } else if (tone === "Formal") {
        letter = `Date: ${date}

To the Hiring Committee,
${company}

Re: Application for the post of ${role}

Dear Sir/Madam,

I am formally submitting my application for the ${role} vacancy at ${company}. Having reviewed the job description, I believe my qualifications in ${skills} make me a suitable candidate for this position.

I am eager to apply my skills and experience to support ${company}'s objectives. I am a dedicated professional committed to achieving excellence in my work.

Thank you for your time and review of my application. I am available for an interview at your earliest convenience.

Respectfully,
${name || "[Your Name]"}`;
      } else if (tone === "Friendly") {
        letter = `Hi ${company} Team,

I was thrilled to see the opening for a ${role} at ${company}! I've been a fan of what you do, and I'd love the chance to join the team.

I bring a lot of passion and hands-on experience with ${skills}. I love solving problems and collaborating with others, and I think I'd fit right in with the culture at ${company}.

I'd be super excited to chat more about how I can help out. Thanks for checking out my application!

Cheers,
${name || "[Your Name]"}`;
      }

      setGeneratedText(letter);
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    alert("Cover letter copied!");
  };

  return (
    <MainLayout>

      {/* 🔹 HERO */}
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-sky-400">
          AI Cover Letter Generator
        </h1>
        <p className="mt-3 text-sky-200 max-w-2xl">
          Create personalized, job-ready cover letters in seconds using AI.
        </p>
      </div>

      {/* 🔹 FORM + OUTPUT */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT – INPUT */}
        <div className="bg-slate-900/60 p-6 rounded-xl border border-sky-500/20 hover:border-sky-500 transition">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Enter Details
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-sky-500 outline-none text-white"
            />

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company Name"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-sky-500 outline-none text-white"
            />

            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Job Role"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-sky-500 outline-none text-white"
            />

            <textarea
              rows="4"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="Key skills & experience (e.g. React, Node.js, Project Management)"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-sky-500 outline-none text-white"
            />

            {/* Tone Selector */}
            <div>
              <p className="text-sky-300 text-sm mb-2">Select Tone</p>
              <div className="flex gap-3 flex-wrap">
                {["Professional", "Formal", "Friendly"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-full border transition
                      ${tone === t
                        ? "bg-sky-500 text-white border-sky-500"
                        : "border-sky-500 text-sky-300 hover:bg-sky-500 hover:text-white"
                      }
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT – OUTPUT */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-sky-500/20 hover:border-sky-500 transition">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Generated Cover Letter
          </h2>

          <textarea
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            placeholder="Your AI-generated cover letter will appear here..."
            className="h-80 w-full p-4 rounded-lg bg-slate-800 text-sky-200 text-sm outline-none resize-none"
          />
        </div>
      </div>

      {/* 🔹 ACTIONS */}
      <div className="mt-16 flex flex-wrap gap-6 justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300
            ${loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-600 hover:scale-105 text-white"
            }
          `}
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>

        <button
          onClick={handleCopy}
          disabled={!generatedText}
          className="px-8 py-3 rounded-lg border border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white transition-all"
        >
          Copy Text
        </button>
      </div>

      {/* 🔹 BENEFITS */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          "AI-tailored for each job",
          "Multiple writing tones",
          "Editable & ready to send",
        ].map((item) => (
          <div
            key={item}
            className="bg-slate-900/60 p-5 rounded-xl border border-sky-500/20 hover:border-sky-500 transition"
          >
            <p className="text-sky-300 text-sm">
              ⭐ {item}
            </p>
          </div>
        ))}
      </div>

    </MainLayout>
  );
}
