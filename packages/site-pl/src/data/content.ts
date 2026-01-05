export const content = {
  hero: {
    title: "Web developer",
    intro:
      "<p>Samouk-wszystkoogarniacz, generalista, osoba zaciekawiona.</p><p>Skupiam się na web developmencie, designie we wszystkich smakach i produktywności bez kija w tyłku.</p>",
    profileAlt: "Filip Chrapek",
  },
  services: [
    { title: "Web Dev", description: "Strony internetowe i aplikacje webowe" },
    {
      title: "Design",
      description: "Projektowanie UI/UX i identyfikacja wizualna",
    },
    {
      title: "Konsulting",
      description: "Konsultacje techniczne i przeglądy kodu",
    },
  ],
  about: {
    meta: {
      title: "O mnie",
      description: "Samouczek, generalista, wiecznie ciekawy freelancer",
    },
    title: "O mnie",
    content: `
      <p>Samouczek, generalista, wiecznie ciekawy freelancer.</p>
      <p>Od lat skupiam się na web developmencie, designie we wszystkich smakach i produktywności bez 'guru' bzdur.</p>
      <p>Skontaktuj się ze mną: <a href="mailto:hello@filipchrapek.com" target="_blank">hello@filipchrapek.com</a></p>
    `,
  },
} as const;
