const navLinks = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Projects", link: "/projects" },
  {
    name: "More",
    dropdown: [
      { name: "Skills", link: "/skills" },
      { name: "Links", link: "/links" },
      { name: "Guestbook", link: "/guestbook" },
      { name: "Contact", link: "/contact" },
    ],
  },
];

export default navLinks;