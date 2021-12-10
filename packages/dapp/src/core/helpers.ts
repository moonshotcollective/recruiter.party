import CID from "cids";

function capitalize([first, ...rest]: string) {
  return first.toUpperCase() + rest.join("").toLowerCase();
}

function convertToKebabCase(string: string) {
  return string.replace(/\s+/g, "-").toLowerCase();
}

function splitCIDS(cids: string[]) {
  const base16cids = Array(cids.length);
  const firstParts = Array(cids.length);
  const secondParts = Array(cids.length);
  cids.forEach((elem, index) => {
    base16cids[index] = new CID(elem).toV1().toString("base16");
    firstParts[index] = `0x${base16cids[index].slice(1, 9)}`;
    secondParts[index] = `0x${base16cids[index].slice(9)}`;
  });
  return { base16cids, firstParts, secondParts };
}

function getProfiles() {
  return [
    {
      id: 1,
      name: "Huxwell",
      coverSrc:
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      avatarSrc: "https://source.unsplash.com/random",
      isUnlocked: true,
      email: "huxwell@email.com",
      phone: "5555-5555",
      twitter: "@huxwell",
      emoji: "🤓",
      city: "New York",
      country: "USA",
      skills: ["React", "Node", "GraphQL", "Next.js", "Everything"],
      experiences: [{
        title: "Lead Engineer",
        company: "Company 1",
        duration: "1 year 4 mo",
        start: "2020",
        end: "Present",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        title: "Developer",
        company: "Company 2",
        duration: "2 year 3 mo",
        start: "2017",
        end: "2020",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }],
      educations: [{
        title: "Software Engineer",
        school: "School of XYZ",
        duration: "1 year 4 mo",
        start: "2020",
        end: "Present",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        title: "Degree of XYZ",
        school: "School of XYZ",
        duration: "2 year 3 mo",
        start: "2017",
        end: "2020",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }],
      description: "Open Source software engineer",
    },
    {
      id: 2,
      name: "QEDK",
      coverSrc:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      avatarSrc: "https://avatars.githubusercontent.com/u/1272002?v=4",
      isUnlocked: false,
      emoji: "🤓",
      city: "Quadratic Lands",
      country: "CO",
      skills: ["Solidity", "Ethereum", "Node"],
      experiences: [{
        title: "Lead Engineer",
        company: "Company 1",
        duration: "1 year 4 mo",
        start: "2020",
        end: "Present",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        title: "Developer",
        company: "Company 2",
        duration: "2 year 3 mo",
        start: "2017",
        end: "2020",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }],
      educations: [{
        title: "Software Engineer",
        school: "School of XYZ",
        duration: "1 year 4 mo",
        start: "2020",
        end: "Present",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        title: "Degree of XYZ",
        school: "School of XYZ",
        duration: "2 year 3 mo",
        start: "2017",
        end: "2020",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }],
      description: "Anon",
    },
    {
      id: 3,
      name: "Dhaiwat",
      coverSrc:
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      avatarSrc: "https://avatars.githubusercontent.com/u/39617427",
      isUnlocked: false,
      emoji: "🤓",
      city: "Gujarat",
      country: "IN",
      skills: ["React", "Node", "GraphQL", "Next.js"],
      experiences: [{
        title: "Lead Engineer",
        company: "Company 1",
        duration: "1 year 4 mo",
        start: "2020",
        end: "Present",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        title: "Developer",
        company: "Company 2",
        duration: "2 year 3 mo",
        start: "2017",
        end: "2020",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }],
      educations: [{
        title: "Software Engineer",
        school: "School of XYZ",
        duration: "1 year 4 mo",
        start: "2020",
        end: "Present",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      },
      {
        title: "Degree of XYZ",
        school: "School of XYZ",
        duration: "2 year 3 mo",
        start: "2017",
        end: "2020",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }],
      description: "Anon 2",
    },
  ];
}

export { capitalize, convertToKebabCase, splitCIDS, getProfiles };
