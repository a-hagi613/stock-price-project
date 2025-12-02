/**
 * Sound utility for playing notification sounds
 */

const playSound = (soundPath: string, volume: number = 0.5) => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = volume;

    // Limit sound duration to 2 seconds
    const stopTimeout = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 2000);

    audio.play().catch((error) => {
      // Silently handle autoplay restrictions
      console.warn("Could not play sound:", error);
      clearTimeout(stopTimeout);
    });

    // Clean up timeout when audio ends naturally
    audio.addEventListener('ended', () => {
      clearTimeout(stopTimeout);
    });
  } catch (error) {
    console.warn("Error playing sound:", error);
  }
};

export const playNotificationSound = (type: "nvda" | "tsla" | "aapl" | "news" | "warning") => {
  const soundMap = {
    nvda: "/sounds/mixkit-clinking-coins-1993.wav",
    tsla: "/sounds/mixkit-emergency-alert-alarm-1007.wav",
    aapl: "/sounds/mixkit-dry-pop-up-notification-alert-2356.wav",
    news: "/sounds/mixkit-paper-slide-1530.wav",
    warning: "/sounds/mixkit-emergency-alert-alarm-1007.wav",
  };

  playSound(soundMap[type]);
};

