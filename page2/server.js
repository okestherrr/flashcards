const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// This handles form data and public files
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const flashcards = [
  {
    term: "According to the course overview, which of the following is NOT listed as a main learning objective for successful graduates?",
    definition: "Master advanced C# memory management techniques",
  },
  {
    term: "What specific version of Python is highly recommended for use in this course according to the reading?",
    definition: "The latest version (3.13.x mentioned)",
  },
  {
    term: "What is the fundamental difference between parallelism and concurrency as defined in the text?",
    definition: "Parallelism involves tasks literally executing at the same time, while concurrency involves tasks making progress in overlapping time periods",
  },
  {
    term: "Which concept, parallelism or concurrency, strictly requires multiple processing units (e.g., multiple cores) to be achieved?",
    definition: "Parallelism",
  },
  {
    term: "Applying the same image filter to different blocks of a large image simultaneously is an example of which type of parallelism?",
    definition: "Data Parallelism",
  },
  {
    term: "Which characteristic best describes fine-grained parallelism according to the reading?",
    definition: "Small tasks executing concurrently with frequent communication and synchronization",
  },
];

function buildDeck() {
  return flashcards.map(card => ({
    term: card.term,
    definition: card.definition,
    status: "unseen",
  }));
}
// home
app.get('/', (req, res) => {
  res.render('index', { 
    page: 'home',
    deckSize: flashcards.length,
    currentCard: null,
    cardIndex: null,
    totalCards: null,
    error: null
  });
});

app.get('/study', (req, res) => {
  const deck = buildDeck();
  res.render('index', {
    page: 'study',
    currentCard: deck[0],
    cardIndex: 1,
    totalCards: deck.length,
    deckSize: flashcards.length,
    allCards: deck,
    error: null
  });
});

//startpage
app.post('/study', (req, res) => {
  const deck = buildDeck();
  res.render('index', {
    page: 'study',
    currentCard: deck[0],
    cardIndex: 1,
    totalCards: deck.length,
    deckSize: flashcards.length,
    allCards: deck,
    error: null
  });
});

app.post('/card', (req, res) => {
  const { action, currentIndex } = req.body;
  let deck = buildDeck();
  let index = parseInt(currentIndex) || 0;
  let error = null;

  // This checks if the card number is valid
  if (isNaN(index) || index < 0 || index >= deck.length) {
    error = 'Invalid card index';
    index = 0;
  }

  if (action === 'prev') {
    if (index > 0) {
      index--;
    } else {
      error = 'You are already on the first card';
    }
  } else if (action === 'next') {
    if (index < deck.length - 1) {
      index++;
    } else {
      error = 'You are on the last card';
    }
  }

  res.render('index', {
    page: 'study',
    currentCard: deck[index],
    cardIndex: index + 1,
    totalCards: deck.length,
    deckSize: flashcards.length,
    allCards: deck,
    error: error
  });
});

app.post('/mark-card', (req, res) => {
  const { status, currentIndex } = req.body;
  let deck = buildDeck();
  const index = parseInt(currentIndex) || 0;
  let error = null;

  // This checks if the data is valid
  if (!['known', 'review'].includes(status)) {
    error = 'Invalid status';
  }

  if (isNaN(index) || index < 0 || index >= deck.length) {
    error = 'Invalid card index';
  }

  // This saves the card status
  if (!error && index < deck.length) {
    deck[index].status = status;
  }

  res.render('index', {
    page: 'study',
    currentCard: deck[index],
    cardIndex: index + 1,
    totalCards: deck.length,
    deckSize: flashcards.length,
    allCards: deck,
    error: error
  });
});

app.post('/shuffle', (req, res) => {
  let deck = buildDeck();
  // This mixes up the card order
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  res.render('index', {
    page: 'study',
    currentCard: deck[0],
    cardIndex: 1,
    totalCards: deck.length,
    deckSize: flashcards.length,
    allCards: deck,
    error: null
  });
});

app.post('/reset', (req, res) => {
  const deck = buildDeck();
  res.render('index', {
    page: 'study',
    currentCard: deck[0],
    cardIndex: 1,
    totalCards: deck.length,
    deckSize: flashcards.length,
    allCards: deck,
    error: null
  });
});

// This starts the server
app.listen(PORT, () => {
  console.log(`StudyFlashCards web app running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
