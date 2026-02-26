# Top Donors and Event List

Streaming overlay that displays the top donor and latest stream events using Streamer.bot API.

## Features

- **Top Donor Bar** - Displays the top donor with amount
- **Event List** - Shows latest events (bits, donations, etc.)
- **Two Display Modes**:
  - **Horizontal** - Compact horizontal bar
  - **Vertical** - Vertical version with scrolling event animation
- **Animation** - Events in vertical mode smoothly scroll from right to left
- **Auto-adaptive** - Animation speed and scroll length automatically adjust to number of events and text length
- **Synchronous Processing** - When events arrive quickly, operations are properly synchronized to prevent desync issues
- **Text Outline** - Optional text outline with configurable color and thickness
- **No Events Mode** - `maxEvents=0` displays no events (empty container)

## Installation

1. Download or clone this repository
2. Start an HTTP server in the project directory (e.g., `python -m http.server` or use Live Server in VS Code)
3. Open `index.html` in a browser or set the URL as OBS overlay

## Configuration

The overlay can be configured using URL parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `mode` | Display mode (`horizontal` or `vertical`) | `horizontal` |
| `maxEvents` | Maximum number of events to display (0 = no events) | `5` |
| `showTopDonor` | Show top donor bar (`true` or `false`) | `false` |
| `address` | Streamer.bot server address | `127.0.0.1` |
| `port` | Streamer.bot port | `8080` |
| `size` | Font size in pixels | `21` |
| `backgroundColor` | Background color in hex format (e.g., #000000 for black) (in URL, # is replaced with %23) | `#000000` |
| `backgroundOpacity` | Background opacity as decimal (0.0 - 1.0) | `0.5` |
| `textColor` | Text color in hex format (e.g., #ffffff for white) (in URL, # is replaced with %23) | `#ffffff` |
| `outlineColor` | Text outline color in hex format (e.g., #000000 for black) (in URL, # is replaced with %23) | `""` (no outline) |
| `outlineThickness` | Text outline thickness in pixels | `2` |
| `kickUsername` | Kick username for WebSocket connection | "" |

### URL Examples

**Horizontal mode with 5 events:**
```
index.html?mode=horizontal&maxEvents=5&showTopDonor=true
```

**Vertical mode:**
```
index.html?mode=vertical
```

**Vertical mode with 3 events and black 2px outline:**
```
index.html?mode=vertical&maxEvents=3&outlineColor=%23000000&outlineThickness=2
```

**Connect to remote Streamer.bot:**
```
index.html?address=192.168.1.100&port=8080
```

**Custom font size and colors:**
```
index.html?mode=vertical&size=24&backgroundColor=%231a1a1a&textColor=%2300ff00
```

**No events (maxEvents=0):**
```
index.html?mode=vertical&maxEvents=0
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

In vertical mode, events smoothly scroll:
- **New event** slides in from top to bottom with fade-in effect
- **Existing events** automatically shift to their new positions (due to flexbox)
- **Last event** smoothly fades out when exceeding maximum count
- **Container** has fixed height calculated based on `maxEvents` (first event 1.5×, others 1.3× font size)
- **Synchronous approach** - when events arrive quickly, animation completion is awaited before next operation
- **Overflow hidden** - text scrolls out of view when event is removed
- **Text outline** - optional outline applied via text-shadow with configurable color and thickness

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
