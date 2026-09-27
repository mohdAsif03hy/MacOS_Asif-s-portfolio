const navLinks = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

const navIcons = [
  {
    id: 1,
    img: "/icons/wifi.svg",
  },
  {
    id: 2,
    img: "/icons/search.svg",
  },
  {
    id: 3,
    img: "/icons/user.svg",
  },
  {
    id: 4,
    img: "/icons/mode.svg",
  },
];

const dockApps = [
  {
    id: "finder",
    name: "Portfolio",
    icon: "finder.webp",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Articles",
    icon: "safari.webp",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Gallery",
    icon: "photos.webp",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact",
    icon: "contact.webp",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills",
    icon: "terminal.webp",
    canOpen: true,
  },
  {
    id: "github",
    name: "GitHub Live",
    icon: "github.svg",
    canOpen: true,
    targetTab: "github",
  },
  {
    id: "leetcode",
    name: "LeetCode Live",
    icon: "leetcode.svg",
    canOpen: true,
    targetTab: "leetcode",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin.svg",
    canOpen: true,
    externalLink: "https://www.linkedin.com/in/mohd-asif-14a86138b",
  },
  {
    id: "trash",
    name: "Archive & Activity",
    icon: "trash.webp",
    canOpen: true,
  },
];

const blogPosts = [
  {
    id: 1,
    date: "Apr 2026",
    title: "Building EasyTalky: A Real-Time Chat App with MERN & WebRTC",
    image: "/images/blog1.webp",
    link: "https://www.linkedin.com/posts/mohd-asif-14a86138b_mern-reactjs-mongodb-activity-7418373725332545536-3cPu?utm_source=share&utm_medium=member_desktop&rcm=ACoAAGAOfYoBuHZCcZWf31nO2HqjwCYl11dDTV0",
  },
  {
    id: 2,
    date: "Apr 2026",
    title: "Wanderlust: Creating a Full-Stack Travel Listing Platform",
    image: "/images/blog2.webp",
    link: "https://www.linkedin.com/posts/mohd-asif-14a86138b_mern-webdevelopment-fullstack-activity-7395526879677530112-DhwQ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAGAOfYoBuHZCcZWf31nO2HqjwCYl11dDTV0",
  },
  {
    id: 3,
    date: "Mar 2026",
    title: "World Country Info: Exploring Global Data with API Integration",
    image: "/images/blog3.webp",
    link: "https://www.linkedin.com/posts/mohd-asif-14a86138b_react-webdevelopment-frontenddevelopment-activity-7449076022941114368-7LNe?utm_source=share&utm_medium=member_desktop&rcm=ACoAAGAOfYoBuHZCcZWf31nO2HqjwCYl11dDTV0",
  },
];

const techStack = [
  {
    category: "Frontend",
    items: ["React.js","JavaScript"],
  },
  {
    category: "Languages",
    items: ["C", "C++", "JavaScript", "Python"],
  },
  {
    category: "Styling",
    items: ["Tailwind CSS", "Sass", "CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "Hono"],
  },
  {
    category: "Database",
    items: ["MongoDB", "MySQL"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "GitHub"],
  },
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/mohdAsif03hy",
  },
  {
    id: 2,
    text: "instagram",
    icon: "/icons/atom.svg",
    bg: "#4bcb63",
    link: "https://www.instagram.com/asif____013/?hl=en",
  },
  {
    id: 3,
    text: "Twitter/X",
    icon: "/icons/twitter.svg",
    bg: "#ff866b",
    link: "https://x.com/",
  },
  {
    id: 4,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/mohd-asif-14a86138b/",
  },
];

const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Memories",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Places",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "People",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

const gallery = [
  // 📚 Library (Featured Projects & Works)
  {
    id: 1,
    category: "Library",
    title: "EcoWaste Sustainability Platform",
    img: "/images/project-1.webp",
  },
  {
    id: 2,
    category: "Library",
    title: "EasyTalky Real-Time Chat App",
    img: "/images/project-2.webp",
  },
  {
    id: 3,
    category: "Library",
    title: "World Country Info Explorer",
    img: "/images/project-3.webp",
  },
  {
    id: 4,
    category: "Library",
    title: "Interactive UI & Component Library",
    img: "/images/gal1.webp",
  },

  // 💡 Memories (Milestones, Hackathons & Campus Life)
  {
    id: 5,
    category: "Memories",
    title: "Smart India Hackathon 2025 - Team MANUU",
    img: "/images/memory-sih-hackathon.webp",
  },
  {
    id: 6,
    category: "Memories",
    title: "SIH Hackathon Certificate Ceremony",
    img: "/images/memory-sih-certificate.webp",
  },
  {
    id: 7,
    category: "Memories",
    title: "Campus Friends & Batchmates Meetup",
    img: "/images/memory-friends-hall.webp",
  },
  {
    id: 8,
    category: "Memories",
    title: "Dept of CS & IT Campus Portrait",
    img: "/images/memory-campus-portrait.webp",
  },

  // 📍 Places (Workspaces, Setups & Travel)
  {
    id: 9,
    category: "Places",
    title: "Minimalist Dev Desk Setup",
    img: "/images/gal2.webp",
  },
  {
    id: 10,
    category: "Places",
    title: "Tech Hub & Innovation Co-Working",
    img: "/images/gal3.webp",
  },
  {
    id: 11,
    category: "Places",
    title: "Creative Nature Walk & Retreat",
    img: "/images/gal4.webp",
  },
  {
    id: 12,
    category: "Places",
    title: "macOS Workspace Environment",
    img: "/images/wallpaper.webp",
  },

  // 👥 People (Friends, Colleagues & Network)
  {
    id: 13,
    category: "People",
    title: "Mohd Asif",
    role: "Frontend Developer • Portfolio Owner",
    img: "/images/adrian.webp",
    linkedin: "https://www.linkedin.com/in/mohd-asif-14a86138b/",
  },
  {
    id: 14,
    category: "People",
    title: "Okasha Maaz",
    role: "Developer & Tech Peer",
    img: null,
    linkedin: "https://www.linkedin.com/in/okasha-maaz-80778a34b/",
  },
  {
    id: 15,
    category: "People",
    title: "Mohd Sadiq",
    role: "Developer & Tech Peer",
    img: "/images/avatar-sadiq.webp",
    linkedin: "https://www.linkedin.com/in/mohd-sadiq-5a5302256/",
  },
  {
    id: 16,
    category: "People",
    title: "Mohd Zeeshan",
    role: "Developer & Tech Peer",
    img: "/images/avatar-zeeshan.webp",
    linkedin: "https://www.linkedin.com/in/mohd-zeeshan-6937062a7/",
  },
  {
    id: 17,
    category: "People",
    title: "Mohammad Sajid",
    role: "Developer & Tech Peer",
    img: "/images/avatar-sajid.webp",
    linkedin: "https://www.linkedin.com/in/mohammad-sajid-498aa6377/",
  },
  {
    id: 18,
    category: "People",
    title: "Kavish Kamal",
    role: "Developer & Tech Peer",
    img: "/images/avatar-kavish.webp",
    linkedin: "https://www.linkedin.com/in/kavish-kamal-527691398/",
  },
  {
    id: 19,
    category: "People",
    title: "Mohd Arsalanul Huda",
    role: "Developer & Tech Peer",
    img: "/images/avatar-arsalan.webp",
    linkedin: "https://www.linkedin.com/in/mohd-arsalanul-huda-1369413a8/",
  },

  // ⭐ Favorites (Top Highlights & Starred Picks)
  {
    id: 20,
    category: "Favorites",
    title: "EasyTalky Dark Mode UI",
    img: "/images/project-2.webp",
  },
  {
    id: 21,
    category: "Favorites",
    title: "Glassmorphism Portfolio Design",
    img: "/images/gal1.webp",
  },
  {
    id: 22,
    category: "Favorites",
    title: "EcoWaste Clean Dashboard",
    img: "/images/project-1.webp",
  },
  {
    id: 23,
    category: "Favorites",
    title: "Signature Developer Portrait",
    img: "/images/adrian-2.webp",
  },
];


export const ARCHIVE_DATA = {
  github: {
    username: "mohdAsif03hy",
    profileUrl: "https://github.com/mohdAsif03hy?tab=repositories",
    totalContributions: "370+",
    currentStreak: "53 Days",
    longestStreak: "89 Days",
    publicRepos: "15+",
    pullRequests: "35+",
    totalStars: "12+",
    topLanguages: [
      { name: "JavaScript", percent: 45, color: "#f7df1e" },
      { name: "React / Next.js", percent: 30, color: "#61dafb" },
      { name: "CSS / Tailwind", percent: 15, color: "#563d7c" },
      { name: "EJS / HTML", percent: 10, color: "#a91e50" },
    ],
    pinnedRepos: [
      {
        name: "EasyTalk",
        desc: "Real-time chatting and language-exchange MERN application made by Asif.",
        stars: 1,
        forks: 0,
        lang: "JavaScript",
        langColor: "#f7df1e",
        url: "https://github.com/mohdAsif03hy/EasyTalk",
      },
      {
        name: "World-country-info",
        desc: "Responsive web application that lets users explore detailed information about countries worldwide.",
        stars: 2,
        forks: 0,
        lang: "CSS",
        langColor: "#563d7c",
        url: "https://github.com/mohdAsif03hy/World-country-info",
      },
      {
        name: "wanderlust",
        desc: "Full-Stack MERN travel listing and booking platform by Mohd Asif.",
        stars: 2,
        forks: 0,
        lang: "EJS",
        langColor: "#a91e50",
        url: "https://github.com/mohdAsif03hy/wanderlust",
      },
    ],
  },
  leetcode: {
    username: "rk12SuClSa",
    profileUrl: "https://leetcode.com/u/rk12SuClSa/",
    totalSolved: 206,
    totalQuestions: 4046,
    ranking: "834,608",
    acceptanceRate: "74.8%",
    contestRating: "1,620",
    currentStreak: "72 Days",
    longestStreak: "72 Days",
    totalActiveDays: 73,
    totalSubmissions: 278,
    badges: ["50 Days Badge 2026", "C++ Specialist", "Problem Solving"],
    breakdown: {
      easy: { solved: 139, total: 963, color: "#00b8a3" },
      medium: { solved: 65, total: 2111, color: "#ffc01e" },
      hard: { solved: 2, total: 972, color: "#ff375f" },
    },
    submissionCalendar: {
      "1770249600": 2, "1784160000": 9, "1784246400": 4, "1784332800": 2, "1784419200": 3,
      "1784505600": 2, "1784592000": 1, "1784678400": 10, "1784764800": 4, "1784851200": 4,
      "1784937600": 2, "1785024000": 1, "1785110400": 2, "1785196800": 5, "1785283200": 1,
      "1785369600": 2, "1785456000": 1, "1785542400": 1, "1785628800": 3, "1785715200": 2,
      "1785801600": 3, "1785888000": 3, "1785974400": 5, "1786060800": 2, "1786147200": 2,
      "1786233600": 4, "1786320000": 5, "1786406400": 2, "1786492800": 4, "1786579200": 3,
      "1786665600": 4, "1786752000": 3, "1786838400": 4, "1786924800": 4, "1787011200": 4,
      "1787097600": 4, "1787184000": 6, "1787270400": 5, "1787356800": 3, "1787443200": 8,
      "1787529600": 4, "1787616000": 6, "1787702400": 4, "1787788800": 4, "1787875200": 6,
      "1787961600": 3, "1788048000": 5, "1788134400": 2, "1788220800": 3, "1788307200": 5,
      "1788393600": 5, "1788480000": 4, "1788566400": 5, "1788652800": 3, "1788739200": 8,
      "1788825600": 3, "1788912000": 1, "1788998400": 3, "1789084800": 10, "1789171200": 4,
      "1789257600": 6, "1789344000": 5, "1789430400": 4, "1789516800": 4, "1789603200": 4,
      "1789689600": 6, "1789776000": 7, "1789862400": 4, "1789948800": 4, "1790035200": 2,
      "1790121600": 1, "1790208000": 3, "1790294400": 2
    },
    recentSubmissions: [
      { title: "Maximum Product of Three Numbers", diff: "Easy", time: "Just now" },
      { title: "Find Pivot Index", diff: "Easy", time: "Yesterday" },
      { title: "Next Greater Element I", diff: "Easy", time: "2 days ago" },
      { title: "Daily Temperatures", diff: "Medium", time: "3 days ago" },
      { title: "Minimum Depth of Binary Tree", diff: "Easy", time: "4 days ago" },
    ],
  },
  archivedProjects: [
    {
      id: 1,
      name: "Portfolio-v1-Legacy",
      desc: "First iteration of developer portfolio built with plain HTML, CSS, and Vanilla JS.",
      year: "2024",
      status: "Archived",
      tags: ["HTML5", "CSS3", "JavaScript"],
      url: "https://github.com/mohdAsif03hy",
    },
    {
      id: 2,
      name: "Mini-Weather-CLI",
      desc: "Node.js command-line interface tool to fetch live weather forecasts using OpenWeather API.",
      year: "2024",
      status: "Deprecated",
      tags: ["Node.js", "Axios", "Commander"],
      url: "https://github.com/mohdAsif03hy",
    },
    {
      id: 3,
      name: "React-Todo-Firebase",
      desc: "Simple real-time task manager with Firebase authentication and Firestore sync.",
      year: "2025",
      status: "Completed",
      tags: ["React", "Firebase", "Tailwind"],
      url: "https://github.com/mohdAsif03hy",
    },
    {
      id: 4,
      name: "Algorithm-Visualizer-Old",
      desc: "Interactive sorting and pathfinding visualizer built as an early learning project.",
      year: "2025",
      status: "Archived",
      tags: ["Algorithms", "Canvas", "JS"],
      url: "https://github.com/mohdAsif03hy",
    },
  ],
};

export {
  navLinks,
  navIcons,
  dockApps,
  blogPosts,
  techStack,
  socials,
  photosLinks,
  gallery,
};

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [
    // ▶ Project 1
    {
      id: 5,
      name: "EcoWaste System",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-10 left-5", // icon position inside Finder
      windowPosition: "top-[52px] left-6", // desktop position
      children: [
        {
          id: 1,
          name: "ecoWaste.txt",
          icon: "/images/txt.webp",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
   "The EcoWaste Management System is a smart platform designed to promote clean and sustainable waste handling.",
   "Instead of traditional waste systems, it provides an interactive way to manage, track, and reduce waste efficiently.",
   "Think of it like a digital solution for building a cleaner and greener environment.",
   "It's built with modern web technologies, ensuring fast performance, responsive design, and a user-friendly experience.",
 ],
         },
         {
           id: 2,
           name: "ecowaste.com",
           icon: "/images/safari.webp",
           kind: "file",
           fileType: "url",
           href: "https://ecowastecom.netlify.app",
           position: "top-10 right-20",
         },
         {
           id: 4,
           name: "Ecowaste.png",
           icon: "/images/image.webp",
           kind: "file",
           fileType: "img",
           position: "top-52 right-80",
           imageUrl: "/images/project-1.webp",
         },
         {
           id: 5,
           name: "Design.fig",
           icon: "/images/plain.svg",
           kind: "file",
           fileType: "fig",
           href: "https://www.figma.com/design/MlHT4kBMrX21NLzJjlgGdf/Untitled?node-id=7-10&t=6FFaui5dJRB35nPD-0",
           position: "top-50 right-20",
         },
       ],
     },
 
     // ▶ Project 2
     {
       id: 6,
       name: "EasyTalky",
       icon: "/images/folder.webp",
       kind: "folder",
       position: "top-52 right-80",
       windowPosition: "top-[154px] left-6",
       children: [
        {
          id: 1,
          name: "EasyTalky.txt",
          icon: "/images/txt.webp",
          kind: "file",
          fileType: "txt",
          position: "top-5 right-10",
          description: [
  "EasyTalky is a real-time chat application for seamless communication.",
  "It supports one-to-one chat, reactions, notifications, and video calls using WebRTC.",
  "Users can connect with features like online status, emojis, avatars, and a modern dark UI.",
  "It also includes customizable themes for a more personalized experience.",
  "Built with the MERN stack, focusing on authentication, APIs, and real-time systems.",
  "This project strengthened my full-stack development and problem-solving skills.",
],
        },
        {
          id: 2,
          name: "EasyTalky.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://easytalky.onrender.com/",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "Easytalky.png",
          icon: "/images/image.webp",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/project-2.webp",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.svg",
          kind: "file",
          fileType: "fig",
          href: "https://www.figma.com/design/MlHT4kBMrX21NLzJjlgGdf/Untitled?node-id=1-2&t=P8xRiXJF8fM28Krf-1",
          position: "top-60 left-5",
        },
      ],
    },


    // ▶ Project 3
    {
      id: 7,
      name: "CountryInfo",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-10 left-80",
      windowPosition: "top-[256px] left-6",
      children: [
        {
          id: 1,
          name: "Countryinfo.txt",
          icon: "/images/txt.webp",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
  "World Country Info is a responsive web app for exploring global country data.",
  "Users can search countries and view key details like capital, population, and region.",
  "It integrates a REST API to fetch real-time and accurate country information.",
  "Built using HTML, CSS, and JavaScript for a clean and interactive experience.",
  "Focuses on efficient data fetching, DOM manipulation, and responsive UI design.",
  "This project strengthened my frontend skills, API handling, and user experience design.",
],
        },
        {
          id: 2,
          name: "CountryInfo.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://world-country-infor.netlify.app",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "ContryInfo.png",
          icon: "/images/image.webp",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-3.webp",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.svg",
          kind: "file",
          fileType: "fig",
          href: "https://www.figma.com/design/MlHT4kBMrX21NLzJjlgGdf/Untitled?node-id=9-20&t=6FFaui5dJRB35nPD-0",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 4 (Active In-Progress Project)
    {
      id: 8,
      name: "E-Commerce",
      icon: "/images/folder.webp",
      kind: "folder",
      comingSoon: true,
      position: "top-52 left-20",
      windowPosition: "top-[364px] left-6",
      children: [
        {
          id: 1,
          name: "E-Commerce.txt",
          icon: "/images/txt.webp",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
  "SwiftCart - Full Stack Modern E-Commerce Platform (🚧 Active In-Progress Project - Coming Soon).",
  "Features dynamic product catalog with advanced multi-attribute filtering, price ranges, and live search.",
  "Includes persistent interactive cart, wishlist, and secure checkout with Stripe payment integration.",
  "Engineered with JWT user authentication, protected routes, and role-based access for customers and admins.",
  "Comprehensive admin dashboard for real-time inventory tracking, order fulfillment, and analytics.",
  "Tech Stack: React.js, Node.js, Express.js, MongoDB / Mongoose, Tailwind CSS, and Stripe API.",
],
        },
        {
          id: 2,
          name: "eCommerce-Store.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://github.com/mohdAsif03hy",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "eCommerce-Preview.png",
          icon: "/images/image.webp",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-1.webp",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.svg",
          kind: "file",
          fileType: "fig",
          href: "https://www.figma.com/",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 5 (Active In-Progress Project)
    {
      id: 9,
      name: "PromptCraft AI",
      icon: "/images/folder.webp",
      kind: "folder",
      comingSoon: true,
      position: "top-52 right-20",
      windowPosition: "top-[472px] left-6",
      children: [
        {
          id: 1,
          name: "PromptCraft.txt",
          icon: "/images/txt.webp",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
  "PromptCraft AI - Advanced AI Prompt Engineering & Sharing Platform (🚧 Active In-Progress Project - Coming Soon).",
  "Designed for developers, creators, and AI practitioners to discover, optimize, and share high-performing LLM prompts.",
  "Interactive prompt testing sandbox with live AI completion, variable templates (e.g. {{variable}}), and output comparison.",
  "Tag-based classification for GPT-4, Claude, Midjourney, and DALL-E with one-click copy and API export.",
  "Community features including prompt upvoting, forks/remixes, collections, and creator profiles.",
  "Tech Stack: Next.js, React, Node.js, Tailwind CSS, OpenAI API, and MongoDB.",
],
        },
        {
          id: 2,
          name: "PromptCraft.ai",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://github.com/mohdAsif03hy",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "PromptCraft-UI.png",
          icon: "/images/image.webp",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-2.webp",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.svg",
          kind: "file",
          fileType: "fig",
          href: "https://www.figma.com/",
          position: "top-60 right-20",
        },
      ],
    },
  ],
};

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/adrian.webp",
    },
    {
      id: 2,
      name: "casual-me.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-28 right-72",
      imageUrl: "/images/adrian-2.webp",
    },
    {
      id: 3,
      name: "conference-me.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-52 left-80",
      imageUrl: "/images/adrian-3.webp",
    },
    {
      id: 4,
      name: "about-me.txt",
      icon: "/images/txt.webp",
      kind: "file",
      fileType: "txt",
      position: "top-60 left-5",
      subtitle: "Meet the Developer Behind the Code",
      image: "/images/adrian.webp",
      description: [
  "Hey! I’m Asif 👋, a frontend developer who enjoys building modern, interactive apps that feel smooth and intuitive,",
  "I work with JavaScript, React, and Next.js—and I focus on performance, clean UI, and real user experience,",
  "I like solving problems with logic, writing clean code, and creating projects that actually make sense,",
  "Outside coding, you’ll find me learning new tech, improving my skills, or thinking about my next big idea 😅",
],
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.webp",
      kind: "file",
      fileType: "pdf",
    },
  ],
};

const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Trash",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "trash-1.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-10 left-10",
      imageUrl: "/images/trash-1.webp",
    },
    {
      id: 2,
      name: "trash-2.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-40 left-80",
      imageUrl: "/images/trash-2.webp",
    },
  ],
};

export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  trash: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };