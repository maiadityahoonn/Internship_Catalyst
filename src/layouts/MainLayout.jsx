export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050B14] text-white relative overflow-hidden">
      
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0ea5e933,transparent_60%)]"></div>

      {/* Page Content */}
      <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto">
        {children}
      </div>

    </div>
  );
}
