/**
 * AudioMark Test JavaScript
 * Handles all UI interactions and testing functionality
 */

import { AudioMark } from './audio.js';

class AudioMarkTester {
    constructor() {
        this.audioMark = new AudioMark();
        this.currentMusicTrack = null;
        this.loadedFiles = new Set();
        
        this.initializeUI();
        this.bindEvents();
        this.log('AudioMark Tester initialized', 'info');
    }
    
    initializeUI() {
        // Get all UI elements
        this.elements = {
            // Buttons
            initBtn: document.getElementById('initBtn'),
            cleanupBtn: document.getElementById('cleanupBtn'),
            
            // File inputs
            music1: document.getElementById('music1'),
            music2: document.getElementById('music2'),
            sfx1: document.getElementById('sfx1'),
            sfx2: document.getElementById('sfx2'),
            sfx3: document.getElementById('sfx3'),
            
            // Load/Unload buttons
            loadMusic1: document.getElementById('loadMusic1'),
            loadMusic2: document.getElementById('loadMusic2'),
            loadSfx1: document.getElementById('loadSfx1'),
            loadSfx2: document.getElementById('loadSfx2'),
            loadSfx3: document.getElementById('loadSfx3'),
            unloadMusic1: document.getElementById('unloadMusic1'),
            unloadMusic2: document.getElementById('unloadMusic2'),
            unloadSfx1: document.getElementById('unloadSfx1'),
            unloadSfx2: document.getElementById('unloadSfx2'),
            unloadSfx3: document.getElementById('unloadSfx3'),
            
            // Music controls
            playMusic1: document.getElementById('playMusic1'),
            playMusic2: document.getElementById('playMusic2'),
            pauseMusic: document.getElementById('pauseMusic'),
            resumeMusic: document.getElementById('resumeMusic'),
            stopMusic: document.getElementById('stopMusic'),
            transitionTime: document.getElementById('transitionTime'),
            transitionMusic: document.getElementById('transitionMusic'),
            
            // SFX controls
            playSfx1: document.getElementById('playSfx1'),
            playSfx2: document.getElementById('playSfx2'),
            playSfx3: document.getElementById('playSfx3'),
            playAllSfx: document.getElementById('playAllSfx'),
            testLoop: document.getElementById('testLoop'),
            stopAll: document.getElementById('stopAll'),
            
            // Volume controls
            masterVolume: document.getElementById('masterVolume'),
            musicVolume: document.getElementById('musicVolume'),
            sfxVolume: document.getElementById('sfxVolume'),
            masterVolumeValue: document.getElementById('masterVolumeValue'),
            musicVolumeValue: document.getElementById('musicVolumeValue'),
            sfxVolumeValue: document.getElementById('sfxVolumeValue'),
            
            // Status and log
            initStatus: document.getElementById('initStatus'),
            contextStatus: document.getElementById('contextStatus'),
            logContainer: document.getElementById('logContainer'),
            clearLog: document.getElementById('clearLog')
        };
    }
    
    bindEvents() {
        // Initialization
        this.elements.initBtn.addEventListener('click', () => this.initializeAudioMark());
        this.elements.cleanupBtn.addEventListener('click', () => this.cleanup());
        
        // File loading
        this.elements.loadMusic1.addEventListener('click', () => this.loadFile('music1'));
        this.elements.loadMusic2.addEventListener('click', () => this.loadFile('music2'));
        this.elements.loadSfx1.addEventListener('click', () => this.loadFile('sfx1'));
        this.elements.loadSfx2.addEventListener('click', () => this.loadFile('sfx2'));
        this.elements.loadSfx3.addEventListener('click', () => this.loadFile('sfx3'));
        
        // File unloading
        this.elements.unloadMusic1.addEventListener('click', () => this.unloadFile('music1'));
        this.elements.unloadMusic2.addEventListener('click', () => this.unloadFile('music2'));
        this.elements.unloadSfx1.addEventListener('click', () => this.unloadFile('sfx1'));
        this.elements.unloadSfx2.addEventListener('click', () => this.unloadFile('sfx2'));
        this.elements.unloadSfx3.addEventListener('click', () => this.unloadFile('sfx3'));
        
        // Music controls
        this.elements.playMusic1.addEventListener('click', () => this.playMusic('music1'));
        this.elements.playMusic2.addEventListener('click', () => this.playMusic('music2'));
        this.elements.pauseMusic.addEventListener('click', () => this.pauseMusic());
        this.elements.resumeMusic.addEventListener('click', () => this.resumeMusic());
        this.elements.stopMusic.addEventListener('click', () => this.stopMusic());
        this.elements.transitionMusic.addEventListener('click', () => this.transitionMusic());
        
        // SFX controls
        this.elements.playSfx1.addEventListener('click', () => this.playSFX('sfx1'));
        this.elements.playSfx2.addEventListener('click', () => this.playSFX('sfx2'));
        this.elements.playSfx3.addEventListener('click', () => this.playSFX('sfx3'));
        this.elements.playAllSfx.addEventListener('click', () => this.playAllSFX());
        this.elements.testLoop.addEventListener('click', () => this.testLoop());
        this.elements.stopAll.addEventListener('click', () => this.stopAll());
        
        // Volume controls
        this.elements.masterVolume.addEventListener('input', (e) => this.setVolume('master', e.target.value));
        this.elements.musicVolume.addEventListener('input', (e) => this.setVolume('music', e.target.value));
        this.elements.sfxVolume.addEventListener('input', (e) => this.setVolume('sfx', e.target.value));
        
        // Log controls
        this.elements.clearLog.addEventListener('click', () => this.clearLog());
        
        // Update status periodically
        setInterval(() => this.updateStatus(), 1000);
    }
    
    async initializeAudioMark() {
        this.log('Initializing AudioMark...', 'info');
        this.elements.initBtn.disabled = true;
        
        try {
            const success = await this.audioMark.initialize();
            if (success) {
                this.log('AudioMark initialized successfully!', 'success');
                this.enableUI();
            } else {
                this.log('AudioMark initialization failed', 'error');
                this.elements.initBtn.disabled = false;
            }
        } catch (error) {
            this.log(`Initialization error: ${error.message}`, 'error');
            this.elements.initBtn.disabled = false;
        }
        
        this.updateStatus();
    }
    
    enableUI() {
        // Enable file inputs
        Object.keys(this.elements).forEach(key => {
            if (key.includes('music') || key.includes('sfx') || key.includes('Volume') || 
                key.includes('transition') || key === 'cleanupBtn') {
                const element = this.elements[key];
                if (element && element.disabled !== undefined) {
                    element.disabled = false;
                }
            }
        });
    }
    
    disableUI() {
        // Disable all controls except init button
        Object.keys(this.elements).forEach(key => {
            if (key !== 'initBtn' && key !== 'clearLog') {
                const element = this.elements[key];
                if (element && element.disabled !== undefined) {
                    element.disabled = true;
                }
            }
        });
        this.elements.initBtn.disabled = false;
    }
    
    async loadFile(name) {
        const fileInput = this.elements[name];
        const file = fileInput.files[0];
        
        if (!file) {
            this.log(`No file selected for ${name}`, 'warning');
            return;
        }
        
        this.log(`Loading ${name}: ${file.name}...`, 'info');
        
        try {
            const success = await this.audioMark.loadAudio(name, file);
            if (success) {
                this.loadedFiles.add(name);
                this.log(`Successfully loaded ${name}: ${file.name}`, 'success');
                this.updateFileStatus(name, true);
            } else {
                this.log(`Failed to load ${name}`, 'error');
            }
        } catch (error) {
            this.log(`Error loading ${name}: ${error.message}`, 'error');
        }
    }
    
    unloadFile(name) {
        const success = this.audioMark.unloadAudio(name);
        if (success) {
            this.loadedFiles.delete(name);
            this.log(`Unloaded ${name}`, 'info');
            this.updateFileStatus(name, false);
        } else {
            this.log(`Failed to unload ${name} (not loaded)`, 'warning');
        }
    }
    
    updateFileStatus(name, loaded) {
        const loadButton = this.elements[`load${name.charAt(0).toUpperCase() + name.slice(1)}`];
        const unloadButton = this.elements[`unload${name.charAt(0).toUpperCase() + name.slice(1)}`];
        
        if (loadButton && unloadButton) {
            loadButton.style.background = loaded ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
            loadButton.textContent = loaded ? 'Loaded' : 'Load';
        }
    }
    
    playMusic(name) {
        if (!this.loadedFiles.has(name)) {
            this.log(`Cannot play ${name} - not loaded`, 'warning');
            return;
        }
        
        this.log(`Playing music: ${name}`, 'info');
        this.audioMark.playMusic(name, { loop: true });
        this.currentMusicTrack = name;
    }
    
    pauseMusic() {
        const success = this.audioMark.pauseMusic();
        if (success) {
            this.log('Music paused', 'info');
        } else {
            this.log('No music to pause', 'warning');
        }
    }
    
    resumeMusic() {
        const success = this.audioMark.resumeMusic();
        if (success) {
            this.log('Music resumed', 'info');
        } else {
            this.log('No music to resume', 'warning');
        }
    }
    
    stopMusic() {
        this.audioMark.stopMusic();
        this.log('Music stopped', 'info');
        this.currentMusicTrack = null;
    }
    
    async transitionMusic() {
        const transitionTime = parseFloat(this.elements.transitionTime.value);
        const targetTrack = this.currentMusicTrack === 'music1' ? 'music2' : 'music1';
        
        if (!this.loadedFiles.has(targetTrack)) {
            this.log(`Cannot transition to ${targetTrack} - not loaded`, 'warning');
            return;
        }
        
        this.log(`Transitioning to ${targetTrack} over ${transitionTime}s`, 'info');
        const success = await this.audioMark.transitionMusic(targetTrack, transitionTime, { loop: true });
        
        if (success) {
            this.currentMusicTrack = targetTrack;
            this.log(`Transition to ${targetTrack} started`, 'success');
        } else {
            this.log('Transition failed', 'error');
        }
    }
    
    playSFX(name) {
        if (!this.loadedFiles.has(name)) {
            this.log(`Cannot play ${name} - not loaded`, 'warning');
            return;
        }
        
        this.log(`Playing SFX: ${name}`, 'info');
        this.audioMark.playSFX(name);
    }
    
    playAllSFX() {
        let played = 0;
        ['sfx1', 'sfx2', 'sfx3'].forEach(name => {
            if (this.loadedFiles.has(name)) {
                this.audioMark.playSFX(name);
                played++;
            }
        });
        
        if (played > 0) {
            this.log(`Playing ${played} SFX simultaneously`, 'info');
        } else {
            this.log('No SFX loaded to play', 'warning');
        }
    }
    
    testLoop() {
        // Play first available SFX with loop
        const availableSfx = ['sfx1', 'sfx2', 'sfx3'].find(name => this.loadedFiles.has(name));
        
        if (availableSfx) {
            this.log(`Testing loop with ${availableSfx}`, 'info');
            this.audioMark.playSFX(availableSfx, { loop: true });
        } else {
            this.log('No SFX loaded for loop test', 'warning');
        }
    }
    
    stopAll() {
        this.audioMark.stopAll();
        this.log('All audio stopped', 'info');
        this.currentMusicTrack = null;
    }
    
    setVolume(type, value) {
        this.audioMark.setVolume(type, value);
        this.elements[`${type}VolumeValue`].textContent = value;
        this.log(`${type.charAt(0).toUpperCase() + type.slice(1)} volume set to ${value}%`, 'info');
    }
    
    cleanup() {
        this.log('Cleaning up AudioMark...', 'info');
        this.audioMark.cleanup();
        this.loadedFiles.clear();
        this.currentMusicTrack = null;
        this.disableUI();
        this.updateStatus();
        this.log('Cleanup complete', 'success');
        
        // Reset file status indicators
        ['music1', 'music2', 'sfx1', 'sfx2', 'sfx3'].forEach(name => {
            this.updateFileStatus(name, false);
        });
    }
    
    updateStatus() {
        const state = this.audioMark.getState();
        
        this.elements.initStatus.textContent = state.isInitialized ? 'Initialized' : 'Not Initialized';
        this.elements.contextStatus.textContent = state.audioContextState;
        
        // Update button states based on current state
        if (state.isInitialized) {
            this.elements.initBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            this.elements.initBtn.textContent = 'Initialized';
        } else {
            this.elements.initBtn.style.background = 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
            this.elements.initBtn.textContent = 'Initialize AudioMark';
        }
    }
    
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        this.elements.logContainer.appendChild(logEntry);
        this.elements.logContainer.scrollTop = this.elements.logContainer.scrollHeight;
        
        // Limit log entries to prevent memory issues
        const entries = this.elements.logContainer.children;
        if (entries.length > 100) {
            this.elements.logContainer.removeChild(entries[0]);
        }
        
        // Also log to console for debugging
        console.log(`[AudioMark] ${message}`);
    }
    
    clearLog() {
        this.elements.logContainer.innerHTML = '';
        this.log('Log cleared', 'info');
    }
}

// Initialize the tester when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.audioMarkTester = new AudioMarkTester();
});