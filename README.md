Learn-Japanese
================

A tiny, casual app for learning Japanese kana — draw a character and the web app guesses which kana it is. Built with a simple CNN and a Flask frontend for quick practice and testing.

Quick start
-----------

1. Create and activate a virtual environment (optional but recommended):

```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the web app:

```bash
python3 web_app/app.py
```

4. Open your browser at http://127.0.0.1:5000 and try the drawing canvas.


Future Work
-----------
- Add a quiz mode: show romaji (romanized Japanese) and ask the user to draw the matching kana. Include simple scoring and options to switch between hiragana and katakana.

Notes
-----
- Ensure web_app/kana.pth (trained model) and web_app/lookup.pkl (index-to-kana table) exist in the web_app folder before starting the server.
- The drawing input expects a 64x64 grayscale grid.

Enjoy practicing your kanas!

