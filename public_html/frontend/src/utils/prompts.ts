export type PromptText = {
  tag: string;
  content: string;
};

export type PromptAction = {
  type: "button" | "input" | "timeout";
  params: any;
};

export type PromptData = {
  text: PromptText[];
  actions: PromptAction[];
};

export const introPrompts: Record<string, PromptData> = {
  intro: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "Welcome to Temps et Liens"
      },
      {
        tag: "<p>",
        content:
          "We're here to take a journey through your past together. I'll be guiding you through remembering eras of your life and asking you to type the name of people you remember."
      },
      {
        tag: "<p>",
        content:
          "Remembering all of what our life has been so far, the good and the bad, can be both fun and hard emotional work. Take your time, take a break when you need it, and come back any time you want to introspect."
      }
    ],
    actions: [
      {
        type: "button",
        params: {
          text: "Let's get started",
          onDo: {
            nextPromptId: "intro2"
          }
        }
      }
    ]
  },
  intro2: {
    text: [
      {
        tag: '<h2 class="text-2xl text-center">',
        content: "Alright. Take a deep breath."
      },
      {
        tag: '<h2 class="text-2xl text-center">',
        content: "I'll get us going."
      }
    ],
    actions: [
      {
        type: "timeout",
        params: {
          time: "5000",
          onDo: {
            nextPromptId: "familyPersonsFirst"
          }
        }
      }
    ]
  },
  familyPersonsFirst: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "Family"
      },
      {
        tag: "<p>",
        content:
          "Think back to your early childhood. Picture where you were born and who was there. Think about what it feels like for you to be with family. The very good and the very bad."
      },
      {
        tag: '<p class="font-bold">',
        content: "Type the name of someone in your family and press Enter."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addPersonWithCategories",
            categoryNames: ["Family"],
            nextPromptId: "familyPersonsNext"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Done with Family",
          onDo: {
            nextPromptId: "schoolIntro"
          }
        }
      }
    ]
  },
  familyPersonsNext: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "Family"
      },
      {
        tag: '<p class="font-bold">',
        content:
          "Keep entering names of people in your family and pressing Enter to submit."
      },
      {
        tag: "<p>",
        content: "Press Done to move to the next category."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addPersonWithCategories",
            categoryNames: ["Family"]
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Done",
          onDo: {
            nextPromptId: "schoolIntro"
          }
        }
      }
    ]
  },
  schoolIntro: {
    text: [
      {
        tag: '<h2 class="text-2xl text-center">',
        content: "Great job."
      },
      {
        tag: '<h2 class="text-2xl text-center">',
        content: "Next, we're going to think about where you went to school."
      }
    ],
    actions: [
      {
        type: "timeout",
        params: {
          time: "4000",
          onDo: {
            nextPromptId: "schoolNameFirst"
          }
        }
      }
    ]
  },
  schoolNameFirst: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "School"
      },
      {
        tag: "<p>",
        content:
          "Think back to the schools you have attended so far. What feelings and memories do these schools bring back for you?"
      },
      {
        tag: '<p class="font-bold">',
        content: "Type the name of a school you went to and press Enter."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addCategoryAndMakeLocalCategory",
            nextPromptId: "schoolPersons"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "I'm done with schools",
          onDo: {
            nextPromptId: "workIntro"
          }
        }
      }
    ]
  },
  schoolNameNext: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "School"
      },
      {
        tag: "<p>",
        content: "What is another school you attended?"
      },
      {
        tag: '<p class="font-bold">',
        content: "Type the name of another school and press Enter."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addCategoryAndMakeLocalCategory",
            nextPromptId: "schoolPersons"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "I'm done with schools",
          onDo: {
            nextPromptId: "workIntro"
          }
        }
      }
    ]
  },
  schoolPersons: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "School"
      },
      {
        tag: "<p>",
        content:
          "Reflect on what that specific school was like for you. Did it feel lonely? Was it the best time of your life?"
      },
      {
        tag: '<p class="font-bold">',
        content:
          "Type the name of someone you associate with that school and press Enter."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addPersonWithCategories",
            categoryNames: ["School", "___localCategory"]
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Enter another school",
          onDo: {
            nextPromptId: "schoolNameNext"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Done with schools",
          onDo: {
            nextPromptId: "workIntro"
          }
        }
      }
    ]
  },
  workIntro: {
    text: [
      {
        tag: '<h2 class="text-2xl text-center">',
        content: "Thank yourself for taking this time"
      },
      {
        tag: '<h2 class="text-2xl text-center">',
        content: "Now, we'll move on to where you worked."
      }
    ],
    actions: [
      {
        type: "timeout",
        params: {
          time: "5000",
          onDo: {
            nextPromptId: "workNameFirst"
          }
        }
      }
    ]
  },
  workNameFirst: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "Work"
      },
      {
        tag: "<p>",
        content:
          "From summer jobs to your career, think back to where your professional life has taken you. The places where you worked, the people you interacted with there..."
      },
      {
        tag: '<p class="font-bold">',
        content:
          "Type a name for the place where you had your first job and press Enter."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addCategoryAndMakeLocalCategory",
            nextPromptId: "workPersons"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "I'm done with work",
          onDo: {
            nextPromptId: "lastOne"
          }
        }
      }
    ]
  },
  workNameNext: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "Work"
      },
      {
        tag: "<p>",
        content: "Where is another place where you worked?"
      },
      {
        tag: '<p class="font-bold">',
        content: "Type the name of another workplace and press Enter."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addCategoryAndMakeLocalCategory",
            nextPromptId: "workPersons"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "I'm done with work",
          onDo: {
            nextPromptId: "lastOne"
          }
        }
      }
    ]
  },
  workPersons: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "Work"
      },
      {
        tag: "<p>",
        content:
          "Reflect on what that specific workplace was like for you. Were you happy with what you were doing? With your colleagues? How did it get you to where you are today?"
      },
      {
        tag: '<p class="font-bold">',
        content:
          "Type the name of someone you associate with that workplace and press Enter."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addPersonWithCategories",
            categoryNames: ["Work", "___localCategory"]
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Enter another workplace",
          onDo: {
            nextPromptId: "workNameNext"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Done with work",
          onDo: {
            nextPromptId: "lastOne"
          }
        }
      }
    ]
  },
  lastOne: {
    text: [
      {
        tag: "<p>",
        content: "Thanks for participating!"
      }
    ],
    actions: [
      {
        type: "button",
        params: {
          text: "Close",
          onDo: {
            nextPromptId: ""
          }
        }
      }
    ]
  }
};

export const addCategoryPrompts: Record<string, PromptData> = {
  addCategory: {
    text: [
      {
        tag: "<p>",
        content: "Type a name for a new category."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addCategoryAndMakeLocalCategory",
            nextPromptId: "categoryPersons"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Close",
          onDo: {
            nextPromptId: ""
          }
        }
      }
    ]
  },
  categoryPersons: {
    text: [
      {
        tag: "<p>",
        content: "Who's someone you associate with that new category?"
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addPersonWithCategories",
            categoryNames: ["___localCategory"],
            nextPromptId: "categoryPersons"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Close",
          onDo: {
            nextPromptId: ""
          }
        }
      }
    ]
  }
};

export const addPersonPrompts: Record<string, PromptData> = {
  addPerson: {
    text: [
      {
        tag: '<h2 class="text-2xl">',
        content: "Make a new person"
      },
      {
        tag: '<p class="font-bold">',
        content:
          "Type the name of someone you associate with that category and press Enter."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addPersonWithCategories",
            nextPromptId: "addPerson",
            categoryNames: ["___localCategory"]
          }
        }
      }
    ]
  }
};
