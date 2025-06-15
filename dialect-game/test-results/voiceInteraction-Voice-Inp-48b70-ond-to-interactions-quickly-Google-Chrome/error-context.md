# Page snapshot

```yaml
- banner:
  - heading "Dialect Learning Game" [level=1]
  - combobox "Sélectionner un thème":
    - option "Modern" [selected]
    - option "Gaming"
    - option "Academic"
    - option "Playful"
  - button "Activer le mode sombre":
    - img
  - text: "FPS: 60Memory: 7MB"
- region "Game statistics":
  - text: Score 0 Best 0 Level 1
  - progressbar
  - text: Accuracy 0.0% Streak 0
  - status
  - alert
- button "Menu"
- button "End Game"
- img "Game canvas"
- text: Game is currently playing
- status: Game started
- button "Start voice recognition": 🎤
- status: Say the word you hear...
- status: Voice recognition stopped
- status: "Game state: playing"
- status: "Current score: 0"
```