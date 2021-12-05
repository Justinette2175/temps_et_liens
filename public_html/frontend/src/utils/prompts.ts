export default {
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
            name: "nextPrompt",
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
            name: "nextPrompt",
            nextPromptId: "familyPersons"
          }
        }
      }
    ]
  },
  familyPersons: {
    text: "Think back to your early childhood. Where you were born, and who was there. Can you list people from your family?",
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
            nextPromptId: "school"
          }
        }
      }
    ]
  },
  schoolName: {
    text: "What is the name of a school you went to?",
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
            name: "nextPrompt",
            nextPromptId: "schoolName"
          }
        }
      }
    ]
  },
  schoolPersons: {
    text: "Write down the name of someone you remember from that school",
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
            name: "nextPrompt",
            nextPromptId: "schoolName"
          }
        }
      },
      {
        type: "button",
        params: {
          text: "Done with schools",
          onDo: {
            name: "nextPrompt",
            nextPromptId: "schoolName"
          }
        }
      }
    ]
  },
  lastOne: {
    text: "Thanks for participating!",
    actions: [
      {
        type: "button",
        params: {
          text: "Close",
          onDo: {
            name: "close"
          }
        }
      }
    ]
  }
};
