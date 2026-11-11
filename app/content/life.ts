import type { Life } from "./schema";

// the "off the clock" section. sizes are the real pixel sizes of the files in public/images
export const life: Life = {
  kicker: "when the laptop's shut",
  intro: "On the bike, on the volleyball court, or with my batch. That's where you'll usually find me.",
  bubble: "Don't ask to borrow it.",
  shots: {
    bike: { src: "/images/life-bike.webp", width: 616, height: 668, alt: "My Honda motorcycle", caption: "" },
    golden: {
      src: "/images/life-golden.webp",
      width: 720,
      height: 900,
      alt: "My motorcycle parked by a lake in golden light, a helmet on the seat",
      caption: "golden hour",
    },
    bridge: {
      src: "/images/life-bridge.webp",
      width: 900,
      height: 600,
      alt: "A rider in a Honda jacket crossing a small bridge between coconut palms",
      caption: "road break",
    },
    volleyball: {
      src: "/images/life-volleyball.webp",
      width: 760,
      height: 950,
      alt: "Vishnu in a red university jersey, number 1, jumping at the net in a volleyball match",
      caption: "mid-jump",
    },
    bouquet: {
      src: "/images/life-bouquet.webp",
      width: 720,
      height: 900,
      alt: "A bouquet of dark red roses with a card that reads Happy Birthday Vishnu",
      caption: "precious",
    },
    batch: {
      src: "/images/life-batch.webp",
      width: 1100,
      height: 619,
      alt: "My batch posing in two rows outside the department building at CUSAT",
      caption: "my batch, CUSAT",
    },
  },
  notes: {
    bike: { title: "My travelling partner", body: "Two wheels, zero stand-ups." },
    volleyball: { title: "University volleyball player", body: "Same rule as shipping code: timing is everything." },
    batch: { title: "Three years, one department", body: "A lot of chai, a lot of group projects." },
    bouquet: { title: "Not on the résumé", body: "Some things don't fit in a portfolio. This one gets a corner anyway." },
  },
};
