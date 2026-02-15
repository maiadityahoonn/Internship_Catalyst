import MainLayout from "../layouts/MainLayout";

export default function SkillGapAnalyzer() {
  return (
    <MainLayout>

      {/* 🔹 HERO SECTION */}
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-sky-400">
          AI Skill Gap Analyzer
        </h1>

        <p className="mt-3 text-sky-200 max-w-2xl">
          Discover missing skills and get a clear roadmap for your career growth.
        </p>
      </div>

      {/* 🔹 INPUT SECTION */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT – CURRENT SKILLS */}
        <div
          className="bg-slate-900/60 p-6 rounded-xl border border-sky-500/20
                     hover:border-sky-500 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your Current Skills
          </h2>

          <textarea
            rows="6"
            placeholder="Example: HTML, CSS, JavaScript, React"
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700
                       focus:border-sky-500 outline-none text-white"
          />
        </div>

        {/* RIGHT – TARGET ROLE */}
        <div
          className="bg-slate-900/60 p-6 rounded-xl border border-sky-500/20
                     hover:border-sky-500 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Target Role
          </h2>

          <select
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700
                       focus:border-sky-500 outline-none text-white"
          >
            <option>Select a role</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
            <option>Data Analyst</option>
            <option>Software Engineer</option>
          </select>
        </div>
      </div>

      {/* 🔹 ANALYZE BUTTON */}
      <div className="mt-12 text-center">
        <button
          className="px-8 py-3 rounded-lg bg-sky-500 text-white font-semibold
                     hover:bg-sky-600 hover:scale-105 transition-all duration-300"
        >
          Analyze Skill Gap
        </button>
      </div>

      {/* 🔹 RESULT SECTION */}
      <div
        className="mt-20 bg-slate-900/60 p-8 rounded-xl border border-sky-500/20
                   hover:border-sky-500 transition-all"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Skill Gap Analysis Result
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* MATCHED SKILLS */}
          <div
            className="bg-slate-800 p-6 rounded-xl
                       hover:scale-105 transition-all"
          >
            <h3 className="text-sky-400 font-semibold mb-2">
              Matched Skills
            </h3>
            <ul className="text-sky-200 text-sm space-y-1">
              <li>✔ HTML</li>
              <li>✔ CSS</li>
              <li>✔ JavaScript</li>
            </ul>
          </div>

          {/* MISSING SKILLS */}
          <div
            className="bg-slate-800 p-6 rounded-xl
                       hover:scale-105 transition-all"
          >
            <h3 className="text-red-400 font-semibold mb-2">
              Missing Skills
            </h3>
            <ul className="text-sky-200 text-sm space-y-1">
              <li>✖ TypeScript</li>
              <li>✖ Redux</li>
              <li>✖ Testing</li>
            </ul>
          </div>

          {/* RECOMMENDED SKILLS */}
          <div
            className="bg-slate-800 p-6 rounded-xl
                       hover:scale-105 transition-all"
          >
            <h3 className="text-green-400 font-semibold mb-2">
              Recommended to Learn
            </h3>
            <ul className="text-sky-200 text-sm space-y-1">
              <li>✔ Tailwind CSS</li>
              <li>✔ Git & GitHub</li>
              <li>✔ REST APIs</li>
            </ul>
          </div>

        </div>
      </div>

      {/* 🔹 LEARNING ROADMAP */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          "Strengthen core fundamentals",
          "Build real-world projects",
          "Prepare for interviews",
        ].map((step, index) => (
          <div
            key={index}
            className="bg-slate-900/60 p-5 rounded-xl border border-sky-500/20
                       hover:border-sky-500 transition"
          >
            <p className="text-sky-300 text-sm">
              🚀 {step}
            </p>
          </div>
        ))}
      </div>

    </MainLayout>
  );
}


