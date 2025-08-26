# AudioMark Library Documentation

## Overview

AudioMark is a comprehensive JavaScript audio library built on the Web Audio API, designed specifically for web games and interactive applications. It provides high-level functionality for managing both sound effects (SFX) and background music with advanced features like volume control, crossfading, and seamless audio transitions.

## Features

- **Web Audio API Based**: Modern, low-latency audio processing
- **Dual Audio Types**: Optimized handling for SFX (short, frequent) and Music (long, streaming)
- **Simultaneous Playback**: Play multiple audio sources at the same time
- **Advanced Volume Control**: Separate volume controls for master, music, and SFX
- **Smooth Transitions**: Crossfade between music tracks with customizable timing
- **Audio Context Management**: Automatic handling of suspended audio context (user interaction requirement)
- **Format Support**: MP3 and WAV audio formats
- **Comprehensive Controls**: Play, pause, resume, stop, and loop functionality
- **Fade Effects**: Fade-in and fade-out capabilities
- **Resource Management**: Load, unload, and cleanup audio resources

## Installation

Simply include the AudioMark library in your project:

```html
<script type="module">
import { AudioMark } from './audio.js';
</script>
```

## Quick Start

```javascript
import { AudioMark } from './audio.js';

// Create AudioMark instance
const audioMark = new AudioMark();

// Initialize (must be called after user interaction)
await audioMark.initialize();

// Load audio files
await audioMark.loadAudio('bgmusic', 'path/to/music.mp3');
await audioMark.loadAudio('jump', 'path/to/jump.wav');

// Play background music with loop
audioMark.playMusic('bgmusic', { loop: true });

// Play sound effect
audioMark.playSFX('jump');

// Control volumes (0-100)
audioMark.setVolume('master', 80);
audioMark.setVolume('music', 60);
audioMark.setVolume('sfx', 90);
```

## API Reference

### Constructor

#### `new AudioMark()`

Creates a new AudioMark instance. The instance must be initialized before use.

```javascript
const audioMark = new AudioMark();
```

### Initialization

#### `initialize(): Promise<boolean>`

Initializes the audio context and sets up gain nodes. Must be called after user interaction due to browser security requirements.

**Returns**: Promise that resolves to `true` if successful, `false` if failed.

```javascript
// Call after user interaction (click, keypress, etc.)
const success = await audioMark.initialize();
if (success) {
    console.log('AudioMark ready!');
}
```

### Audio Loading

#### `loadAudio(name, source): Promise<boolean>`

Loads an audio file into memory for later playback.

**Parameters**:
- `name` (string): Unique identifier for the audio
- `source` (string|File): URL string or File object

**Returns**: Promise that resolves to `true` if successful, `false` if failed.

```javascript
// Load from URL
await audioMark.loadAudio('bgmusic', 'assets/background.mp3');

// Load from File object (e.g., file input)
const file = fileInput.files[0];
await audioMark.loadAudio('usermusic', file);
```

#### `unloadAudio(name): boolean`

Removes audio from memory.

**Parameters**:
- `name` (string): Identifier of the audio to unload

**Returns**: `true` if successfully unloaded, `false` if audio was not found.

```javascript
audioMark.unloadAudio('bgmusic');
```

### Sound Effects (SFX)

#### `playSFX(name, options): AudioBufferSourceNode|null`

Plays a sound effect. SFX are optimized for short, frequent playback with low latency.

**Parameters**:
- `name` (string): Identifier of the loaded audio
- `options` (object, optional):
  - `loop` (boolean): Whether to loop the audio (default: false)
  - `volume` (number): Volume multiplier 0.0-1.0 (default: 1.0)
  - `fadeIn` (number): Fade-in duration in seconds (default: 0)

**Returns**: AudioBufferSourceNode if successful, null if failed.

```javascript
// Simple SFX playback
audioMark.playSFX('jump');

// SFX with options
audioMark.playSFX('engine', {
    loop: true,
    volume: 0.7,
    fadeIn: 0.5
});
```

### Music

#### `playMusic(name, options): AudioBufferSourceNode|null`

Plays background music with full control options.

**Parameters**:
- `name` (string): Identifier of the loaded audio
- `options` (object, optional):
  - `loop` (boolean): Whether to loop the audio (default: true)
  - `volume` (number): Volume multiplier 0.0-1.0 (default: 1.0)
  - `fadeIn` (number): Fade-in duration in seconds (default: 0)
  - `stopCurrent` (boolean): Whether to stop current music (default: true)

**Returns**: AudioBufferSourceNode if successful, null if failed.

```javascript
// Play looping background music
audioMark.playMusic('level1theme');

// Play with fade-in
audioMark.playMusic('level2theme', {
    fadeIn: 2.0,
    volume: 0.8
});
```

#### `stopMusic()`

Stops all currently playing music.

```javascript
audioMark.stopMusic();
```

#### `pauseMusic(): boolean`

Pauses the current music track.

**Returns**: `true` if music was paused, `false` if no music was playing.

```javascript
const paused = audioMark.pauseMusic();
```

#### `resumeMusic(): boolean`

Resumes paused music from where it was paused.

**Returns**: `true` if music was resumed, `false` if no music was paused.

```javascript
const resumed = audioMark.resumeMusic();
```

#### `transitionMusic(newTrackName, transitionTime, options): Promise<boolean>`

Smoothly transitions from current music to a new track with crossfading.

**Parameters**:
- `newTrackName` (string): Identifier of the new music track
- `transitionTime` (number): Duration of the transition in seconds (default: 2.0)
- `options` (object, optional): Same options as `playMusic()`

**Returns**: Promise that resolves to `true` if successful.

```javascript
// Smooth 3-second transition to new track
await audioMark.transitionMusic('level2theme', 3.0, {
    loop: true,
    volume: 0.9
});
```

### Volume Control

#### `setVolume(type, volume)`

Sets volume for master, music, or SFX channels.

**Parameters**:
- `type` (string): 'master', 'music', or 'sfx'
- `volume` (number): Volume from 0 (silent) to 100 (full volume)

```javascript
audioMark.setVolume('master', 80);  // 80% master volume
audioMark.setVolume('music', 60);   // 60% music volume
audioMark.setVolume('sfx', 90);     // 90% SFX volume
```

#### `getVolume(type): number`

Gets current volume setting.

**Parameters**:
- `type` (string): 'master', 'music', or 'sfx'

**Returns**: Current volume (0-100).

```javascript
const musicVolume = audioMark.getVolume('music');
```

### Advanced Features

#### `fadeOut(source, duration)`

Fades out a specific audio source.

**Parameters**:
- `source` (AudioBufferSourceNode): The audio source to fade out
- `duration` (number): Fade duration in seconds (default: 1.0)

```javascript
const sfxSource = audioMark.playSFX('explosion');
// Fade out after 2 seconds
setTimeout(() => {
    audioMark.fadeOut(sfxSource, 1.5);
}, 2000);
```

#### `stopAll()`

Stops all currently playing audio (music and SFX).

```javascript
audioMark.stopAll();
```

#### `cleanup()`

Cleans up all resources and closes the audio context. Call this when you're done with AudioMark.

```javascript
audioMark.cleanup();
```

### State Management

#### `getState(): object`

Returns current state information for debugging and monitoring.

**Returns**: Object containing current state information.

```javascript
const state = audioMark.getState();
console.log('Loaded audio:', state.loadedAudio);
console.log('Active sources:', state.activeSources);
console.log('Current music:', state.currentMusic);
```

## Usage Patterns

### Game Scene Management

```javascript
class GameScene {
    async init() {
        this.audioMark = new AudioMark();
        await this.audioMark.initialize();
        
        // Load scene-specific audio
        await this.audioMark.loadAudio('bgmusic', 'assets/level1.mp3');
        await this.audioMark.loadAudio('jump', 'assets/jump.wav');
        await this.audioMark.loadAudio('coin', 'assets/coin.wav');
        
        // Start background music
        this.audioMark.playMusic('bgmusic');
    }
    
    onPlayerJump() {
        this.audioMark.playSFX('jump');
    }
    
    onCoinCollect() {
        this.audioMark.playSFX('coin', { volume: 0.7 });
    }
    
    async switchToLevel2() {
        await this.audioMark.loadAudio('level2music', 'assets/level2.mp3');
        await this.audioMark.transitionMusic('level2music', 2.0);
    }
    
    cleanup() {
        this.audioMark.cleanup();
    }
}
```

### Dynamic Volume Control

```javascript
// Implement dynamic volume based on game state
function updateAudioVolume(gameState) {
    if (gameState.isPaused) {
        audioMark.setVolume('music', 30);  // Lower music when paused
        audioMark.setVolume('sfx', 50);
    } else if (gameState.inCombat) {
        audioMark.setVolume('music', 70);  // Moderate music during combat
        audioMark.setVolume('sfx', 100);   // Full SFX volume
    } else {
        audioMark.setVolume('music', 80);  // Normal music volume
        audioMark.setVolume('sfx', 90);
    }
}
```

### User Settings Integration

```javascript
// Save/load user audio preferences
function saveAudioSettings() {
    const settings = {
        master: audioMark.getVolume('master'),
        music: audioMark.getVolume('music'),
        sfx: audioMark.getVolume('sfx')
    };
    localStorage.setItem('audioSettings', JSON.stringify(settings));
}

function loadAudioSettings() {
    const settings = JSON.parse(localStorage.getItem('audioSettings'));
    if (settings) {
        audioMark.setVolume('master', settings.master);
        audioMark.setVolume('music', settings.music);
        audioMark.setVolume('sfx', settings.sfx);
    }
}
```

## Error Handling

AudioMark uses alert() for error reporting as specified. Common errors include:

- **Initialization before user interaction**: Browser security requires user interaction before audio
- **Loading non-existent files**: Check file paths and CORS settings
- **Playing unloaded audio**: Ensure audio is loaded before playback
- **Audio context issues**: Usually resolved by user interaction

```javascript
// Proper error handling pattern
try {
    await audioMark.initialize();
    const loaded = await audioMark.loadAudio('music', 'path/to/music.mp3');
    if (loaded) {
        audioMark.playMusic('music');
    }
} catch (error) {
    console.error('Audio setup failed:', error);
}
```

## Browser Compatibility

AudioMark requires modern browsers with Web Audio API support:
- Chrome 66+
- Firefox 60+
- Safari 14.1+
- Edge 79+

No fallback is provided as specified in the requirements.

## Performance Tips

1. **Preload audio**: Load frequently used audio during initialization
2. **Unload unused audio**: Free memory by unloading audio no longer needed
3. **Limit simultaneous SFX**: Consider pooling for very frequent SFX
4. **Use appropriate formats**: MP3 for music (smaller), WAV for SFX (faster decoding)
5. **Monitor active sources**: Check `getState()` to monitor resource usage

## License

MIT License - see LICENSE file for details.