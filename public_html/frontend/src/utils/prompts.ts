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
        tag: "<p>",
        content: "Let's get ready to start your journey through your past."
      },
      {
        tag: "<p>",
        content:
          "I'll be guiding you through remembering eras of your life and asking you to type the name of people you remember."
      }
    ],
    actions: [
      {
        type: "button",
        params: {
          text: "I'm ready",
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
        tag: "<p>",
        content: "Take a deep breath, we're about to start."
      }
    ],
    actions: [
      {
        type: "timeout",
        params: {
          time: "5000",
          onDo: {
            nextPromptId: "familyPersons"
          }
        }
      }
    ]
  },
  familyPersons: {
    text: [
      {
        tag: "<p>",
        content:
          "Think back to your early childhood. Where you were born, and who was there. Can you list people from your family?"
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
            nextPromptId: "schoolName"
          }
        }
      }
    ]
  },
  schoolName: {
    text: [
      {
        tag: "<p>",
        content: "What is the name of a school you went to?"
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
          text: "Done with schools",
          onDo: {
            nextPromptId: "lastOne"
          }
        }
      }
    ]
  },
  schoolPersons: {
    text: [
      {
        tag: "<p>",
        content: "Write down the name of someone you remember from that school"
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addPersonWithCategories",
            categoryNames: ["School", "___localCategory"],
            nextPromptId: "schoolPersons"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Enter another school",
          onDo: {
            nextPromptId: "schoolName"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Done with schools",
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
        tag: "<p>",
        content: "Type someone's name to add them to your collection."
      }
    ],
    actions: [
      {
        type: "input",
        params: {
          onDo: {
            name: "addPersonWithCategories",
            nextPromptId: "addPerson"
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
