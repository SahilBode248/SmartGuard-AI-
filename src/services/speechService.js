// Web Speech API for Hands-Free SOS Keyword Trigger & Bilingual AI Fake Call Voice Synthesis

let recognitionInstance = null;

export const speakFakeCallMessage = (userName, lang = 'en', onEndCallback) => {
  if (!('speechSynthesis' in window)) return false;
  try {
    window.speechSynthesis.cancel();
    const cleanName = userName ? userName.split(' ')[0] : 'friend';
    
    let text = "";
    let voiceLang = 'en-US';

    if (lang === 'hi') {
      text = `अरे ${cleanName}! कहाँ हो तुम? मैं बाहर गाड़ी में तुम्हारा इंतज़ार कर रही हूँ। जब तक गाड़ी तक नहीं आ जाती, मेरे साथ फ़ोन पर बात करती रहो!`;
      voiceLang = 'hi-IN';
    } else {
      text = `Hey ${cleanName}! Where are you? I'm waiting outside in the car right now. Keep talking to me while you walk!`;
      voiceLang = 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    if (onEndCallback) utterance.onend = onEndCallback;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn("Speech Synthesis error:", err);
    return false;
  }
};

export const stopSpeechSynthesis = () => {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
};

export const initVoiceKeywordSOS = (onTriggerCallback) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("Speech Recognition API is not supported in this browser.");
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // English & Hindi Trigger Keywords
    const triggerKeywords = [
      'help', 'emergency', 'save me', 'sos', 'stop', 'danger',
      'bachao', 'madad', 'police', 'sahayata', 'मदद', 'बचाओ'
    ];

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        const detected = triggerKeywords.some(keyword => transcript.includes(keyword));
        if (detected) {
          onTriggerCallback(transcript);
        }
      }
    };

    recognition.onerror = (err) => {
      console.warn("Speech Recognition error:", err);
    };

    recognition.start();
    recognitionInstance = recognition;
    return recognition;
  } catch (err) {
    console.warn("Could not start Speech Recognition:", err);
    return null;
  }
};

export const stopVoiceKeywordSOS = () => {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {}
    recognitionInstance = null;
  }
};
