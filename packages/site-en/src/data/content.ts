export const content = {
  hero: {
    title: "Web development consultant",
    intro:
      "<p>Self-taught generalist, perpetually curious freelancer.</p><p>For years now, my professional focus is going to web dev, design of all flavors, and productivity without the 'guru' BS.</p>",
    profileAlt: "Filip Chrapek",
  },
  services: [
    {
      title: "Web Development",
      description:
        "Custom, modern WordPress sites and web applications. Clean code, fast performance, built to last.",
    },
    {
      title: "UX/UI Design",
      description:
        "User-centered design in Figma, enhanced with AI tools. Modern interfaces that work.",
    },
    {
      title: "Consulting",
      description:
        "Technical guidance, code reviews, and strategy sessions. Book a call to get started.",
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
