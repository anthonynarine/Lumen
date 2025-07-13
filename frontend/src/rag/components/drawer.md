
    Component structure

RagDrawer (Floating Assistant Drawer)
├── Header (Top Bar)
│   ├── "Lumen" Label           ← Assistant name/title
│   └── Close Button (X)        ← Closes the drawer via context
│
├── Message Area (Scrollable Body)
│   ├── MessageList             ← Displays user and AI messages
│   └── bottomRef Anchor        ← Keeps view scrolled to latest message
│
└── Input Area (Bottom Bar)
    └── InputBox                ← Textarea + Send button for user input


TypingMessage
└── <span> (containerRef)
    ├── {text.slice(0, charCount)}         ← progressively reveals typed text
    └── blinking <span> cursor             ← visual typing indicator