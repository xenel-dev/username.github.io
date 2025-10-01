const projects = [
  {
    title: "Quiz Game",
    description: "An interactive quiz with local storage and JSON-driven questions.",
    image: "./Quiz.png",
    link: "september 11/index.html"
  },
  {
    title: "Shop",
    description: "A modular shop layout with product filtering and pagination.",
    image: "./Shop.png",
    link: "september 18/index.html"
  },
  {
    title: "Leaderboard",
    description: "A dynamic leaderboard with score tracking and JSON integration.",
    image: "./Leaderboard.png",
    link: "september 24/index.html"
  }
];

const grid = document.querySelector(".projects-grid");

projects.forEach(project => {
  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <img src="${project.image}" alt="${project.title} preview" />
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <a href="${project.link}" target="_blank">View Project</a>
  `;
  grid.appendChild(card);
});
