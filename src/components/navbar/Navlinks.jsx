const navLinks = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Projects", link: "/projects" },
  { name: "Contact", link: "/contact" },
  {
    name: "More",
    dropdown: [
      { name: "Skills", link: "/skills" },
      { name: "Links", link: "/links" },
      { name: "Guestbook", link: "/registry" },
      { name: "Resume", link: "/resume" },
    ],
  },
];

export default navLinks;