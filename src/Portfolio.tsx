import React from 'react';
import { ArrowDown, ArrowUpRight, Bot, Code2, Github, Layers3, Sparkles, Terminal } from 'lucide-react';

const projects = [
  {
    number: '01',
    name: 'Explain Simply',
    type: 'AI LEARNING TOOL',
    description: 'An AI-powered explainer designed to make difficult topics easier to understand, with different explanation levels.',
    tags: ['AI', 'React', 'TypeScript'],
    href: '/app',
  },
];

export default function Portfolio() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070910] text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(90,110,150,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(90,110,150,0.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[110px]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#home" className="flex items-center gap-3" aria-label="Back to top">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200"><Sparkles size={19} /></span>
          <span className="text-sm font-semibold tracking-[0.22em]">EXPLAIN SIMPLY<span className="text-cyan-300">.</span></span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
          <a className="transition hover:text-white" href="#about">About</a>
          <a className="transition hover:text-white" href="#projects">Projects</a>
          <a className="transition hover:text-white" href="#demo">Live demo</a>
          <a className="transition hover:text-white" href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium transition hover:border-cyan-200/60 hover:bg-cyan-200/10">Let's connect <ArrowUpRight className="ml-1 inline" size={14} /></a>
      </header>

      <section id="home" className="relative z-10 mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:py-28">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-xs text-cyan-100"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> INDEPENDENT AI BUILDER · LEARNING IN PUBLIC</div>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-slate-500">Ideas into interactive experiences</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-7xl lg:text-8xl">Building what <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-transparent">comes next.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">I explore AI, software, and thoughtful digital experiences by turning ideas into projects you can actually try.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100">Explore projects <ArrowUpRight className="ml-2 inline" size={16} /></a>
            <a href="#demo" className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/50">Try Explain Simply</a>
          </div>
          <a href="#about" className="mt-14 inline-flex items-center gap-2 text-xs tracking-wide text-slate-500 transition hover:text-cyan-200"><ArrowDown size={14} /> SCROLL TO EXPLORE</a>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-cyan-400/15 via-transparent to-violet-500/15 blur-2xl" />
          <div className="relative rounded-[1.6rem] border border-white/10 bg-[#0c111c]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-300/80"/><span className="h-2.5 w-2.5 rounded-full bg-amber-200/80"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80"/></div><span className="font-mono text-[10px] tracking-widest text-slate-500">WORKSPACE / 001</span></div>
            <div className="py-8">
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><Bot size={28}/></div>
              <p className="font-mono text-xs text-cyan-200">CURRENT FOCUS</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">AI that makes ideas clearer.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Building, testing, learning, and improving—one iteration at a time.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4"><Code2 className="mb-3 text-cyan-200" size={19}/><p className="text-sm font-medium">Build</p><p className="mt-1 text-xs text-slate-500">Small steps, real projects</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4"><Layers3 className="mb-3 text-violet-200" size={19}/><p className="text-sm font-medium">Improve</p><p className="mt-1 text-xs text-slate-500">Useful, clear experiences</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"><span className="font-mono text-xs text-slate-500">STATUS</span><span className="text-xs text-emerald-200">● Learning & building</span></div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 border-y border-white/[0.07] bg-white/[0.018]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 md:grid-cols-[.7fr_1.3fr] md:py-24">
          <div><p className="font-mono text-xs tracking-[0.25em] text-cyan-200">01 / ABOUT</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Curiosity is the starting point.</h2></div>
          <div><p className="max-w-3xl text-lg leading-8 text-slate-300">I'm exploring how AI and software can solve everyday problems. This portfolio is a living record of what I'm learning, what I'm building, and how each project gets better over time.</p><p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">I value practical experimentation, clear design, and learning by shipping real things. The projects here represent work in progress—not claims of expertise.</p></div>
        </div>
      </section>

      <section id="projects" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono text-xs tracking-[0.25em] text-cyan-200">02 / SELECTED WORK</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Projects in progress.</h2></div><p className="max-w-sm text-sm leading-6 text-slate-500">A small collection of ideas turned into working experiments.</p></div>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {projects.map((project) => <article key={project.number} className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.015] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 sm:p-8">
            <div className="flex items-center justify-between"><span className="font-mono text-xs text-cyan-200">{project.number} / PROJECT</span><ArrowUpRight className="text-slate-500 transition group-hover:text-cyan-200" size={20}/></div>
            <div className="my-8 grid h-44 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#080c15]"><div className="text-center"><Bot className="mx-auto text-cyan-200" size={42}/><p className="mt-4 font-mono text-xs tracking-[0.25em] text-slate-500">EXPLAIN SIMPLY / AI</p></div></div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-cyan-200">{project.type}</p><h3 className="mt-2 text-2xl font-semibold">{project.name}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{tag}</span>)}</div>
            <a href={project.href} className="mt-7 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">Open app <ArrowUpRight className="ml-2" size={15}/></a>
          </article>)}
          <article className="flex min-h-[22rem] flex-col justify-between rounded-2xl border border-dashed border-white/15 bg-white/[0.015] p-6 sm:p-8"><div><div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-slate-400"><Terminal size={20}/></div><h3 className="mt-6 text-xl font-semibold">More experiments coming</h3><p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">New ideas will appear here as they become real projects. This space will grow with the work.</p></div><span className="font-mono text-xs tracking-widest text-slate-600">NEXT BUILD / TBD</span></article>
        </div>
      </section>

      <section id="demo" className="relative z-10 border-y border-white/[0.07] bg-[#0a0e18]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono text-xs tracking-[0.25em] text-cyan-200">03 / LIVE EXPERIENCE</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Try Explain Simply.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Ask a question and explore an explanation. The app runs inside this page.</p></div><a href="/app" className="text-sm text-cyan-200 transition hover:text-white">Open full app <ArrowUpRight className="ml-1 inline" size={15}/></a></div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#090d16] shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3"><span className="h-2 w-2 rounded-full bg-rose-300/70"/><span className="h-2 w-2 rounded-full bg-amber-200/70"/><span className="h-2 w-2 rounded-full bg-emerald-300/70"/><span className="ml-2 font-mono text-[10px] tracking-widest text-slate-500">EXPLAIN SIMPLY · LIVE APP</span></div>
            <iframe title="Explain Simply live demo" src="/app" className="block h-[760px] w-full border-0 bg-[#090d16] sm:h-[850px]" loading="lazy" />
          </div>
          <p className="mt-3 text-xs text-slate-600">If the embedded app does not load in your browser, use “Open full app” above.</p>
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24">
        <div className="rounded-3xl border border-cyan-200/15 bg-gradient-to-br from-cyan-200/[0.08] via-white/[0.025] to-violet-300/[0.06] p-7 sm:p-12">
          <p className="font-mono text-xs tracking-[0.25em] text-cyan-200">04 / CONTACT</p><h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">Have an idea? Let's make something useful.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">Open to learning, sharing ideas, and exploring meaningful projects together.</p>
          <div className="mt-7 flex flex-wrap gap-3"><a href="mailto:michaelbusiness117@gmail.com" className="rounded-xl border border-cyan-200/30 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-200/10">michaelbusiness117@gmail.com <ArrowUpRight className="ml-2 inline" size={15}/></a><a href="https://github.com/kdrryan/Explain-Simply" target="_blank" rel="noreferrer" className="rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"><Github className="mr-2 inline" size={16}/> View GitHub</a><a href="#home" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold transition hover:border-cyan-200/40">Back to top ↑</a></div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.07] px-5 py-7 text-center text-xs text-slate-600"><span className="font-mono tracking-widest">EXPLAIN SIMPLY</span> <span className="mx-2">/</span> Built with curiosity. Updated as I learn.</footer>
    </main>
  );
}
