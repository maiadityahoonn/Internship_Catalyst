import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

export default function ResumePreview({ template, data }) {
    if (!template) return <div className="text-gray-400 text-center p-10">Select a template to preview</div>;

    // --- HELPER COMPONENTS ---
    const SectionHeader = ({ title, className = "" }) => (
        <h3 className={`font-bold uppercase tracking-wide border-b border-gray-300 mb-2 pb-1 text-base ${className}`}>{title}</h3>
    );

    const DateRange = ({ start, end }) => <span className="text-xs text-gray-500 whitespace-nowrap">{start} - {end}</span>;

    const BulletList = ({ items, renderItem }) => (
        <ul className="list-disc ml-4 space-y-1">
            {items.map((item, i) => <li key={i} className="text-sm">{renderItem(item)}</li>)}
        </ul>
    );

    // --- TEMPLATE 1: Modern Clean (Sidebar) ---
    if (template.name === "Modern Clean") {
        return (
            <div className="w-full h-full bg-white shadow-2xl flex min-h-[1050px] text-slate-800 font-sans border border-slate-200">
                {/* SIDEBAR */}
                <div className="w-80 bg-[#0f172a] text-white p-6 flex flex-col gap-6 flex-shrink-0">
                    <div>
                        <h1 className="text-4xl font-bold uppercase tracking-wider leading-tight text-white">{data.personalInfo?.fullName || "Your Name"}</h1>
                        <p className="text-sky-400 font-medium mt-1 text-base">{data.experience?.[0]?.title || "Professional"}</p>
                    </div>

                    <div className="space-y-4 text-xs text-slate-300">
                        <h3 className="text-white font-bold uppercase border-b border-slate-600 pb-1">Contact</h3>
                        {data.personalInfo?.phone && <div className="flex gap-2 items-center"><FaPhone className="text-sky-500" /> {data.personalInfo.phone}</div>}
                        {data.personalInfo?.email && <div className="flex gap-2 items-center"><FaEnvelope className="text-sky-500" /> {data.personalInfo.email}</div>}
                        {data.personalInfo?.address && <div className="flex gap-2 items-center"><FaMapMarkerAlt className="text-sky-500" /> {data.personalInfo.address}, {data.personalInfo.city}</div>}
                        {data.personalInfo?.linkedin && <div className="flex gap-2 items-center"><FaLinkedin className="text-sky-500" /> {data.personalInfo.linkedin}</div>}
                        {data.personalInfo?.github && <div className="flex gap-2 items-center"><FaGithub className="text-sky-500" /> {data.personalInfo.github}</div>}
                    </div>

                    {data.skills?.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-white font-bold uppercase border-b border-slate-600 pb-1 text-xs">Skills</h3>
                            <div className="flex flex-wrap gap-1">
                                {data.skills.map((s, i) => <span key={i} className="bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-700">{s.name}</span>)}
                            </div>
                        </div>
                    )}

                    {data.software?.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-white font-bold uppercase border-b border-slate-600 pb-1 text-xs">Software</h3>
                            <div className="space-y-1">
                                {data.software.map((s, i) => (
                                    <div key={i} className="text-[10px] flex justify-between"><span>{s.name}</span> <span className="text-slate-500">{s.level}</span></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.languages?.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-white font-bold uppercase border-b border-slate-600 pb-1 text-xs">Languages</h3>
                            <div className="text-[10px] flex gap-2 flex-wrap">
                                {data.languages.map((l, i) => <span key={i}>{l.name}</span>)}
                            </div>
                        </div>
                    )}
                </div>
                {/* MAIN CONTENT */}
                <div className="flex-1 p-8 flex flex-col gap-6 bg-white overflow-hidden">
                    {data.summary && <div className="border-l-4 border-sky-500 pl-4 py-1"><p className="text-base text-slate-600 leading-relaxed italic">{data.summary}</p></div>}

                    {data.experience?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-slate-800 font-bold text-xl uppercase border-b-2 border-slate-100 pb-1">Experience</h3>
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between font-bold text-slate-700 text-base">
                                        <h4>{exp.title}</h4>
                                        <DateRange start={exp.startDate} end={exp.endDate} />
                                    </div>
                                    <p className="text-sky-600 text-sm font-semibold">{exp.company}</p>
                                    <p className="text-sm mt-1 text-slate-600 leading-snug">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.projects?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-slate-800 font-bold text-xl uppercase border-b-2 border-slate-100 pb-1">Projects</h3>
                            {data.projects.map((proj, i) => (
                                <div key={i} className="text-base">
                                    <div className="font-bold flex justify-between"><span>{proj.title}</span> <span className="text-xs text-slate-400 font-normal">{proj.technologies}</span></div>
                                    <p className="text-sm text-slate-600 leading-snug">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.education?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-slate-800 font-bold text-xl uppercase border-b-2 border-slate-100 pb-1">Education</h3>
                            {data.education.map((edu, i) => (
                                <div key={i} className="text-base">
                                    <div className="flex justify-between font-bold text-slate-700">
                                        <h4>{edu.degree}</h4>
                                        <span className="text-sm text-gray-400 font-normal">{edu.year}</span>
                                    </div>
                                    <p className="text-sm italic text-slate-500">{edu.school}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {(data.achievements?.length > 0 || data.extracurriculars?.length > 0 || data.certifications?.length > 0 || data.volunteerWork?.length > 0) && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {data.achievements?.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-base uppercase text-slate-700 border-b border-slate-100 mb-2">Achievements</h3>
                                        <BulletList items={data.achievements} renderItem={(a) => <span className="text-sm">{a.title}</span>} />
                                    </div>
                                )}
                                {data.extracurriculars?.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-base uppercase text-slate-700 border-b border-slate-100 mb-2">Activities</h3>
                                        <BulletList items={data.extracurriculars} renderItem={(e) => <span className="text-sm">{e.title}</span>} />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {data.certifications?.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-base uppercase text-slate-700 border-b border-slate-100 mb-2">Certifications</h3>
                                        <BulletList items={data.certifications} renderItem={(c) => <div className="text-sm leading-tight font-semibold">{c.name} <p className="font-normal text-xs text-slate-500">{c.issuer}</p></div>} />
                                    </div>
                                )}
                                {data.volunteerWork?.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-base uppercase text-slate-700 border-b border-slate-100 mb-2">Volunteer</h3>
                                        <BulletList items={data.volunteerWork} renderItem={(v) => <div className="text-sm leading-tight font-semibold">{v.role} <p className="font-normal text-xs text-slate-500">{v.organization}</p></div>} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- TEMPLATE 2: Academic Focus ---
    if (template.name === "Academic Focus") {
        return (
            <div className="w-full h-full bg-white p-10 text-black font-serif min-h-[1050px] border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                    <div className="max-w-[65%]">
                        <h1 className="text-4xl font-bold uppercase leading-none">{data.personalInfo?.fullName}</h1>
                        <p className="text-lg mt-2 font-bold italic">{data.education?.[0]?.degree || "Candidate"}</p>
                        <p className="text-base">{data.education?.[0]?.school}</p>
                    </div>
                    <div className="text-right text-xs space-y-0.5 leading-tight">
                        <p>{data.personalInfo?.phone}</p>
                        <p>{data.personalInfo?.email}</p>
                        <p>{data.personalInfo?.linkedin}</p>
                        <p>{data.personalInfo?.github}</p>
                        {data.personalInfo?.address && <p>{data.personalInfo.address}</p>}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Summary */}
                    {data.summary && (
                        <section>
                            <SectionHeader title="Profile" />
                            <p className="text-sm leading-relaxed">{data.summary}</p>
                        </section>
                    )}

                    {/* Education */}
                    <section>
                        <SectionHeader title="Education" />
                        {data.education?.map((edu, i) => (
                            <div key={i} className="flex justify-between mb-2 text-sm">
                                <div>
                                    <span className="font-bold">{edu.degree}</span>
                                    <div className="italic">{edu.school}</div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold">{edu.year}</span>
                                    {edu.description && <div className="text-xs text-gray-600">{edu.description}</div>}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Experience */}
                    {data.experience?.length > 0 && (
                        <section>
                            <SectionHeader title="Experience" />
                            {data.experience.map((exp, i) => (
                                <div key={i} className="mb-3 text-sm">
                                    <div className="flex justify-between font-bold">
                                        <span>{exp.title} | {exp.company}</span>
                                        <span>{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="leading-relaxed mt-1">{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects?.length > 0 && (
                        <section>
                            <SectionHeader title="Relevant Projects" />
                            {data.projects.map((proj, i) => (
                                <div key={i} className="mb-3 text-xs">
                                    <div className="flex justify-between font-bold">
                                        <span>{proj.title}</span>
                                        <span className="text-[10px] font-normal italic text-gray-500">{proj.technologies}</span>
                                    </div>
                                    <p className="leading-relaxed">{proj.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Skills & Others */}
                    <div className="grid grid-cols-2 gap-8">
                        <section>
                            <SectionHeader title="Skills" />
                            <div className="text-[11px] leading-relaxed">
                                <p><span className="font-bold uppercase tracking-tighter text-[10px] mr-1">Technical:</span> {data.skills?.map(s => s.name).join(", ")}</p>
                                {data.software?.length > 0 && <p className="mt-1"><span className="font-bold uppercase tracking-tighter text-[10px] mr-1">Software:</span> {data.software.map(s => s.name).join(", ")}</p>}
                                {data.languages?.length > 0 && <p className="mt-1"><span className="font-bold uppercase tracking-tighter text-[10px] mr-1">Languages:</span> {data.languages.map(l => l.name).join(", ")}</p>}
                            </div>
                        </section>

                        {(data.achievements?.length > 0 || data.publications?.length > 0 || data.certifications?.length > 0) && (
                            <section>
                                <SectionHeader title="Achievements & Certifications" />
                                <ul className="list-disc ml-4 text-[10px] space-y-0.5">
                                    {data.achievements?.map((a, i) => <li key={i}>{a.title}</li>)}
                                    {data.publications?.map((p, i) => <li key={i}>Publication: {p.title}</li>)}
                                    {data.certifications?.map((c, i) => <li key={i} className="font-bold">Cert: {c.name} ({c.issuer})</li>)}
                                </ul>
                            </section>
                        )}
                    </div>
                    {data.volunteerWork?.length > 0 && (
                        <section className="mt-4">
                            <SectionHeader title="Volunteer Work" />
                            {data.volunteerWork.map((v, i) => (
                                <div key={i} className="text-[10px] mb-1">
                                    <span className="font-bold">{v.role}</span> at {v.organization} — {v.description}
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        );
    }

    // --- TEMPLATE 3: Corporate Pro ---
    if (template.name === "Corporate Pro") {
        return (
            <div className="w-full h-full bg-white p-12 text-slate-900 font-sans min-h-[1050px] border border-slate-200">
                {/* Header */}
                <div className="text-center mb-10 border-b-4 border-emerald-600 pb-6">
                    <h1 className="text-4xl font-black uppercase text-slate-800 tracking-tighter">{data.personalInfo?.fullName}</h1>
                    <div className="flex justify-center gap-4 text-xs font-bold text-slate-500 uppercase mt-4">
                        {data.personalInfo?.city && <span>{data.personalInfo.city}</span>}
                        {data.personalInfo?.phone && <span>• {data.personalInfo.phone}</span>}
                        {data.personalInfo?.email && <span>• {data.personalInfo.email}</span>}
                    </div>
                    <div className="flex justify-center gap-4 text-xs text-emerald-700 font-black uppercase mt-2">
                        {data.personalInfo?.linkedin && <span className="hover:underline flex items-center gap-1"><FaLinkedin /> LinkedIn</span>}
                        {data.personalInfo?.github && <span className="hover:underline flex items-center gap-1"><FaGithub /> GitHub</span>}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Summary */}
                    {data.summary && (
                        <div>
                            <h3 className="text-base font-black border-l-4 border-emerald-600 pl-2 mb-2 uppercase text-slate-700">Professional Summary</h3>
                            <p className="text-sm leading-relaxed text-slate-600">{data.summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience?.length > 0 && (
                        <div>
                            <h3 className="text-base font-black border-l-4 border-emerald-600 pl-2 mb-3 uppercase text-slate-700">Professional Experience</h3>
                            <div className="space-y-4">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between font-bold text-sm text-slate-800">
                                            <span>{exp.title} | {exp.company}</span>
                                            <span className="text-slate-500">{exp.startDate} – {exp.endDate}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1 leading-snug">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects & Education */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-black border-l-4 border-emerald-600 pl-2 mb-3 uppercase text-slate-700">Education</h3>
                            {data.education?.map((edu, i) => (
                                <div key={i} className="mb-3">
                                    <div className="font-bold text-xs">{edu.school}</div>
                                    <div className="text-[11px] text-slate-700">{edu.degree}</div>
                                    <div className="text-[10px] text-emerald-600 font-bold">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="text-sm font-black border-l-4 border-emerald-600 pl-2 mb-3 uppercase text-slate-700">Skills</h3>
                            <div className="flex flex-wrap gap-1">
                                {data.skills?.map((s, i) => (
                                    <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-700 border border-slate-200 font-bold">{s.name}</span>
                                ))}
                                {data.software?.map((s, i) => (
                                    <span key={i} className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full text-emerald-700 border border-emerald-100 font-bold">{s.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Sections */}
                    {(data.projects?.length > 0 || data.achievements?.length > 0 || data.certifications?.length > 0 || data.volunteerWork?.length > 0) && (
                        <div className="pt-4 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    {data.projects?.length > 0 && (
                                        <div className="text-[11px]">
                                            <h4 className="font-black uppercase mb-2 text-emerald-700 text-[10px]">Projects</h4>
                                            <ul className="space-y-1">
                                                {data.projects.slice(0, 2).map((p, i) => <li key={i}><span className="font-bold">{p.title}:</span> {p.description.substring(0, 80)}...</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {data.certifications?.length > 0 && (
                                        <div className="text-[11px]">
                                            <h4 className="font-black uppercase mb-2 text-emerald-700 text-[10px]">Certifications</h4>
                                            <ul className="space-y-1">
                                                {data.certifications.map((c, i) => <li key={i}><span className="font-bold">{c.name}</span> — {c.issuer}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {data.achievements?.length > 0 && (
                                        <div className="text-[11px]">
                                            <h4 className="font-black uppercase mb-2 text-emerald-700 text-[10px]">Achievements</h4>
                                            <ul className="list-disc ml-4 space-y-1">
                                                {data.achievements.map((a, i) => <li key={i}>{a.title}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {data.volunteerWork?.length > 0 && (
                                        <div className="text-[11px]">
                                            <h4 className="font-black uppercase mb-2 text-emerald-700 text-[10px]">Volunteer Work</h4>
                                            <ul className="space-y-1">
                                                {data.volunteerWork.map((v, i) => <li key={i}><span className="font-bold">{v.role}</span>, {v.organization}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- TEMPLATE 4: Tech Specialist ---
    if (template.name === "Tech Specialist") {
        return (
            <div className="w-full h-full bg-white p-8 font-mono text-[11px] min-h-[1050px] border border-indigo-100">
                {/* Header */}
                <div className="mb-6 bg-slate-900 text-white p-8 rounded-lg flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">&gt; {data.personalInfo?.fullName || "DEV_USER"}</h1>
                        <p className="text-indigo-400 text-sm mt-1">$ {data.experience?.[0]?.title || "Full Stack Developer"}</p>
                    </div>
                    <div className="text-right text-xs text-slate-400 font-bold leading-tight uppercase">
                        <p># {data.personalInfo?.phone}</p>
                        <p>@ {data.personalInfo?.email}</p>
                        <p>L {data.personalInfo?.linkedin}</p>
                        <p>G {data.personalInfo?.github}</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column (Main) */}
                    <div className="col-span-8 space-y-6">
                        <section>
                            <h3 className="bg-indigo-600 text-white px-3 py-1 font-bold mb-3 uppercase w-fit inline-block text-sm">Experience</h3>
                            <div className="space-y-4">
                                {data.experience?.map((exp, i) => (
                                    <div key={i} className="border-l-2 border-slate-100 pl-4">
                                        <div className="flex justify-between font-bold text-sm">
                                            <span>{exp.title}</span>
                                            <span className="text-indigo-600">[{exp.startDate} - {exp.endDate}]</span>
                                        </div>
                                        <div className="text-slate-500 italic mb-1 text-xs">{exp.company}</div>
                                        <p className="text-xs leading-relaxed mb-1">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="bg-indigo-600 text-white px-2 py-0.5 font-bold mb-3 uppercase w-fit inline-block">Projects</h3>
                            <div className="space-y-4">
                                {data.projects?.map((proj, i) => (
                                    <div key={i} className="border-l-2 border-indigo-100 pl-4">
                                        <div className="font-bold flex justify-between">
                                            <span>{proj.title}</span>
                                            <span className="text-[9px] text-slate-400 font-normal opacity-50">{proj.technologies}</span>
                                        </div>
                                        <p className="text-[10px] mt-1 leading-snug">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Side) */}
                    <div className="col-span-4 space-y-6">
                        <section>
                            <h3 className="bg-slate-800 text-white px-2 py-0.5 font-bold mb-2 uppercase text-[10px]">Stack</h3>
                            <div className="flex flex-wrap gap-1">
                                {data.skills?.map((s, i) => <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] border border-slate-200">{s.name}</span>)}
                            </div>
                        </section>

                        <section>
                            <h3 className="bg-slate-800 text-white px-2 py-0.5 font-bold mb-2 uppercase text-[10px]">Tools</h3>
                            <div className="flex flex-wrap gap-1">
                                {data.software?.map((s, i) => <span key={i} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] border border-indigo-100">{s.name}</span>)}
                            </div>
                        </section>

                        <section>
                            <h3 className="bg-slate-800 text-white px-2 py-0.5 font-bold mb-2 uppercase text-[10px]">Education</h3>
                            {data.education?.map((edu, i) => (
                                <div key={i} className="mb-2 text-[10px]">
                                    <div className="font-bold leading-tight">{edu.degree}</div>
                                    <div className="text-slate-500 text-[9px]">{edu.school}</div>
                                    <div className="text-indigo-600 font-bold">{edu.year}</div>
                                </div>
                            ))}
                        </section>

                        {(data.achievements?.length > 0 || data.certifications?.length > 0) && (
                            <section>
                                <h3 className="bg-slate-800 text-white px-2 py-0.5 font-bold mb-2 uppercase text-[10px]">Recognition</h3>
                                <div className="space-y-3">
                                    {data.achievements?.length > 0 && (
                                        <ul className="text-[9px] space-y-1">
                                            {data.achievements.map((a, i) => <li key={i} className="border-b border-slate-100 pb-1 opacity-80">- {a.title}</li>)}
                                        </ul>
                                    )}
                                    {data.certifications?.length > 0 && (
                                        <ul className="text-[9px] space-y-1">
                                            {data.certifications.map((c, i) => <li key={i} className="text-indigo-600 font-bold leading-tight"># {c.name}</li>)}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        )}
                        {data.volunteerWork?.length > 0 && (
                            <section>
                                <h3 className="bg-slate-800 text-white px-2 py-0.5 font-bold mb-2 uppercase text-[10px]">Volunteer</h3>
                                <ul className="text-[9px] space-y-1">
                                    {data.volunteerWork.map((v, i) => <li key={i} className="opacity-80">&gt; {v.role}</li>)}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- TEMPLATE 5: Research CV ---
    if (template.name === "Research CV") {
        return (
            <div className="w-full h-full bg-white p-12 font-serif text-slate-900 border-t-8 border-slate-800 min-h-[1050px] border border-slate-100">
                <div className="text-center mb-10 pb-6 border-b border-slate-200">
                    <h1 className="text-4xl font-bold tracking-[0.2em] uppercase leading-tight">{data.personalInfo?.fullName}</h1>
                    <div className="mt-4 text-xs flex justify-center gap-6 text-slate-500 uppercase font-bold tracking-widest">
                        <span>{data.personalInfo?.phone}</span>
                        <span>{data.personalInfo?.email}</span>
                        {data.personalInfo?.city && <span>{data.personalInfo.city}</span>}
                    </div>
                    <div className="mt-2 text-xs flex justify-center gap-4 text-sky-800 lowercase">
                        <span>{data.personalInfo?.linkedin}</span>
                        <span>{data.personalInfo?.portfolio}</span>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Education - Usually First in Research */}
                    <section>
                        <h3 className="font-bold border-b-2 border-slate-800 mb-3 uppercase text-[12px] tracking-widest italic pb-1">Academic Background</h3>
                        <div className="space-y-3">
                            {data.education?.map((edu, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                    <div className="max-w-[75%]"><span className="font-bold">{edu.school}</span>, {edu.degree}</div>
                                    <div className="italic text-slate-500 font-bold">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Publications */}
                    {data.publications?.length > 0 ? (
                        <section>
                            <h3 className="font-bold border-b-2 border-slate-800 mb-3 uppercase text-[12px] tracking-widest italic pb-1">Selected Publications</h3>
                            {data.publications.map((pub, i) => (
                                <div key={i} className="mb-4 text-xs leading-relaxed">
                                    <div className="font-bold inline">{pub.title}</div>.
                                    {pub.description && <span className="text-slate-600 block mt-1 pb-1 border-b border-slate-50 italic">{pub.description}</span>}
                                </div>
                            ))}
                        </section>
                    ) : null}

                    {/* Experience */}
                    <section>
                        <h3 className="font-bold border-b-2 border-slate-800 mb-3 uppercase text-[12px] tracking-widest italic pb-1">Professional Appointments</h3>
                        <div className="space-y-4">
                            {data.experience?.map((exp, i) => (
                                <div key={i} className="text-xs">
                                    <div className="flex justify-between font-bold">
                                        <span>{exp.title}</span>
                                        <span>{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="text-slate-600 italic mb-1">{exp.company}</div>
                                    <p className="text-slate-700 leading-relaxed text-[11px]">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects / Research Projects */}
                    {data.projects?.length > 0 && (
                        <section>
                            <h3 className="font-bold border-b-2 border-slate-800 mb-3 uppercase text-[12px] tracking-widest italic pb-1">Research Projects</h3>
                            <div className="space-y-3">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="text-xs">
                                        <div className="font-bold">{proj.title} <span className="text-[10px] font-normal text-slate-400">[{proj.technologies}]</span></div>
                                        <p className="text-[11px] leading-relaxed text-slate-600 mt-1">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills Grid for Researcher */}
                    <div className="grid grid-cols-2 gap-10">
                        <section>
                            <h3 className="font-bold border-b-2 border-slate-800 mb-2 uppercase text-[10px] tracking-widest">Skills</h3>
                            <div className="text-[10px] space-y-1">
                                <p><span className="font-bold">Methods:</span> {data.skills?.map(s => s.name).join(", ")}</p>
                                <p><span className="font-bold">Tools:</span> {data.software?.map(s => s.name).join(", ")}</p>
                                <p><span className="font-bold">Tongues:</span> {data.languages?.map(l => l.name).join(", ")}</p>
                            </div>
                        </section>
                        {(data.achievements?.length > 0 || data.certifications?.length > 0) && (
                            <section>
                                <h3 className="font-bold border-b-2 border-slate-800 mb-2 uppercase text-[10px] tracking-widest">Grants & Honors</h3>
                                <ul className="text-[10px] space-y-1">
                                    {data.achievements.map((a, i) => <li key={i} className="leading-tight">• {a.title}</li>)}
                                    {data.certifications.map((c, i) => <li key={i} className="leading-tight font-bold">• CERT: {c.name}</li>)}
                                </ul>
                            </section>
                        )}
                    </div>
                    {data.volunteerWork?.length > 0 && (
                        <section>
                            <h3 className="font-bold border-b-2 border-slate-800 mb-3 uppercase text-[10px] tracking-widest italic">Volunteer & Activities</h3>
                            {data.volunteerWork.map((v, i) => (
                                <div key={i} className="text-[11px] mb-2 leading-relaxed">
                                    <span className="font-bold">{v.role}</span>, {v.organization} — {v.description}
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        );
    }

    // --- TEMPLATE 6: Minimalist Star ---
    if (template.name === "Minimalist Star") {
        return (
            <div className="w-full h-full bg-white p-10 font-sans text-slate-800 min-h-[1050px] border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="border-b-[3px] border-slate-900 pb-2 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{data.personalInfo?.fullName}</h1>
                        <p className="text-base font-bold text-slate-500 mt-1 uppercase tracking-widest">{data.experience?.[0]?.title || "Professional"}</p>
                    </div>
                    <div className="text-right text-xs font-bold uppercase tracking-tight text-slate-600 space-y-0.5">
                        <p>{data.personalInfo?.phone} | {data.personalInfo?.email}</p>
                        <p className="text-slate-400">{data.personalInfo?.linkedin} | {data.personalInfo?.github}</p>
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    {/* Education */}
                    <section>
                        <h3 className="font-black uppercase tracking-[0.2em] mb-3 text-[10px] py-0.5 px-2 bg-slate-900 text-white w-fit">Education</h3>
                        <div className="space-y-2">
                            {data.education?.map((edu, i) => (
                                <div key={i} className="flex justify-between items-baseline text-xs">
                                    <div className="font-bold">{edu.school} <span className="font-normal text-slate-500 mx-2">//</span> <span className="italic">{edu.degree}</span></div>
                                    <span className="font-mono text-[10px] font-bold text-slate-400">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Industrial Exp */}
                    <section>
                        <h3 className="font-black uppercase tracking-[0.2em] mb-3 text-[10px] py-0.5 px-2 bg-slate-900 text-white w-fit">Experience</h3>
                        <div className="space-y-4">
                            {data.experience?.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline text-xs">
                                        <h4 className="font-black uppercase text-slate-700">{exp.company}</h4>
                                        <span className="font-mono text-[10px] text-slate-400">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="text-[11px] font-bold italic text-slate-500 mb-1">{exp.title}</div>
                                    <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-4">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Technical Assets */}
                    <section>
                        <h3 className="font-black uppercase tracking-[0.2em] mb-3 text-[10px] py-0.5 px-2 bg-slate-900 text-white w-fit">Skills</h3>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                            <div className="border border-slate-100 p-2 rounded">
                                <span className="font-black text-[9px] uppercase text-slate-400 block mb-1">Expertise</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.skills?.map((s, i) => <span key={i} className="bg-slate-50 px-1 py-0.5 rounded text-[10px]">{s.name}</span>)}
                                </div>
                            </div>
                            <div className="border border-slate-100 p-2 rounded">
                                <span className="font-black text-[9px] uppercase text-slate-400 block mb-1">Platforms</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.software?.map((s, i) => <span key={i} className="bg-slate-50 px-1 py-0.5 rounded text-[10px]">{s.name}</span>)}
                                </div>
                            </div>
                            <div className="border border-slate-100 p-2 rounded">
                                <span className="font-black text-[9px] uppercase text-slate-400 block mb-1">Languages</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.languages?.map((l, i) => <span key={i} className="bg-slate-50 px-1 py-0.5 rounded text-[10px]">{l.name}</span>)}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Projects */}
                    <section>
                        <h3 className="font-black uppercase tracking-[0.2em] mb-3 text-[10px] py-0.5 px-2 bg-slate-900 text-white w-fit">Projects</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {data.projects?.map((proj, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-lg">
                                    <div className="font-black text-[11px] uppercase text-slate-700 leading-tight">
                                        {proj.title}
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-bold mb-1">{proj.technologies}</div>
                                    <p className="text-[10px] text-slate-600 leading-snug">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Others */}
                    {(data.achievements?.length > 0 || data.extracurriculars?.length > 0 || data.certifications?.length > 0 || data.volunteerWork?.length > 0) && (
                        <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-4 mt-auto">
                            <div className="space-y-4">
                                {data.achievements?.length > 0 && (
                                    <div>
                                        <h4 className="font-black text-[9px] uppercase text-slate-400 mb-1">Achievements</h4>
                                        <ul className="text-[10px] space-y-0.5">
                                            {data.achievements.slice(0, 3).map((a, i) => <li key={i}>• {a.title}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {data.certifications?.length > 0 && (
                                    <div>
                                        <h4 className="font-black text-[9px] uppercase text-slate-400 mb-1">Certifications</h4>
                                        <ul className="text-[10px] space-y-0.5">
                                            {data.certifications.slice(0, 3).map((c, i) => <li key={i}>• {c.name}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                {data.extracurriculars?.length > 0 && (
                                    <div>
                                        <h4 className="font-black text-[9px] uppercase text-slate-400 mb-1">Activities</h4>
                                        <ul className="text-[10px] space-y-0.5">
                                            {data.extracurriculars.slice(0, 3).map((e, i) => <li key={i}>• {e.title}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {data.volunteerWork?.length > 0 && (
                                    <div>
                                        <h4 className="font-black text-[9px] uppercase text-slate-400 mb-1">Volunteer</h4>
                                        <ul className="text-[10px] space-y-0.5">
                                            {data.volunteerWork.slice(0, 3).map((v, i) => <li key={i}>• {v.role}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }



    // Default Fallback
    return <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">Selected Template Configuration Error</div>;
}
