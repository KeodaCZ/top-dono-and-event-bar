# Top Donors and Event List

Streaming overlay that displays the top donor and latest stream events using Streamer.bot API.

## Features

- **Top Donor Bar** - Displays the top donor with amount
- **Event List** - Shows latest events (bits, donations, etc.)
- **Two Display Modes**:
  - **Horizontal** - Compact horizontal bar
  - **Vertical** - Vertical version with scrolling event animation
- **Animation** - Events in vertical mode smoothly scroll from right to left
- **Auto-adaptive** - Animation speed and scroll length automatically adjust to the number of events and text length

## Installation

1. Download or clone this repository
2. Start an HTTP server in the project directory (e.g., `python -m http.server` or use Live Server in VS Code)
3. Open `index.html` in a browser or set the URL as OBS overlay

## Configuration

The overlay can be configured using URL parameters:

| Parameter | Description | Default |
|----------|-------------|---------|
| `mode` | Display mode (`horizontal` or `vertical`) | `horizontal` |
| `maxEvents` | Maximum number of events to display | `3` |
| `showTopDonor` | Show top donor bar (`true` or `false`) | `false` |
| `address` | Streamer.bot server address | `127.0.0.1` |
| `port` | Streamer.bot port | `8080` |

### URL Examples

**Horizontal mode with 5 events:**
```
index.html?mode=horizontal&maxEvents=5&showTopDonor=true
```

**Vertical mode:**
```
index.html?mode=vertical
```

**Connect to remote Streamer.bot:**
```
index.html?address=192.168.1.100&port=8080
```

## Streamer.bot Integration

1. Make sure Streamer.bot is running and has WebSocket server enabled
2. Configure relevant events in Streamer.bot (bits, donations, etc.)
3. Events will be automatically received and displayed on the overlay

## OBS Usage Example

1. In OBS, add a new **Browser Source**
2. Paste the path to your `index.html` with desired parameters in the **URL** field
3. Set **Width** and **Height** as needed
4. Click **OK**

## Vertical Mode Animation

In vertical mode, events automatically scroll:
- Text moves from right to left
- Animation speed is calculated based on content length
- If content fits on screen, animation stops
- Smooth infinite loop without jumps

## File Structure

```
top-dono-and-event-list/
├── index.html      # Main HTML file
├── style.css       # Styles and animations
├── script.js       # Logic and Streamer.bot integration
├── README.md       # English documentation
└── README.cs.md    # Czech documentation
```

## Requirements

- Modern web browser
- Running Streamer.bot with WebSocket API
- HTTP server for local development (optional)
