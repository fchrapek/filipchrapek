export const content = {
  hero: {
    title: "Web development consultant",
    intro:
      "<p>Self-taught generalist, perpetually curious freelancer.</p><p>For years now, my professional focus is going to web dev, design of all flavors, and productivity without the 'guru' BS.</p>",
    profileAlt: "Filip Chrapek",
  },
  services: [
    { title: "Web Dev", description: "Custom websites and web applications" },
    { title: "Design", description: "UI/UX design and visual identity" },
    {
      title: "Consulting",
      description: "Technical consulting and code reviews",
    },
  ],
  about: {
    meta: {
      title: "About",
      description: "I'm a starter theme for Astro.build",
    },
    title: "About",
    content: `
      <p>Self-taught generalist, perpetually curious freelancer.</p>
      <p>For years now, my professional focus is going to web dev, design of all flavors, and productivity without the 'guru' BS.</p>
      <p>Contact me at <a href="mailto:hello@filipchrapek.com" target="_blank">hello@filipchrapek.com</a></p>
    `,
  },
} as const;
