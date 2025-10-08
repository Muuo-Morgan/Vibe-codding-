/* app.js - shared across pages */

const COURSES = [
  {
    id: 1,
    slug: "data-analysis",
    title: "Introduction to Data Analysis",
    subtitle: "Cleaning, visualization & storytelling",
    lessons: ["Understanding Data", "Data Cleaning", "Exploratory Visualization", "Final Project"]
  },
  {
    id: 2,
    slug: "web-dev",
    title: "Web Development Essentials",
    subtitle: "HTML × CSS × JavaScript fundamentals",
    lessons: ["HTML Basics", "Styling with CSS", "Intro to JS", "Final Mini Project"]
  },
  {
    id: 3,
    slug: "python",
    title: "Python for Beginners",
    subtitle: "Syntax, data types, control flow",
    lessons: ["Python Syntax", "Collections & Types", "Control Flow", "Small Projects"]
  }
];

/* UTILS */
function qs(sel){return document.querySelector(sel)}
function qsa(sel){return Array.from(document.querySelectorAll(sel))}

/* render nav active states */
function markActiveNav(pathname){
  qsa('.nav a').forEach(a=>{
    try{
      const href = new URL(a.href).pathname;
      if(href === pathname) a.classList.add('active');
      else a.classList.remove('active');
    }catch(e){}
  });
}

/* CHATBOT - simulated but pluggable */
const Chatbot = (function(){
  let windowEl, toggleBtn, bodyEl, inputEl, sendBtn;
  function init(){
    windowEl = qs('.chat-window');
    toggleBtn = qs('.chat-toggle');
    bodyEl = qs('.chat-body');
    inputEl = qs('.chat-input input');
    sendBtn = qs('.chat-input button');

    if(!toggleBtn) return;
    toggleBtn.addEventListener('click', ()=>{
      windowEl.style.display = windowEl.style.display === 'flex' ? 'none' : 'flex';
    });
    sendBtn.addEventListener('click', send);
    inputEl.addEventListener('keypress', e=>{ if(e.key==='Enter') send(); });
  }

  function send(){
    const text = inputEl.value.trim();
    if(!text) return;
    append('user', text);
    inputEl.value = '';
    // simulate thinking
    setTimeout(()=> {
      append('bot', generateReply(text));
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }, 550 + Math.random()*450);
  }

  function append(sender, text){
    const d = document.createElement('div');
    d.className = 'msg ' + (sender==='user' ? 'user' : 'bot');
    d.textContent = text;
    bodyEl.appendChild(d);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function generateReply(text){
    const t = text.toLowerCase();
    if(t.includes('hello') || t.includes('hi')) return "Hey! 👋 I'm LearnBot. Ask me to recommend a course or check progress.";
    if(t.includes('recommend')) return "Try 'Web Development Essentials' if you like frontend, or 'Python for Beginners' for general purpose coding.";
    if(t.includes('progress')) return "Progress is stored locally in your browser. Open a course to see details.";
    if(t.includes('python')) return "Python tip: start with variables, loops, and functions. Try small scripts to practice!";
    if(t.includes('joke') || t.includes('funny')) return "Geek joke: Why do programmers prefer dark mode? Because light attracts bugs. 🐛";
    return "Nice question — I'm learning! For deep AI responses you can later connect this widget to a real API.";
  }

  return { init };
})();

/* PROGRESS UTIL */
const Progress = {
  key: id => `learnhub_course_${id}_completed`,
  get(id){ return JSON.parse(localStorage.getItem(this.key(id)) || '[]') },
  toggle(id, lessonIndex){
    const arr = this.get(id);
    const exists = arr.includes(lessonIndex);
    let next = exists ? arr.filter(x=>x!==lessonIndex) : [...arr, lessonIndex];
    localStorage.setItem(this.key(id), JSON.stringify(next));
    return next;
  },
  percent(id, total){
    const got = this.get(id).length || 0;
    return Math.round((got/total)*100);
  }
};

/* Expose as global for pages to use */
window.COURSES = COURSES;
window.Chatbot = Chatbot;
window.Progress = Progress;

/* Initialize when possible */
document.addEventListener('DOMContentLoaded', ()=>{
  try{ Chatbot.init(); }catch(e){}
});
