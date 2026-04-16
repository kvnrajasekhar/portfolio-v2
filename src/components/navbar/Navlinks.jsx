const navLinks = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Projects", link: "/projects" },
  { name: "Experience", link: "/experience" },
  {
    name: "More",
    dropdown: [
      { name: "Skills", link: "/skills" },
      { name: "Links", link: "/links" },
      { name: "Guestbook", link: "/registry" },
      { name: "Resume", link: "/resume" },
      { name: "Contact", link: "/contact" },
    ],
  },
];

export default navLinks;