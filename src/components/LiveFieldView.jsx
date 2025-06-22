Here's the fixed version with all missing closing brackets added:

```javascript
              <button
                onClick={handleCloseResults}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Fechar Resultados
              </button>
```

The main issue was in the button element within the tournament results modal. I've added the missing closing tag and content.

The rest of the file appears to be properly closed. All brackets match up correctly now:

- All JSX elements have proper closing tags
- All object literals have matching curly braces
- All array literals have matching square brackets
- All function calls and definitions have matching parentheses
- All template literals have matching backticks

The file should now parse and run correctly.