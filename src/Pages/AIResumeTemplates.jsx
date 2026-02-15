import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import { FaCheck, FaArrowRight } from "react-icons/fa";

export default function AIResumeTemplates() {
    const templates = [
        {
            id: 1,
            name: "Modern Clean",
            type: "Fresher",
            description: "A balanced layout with a strong sidebar for skills.",
            preview: (
                <div className="w-full h-full bg-white flex text-[4px] leading-tight overflow-hidden select-none pointer-events-none">
                    <div className="w-1/3 bg-slate-800 text-white p-2 flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-600 mb-2"></div>
                        <div className="space-y-1 opacity-70">
                            <div className="h-1 w-full bg-slate-600 rounded"></div>
                            <div className="h-1 w-4/5 bg-slate-600 rounded"></div>
                            <div className="h-1 w-2/3 bg-slate-600 rounded"></div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="h-1.5 w-1/2 bg-sky-400 rounded mb-1"></div>
                            <div className="h-0.5 w-full bg-slate-600 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-600 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-600 rounded"></div>
                        </div>
                    </div>
                    <div className="w-2/3 p-3 flex flex-col gap-2">
                        <div className="space-y-1 mb-2">
                            <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
                            <div className="h-1.5 w-1/2 bg-sky-500 rounded"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-1.5 w-1/4 bg-slate-300 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                            <div className="h-0.5 w-5/6 bg-slate-200 rounded"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-1.5 w-1/4 bg-slate-300 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            name: "Professional",
            type: "Experienced",
            description: "Classic, top-down structure favored by large corporations.",
            preview: (
                <div className="w-full h-full bg-white p-3 text-[4px] leading-tight overflow-hidden select-none pointer-events-none flex flex-col gap-2">
                    <div className="text-center space-y-1 border-b border-gray-200 pb-2">
                        <div className="h-3 w-1/2 bg-slate-800 mx-auto rounded"></div>
                        <div className="h-1 w-1/3 bg-slate-500 mx-auto rounded"></div>
                    </div>
                    <div className="space-y-1">
                        <div className="h-1.5 w-1/6 bg-slate-700 rounded mb-1"></div>
                        <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                        <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                    </div>
                    <div className="space-y-1">
                        <div className="h-1.5 w-1/4 bg-slate-700 rounded mb-1"></div>
                        <div className="flex gap-2">
                            <div className="w-1 bg-slate-200"></div>
                            <div className="flex-1 space-y-1">
                                <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                                <div className="h-0.5 w-5/6 bg-slate-200 rounded"></div>
                                <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="h-1.5 w-1/5 bg-slate-700 rounded mb-1"></div>
                        <div className="grid grid-cols-3 gap-1">
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            name: "Creative",
            type: "Designer",
            description: "Bold colors and unique layout for creative roles.",
            preview: (
                <div className="w-full h-full bg-slate-50 flex flex-col text-[4px] overflow-hidden select-none pointer-events-none">
                    <div className="h-1/4 bg-purple-600 p-3 text-white flex items-end">
                        <div className="space-y-1 w-full">
                            <div className="h-4 w-1/2 bg-white/20 rounded"></div>
                            <div className="h-1 w-1/3 bg-white/40 rounded"></div>
                        </div>
                    </div>
                    <div className="flex-1 flex p-2 gap-2">
                        <div className="w-2/3 space-y-2">
                            <div className="space-y-1">
                                <div className="h-1 w-1/4 bg-purple-600 rounded"></div>
                                <div className="h-0.5 w-full bg-slate-300 rounded"></div>
                                <div className="h-0.5 w-full bg-slate-300 rounded"></div>
                            </div>
                            <div className="space-y-1">
                                <div className="h-1 w-1/3 bg-purple-600 rounded"></div>
                                <div className="h-0.5 w-full bg-slate-300 rounded"></div>
                                <div className="h-0.5 w-5/6 bg-slate-300 rounded"></div>
                            </div>
                        </div>
                        <div className="w-1/3 space-y-2">
                            <div className="bg-purple-50 p-1 rounded space-y-1">
                                <div className="h-1 w-1/2 bg-purple-400 rounded"></div>
                                <div className="h-0.5 w-full bg-purple-200 rounded"></div>
                                <div className="h-0.5 w-full bg-purple-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            name: "Classic Silver",
            type: "Executive",
            description: "Elegant, high-contrast design with distinctive typography.",
            preview: (
                <div className="w-full h-full bg-white p-3 text-[4px] leading-tight overflow-hidden select-none pointer-events-none flex flex-col gap-3 font-serif">
                    <div className="text-center space-y-1">
                        <div className="h-4 w-2/3 bg-slate-900 mx-auto rounded-sm"></div>
                        <div className="flex justify-center gap-1 opacity-60">
                            <div className="h-0.5 w-8 bg-slate-600"></div>
                            <div className="h-0.5 w-8 bg-slate-600"></div>
                            <div className="h-0.5 w-8 bg-slate-600"></div>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-1">
                        <div className="w-2/3 space-y-3">
                            <div className="space-y-1">
                                <div className="h-0.5 w-full bg-slate-300 mb-1"></div>
                                <div className="h-2 w-1/3 bg-slate-800 italic"></div>
                                <div className="h-0.5 w-full bg-slate-400"></div>
                                <div className="space-y-1 pt-1">
                                    <div className="h-0.5 w-full bg-slate-200"></div>
                                    <div className="h-0.5 w-full bg-slate-200"></div>
                                    <div className="h-0.5 w-5/6 bg-slate-200"></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="h-0.5 w-full bg-slate-300 mb-1"></div>
                                <div className="h-2 w-1/4 bg-slate-800 italic"></div>
                                <div className="h-0.5 w-full bg-slate-400"></div>
                                <div className="space-y-1 pt-1">
                                    <div className="h-0.5 w-full bg-slate-200"></div>
                                    <div className="h-0.5 w-full bg-slate-200"></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 space-y-3 pt-4">
                            <div className="space-y-1 text-right">
                                <div className="h-1.5 w-1/2 bg-slate-700 ml-auto italic"></div>
                                <div className="h-0.5 w-full bg-slate-200"></div>
                                <div className="h-0.5 w-3/4 bg-slate-200 ml-auto"></div>
                                <div className="h-0.5 w-full bg-slate-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            name: "Minimalist",
            type: "Developer",
            description: "No-nonsense, content-first layout perfect for technical roles.",
            preview: (
                <div className="w-full h-full bg-white p-4 text-[4px] leading-tight overflow-hidden select-none pointer-events-none font-mono">
                    <div className="border-b-2 border-slate-900 pb-2 mb-3">
                        <div className="h-5 w-1/2 bg-slate-900 mb-2"></div>
                        <div className="h-1.5 w-3/4 bg-slate-500"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                            <div className="h-1.5 w-1/6 bg-slate-900 uppercase"></div>
                            <div className="h-0.5 w-full bg-slate-200"></div>
                            <div className="h-0.5 w-full bg-slate-200"></div>
                            <div className="h-0.5 w-3/4 bg-slate-200"></div>
                        </div>
                        <div className="space-y-1">
                            <div className="h-1.5 w-1/6 bg-slate-900 uppercase"></div>
                            <div className="h-0.5 w-full bg-slate-200"></div>
                            <div className="h-0.5 w-full bg-slate-200"></div>
                        </div>
                        <div className="space-y-1">
                            <div className="h-1.5 w-1/6 bg-slate-900 uppercase"></div>
                            <div className="grid grid-cols-4 gap-1">
                                <div className="h-1 bg-slate-100 border border-slate-300"></div>
                                <div className="h-1 bg-slate-100 border border-slate-300"></div>
                                <div className="h-1 bg-slate-100 border border-slate-300"></div>
                                <div className="h-1 bg-slate-100 border border-slate-300"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 6,
            name: "Tech Focused",
            type: "Engineer",
            description: "Modern grid layout highlighting skills and projects.",
            preview: (
                <div className="w-full h-full bg-slate-50 p-2 text-[4px] leading-tight overflow-hidden select-none pointer-events-none flex gap-2">
                    <div className="w-1/4 bg-indigo-900 rounded-lg p-2 text-white/80 space-y-3">
                        <div className="h-6 w-full bg-indigo-700/50 rounded-md"></div>
                        <div className="space-y-1">
                            <div className="h-1 w-1/2 bg-indigo-400 rounded"></div>
                            <div className="h-0.5 w-full bg-indigo-300/20 rounded"></div>
                            <div className="h-0.5 w-full bg-indigo-300/20 rounded"></div>
                        </div>
                        <div className="space-y-1">
                            <div className="h-1 w-1/2 bg-indigo-400 rounded"></div>
                            <div className="h-0.5 w-full bg-indigo-300/20 rounded"></div>
                            <div className="h-0.5 w-full bg-indigo-300/20 rounded"></div>
                        </div>
                    </div>
                    <div className="w-3/4 space-y-2 py-1">
                        <div className="h-6 w-2/3 bg-slate-800 rounded-md mb-3"></div>
                        <div className="space-y-1 bg-white p-2 rounded-md shadow-sm">
                            <div className="h-1.5 w-1/4 bg-indigo-600 rounded mb-1"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                        </div>
                        <div className="space-y-1 bg-white p-2 rounded-md shadow-sm">
                            <div className="h-1.5 w-1/4 bg-indigo-600 rounded mb-1"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                            <div className="h-0.5 w-full bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            )
        },
    ];

    return (
        <MainLayout>
            <div className="animate-fade-in space-y-20 pb-20">

                {/* Header Section */}
                <div className="text-center pt-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 mb-6 drop-shadow-sm">
                        Professional Resume Templates
                    </h1>
                    <p className="text-sky-200 text-xl max-w-3xl mx-auto leading-relaxed mb-12">
                        Choose from our collection of ATS-friendly, professionally designed templates to stand out from the crowd.
                    </p>
                </div>

                {/* Template Gallery */}
                <div className="max-w-7xl mx-auto px-4">

                    {/* Filters */}
                    <div className="mb-12 flex justify-center flex-wrap gap-4">
                        {["All", "Fresher", "Experienced", "Developer", "Management"].map((filter) => (
                            <button
                                key={filter}
                                className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium ${filter === "All"
                                    ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/25"
                                    : "border-sky-500/30 text-sky-400 hover:bg-sky-500/10 hover:border-sky-500 hover:text-white"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="group relative bg-slate-900/40 backdrop-blur-sm border border-sky-500/20 rounded-2xl p-4 hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Preview Placeholder */}
                                <div className="h-96 rounded-xl flex items-center justify-center mb-5 bg-white overflow-hidden shadow-inner relative group-hover:shadow-lg transition-all">
                                    {template.preview}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-10">
                                        <Link
                                            to="/ai-cv-builder"
                                            className="px-8 py-3 bg-sky-500 text-white font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-sky-400 shadow-lg hover:shadow-sky-500/50 flex items-center gap-2"
                                        >
                                            Use This Template <FaArrowRight />
                                        </Link>
                                        <button className="text-sky-300 hover:text-white text-sm mt-2 underline decoration-sky-500/50 hover:decoration-sky-500 underline-offset-4">
                                            Preview Full Size
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end px-3 pb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">{template.name}</h3>
                                        <p className="text-sm text-sky-300/80 font-medium badge bg-sky-500/10 px-2 py-1 rounded w-fit border border-sky-500/10">{template.type}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center text-white mb-10">Why Choose Our Templates?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                        {[
                            {
                                title: "ATS Optimized",
                                desc: "Designed to pass applicant tracking systems easily and get your resume in front of recruiters.",
                                icon: "🎯"
                            },
                            {
                                title: "Recruiter Approved",
                                desc: "Clean, professional layouts preferred by hiring managers across top industries.",
                                icon: "tik"
                            },
                            {
                                title: "Easy Customization",
                                desc: "Edit and update your resume in minutes with our intuitive AI-powered builder.",
                                icon: "✏️"
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="bg-slate-900/60 p-8 rounded-2xl border border-sky-500/20 hover:border-sky-500 transition-all duration-300 text-center group hover:bg-slate-800/80 hover:shadow-xl hover:shadow-sky-500/10"
                            >
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{item.icon === "tik" ? <FaCheck className="inline text-sky-400" /> : item.icon}</div>
                                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-sky-200 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
