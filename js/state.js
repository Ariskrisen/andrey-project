export const state = {
    lastResetTime: Date.now(),
    lastDayCount: -1,
    isTyping: false,
    godMode: false,
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    tick: 0,
    isTabActive: true,
	isPunished: false, // Флаг, что кнопка исчезла
    isDead: false,     // Флаг, что сайт "умер"
};