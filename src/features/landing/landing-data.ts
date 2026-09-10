import designSectionOne from "@/assets/design-section-one.jpg";
import designSectionTwo from "@/assets/design-section-two.jpg";
import processImage from "@/assets/process-concrete.jpg";
import projectsSectionOne from "@/assets/projects-section-one.jpg";
import projectsSectionThree from "@/assets/projects-section-three.jpg";
import projectsSectionTwo from "@/assets/projects-section-two.jpg";

export const landingAssets = {
  designSectionOne,
  designSectionTwo,
  processImage,
  projectsSectionOne,
  projectsSectionThree,
  projectsSectionTwo,
} as const;

export const navLinks = [
  { label: "Design", href: "#design" },
  { label: "Process", href: "#process" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const studioStats = [
  ["18 yrs", "Studio practice"],
  ["94", "Completed builds"],
  ["11", "Design awards"],
  ["100%", "In-house delivery"],
] as const;

export const transitionPoints = [
  "Drawn survey and concept",
  "Structural and material resolution",
  "Built, finished, handed over",
] as const;

export const processSteps = [
  {
    n: "01",
    title: "Survey & brief",
    copy: "We measure the site, the light and the way you live before a single line is drawn.",
  },
  {
    n: "02",
    title: "Drawing & detail",
    copy: "Hand studies become millimetre-accurate documents, agreed before anything is poured.",
  },
  {
    n: "03",
    title: "Build & finish",
    copy: "One team holds structure, joinery and finish, so the delivered room matches the drawing.",
  },
] as const;

export const projects = [
  {
    name: "Casa Lumen",
    place: "Marbella, Spain",
    scope: "Design-build residence",
    year: "2025",
    image: landingAssets.projectsSectionThree,
    width: 730,
    height: 973,
    alt: "Contemporary white stone-and-timber residence with a landscaped front garden",
  },
  {
    name: "Stone Chapel",
    place: "Kildare, Ireland",
    scope: "Cultural pavilion",
    year: "2024",
    image: landingAssets.projectsSectionOne,
    width: 730,
    height: 973,
    alt: "Green modern residence with a tall arched entrance and warm exterior lighting",
  },
  {
    name: "Villa Terrace",
    place: "Lisbon, Portugal",
    scope: "Renovation & extension",
    year: "2024",
    image: landingAssets.projectsSectionTwo,
    width: 730,
    height: 973,
    alt: "Modern concrete-and-timber villa with a reflecting pool and timber walkway",
  },
] as const;
