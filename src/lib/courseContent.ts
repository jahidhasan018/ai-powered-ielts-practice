// Mock course content based on the user's focus skills and topics

export interface TaskContent {
  id: string;
  topic: string;
  skill: string;
  title: string;
  lessons: {
    concept: {
      title: string;
      content: string;
    };
    guidedTasks: Array<{
      id: string;
      instruction: string;
      resource: string;
      hint: string;
    }>;
    practiceTasks: Array<{
      id: string;
      type: string;
      question: string;
      options?: string[];
      optionExplanations?: Record<string, string>;
      correctAnswer: string;
    }>;
    review: {
      explanations: string;
    };
  };
}

const skimmingModule: TaskContent = {
  id: 'read_skim_scan_1',
  topic: 'Skimming & Scanning',
  skill: 'reading',
  title: 'Mastering Skimming for Main Ideas',
  lessons: {
    concept: {
      title: 'Understanding Skimming',
      content: 'Skimming means reading very quickly to get the general idea, or "gist," of a passage. You do not read every word. Instead, focus on:\n\n- The title and headings\n- The first and last sentences of paragraphs\n- Keywords and formatted text (bold, italic)\n\nThis technique is crucial for IELTS reading to save time before you plunge into specific questions.'
    },
    guidedTasks: [
      {
        id: 'g1',
        instruction: 'Skim the following text quickly (aim for 30 seconds) and identify the main topic.',
        resource: 'The history of the bicycle dates back to the 19th century. Early models like the penny-farthing were difficult to ride and highly unsafe. It wasn\'t until the development of the "safety bicycle" in the late 1880s, which featured equal-sized wheels and a chain drive, that cycling became widely popular. Today, bicycles are a key component of sustainable urban transport strategies worldwide.',
        hint: 'Look at the first sentence to find the core subject, and the last sentence to see its modern context.'
      }
    ],
    practiceTasks: [
      {
        id: 'p1',
        type: 'mcq',
        question: 'Based on your skimming, what is the primary focus of the text?',
        options: [
          'The dangers of the penny-farthing',
          'A brief history and evolution of the bicycle',
          'Modern urban transport strategies',
          'The invention of the chain drive'
        ],
        correctAnswer: 'A brief history and evolution of the bicycle',
        optionExplanations: {
          'The dangers of the penny-farthing': 'Incorrect. While mentioned, it is only a specific detail about early models, not the main focus.',
          'A brief history and evolution of the bicycle': 'Correct! The text spans from the 19th century to modern times, tracking the bicycle\'s development.',
          'Modern urban transport strategies': 'Incorrect. This relies too much on the final sentence. Skimming requires capturing the overarching theme, not just the conclusion.',
          'The invention of the chain drive': 'Incorrect. The chain drive is merely an example of a development in the 1880s, not the passage\'s main topic.'
        }
      }
    ],
    review: {
      explanations: 'The correct answer is "A brief history and evolution of the bicycle". If you chose "Modern urban transport", you focused too much on the final sentence. If you chose "penny-farthing", you focused too much on a specific detail. Skimming requires capturing the overarching theme.'
    }
  }
};

const essayWritingModule: TaskContent = {
  id: 'write_task2_1',
  topic: 'Task 2: Essay Structure',
  skill: 'writing',
  title: 'Structuring an Argumentative Essay',
  lessons: {
    concept: {
      title: 'The 4-Paragraph Structure',
      content: 'A standard IELTS Task 2 essay should have 4 main paragraphs:\n\n1. **Introduction:** Paraphrase the prompt and state your thesis/opinion.\n2. **Body Paragraph 1:** First main point with explanation and example.\n3. **Body Paragraph 2:** Second main point (or counter-argument) with explanation and example.\n4. **Conclusion:** Summarize the main points and restate your opinion.\n\nKeep it clear. Do not overcomplicate your structure.'
    },
    guidedTasks: [
      {
        id: 'g1',
        instruction: 'Identify the thesis statement in this introduction.',
        resource: 'Some people believe that university education should be free for everyone, while others think that students should pay for their higher education. In my opinion, although free education promotes equality, students should contribute to tuition fees to maintain the quality of educational institutions.',
        hint: 'The thesis statement is usually the last sentence of the introduction where the writer states their clear position.'
      }
    ],
    practiceTasks: [
      {
        id: 'p1',
        type: 'mcq',
        question: 'Which of the following is a strong topic sentence for Body Paragraph 1 (supporting tuition fees)?',
        options: [
          'First of all, universities have a lot of expenses.',
          'One of the primary reasons students should pay fees is that it ensures universities have sufficient funding to hire top-tier professors and maintain modern facilities.',
          'Students studying engineering need better labs than arts students.',
          'To begin with, free education is a good idea but it has problems.'
        ],
        correctAnswer: 'One of the primary reasons students should pay fees is that it ensures universities have sufficient funding to hire top-tier professors and maintain modern facilities.',
        optionExplanations: {
          'First of all, universities have a lot of expenses.': 'Incorrect. Too simple and lacks academic tone. It doesn\'t clearly link to the core argument of quality.',
          'One of the primary reasons students should pay fees is that it ensures universities have sufficient funding to hire top-tier professors and maintain modern facilities.': 'Correct! It is specific, introduces the main point (funding/quality), and is written in an academic tone.',
          'Students studying engineering need better labs than arts students.': 'Incorrect. Too specific for a topic sentence. This sounds more like a supporting example.',
          'To begin with, free education is a good idea but it has problems.': 'Incorrect. Too vague and informal. It does not introduce the specific argument of the paragraph.'
        }
      }
    ],
    review: {
      explanations: 'The correct answer is the second option. It is specific, introduces the main point of the paragraph (funding/quality), and is written in an academic tone. The other options are either too informal or too narrow.'
    }
  }
};

// A fallback module for any other skill
const genericModule = (skill: string): TaskContent => ({
  id: `generic_${skill}`,
  topic: `${skill} Fundamentals`,
  skill: skill.toLowerCase(),
  title: `Core principles of IELTS ${skill}`,
  lessons: {
    concept: {
      title: `Introduction to ${skill}`,
      content: `This module covers the basic strategies required for IELTS ${skill}. Focus on understanding the instructions, managing your time, and identifying keywords.`
    },
    guidedTasks: [
      {
        id: 'g1',
        instruction: 'Review the provided sample material and identify the key instruction words.',
        resource: 'Sample prompt: Discuss the advantages and disadvantages of this approach.',
        hint: 'Look for the verbs that tell you what action to take.'
      }
    ],
    practiceTasks: [
      {
        id: 'p1',
        type: 'mcq',
        question: 'What is the most important first step?',
        options: [
          'Start answering immediately',
          'Read the instructions carefully',
          'Guess the answers quickly',
          'Skip to the end'
        ],
        correctAnswer: 'Read the instructions carefully'
      }
    ],
    review: {
      explanations: 'Always read the instructions carefully before attempting any IELTS question.'
    }
  }
});

export const getCourseContentForTask = (taskType: string): TaskContent => {
  const typeLower = taskType.toLowerCase();
  if (typeLower.includes('read')) return skimmingModule;
  if (typeLower.includes('writ')) return essayWritingModule;
  return genericModule(taskType);
};
